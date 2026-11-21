import { query } from '../db';
import { ApiError } from '../utils/apiError';

export interface MessMenuRecord {
  menu_id: string;
  day_of_week: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  special_diet?: string;
}

export interface MealAttendanceRecord {
  attendance_id: string;
  student_id: string;
  student_name: string;
  room_number: string;
  date: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  status: 'Present' | 'Leave / Rebate' | 'Missed';
  token_number: string;
}

export class MessService {
  /**
   * Retrieves weekly menu
   */
  static async getWeeklyMenu(): Promise<MessMenuRecord[]> {
    return await query<MessMenuRecord[]>('SELECT * FROM mess_menu ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")');
  }

  /**
   * Retrieves meal attendance records
   */
  static async getAttendance(date?: string, studentId?: string): Promise<MealAttendanceRecord[]> {
    let sql = 'SELECT * FROM meal_attendance WHERE 1=1';
    const params: any[] = [];

    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    if (studentId) {
      sql += ' AND student_id = ?';
      params.push(studentId);
    }

    sql += ' ORDER BY created_at DESC';
    return await query<MealAttendanceRecord[]>(sql, params);
  }

  /**
   * Marks meal attendance for a student
   */
  static async markAttendance(data: Partial<MealAttendanceRecord>): Promise<MealAttendanceRecord> {
    if (!data.student_id || !data.meal_type) {
      throw ApiError.badRequest('Student ID and Meal Type are required');
    }

    const attendanceId = data.attendance_id || `att-${Date.now()}`;
    const date = data.date || new Date().toISOString().split('T')[0];
    const token = data.token_number || `TKN-${Math.floor(100 + Math.random() * 900)}`;

    const record: MealAttendanceRecord = {
      attendance_id: attendanceId,
      student_id: data.student_id,
      student_name: data.student_name || 'Scholar',
      room_number: data.room_number || 'S-101',
      date,
      meal_type: data.meal_type as any,
      status: (data.status as any) || 'Present',
      token_number: token,
    };

    const sql = `
      INSERT INTO meal_attendance (
        attendance_id, student_id, student_name, room_number, date, meal_type, status, token_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      record.attendance_id,
      record.student_id,
      record.student_name,
      record.room_number,
      record.date,
      record.meal_type,
      record.status,
      record.token_number,
    ]);

    return record;
  }

  /**
   * Calculates eligible mess rebate for a student
   */
  static async calculateRebate(studentId: string, fromDate: string, toDate: string, dailyRate = 120.0) {
    try {
      // Attempt stored procedure call
      const procResult = await query(
        'CALL sp_calculate_mess_rebate(?, ?, ?, @eligible_days, @rebate_amount); SELECT @eligible_days AS eligible_days, @rebate_amount AS rebate_amount;',
        [studentId, fromDate, toDate]
      );
      if (Array.isArray(procResult) && procResult.length > 1) {
        return procResult[1][0];
      }
    } catch {
      // Fallback calculation in Node if procedure is pending
    }

    const start = new Date(fromDate).getTime();
    const end = new Date(toDate).getTime();
    const days = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const eligibleDays = days >= 2 ? days : 0;
    const rebateAmount = eligibleDays * dailyRate;

    return {
      student_id: studentId,
      from_date: fromDate,
      to_date: toDate,
      eligible_days: eligibleDays,
      daily_rate: dailyRate,
      rebate_amount: rebateAmount,
    };
  }
}
