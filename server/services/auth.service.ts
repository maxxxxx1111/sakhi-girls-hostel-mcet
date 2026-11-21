import { query } from '../db';
import { ApiError } from '../utils/apiError';
import { SecurityUtil } from '../utils/security.util';
import { RbacService } from './rbac.service';
import { AuditService } from './audit.service';
import { config } from '../config';
import {
  AuthUser,
  LoginDto,
  RegisterDto,
  PasswordResetRequestDto,
  PasswordResetSubmitDto,
  ChangePasswordDto,
  UpdateProfileDto,
  UserRole,
} from '../types/auth.types';

export class AuthService {
  /**
   * Registers a new institutional account
   */
  static async register(
    dto: RegisterDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: AuthUser; accessToken: string; sessionId: string }> {
    // 1. Validate password strength
    const strength = SecurityUtil.validatePasswordStrength(dto.password);
    if (!strength.valid) {
      throw ApiError.badRequest(strength.reason || 'Password does not meet institutional complexity standards');
    }

    // 2. Normalize and check uniqueness of email and username
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();

    const existing = await query<any[]>(
      'SELECT user_id, email, username FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing && existing.length > 0) {
      if (existing.some((u) => u.email === email)) {
        throw ApiError.conflict('An account with this institutional email address already exists');
      }
      if (existing.some((u) => u.username === username)) {
        throw ApiError.conflict('An account with this Username / PRN already exists');
      }
    }

    // 3. Hash password using modern bcrypt (12 salt rounds)
    const passwordHash = await SecurityUtil.hashPassword(dto.password);
    const userId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const roleId: UserRole = dto.roleId || 'regular_user';

    // 4. Determine student or warden linkage if applicable
    let studentId: string | null = null;
    let wardenId: string | null = null;

    if (dto.studentPrn) {
      const studentRows = await query<any[]>('SELECT student_id FROM students WHERE prn = ?', [dto.studentPrn]);
      if (studentRows && studentRows.length > 0) {
        studentId = studentRows[0].student_id;
      }
    }

    if (dto.wardenId) {
      const wardenRows = await query<any[]>('SELECT warden_id FROM wardens WHERE warden_id = ?', [dto.wardenId]);
      if (wardenRows && wardenRows.length > 0) {
        wardenId = wardenRows[0].warden_id;
      }
    }

    // 5. Insert new user into MySQL
    await query(
      `INSERT INTO users (
        user_id, username, email, password_hash, full_name, phone, role_id, 
        account_status, is_email_verified, student_id, warden_id, department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', TRUE, ?, ?, ?)`,
      [
        userId,
        username,
        email,
        passwordHash,
        dto.fullName.trim(),
        dto.phone || null,
        roleId,
        studentId,
        wardenId,
        dto.department || null,
      ]
    );

    // 6. Resolve role permissions
    const { permissions, hierarchy, roleName } = await RbacService.getRolePermissions(roleId);

    // 7. Create authenticated session
    const sessionId = `sess-${SecurityUtil.generateRandomToken(16)}`;
    const sessionToken = SecurityUtil.generateRandomToken(32);
    const tokenHash = SecurityUtil.hashToken(sessionToken);
    const expiresAt = new Date(Date.now() + config.auth.sessionDurationDays * 24 * 60 * 60 * 1000);

    await query(
      `INSERT INTO user_sessions (session_id, user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, userId, tokenHash, ipAddress || null, userAgent || null, expiresAt]
    );

    // 8. Generate JWT access token
    const accessToken = SecurityUtil.generateAccessToken({
      sub: userId,
      username,
      role: roleId,
      sessionId,
      hierarchy,
    });

    const user: AuthUser = {
      user_id: userId,
      username,
      email,
      full_name: dto.fullName.trim(),
      phone: dto.phone,
      role_id: roleId,
      role_name: roleName,
      hierarchy_level: hierarchy,
      account_status: 'ACTIVE',
      is_email_verified: true,
      student_id: studentId,
      warden_id: wardenId,
      department: dto.department,
      mfa_enabled: false,
      permissions,
      session_id: sessionId,
    };

    // 9. Log audit event
    await AuditService.logEvent({
      userId,
      eventType: 'REGISTRATION_SUCCESS',
      severity: 'INFO',
      ipAddress,
      userAgent,
      details: { username, email, roleId },
    });

    return { user, accessToken, sessionId };
  }

  /**
   * Institutional Login with Brute-Force Lockout Protection & RBAC Hydration
   */
  static async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: AuthUser; accessToken: string; sessionId: string }> {
    const identifier = dto.identifier.trim();

    // 1. Locate user by username, email, or linked student PRN
    const rows = await query<any[]>(
      `SELECT u.*, s.student_id AS linked_student_id, w.warden_id AS linked_warden_id
       FROM users u
       LEFT JOIN students s ON u.student_id = s.student_id OR s.prn = u.username OR s.prn = ?
       LEFT JOIN wardens w ON u.warden_id = w.warden_id OR w.email = u.email
       WHERE u.email = ? OR u.username = ? OR u.student_id = ?
       LIMIT 1`,
      [identifier, identifier, identifier, identifier]
    );

    if (!rows || rows.length === 0) {
      await AuditService.logEvent({
        eventType: 'LOGIN_FAILED',
        severity: 'WARNING',
        ipAddress,
        userAgent,
        details: { identifier, reason: 'User identity not found' },
      });
      throw ApiError.unauthorized('Invalid institutional credentials');
    }

    const userRow = rows[0];

    // 2. BRUTE FORCE PROTECTION: Check if account is locked
    if (userRow.locked_until && new Date(userRow.locked_until) > new Date()) {
      const minutesRemaining = Math.ceil(
        (new Date(userRow.locked_until).getTime() - Date.now()) / (60 * 1000)
      );
      await AuditService.logEvent({
        userId: userRow.user_id,
        eventType: 'LOGIN_BLOCKED_LOCKED_ACCOUNT',
        severity: 'CRITICAL',
        ipAddress,
        userAgent,
        details: { identifier, minutesRemaining },
      });
      throw ApiError.forbidden(
        `Account is temporarily locked due to excessive failed attempts. Please retry in ${minutesRemaining} minute(s) or reset your password.`
      );
    }

    // 3. ACCOUNT STATUS CHECK: Check if account is suspended or deactivated
    if (userRow.account_status === 'SUSPENDED') {
      throw ApiError.forbidden('Your institutional account has been suspended. Please contact the Chief Warden office.');
    }
    if (userRow.account_status === 'DEACTIVATED') {
      throw ApiError.forbidden('Your account is deactivated. Contact campus IT administration for reinstatement.');
    }

    // 4. Verify password with bcrypt
    const passwordMatch = await SecurityUtil.comparePassword(dto.password, userRow.password_hash);

    if (!passwordMatch) {
      const attempts = (userRow.failed_login_attempts || 0) + 1;
      const isNowLocked = attempts >= config.auth.maxLoginAttempts;
      const lockedUntil = isNowLocked
        ? new Date(Date.now() + config.auth.lockoutDurationMinutes * 60 * 1000)
        : null;

      await query(
        'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE user_id = ?',
        [attempts, lockedUntil, userRow.user_id]
      );

      await AuditService.logEvent({
        userId: userRow.user_id,
        eventType: isNowLocked ? 'ACCOUNT_LOCKED_BRUTE_FORCE' : 'LOGIN_FAILED_PASSWORD_MISMATCH',
        severity: isNowLocked ? 'CRITICAL' : 'WARNING',
        ipAddress,
        userAgent,
        details: { attempts, isNowLocked, lockoutMinutes: config.auth.lockoutDurationMinutes },
      });

      if (isNowLocked) {
        throw ApiError.forbidden(
          `Security Alert: Maximum login attempts exceeded. Your account has been locked for ${config.auth.lockoutDurationMinutes} minutes.`
        );
      }

      throw ApiError.unauthorized('Invalid institutional credentials');
    }

    // 5. Successful password match: Reset failed attempts counter and update login metadata
    await query(
      `UPDATE users 
       SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW(), last_login_ip = ?
       WHERE user_id = ?`,
      [ipAddress || null, userRow.user_id]
    );

    // 6. Create active session in user_sessions
    const sessionId = `sess-${SecurityUtil.generateRandomToken(16)}`;
    const sessionToken = SecurityUtil.generateRandomToken(32);
    const tokenHash = SecurityUtil.hashToken(sessionToken);
    const sessionDays = dto.rememberMe ? config.auth.sessionDurationDays : 1;
    const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

    await query(
      `INSERT INTO user_sessions (session_id, user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, userRow.user_id, tokenHash, ipAddress || null, userAgent || null, expiresAt]
    );

    // 7. Resolve dynamic role permissions from DB
    const roleId = userRow.role_id as UserRole;
    const { permissions, hierarchy, roleName } = await RbacService.getRolePermissions(roleId);

    // 8. Sign JWT access token
    const accessToken = SecurityUtil.generateAccessToken({
      sub: userRow.user_id,
      username: userRow.username,
      role: roleId,
      sessionId,
      hierarchy,
    });

    const user: AuthUser = {
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
      session_id: sessionId,
    };

    // 9. Record login success in audit logs
    await AuditService.logEvent({
      userId: userRow.user_id,
      eventType: 'LOGIN_SUCCESS',
      severity: 'INFO',
      ipAddress,
      userAgent,
      details: { username: userRow.username, role: roleId, sessionId },
    });

    return { user, accessToken, sessionId };
  }

  /**
   * Revokes the current session
   */
  static async logout(sessionId?: string, userId?: string): Promise<{ success: boolean }> {
    if (sessionId) {
      await query('UPDATE user_sessions SET is_revoked = 1 WHERE session_id = ?', [sessionId]);
    }
    if (userId) {
      await AuditService.logEvent({
        userId,
        eventType: 'LOGOUT',
        severity: 'INFO',
        details: { sessionId },
      });
    }
    return { success: true };
  }

  /**
   * Revokes all active sessions for a user (security lockdown)
   */
  static async logoutAllSessions(userId: string): Promise<{ success: boolean; revokedCount: number }> {
    const result = await query<any>('UPDATE user_sessions SET is_revoked = 1 WHERE user_id = ? AND is_revoked = 0', [userId]);
    await AuditService.logEvent({
      userId,
      eventType: 'ALL_SESSIONS_REVOKED',
      severity: 'WARNING',
      details: { affectedRows: result?.affectedRows },
    });
    return { success: true, revokedCount: result?.affectedRows || 0 };
  }

  /**
   * Generates a secure, cryptographically random password reset OTP
   */
  static async requestPasswordReset(
    dto: PasswordResetRequestDto,
    ipAddress?: string
  ): Promise<{ success: boolean; message: string; otpCode?: string }> {
    const identifier = dto.identifier.trim();

    const users = await query<any[]>(
      'SELECT user_id, email, full_name FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );

    if (!users || users.length === 0) {
      // Return ambiguous message to prevent user enumeration attacks
      return {
        success: true,
        message: 'If an account matches those credentials, a 6-digit OTP has been dispatched to the registered contact.',
      };
    }

    const user = users[0];
    const otpCode = SecurityUtil.generateNumericOtp(6);
    const tokenId = `rst-${SecurityUtil.generateRandomToken(16)}`;
    const tokenHash = SecurityUtil.hashToken(otpCode);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // Invalidate existing reset tokens
    await query('UPDATE password_reset_tokens SET is_used = 1 WHERE user_id = ?', [user.user_id]);

    // Insert new OTP record
    await query(
      `INSERT INTO password_reset_tokens (token_id, user_id, token_hash, otp_code, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [tokenId, user.user_id, tokenHash, otpCode, expiresAt]
    );

    await AuditService.logEvent({
      userId: user.user_id,
      eventType: 'PASSWORD_RESET_REQUESTED',
      severity: 'INFO',
      ipAddress,
      details: { email: user.email },
    });

    return {
      success: true,
      message: 'Password reset OTP has been generated (Valid for 15 minutes).',
      otpCode, // Returned for dev/institutional demo verification
    };
  }

  /**
   * Resets password using verified OTP and revokes all active sessions
   */
  static async resetPassword(
    dto: PasswordResetSubmitDto,
    ipAddress?: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Validate new password strength
    const strength = SecurityUtil.validatePasswordStrength(dto.newPassword);
    if (!strength.valid) {
      throw ApiError.badRequest(strength.reason || 'New password does not meet institutional standards');
    }

    // 2. Find user
    const users = await query<any[]>(
      'SELECT user_id, email FROM users WHERE email = ? OR username = ?',
      [dto.identifier, dto.identifier]
    );
    if (!users || users.length === 0) {
      throw ApiError.badRequest('Invalid or expired password reset request');
    }
    const user = users[0];

    // 3. Find valid OTP token
    const tokenRows = await query<any[]>(
      `SELECT * FROM password_reset_tokens 
       WHERE user_id = ? AND otp_code = ? AND is_used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [user.user_id, dto.otpCode.trim()]
    );

    if (!tokenRows || tokenRows.length === 0) {
      await AuditService.logEvent({
        userId: user.user_id,
        eventType: 'PASSWORD_RESET_FAILED_INVALID_OTP',
        severity: 'WARNING',
        ipAddress,
      });
      throw ApiError.badRequest('Invalid or expired OTP code');
    }

    const resetRecord = tokenRows[0];

    // 4. Hash new password
    const newHash = await SecurityUtil.hashPassword(dto.newPassword);

    // 5. Update user password and unlock account if previously locked
    await query(
      `UPDATE users 
       SET password_hash = ?, failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() 
       WHERE user_id = ?`,
      [newHash, user.user_id]
    );

    // 6. Mark reset token as used
    await query('UPDATE password_reset_tokens SET is_used = 1 WHERE token_id = ?', [resetRecord.token_id]);

    // 7. Revoke all existing sessions to enforce re-login
    await query('UPDATE user_sessions SET is_revoked = 1 WHERE user_id = ?', [user.user_id]);

    await AuditService.logEvent({
      userId: user.user_id,
      eventType: 'PASSWORD_RESET_SUCCESS',
      severity: 'WARNING',
      ipAddress,
    });

    return {
      success: true,
      message: 'Password successfully updated. All prior sessions have been revoked. Please sign in with your new credentials.',
    };
  }

  /**
   * Changes password from authenticated user profile
   */
  static async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress?: string
  ): Promise<{ success: boolean; message: string }> {
    // 1. Validate new password strength
    const strength = SecurityUtil.validatePasswordStrength(dto.newPassword);
    if (!strength.valid) {
      throw ApiError.badRequest(strength.reason || 'New password does not meet institutional standards');
    }

    // 2. Fetch current password hash
    const rows = await query<any[]>('SELECT password_hash FROM users WHERE user_id = ?', [userId]);
    if (!rows || rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // 3. Verify current password
    const match = await SecurityUtil.comparePassword(dto.currentPassword, rows[0].password_hash);
    if (!match) {
      await AuditService.logEvent({
        userId,
        eventType: 'PASSWORD_CHANGE_FAILED_CURRENT_MISMATCH',
        severity: 'WARNING',
        ipAddress,
      });
      throw ApiError.badRequest('Current password verification failed');
    }

    // 4. Update with new hash
    const newHash = await SecurityUtil.hashPassword(dto.newPassword);
    await query('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?', [newHash, userId]);

    // 5. Invalidate other active sessions
    await query('UPDATE user_sessions SET is_revoked = 1 WHERE user_id = ?', [userId]);

    await AuditService.logEvent({
      userId,
      eventType: 'PASSWORD_CHANGED_BY_USER',
      severity: 'INFO',
      ipAddress,
    });

    return {
      success: true,
      message: 'Password successfully updated. Other active sessions have been revoked.',
    };
  }

  /**
   * Retrieves full hydrated profile for authenticated user
   */
  static async getProfile(userId: string): Promise<AuthUser> {
    const rows = await query<any[]>(
      `SELECT u.*, s.student_id AS linked_student_id, w.warden_id AS linked_warden_id
       FROM users u
       LEFT JOIN students s ON u.student_id = s.student_id
       LEFT JOIN wardens w ON u.warden_id = w.warden_id
       WHERE u.user_id = ? LIMIT 1`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      throw ApiError.notFound('User record not found');
    }

    const userRow = rows[0];
    const roleId = userRow.role_id as UserRole;
    const { permissions, hierarchy, roleName } = await RbacService.getRolePermissions(roleId);

    return {
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
    };
  }

  /**
   * Updates user profile
   */
  static async updateProfile(userId: string, dto: UpdateProfileDto): Promise<AuthUser> {
    await query(
      `UPDATE users 
       SET full_name = COALESCE(?, full_name), 
           phone = COALESCE(?, phone), 
           department = COALESCE(?, department), 
           updated_at = NOW() 
       WHERE user_id = ?`,
      [dto.fullName || null, dto.phone || null, dto.department || null, userId]
    );

    return this.getProfile(userId);
  }
}
