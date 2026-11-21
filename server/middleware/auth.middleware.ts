import { Request, Response, NextFunction } from 'express';
import { SecurityUtil } from '../utils/security.util';
import { ApiError } from '../utils/apiError';
import { RbacService } from '../services/rbac.service';
import { AuditService } from '../services/audit.service';
import { query } from '../db';
import { AuthUser, UserRole } from '../types/auth.types';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      token?: string;
    }
  }
}

export class AuthMiddleware {
  /**
   * Primary Authentication Middleware:
   * 1. Extracts JWT from Authorization header (`Bearer <token>`) or `x-access-token`
   * 2. Verifies cryptographic signature
   * 3. Confirms associated session in DB is NOT revoked
   * 4. Confirms account is ACTIVE (not suspended or deactivated)
   * 5. Hydrates live user permissions from DB (Never trusts client payload)
   */
  static async authenticateToken(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers['authorization'] || (req.headers['x-access-token'] as string);
      let token: string | undefined;

      if (authHeader) {
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7).trim();
        } else if (typeof authHeader === 'string') {
          token = authHeader.trim();
        }
      }

      if (!token) {
        throw ApiError.unauthorized('Authentication required: Missing access token');
      }

      // 1. Verify cryptographic signature & expiration of JWT
      let decoded;
      try {
        decoded = SecurityUtil.verifyAccessToken(token);
      } catch (err: any) {
        await AuditService.logEvent({
          eventType: 'TOKEN_VERIFICATION_FAILED',
          severity: 'WARNING',
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          endpoint: req.originalUrl,
          details: { error: err.message },
        });
        throw ApiError.unauthorized('Invalid or expired authentication token');
      }

      // 2. Validate Session Lifecycle in DB (Revocation Check)
      if (decoded.sessionId) {
        const sessionRows = await query<any[]>(
          'SELECT is_revoked, expires_at FROM user_sessions WHERE session_id = ? LIMIT 1',
          [decoded.sessionId]
        );

        if (sessionRows && sessionRows.length > 0) {
          const session = sessionRows[0];
          if (session.is_revoked || new Date(session.expires_at) < new Date()) {
            await AuditService.logEvent({
              userId: decoded.sub,
              eventType: 'REVOKED_SESSION_ACCESSED',
              severity: 'WARNING',
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
              endpoint: req.originalUrl,
            });
            throw ApiError.unauthorized('Session has been revoked or expired. Please sign in again.');
          }
        }
      }

      // 3. Hydrate User Record directly from Database (Ensures client role cannot be spoofed)
      const users = await query<any[]>(
        `SELECT u.*, s.student_id AS linked_student_id, w.warden_id AS linked_warden_id
         FROM users u
         LEFT JOIN students s ON u.student_id = s.student_id
         LEFT JOIN wardens w ON u.warden_id = w.warden_id
         WHERE u.user_id = ? LIMIT 1`,
        [decoded.sub]
      );

      if (!users || users.length === 0) {
        throw ApiError.unauthorized('User associated with this token no longer exists');
      }

      const userRow = users[0];

      // 4. Verify account status
      if (userRow.account_status === 'SUSPENDED') {
        throw ApiError.forbidden('Your account is currently suspended. Access denied.');
      }
      if (userRow.account_status === 'DEACTIVATED') {
        throw ApiError.forbidden('Your account has been deactivated. Access denied.');
      }

      // 5. Fetch effective role permissions
      const roleId = userRow.role_id as UserRole;
      const { permissions, hierarchy, roleName } = await RbacService.getRolePermissions(roleId);

      req.user = {
        user_id: userRow.user_id,
        username: userRow.username,
        email: userRow.email,
        full_name: userRow.full_name,
        phone: userRow.phone,
        role_id: roleId,
        role_name: roleName,
        hierarchy_level: hierarchy,
        account_status: userRow.account_status,
        is_email_verified: Boolean(userRow.is_email_verified),
        student_id: userRow.student_id || userRow.linked_student_id,
        warden_id: userRow.warden_id || userRow.linked_warden_id,
        department: userRow.department,
        mfa_enabled: Boolean(userRow.mfa_enabled),
        permissions,
        session_id: decoded.sessionId,
      };
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  /**
   * Optional authentication: Hydrates user if token is present, continues as guest if not
   */
  static async optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers['authorization'] || (req.headers['x-access-token'] as string);
      if (!authHeader) {
        return next();
      }
      await AuthMiddleware.authenticateToken(req, _res, next);
    } catch {
      // Degrade gracefully to public guest
      req.user = undefined;
      next();
    }
  }

  /**
   * Enforces Role-Based Access Control (RBAC)
   * Super Administrator (`super_admin`) automatically satisfies all role checks.
   */
  static requireRole(...allowedRoles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(ApiError.unauthorized('Authentication required to access this resource'));
      }

      // Super Admin bypass
      if (req.user.role_id === 'super_admin') {
        return next();
      }

      if (!allowedRoles.includes(req.user.role_id)) {
        AuditService.logEvent({
          userId: req.user.user_id,
          eventType: 'ACCESS_DENIED_ROLE_MISMATCH',
          severity: 'WARNING',
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          endpoint: req.originalUrl,
          details: {
            userRole: req.user.role_id,
            requiredRoles: allowedRoles,
          },
        });

        return next(
          ApiError.forbidden(
            `Access Denied: Your assigned role (${req.user.role_name}) does not possess authority for this operation`
          )
        );
      }

      next();
    };
  }

  /**
   * Enforces Granular Permission-Based Access Control (PBAC)
   */
  static requirePermission(...requiredPermissions: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(ApiError.unauthorized('Authentication required to perform this action'));
      }

      // Super Admin bypass
      if (req.user.role_id === 'super_admin' || req.user.permissions.includes('*')) {
        return next();
      }

      const missingPermissions = requiredPermissions.filter(
        (perm) => !req.user!.permissions.includes(perm)
      );

      if (missingPermissions.length > 0) {
        AuditService.logEvent({
          userId: req.user.user_id,
          eventType: 'ACCESS_DENIED_MISSING_PERMISSION',
          severity: 'WARNING',
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          endpoint: req.originalUrl,
          details: {
            userRole: req.user.role_id,
            missingPermissions,
          },
        });

        return next(
          ApiError.forbidden(
            `Access Denied: Missing required permission (${missingPermissions.join(', ')})`
          )
        );
      }

      next();
    };
  }

  /**
   * Enforces Authority Hierarchy Level (Minimum numeric rank required)
   */
  static requireHierarchy(minLevel: number) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
      }

      if (req.user.hierarchy_level < minLevel && req.user.role_id !== 'super_admin') {
        return next(
          ApiError.forbidden(
            `Insufficient authority rank (Required level ${minLevel}, your level is ${req.user.hierarchy_level})`
          )
        );
      }

      next();
    };
  }

  /**
   * Enforces Resource Ownership Or Elevated Privilege
   * Example: A regular student scholar can ONLY read/write their own complaints, leaves, or fee receipts,
   * while a warden or administrator with `bypassPermission` can access any scholar's data.
   */
  static requireOwnershipOrPrivilege(
    getOwnerStudentId: (req: Request) => string | undefined,
    bypassPermission: string
  ) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(ApiError.unauthorized('Authentication required'));
      }

      // Check if user has administrative bypass permission
      if (
        req.user.role_id === 'super_admin' ||
        req.user.permissions.includes('*') ||
        req.user.permissions.includes(bypassPermission)
      ) {
        return next();
      }

      // Regular user: verify resource owner matches requesting user's linked student_id
      const targetOwnerId = getOwnerStudentId(req);
      if (!targetOwnerId || targetOwnerId !== req.user.student_id) {
        AuditService.logEvent({
          userId: req.user.user_id,
          eventType: 'UNAUTHORIZED_CROSS_TENANT_ACCESS_BLOCKED',
          severity: 'CRITICAL',
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          endpoint: req.originalUrl,
          details: {
            userStudentId: req.user.student_id,
            targetOwnerId,
          },
        });

        return next(
          ApiError.forbidden('Privacy Protection: You are not authorized to view or modify another scholar\'s private record')
        );
      }

      next();
    };
  }
}
