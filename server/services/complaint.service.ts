import { query } from '../db';
import { ApiError } from '../utils/apiError';

export interface ComplaintRecord {
  complaint_id: string;
  student_id: string;
  student_name: string;
  room_number: string;
  category: string;
  title: string;
  description: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending' | 'In Progress' | 'Resolved';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at?: string;
}

export class ComplaintService {
  /**
   * Retrieves all complaints
   */
  static async getAllComplaints(filters?: { studentId?: string; status?: string; category?: string }): Promise<ComplaintRecord[]> {
    let sql = 'SELECT * FROM complaints WHERE 1=1';
    const params: any[] = [];

    if (filters?.studentId) {
      sql += ' AND student_id = ?';
      params.push(filters.studentId);
    }
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters?.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    sql += ' ORDER BY created_at DESC';
    return await query<ComplaintRecord[]>(sql, params);
  }

  /**
   * Creates a new complaint ticket
   */
  static async createComplaint(data: Partial<ComplaintRecord>): Promise<ComplaintRecord> {
    if (!data.student_id || !data.title || !data.description) {
      throw ApiError.badRequest('Student ID, title, and description are required');
    }

    const complaintId = data.complaint_id || `comp-${Date.now()}`;
    const record: ComplaintRecord = {
      complaint_id: complaintId,
      student_id: data.student_id,
      student_name: data.student_name || 'Scholar',
      room_number: data.room_number || 'S-101',
      category: data.category || 'Maintenance',
      title: data.title.trim(),
      description: data.description.trim(),
      urgency: data.urgency || 'Medium',
      status: 'Pending',
    };

    const sql = `
      INSERT INTO complaints (
        complaint_id, student_id, student_name, room_number,
        category, title, description, urgency, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      record.complaint_id,
      record.student_id,
      record.student_name,
      record.room_number,
      record.category,
      record.title,
      record.description,
      record.urgency,
      record.status,
    ]);

    return record;
  }

  /**
   * Updates status of a complaint
   */
  static async updateStatus(complaintId: string, status: 'In Progress' | 'Resolved', wardenId: string, notes?: string) {
    const resolvedAt = status === 'Resolved' ? new Date().toISOString().replace('T', ' ').substring(0, 19) : null;

    await query(
      `UPDATE complaints 
       SET status = ?, resolved_by = ?, resolution_notes = ?, resolved_at = ? 
       WHERE complaint_id = ?`,
      [status, wardenId, notes || null, resolvedAt, complaintId]
    );

    return { complaintId, status, resolvedBy: wardenId, resolutionNotes: notes, resolvedAt };
  }
}
