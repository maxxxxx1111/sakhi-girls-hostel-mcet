import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { config } from '../config';

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const code = isApiError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  if (statusCode >= 500) {
    console.error(`[UnhandledError] ${req.method} ${req.originalUrl}:`, err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: isApiError ? err.details : undefined,
      stack: config.env === 'development' ? err.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  });
}
