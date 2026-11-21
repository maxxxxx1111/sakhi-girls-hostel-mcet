import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/room.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class RoomController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const floor = req.query.floor !== undefined ? parseInt(req.query.floor as string, 10) : undefined;
      const rooms = await RoomService.getAllRooms(floor);
      return ApiResponse.success(res, rooms, 'Rooms retrieved successfully', 200, {
        count: rooms.length,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await RoomService.getHostelSummary();
      return ApiResponse.success(res, summary, 'Hostel summary retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  static async allot(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, bedId, studentId, studentName } = req.body;
      if (!roomId || !bedId || !studentId || !studentName) {
        throw ApiError.badRequest('roomId, bedId, studentId, and studentName are required');
      }

      const result = await RoomService.allotBed(roomId, bedId, studentId, studentName);
      return ApiResponse.success(res, result, 'Bed allotted successfully');
    } catch (err) {
      next(err);
    }
  }

  static async vacate(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId, bedId } = req.body;
      if (!roomId || !bedId) {
        throw ApiError.badRequest('roomId and bedId are required');
      }

      const result = await RoomService.vacateBed(roomId, bedId);
      return ApiResponse.success(res, result, 'Bed vacated successfully');
    } catch (err) {
      next(err);
    }
  }
}
