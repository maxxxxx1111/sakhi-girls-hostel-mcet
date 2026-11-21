import { apiClient } from './client';

export interface RoleInfo {
  role_id: string;
  name: string;
  description: string;
  hierarchy_level: number;
  is_system: boolean;
  permissions: string[];
}

export interface PermissionInfo {
  permission_id: string;
  module: string;
  action: string;
  description: string;
}

export interface UserAccountItem {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role_id: string;
  role_name: string;
  hierarchy_level: number;
  account_status: string;
  is_email_verified: boolean;
  failed_login_attempts: number;
  locked_until?: string | null;
  last_login_at?: string | null;
  created_at: string;
  student_prn?: string;
  room_number?: string;
  department?: string;
}

export interface SecurityAuditEntry {
  log_id: string;
  user_id?: string | null;
  event_type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  details?: Record<string, any>;
  created_at: string;
}

export const rbacApi = {
  getRoles: async (): Promise<RoleInfo[]> => {
    return apiClient.get<RoleInfo[]>('/rbac/roles');
  },

  getPermissions: async (): Promise<PermissionInfo[]> => {
    return apiClient.get<PermissionInfo[]>('/rbac/permissions');
  },

  getUsers: async (params?: { role?: string; status?: string; search?: string }): Promise<UserAccountItem[]> => {
    return apiClient.get<UserAccountItem[]>('/rbac/users', params);
  },

  updateUserRole: async (userId: string, roleId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.put(`/rbac/users/${userId}/role`, { roleId });
  },

  updateUserStatus: async (
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED',
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.put(`/rbac/users/${userId}/status`, { status, reason });
  },

  getAuditLogs: async (limit = 100, severity?: string): Promise<SecurityAuditEntry[]> => {
    return apiClient.get<SecurityAuditEntry[]>('/rbac/audit-logs', { limit, severity });
  },
};
