import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import { JwtTokenPayload } from '../types/auth.types';

export class SecurityUtil {
  /**
   * Hashes a password using modern bcrypt with configurable salt rounds (default 12)
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.auth.bcryptSaltRounds);
  }

  /**
   * Compares plain password with bcrypt hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a signed, tamper-proof JSON Web Token (JWT)
   */
  static generateAccessToken(payload: Omit<JwtTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn as any,
    });
  }

  /**
   * Verifies and decodes a JWT token
   */
  static verifyAccessToken(token: string): JwtTokenPayload {
    return jwt.verify(token, config.auth.jwtSecret) as JwtTokenPayload;
  }

  /**
   * Generates a cryptographically strong random token
   */
  static generateRandomToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  /**
   * Hashes a sensitive token with SHA-256 for secure database storage
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a secure 6-digit numeric OTP for 2FA / Password Reset
   */
  static generateNumericOtp(length = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max + 1).toString();
  }

  /**
   * Validates institutional password complexity
   * Requires: >= 8 characters, at least 1 uppercase, 1 lowercase, 1 digit
   */
  static validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
    if (!password || password.length < 8) {
      return { valid: false, reason: 'Password must be at least 8 characters in length' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, reason: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, reason: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, reason: 'Password must contain at least one numerical digit' };
    }
    return { valid: true };
  }
}
