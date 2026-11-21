import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

export class StudentController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { department, year, status } = req.query;
      const students = await StudentService.getAllStudents({
        department: department as string,
        year: year as string,
        status: status as string,
      });
      return ApiResponse.success(res, students, 'Students retrieved successfully', 200, {
        count: students.length,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentByIdOrPrn(id);
      if (!student) {
        throw ApiError.notFound(`Student with ID or PRN "${id}" not found`);
      }
      return ApiResponse.success(res, student);
    } catch (err) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentService.registerStudent(req.body);
      return ApiResponse.created(res, student, 'Student registered successfully');
    } catch (err) {
      next(err);
    }
  }
}
