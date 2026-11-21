import { query, transaction } from '../db';
import { ApiError } from '../utils/apiError';
import { WhatsAppNotificationService } from './whatsapp.notification';

export interface LeaveRecord {
  leave_id: string;
  student_id: string;
  student_name: string;
  room_number: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_days: number;
  reason: string;
  destination: string;
  parent_consent: boolean;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  gate_pass_code?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  source?: string;
  whatsapp_phone?: string;
  departure_time?: string;
  expected_return_time?: string;
  created_at?: string;
}

export class LeaveService {
  /**
   * Retrieves all leave requests
   */
  static async getAllLeaves(filters?: { studentId?: string; status?: string }): Promise<LeaveRecord[]> {
    let sql = 'SELECT * FROM leave_requests WHERE 1=1';
    const params: any[] = [];

    if (filters?.studentId) {
      sql += ' AND student_id = ?';
      params.push(filters.studentId);
    }
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    sql += ' ORDER BY created_at DESC';
    return await query<LeaveRecord[]>(sql, params);
  }

  /**
   * Creates a new leave request
   */
  static async createLeave(data: Partial<LeaveRecord>): Promise<LeaveRecord> {
    if (!data.student_id || !data.from_date || !data.to_date || !data.reason) {
      throw ApiError.badRequest('Student ID, from date, to date, and reason are required');
    }

    const leaveId = data.leave_id || `leave-${Date.now()}`;
    const totalDays = data.total_days || 1;

    const record: LeaveRecord = {
      leave_id: leaveId,
      student_id: data.student_id,
      student_name: data.student_name || 'Scholar',
      room_number: data.room_number || 'S-101',
      leave_type: data.leave_type || 'Weekend Home',
      from_date: data.from_date,
      to_date: data.to_date,
      total_days: totalDays,
      reason: data.reason,
      destination: data.destination || 'Home',
      parent_consent: data.parent_consent ?? true,
      status: 'Pending',
    };

    const sql = `
      INSERT INTO leave_requests (
        leave_id, student_id, student_name, room_number, leave_type,
        from_date, to_date, total_days, reason, destination, parent_consent, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      record.leave_id,
      record.student_id,
      record.student_name,
      record.room_number,
      record.leave_type,
      record.from_date,
      record.to_date,
      record.total_days,
      record.reason,
      record.destination,
      record.parent_consent ? 1 : 0,
      record.status,
    ]);

    return record;
  }

  /**
   * Approves a leave request and issues a digital gate pass code
   */
  static async approveLeave(leaveId: string, wardenId: string) {
    const gatePassCode = `GP-MCET-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await query(
      `UPDATE leave_requests 
       SET status = 'Approved', gate_pass_code = ?, reviewed_by = ?, reviewed_date = ?, approved_by = ?, approved_at = ? 
       WHERE leave_id = ?`,
      [gatePassCode, wardenId, approvedAt, wardenId, approvedAt, leaveId]
    );

    // Asynchronously dispatch WhatsApp notification to student with digital QR pass link
    WhatsAppNotificationService.notifyDecision(leaveId, 'Approved', undefined, wardenId).catch((err) => {
      console.warn('[LeaveService] WhatsApp notification failed:', err);
    });

    return { leaveId, status: 'Approved', gatePassCode, approvedBy: wardenId, approvedAt };
  }

  /**
   * Rejects a leave request
   */
  static async rejectLeave(leaveId: string, wardenId: string, reason: string) {
    const reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await query(
      `UPDATE leave_requests 
       SET status = 'Rejected', reviewed_by = ?, reviewed_date = ?, warden_remarks = ?, approved_by = ?, rejection_reason = ? 
       WHERE leave_id = ?`,
      [wardenId, reviewedAt, reason, wardenId, reason, leaveId]
    );

    // Asynchronously dispatch WhatsApp rejection notification to student
    WhatsAppNotificationService.notifyDecision(leaveId, 'Rejected', reason, wardenId).catch((err) => {
      console.warn('[LeaveService] WhatsApp notification failed:', err);
    });

    return { leaveId, status: 'Rejected', rejectedBy: wardenId, reason };
  }

  /**
   * Verifies gate pass by code
   */
  static async verifyGatePass(code: string) {
    const rows = await query<LeaveRecord[]>(
      'SELECT * FROM leave_requests WHERE gate_pass_code = ? OR student_id = ? LIMIT 1',
      [code, code]
    );

    if (rows.length === 0) {
      throw ApiError.notFound('Invalid or unverified gate pass code');
    }

    return rows[0];
  }
}
