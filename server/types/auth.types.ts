export type UserRole =
  | 'super_admin'
  | 'administrator'
  | 'authority_officer'
  | 'department_manager'
  | 'moderator'
  | 'regular_user'
  | 'guest';

export type AccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface RoleDefinition {
  role_id: UserRole;
  name: string;
  description: string;
  hierarchy_level: number;
  is_system: boolean;
  permissions: string[];
}

export interface PermissionDefinition {
  permission_id: string;
  module: string;
  action: string;
  description: string;
}

export interface AuthUser {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role_id: UserRole;
  role_name: string;
  hierarchy_level: number;
  account_status: AccountStatus;
  is_email_verified: boolean;
  student_id?: string | null;
  warden_id?: string | null;
  department?: string | null;
  mfa_enabled: boolean;
  permissions: string[];
  session_id?: string;
}

export interface JwtTokenPayload {
  sub: string;
  username: string;
  role: UserRole;
  sessionId: string;
  hierarchy: number;
  iat?: number;
  exp?: number;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  studentPrn?: string;
  wardenId?: string;
  department?: string;
  roleId?: UserRole;
}

export interface LoginDto {
  identifier: string; // username, email, or PRN
  password: string;
  rememberMe?: boolean;
}

export interface PasswordResetRequestDto {
  identifier: string;
}

export interface PasswordResetSubmitDto {
  identifier: string;
  otpCode: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  department?: string;
}

export interface SecurityAuditLogEntry {
  log_id: string;
  user_id?: string | null;
  event_type: string;
  severity: AuditSeverity;
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  details?: Record<string, any>;
  created_at: string;
}
