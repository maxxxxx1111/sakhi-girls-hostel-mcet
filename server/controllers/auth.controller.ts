import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { query } from '../db';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, fullName, phone, studentPrn, department } = req.body;

      if (!username || !email || !password || !fullName) {
        throw ApiError.badRequest('Username, institutional email, password, and full name are required');
      }

      const result = await AuthService.register(
        { username, email, password, fullName, phone, studentPrn, department },
        req.ip,
        req.get('user-agent')
      );

      ApiResponse.created(res, result, 'Institutional registration successful');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, password, rememberMe } = req.body;

      if (!identifier || !password) {
        throw ApiError.badRequest('Identifier (Email/PRN) and password are required');
      }

      const result = await AuthService.login(
        { identifier, password, rememberMe },
        req.ip,
        req.get('user-agent')
      );

      ApiResponse.success(res, result, 'Authentication successful');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.user?.session_id;
      const userId = req.user?.user_id;

      await AuthService.logout(sessionId, userId);
      ApiResponse.success(res, { loggedOut: true }, 'Session successfully terminated');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/logout-all
   */
  static async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const result = await AuthService.logoutAllSessions(req.user.user_id);
      ApiResponse.success(res, result, 'All active sessions have been revoked');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier } = req.body;
      if (!identifier) {
        throw ApiError.badRequest('Institutional PRN or Email is required');
      }

      const result = await AuthService.requestPasswordReset({ identifier }, req.ip);
      ApiResponse.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, otpCode, newPassword } = req.body;
      if (!identifier || !otpCode || !newPassword) {
        throw ApiError.badRequest('Identifier, 6-digit OTP code, and new password are required');
      }

      const result = await AuthService.resetPassword({ identifier, otpCode, newPassword }, req.ip);
      ApiResponse.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const profile = await AuthService.getProfile(req.user.user_id);
      ApiResponse.success(res, profile, 'User identity verified');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/auth/profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const { fullName, phone, department } = req.body;
      const updated = await AuthService.updateProfile(req.user.user_id, { fullName, phone, department });
      ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/auth/change-password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw ApiError.badRequest('Current password and new password are required');
      }

      const result = await AuthService.changePassword(
        req.user.user_id,
        { currentPassword, newPassword },
        req.ip
      );
      ApiResponse.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/auth/sessions
   */
  static async getActiveSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const sessions = await query<any[]>(
        `SELECT session_id, ip_address, user_agent, created_at, expires_at, is_revoked 
         FROM user_sessions 
         WHERE user_id = ? AND is_revoked = 0 AND expires_at > NOW() 
         ORDER BY created_at DESC`,
        [req.user.user_id]
      );

      ApiResponse.success(res, sessions, 'Active user sessions retrieved');
    } catch (err) {
      next(err);
    }
  }
}
