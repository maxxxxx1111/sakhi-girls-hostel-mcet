import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { ApiResponse } from '../utils/apiResponse';

export class AnalyticsController {
  static async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await AnalyticsService.getOverviewMetrics();
      return ApiResponse.success(res, overview, 'Hostel overview metrics retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getDepartments(_req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await AnalyticsService.getDepartmentDistribution();
      return ApiResponse.success(res, departments, 'Department distribution retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getYears(_req: Request, res: Response, next: NextFunction) {
    try {
      const years = await AnalyticsService.getYearDistribution();
      return ApiResponse.success(res, years, 'Year distribution retrieved');
    } catch (err) {
      next(err);
    }
  }
}
