import { Request, Response, NextFunction } from 'express';
import { LeaveService } from '../services/leave.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class LeaveController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, status } = req.query;
      const leaves = await LeaveService.getAllLeaves({
        studentId: studentId as string,
        status: status as string,
      });
      return ApiResponse.success(res, leaves, 'Leaves retrieved successfully', 200, {
        count: leaves.length,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const leave = await LeaveService.createLeave(req.body);
      return ApiResponse.created(res, leave, 'Leave request submitted successfully');
    } catch (err) {
      next(err);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { wardenId } = req.body;
      if (!wardenId) {
        throw ApiError.badRequest('Warden ID is required to approve a leave pass');
      }

      const result = await LeaveService.approveLeave(id, wardenId);
      return ApiResponse.success(res, result, 'Gate pass approved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { wardenId, reason } = req.body;
      if (!wardenId || !reason) {
        throw ApiError.badRequest('Warden ID and rejection reason are required');
      }

      const result = await LeaveService.rejectLeave(id, wardenId, reason);
      return ApiResponse.success(res, result, 'Leave request rejected');
    } catch (err) {
      next(err);
    }
  }

  static async verifyPass(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const pass = await LeaveService.verifyGatePass(code);
      return ApiResponse.success(res, pass, 'Gate pass verified');
    } catch (err) {
      next(err);
    }
  }
}
