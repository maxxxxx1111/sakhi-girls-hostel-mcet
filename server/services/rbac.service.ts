import { query } from '../db';
import { ApiError } from '../utils/apiError';
import { RoleDefinition, PermissionDefinition, UserRole, AccountStatus } from '../types/auth.types';
import { AuditService } from './audit.service';

// In-memory fallback if database connection is temporarily interrupted
const DEFAULT_ROLES: RoleDefinition[] = [
  {
    role_id: 'super_admin',
    name: 'Super Administrator',
    description: 'Complete system control across all campus hostels, users, and server configurations',
    hierarchy_level: 100,
    is_system: true,
    permissions: ['*'],
  },
  {
    role_id: 'administrator',
    name: 'Administrator',
    description: 'Hostel Rector & Chief Warden with full residential, room allotment, and financial permissions',
    hierarchy_level: 80,
    is_system: true,
    permissions: [
      'users:read', 'users:write', 'users:status',
      'rooms:read', 'rooms:allocate', 'rooms:vacate', 'rooms:manage',
      'leaves:read_all', 'leaves:verify_parent', 'leaves:approve',
      'gate:scan', 'gate:view_logs',
      'complaints:read_all', 'complaints:assign', 'complaints:resolve',
      'mess:view_menu', 'mess:manage_menu', 'mess:attendance', 'mess:manage_inventory', 'mess:manage_expenses',
      'fees:read_all', 'fees:manage', 'fees:generate_receipt',
      'notices:view', 'notices:publish', 'notices:delete',
      'audit:view_logs'
    ],
  },
  {
    role_id: 'authority_officer',
    name: 'Authority Officer',
    description: 'Campus Security Officers and Sentry Gate Supervisors for movement audit & passes',
    hierarchy_level: 60,
    is_system: true,
    permissions: [
      'gate:scan', 'gate:view_logs', 'gate:override',
      'leaves:read_all', 'users:read', 'rooms:read', 'notices:view', 'audit:view_logs'
    ],
  },
  {
    role_id: 'department_manager',
    name: 'Department Manager',
    description: 'Engineering Department Heads (HODs) with oversight of student residents in their branch',
    hierarchy_level: 50,
    is_system: true,
    permissions: [
      'users:read', 'rooms:read', 'leaves:read_all', 'complaints:read_all', 'notices:view'
    ],
  },
  {
    role_id: 'moderator',
    name: 'Moderator',
    description: 'Resident Floor Assistants & Student Mess Council Representatives for ticket triage',
    hierarchy_level: 40,
    is_system: true,
    permissions: [
      'rooms:read', 'complaints:read_all', 'complaints:resolve',
      'mess:view_menu', 'mess:attendance', 'notices:view'
    ],
  },
  {
    role_id: 'regular_user',
    name: 'Regular User',
    description: 'Enrolled female engineering scholar resident with access to personal living portal',
    hierarchy_level: 20,
    is_system: true,
    permissions: [
      'rooms:read', 'leaves:apply', 'leaves:read_own',
      'complaints:create', 'complaints:read_own',
      'mess:view_menu', 'mess:attendance', 'mess:feedback',
      'fees:view_own', 'fees:generate_receipt', 'notices:view'
    ],
  },
  {
    role_id: 'guest',
    name: 'Guest',
    description: 'Prospective scholars and public visitors with read-only public hostel brochure access',
    hierarchy_level: 0,
    is_system: true,
    permissions: ['rooms:read', 'mess:view_menu', 'notices:view'],
  },
];

export class RbacService {
  /**
   * Retrieves all roles with their hierarchy and associated permissions
   */
  static async getAllRoles(): Promise<RoleDefinition[]> {
    try {
      const roles = await query<any[]>('SELECT * FROM roles ORDER BY hierarchy_level DESC');
      const rolePerms = await query<any[]>('SELECT role_id, permission_id FROM role_permissions');

      if (Array.isArray(roles) && roles.length > 0) {
        return roles.map((r) => {
          const perms = rolePerms
            .filter((rp) => rp.role_id === r.role_id)
            .map((rp) => rp.permission_id);
          return {
            role_id: r.role_id as UserRole,
            name: r.name,
            description: r.description,
            hierarchy_level: r.hierarchy_level,
            is_system: Boolean(r.is_system),
            permissions: r.role_id === 'super_admin' ? ['*'] : perms,
          };
        });
      }
    } catch (err: any) {
      console.warn('[RbacService] Error loading roles from MySQL, using fallback defaults:', err.message);
    }

    return DEFAULT_ROLES;
  }

  /**
   * Retrieves all granular permissions registered in the system
   */
  static async getAllPermissions(): Promise<PermissionDefinition[]> {
    try {
      const perms = await query<PermissionDefinition[]>('SELECT * FROM permissions ORDER BY module, action');
      if (Array.isArray(perms) && perms.length > 0) {
        return perms;
      }
    } catch (err: any) {
      console.warn('[RbacService] Error loading permissions from MySQL:', err.message);
    }

    // Default permission set if DB query fails
    return [
      { permission_id: 'users:read', module: 'users', action: 'read', description: 'View user accounts' },
      { permission_id: 'users:write', module: 'users', action: 'write', description: 'Modify user accounts' },
      { permission_id: 'users:roles', module: 'users', action: 'roles', description: 'Assign roles' },
      { permission_id: 'users:status', module: 'users', action: 'status', description: 'Activate or suspend users' },
      { permission_id: 'rooms:read', module: 'rooms', action: 'read', description: 'View room layouts' },
      { permission_id: 'rooms:allocate', module: 'rooms', action: 'allocate', description: 'Allot beds' },
      { permission_id: 'rooms:vacate', module: 'rooms', action: 'vacate', description: 'Vacate beds' },
      { permission_id: 'leaves:apply', module: 'leaves', action: 'apply', description: 'Apply for leave' },
      { permission_id: 'leaves:read_own', module: 'leaves', action: 'read_own', description: 'View own leaves' },
      { permission_id: 'leaves:read_all', module: 'leaves', action: 'read_all', description: 'View all leave requests' },
      { permission_id: 'leaves:approve', module: 'leaves', action: 'approve', description: 'Approve leaves' },
      { permission_id: 'gate:scan', module: 'gate', action: 'scan', description: 'Scan QR gate passes' },
      { permission_id: 'gate:view_logs', module: 'gate', action: 'view_logs', description: 'View gate logs' },
      { permission_id: 'complaints:create', module: 'complaints', action: 'create', description: 'Submit complaints' },
      { permission_id: 'complaints:read_all', module: 'complaints', action: 'read_all', description: 'View all complaints' },
      { permission_id: 'complaints:resolve', module: 'complaints', action: 'resolve', description: 'Resolve complaints' },
      { permission_id: 'mess:view_menu', module: 'mess', action: 'view_menu', description: 'View mess menu' },
      { permission_id: 'mess:manage_menu', module: 'mess', action: 'manage_menu', description: 'Edit mess menu' },
      { permission_id: 'fees:read_all', module: 'fees', action: 'read_all', description: 'View fees' },
      { permission_id: 'notices:publish', module: 'notices', action: 'publish', description: 'Publish notices' },
      { permission_id: 'audit:view_logs', module: 'audit', action: 'view_logs', description: 'View security logs' },
    ];
  }

  /**
   * Resolves effective permissions and hierarchy level for a specific role
   */
  static async getRolePermissions(roleId: UserRole): Promise<{ permissions: string[]; hierarchy: number; roleName: string }> {
    const roles = await this.getAllRoles();
    const role = roles.find((r) => r.role_id === roleId);

    if (!role) {
      return { permissions: [], hierarchy: 0, roleName: 'Guest' };
    }

    return {
      permissions: role.permissions,
      hierarchy: role.hierarchy_level,
      roleName: role.name,
    };
  }

  /**
   * Checks whether a role or permission set has a given permission
   */
  static hasPermission(effectivePermissions: string[], requiredPermission: string): boolean {
    if (effectivePermissions.includes('*')) return true;
    return effectivePermissions.includes(requiredPermission);
  }

  /**
   * Assigns a new role to a target user with STRICT Anti-Privilege-Escalation verification
   */
  static async updateUserRole(
    actorId: string,
    actorHierarchy: number,
    targetUserId: string,
    newRoleId: UserRole,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Fetch target user
    const users = await query<any[]>('SELECT user_id, username, role_id FROM users WHERE user_id = ?', [targetUserId]);
    if (!users || users.length === 0) {
      throw ApiError.notFound('Target user not found');
    }
    const targetUser = users[0];

    // 2. Fetch target user's current role hierarchy and new role hierarchy
    const roles = await this.getAllRoles();
    const currentRole = roles.find((r) => r.role_id === targetUser.role_id);
    const newRole = roles.find((r) => r.role_id === newRoleId);

    if (!newRole) {
      throw ApiError.badRequest(`Target role '${newRoleId}' does not exist`);
    }

    // 3. ANTI-PRIVILEGE-ESCALATION CHECK:
    // Actor must have strictly higher hierarchy than the target user's current hierarchy
    if (actorHierarchy <= (currentRole?.hierarchy_level ?? 0) && actorHierarchy < 100) {
      await AuditService.logEvent({
        userId: actorId,
        eventType: 'PRIVILEGE_ESCALATION_BLOCKED',
        severity: 'CRITICAL',
        ipAddress,
        userAgent,
        details: {
          targetUserId,
          currentRole: targetUser.role_id,
          attemptedRole: newRoleId,
          reason: 'Cannot modify a user with equal or higher authority level',
        },
      });
      throw ApiError.forbidden('Authorization Failure: You cannot modify a user with equal or higher authority level');
    }

    // Actor cannot assign a role higher or equal to their own hierarchy level (unless super_admin)
    if (actorHierarchy <= newRole.hierarchy_level && actorHierarchy < 100) {
      await AuditService.logEvent({
        userId: actorId,
        eventType: 'PRIVILEGE_ESCALATION_BLOCKED',
        severity: 'CRITICAL',
        ipAddress,
        userAgent,
        details: {
          targetUserId,
          attemptedRole: newRoleId,
          reason: 'Cannot grant a role higher or equal to your own authority level',
        },
      });
      throw ApiError.forbidden('Authorization Failure: You cannot grant a role with authority equal to or higher than your own');
    }

    // 4. Update the user's role in the database
    await query('UPDATE users SET role_id = ?, updated_at = NOW() WHERE user_id = ?', [newRoleId, targetUserId]);

    // 5. Invalidate existing active sessions to force re-authentication with new privileges
    await query('UPDATE user_sessions SET is_revoked = 1 WHERE user_id = ?', [targetUserId]);

    // 6. Log security audit event
    await AuditService.logEvent({
      userId: actorId,
      eventType: 'ROLE_CHANGED',
      severity: 'WARNING',
      ipAddress,
      userAgent,
      details: {
        targetUserId,
        previousRole: targetUser.role_id,
        newRole: newRoleId,
        sessionsRevoked: true,
      },
    });

    return {
      success: true,
      message: `User role successfully updated to ${newRole.name}. Prior active sessions have been securely revoked.`,
    };
  }

  /**
   * Modifies account lifecycle status (ACTIVE, SUSPENDED, DEACTIVATED)
   */
  static async updateUserStatus(
    actorId: string,
    actorHierarchy: number,
    targetUserId: string,
    newStatus: AccountStatus,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; message: string }> {
    const users = await query<any[]>('SELECT user_id, username, role_id, account_status FROM users WHERE user_id = ?', [targetUserId]);
    if (!users || users.length === 0) {
      throw ApiError.notFound('Target user not found');
    }
    const targetUser = users[0];

    const roles = await this.getAllRoles();
    const currentRole = roles.find((r) => r.role_id === targetUser.role_id);

    // Actor cannot modify someone with equal or higher hierarchy
    if (actorHierarchy <= (currentRole?.hierarchy_level ?? 0) && actorHierarchy < 100) {
      throw ApiError.forbidden('You cannot change account status for an account with equal or higher authority level');
    }

    await query('UPDATE users SET account_status = ?, updated_at = NOW() WHERE user_id = ?', [newStatus, targetUserId]);

    // If suspended or deactivated, revoke all active sessions immediately
    if (newStatus === 'SUSPENDED' || newStatus === 'DEACTIVATED') {
      await query('UPDATE user_sessions SET is_revoked = 1 WHERE user_id = ?', [targetUserId]);
    }

    await AuditService.logEvent({
      userId: actorId,
      eventType: 'ACCOUNT_STATUS_CHANGED',
      severity: 'WARNING',
      ipAddress,
      userAgent,
      details: {
        targetUserId,
        previousStatus: targetUser.account_status,
        newStatus,
        reason,
      },
    });

    return {
      success: true,
      message: `Account status updated to ${newStatus}.`,
    };
  }
}
