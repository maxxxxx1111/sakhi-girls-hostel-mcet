import { Request, Response, NextFunction } from 'express';
import { MessService } from '../services/mess.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class MessController {
  static async getMenu(_req: Request, res: Response, next: NextFunction) {
    try {
      const menu = await MessService.getWeeklyMenu();
      return ApiResponse.success(res, menu, 'Weekly menu retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, studentId } = req.query;
      const attendance = await MessService.getAttendance(date as string, studentId as string);
      return ApiResponse.success(res, attendance, 'Meal attendance records retrieved successfully', 200, {
        count: attendance.length,
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await MessService.markAttendance(req.body);
      return ApiResponse.created(res, record, 'Meal attendance recorded');
    } catch (err) {
      next(err);
    }
  }

  static async calculateRebate(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, fromDate, toDate, dailyRate } = req.query;
      if (!studentId || !fromDate || !toDate) {
        throw ApiError.badRequest('studentId, fromDate, and toDate are required query parameters');
      }

      const rate = dailyRate ? parseFloat(dailyRate as string) : 120.0;
      const rebate = await MessService.calculateRebate(studentId as string, fromDate as string, toDate as string, rate);
      return ApiResponse.success(res, rebate, 'Mess rebate calculated successfully');
    } catch (err) {
      next(err);
    }
  }
}
