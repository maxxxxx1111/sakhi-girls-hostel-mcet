import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaint.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class ComplaintController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, status, category } = req.query;
      const complaints = await ComplaintService.getAllComplaints({
        studentId: studentId as string,
        status: status as string,
        category: category as string,
      });
      return ApiResponse.success(res, complaints, 'Complaints retrieved successfully', 200, {
        count: complaints.length,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const complaint = await ComplaintService.createComplaint(req.body);
      return ApiResponse.created(res, complaint, 'Complaint ticket submitted successfully');
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, wardenId, notes } = req.body;
      if (!status || !wardenId) {
        throw ApiError.badRequest('status and wardenId are required');
      }

      const result = await ComplaintService.updateStatus(id, status, wardenId, notes);
      return ApiResponse.success(res, result, 'Complaint status updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
