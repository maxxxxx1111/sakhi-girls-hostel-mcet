import { Request, Response, NextFunction } from 'express';
import { RbacService } from '../services/rbac.service';
import { AuditService } from '../services/audit.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { query } from '../db';
import { UserRole, AccountStatus } from '../types/auth.types';

export class RbacController {
  /**
   * GET /api/rbac/roles
   */
  static async getRoles(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await RbacService.getAllRoles();
      ApiResponse.success(res, roles, 'Authority hierarchy and roles retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/rbac/permissions
   */
  static async getPermissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await RbacService.getAllPermissions();
      ApiResponse.success(res, permissions, 'System permissions retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/rbac/users
   */
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, status, search } = req.query;

      let sql = `
        SELECT u.user_id, u.username, u.email, u.full_name, u.phone, u.role_id, 
               r.name AS role_name, r.hierarchy_level, u.account_status, u.is_email_verified, 
               u.failed_login_attempts, u.locked_until, u.last_login_at, u.created_at,
               s.prn AS student_prn, s.room_number, s.department
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN students s ON u.student_id = s.student_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (role) {
        sql += ' AND u.role_id = ?';
        params.push(role);
      }
      if (status) {
        sql += ' AND u.account_status = ?';
        params.push(status);
      }
      if (search) {
        sql += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.username LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      sql += ' ORDER BY r.hierarchy_level DESC, u.created_at DESC';

      const users = await query<any[]>(sql, params);
      ApiResponse.success(res, users, 'System user roster retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/rbac/users/:id/role
   */
  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const targetUserId = req.params.id;
      const { roleId } = req.body;

      if (!roleId) {
        throw ApiError.badRequest('Target roleId is required');
      }

      const result = await RbacService.updateUserRole(
        req.user.user_id,
        req.user.hierarchy_level,
        targetUserId,
        roleId as UserRole,
        req.ip,
        req.get('user-agent')
      );

      ApiResponse.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/rbac/users/:id/status
   */
  static async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const targetUserId = req.params.id;
      const { status, reason } = req.body;

      if (!status || !['ACTIVE', 'SUSPENDED', 'DEACTIVATED'].includes(status)) {
        throw ApiError.badRequest('Valid status (ACTIVE, SUSPENDED, DEACTIVATED) is required');
      }

      const result = await RbacService.updateUserStatus(
        req.user.user_id,
        req.user.hierarchy_level,
        targetUserId,
        status as AccountStatus,
        reason,
        req.ip,
        req.get('user-agent')
      );

      ApiResponse.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/rbac/audit-logs
   */
  static async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt((req.query.limit as string) || '100', 10);
      const severity = req.query.severity as string | undefined;

      const logs = await AuditService.getLogs(limit, severity);
      ApiResponse.success(res, logs, 'Security audit logs retrieved');
    } catch (err) {
      next(err);
    }
  }
}
