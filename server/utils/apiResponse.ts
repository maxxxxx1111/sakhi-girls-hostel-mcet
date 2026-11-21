import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200, meta?: Record<string, any>) {
    const payload: ApiResponsePayload<T> = {
      success: true,
      data,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
