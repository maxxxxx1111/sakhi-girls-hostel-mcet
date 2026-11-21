import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface ServerConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  appUrl: string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    connectionLimit: number;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenExpiresIn: string;
    bcryptSaltRounds: number;
    maxLoginAttempts: number;
    lockoutDurationMinutes: number;
    sessionDurationDays: number;
  };
  whatsapp: {
    enabled: boolean;
    phoneNumberId: string;
    accessToken: string;
    businessAccountId: string;
    verifyToken: string;
    appSecret: string;
    businessPhone: string;
    apiVersion: string;
    webhookUrl: string;
  };
  gemini: {
    apiKey: string;
  };
}

export const config: ServerConfig = {
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    name: process.env.DB_NAME || 'mcet_hostel_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'mcet-sakhi-hostel-jwt-secret-key-2026-production-grade',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    bcryptSaltRounds: 12,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    sessionDurationDays: 30,
  },
  whatsapp: {
    enabled: process.env.WHATSAPP_ENABLED !== 'false',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '512489108612345',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '109283746591823',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'sakhi_mcet_whatsapp_verify_token_2026',
    appSecret: process.env.WHATSAPP_APP_SECRET || 'mcet_sakhi_meta_app_secret_2026',
    businessPhone: process.env.WHATSAPP_BUSINESS_PHONE || '+91 7265 252443',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
    webhookUrl: process.env.WHATSAPP_WEBHOOK_URL || 'https://sakhi.mcet.ac.in/api/whatsapp/webhook',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
};
