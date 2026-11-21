import { query, transaction } from '../db';
import { ApiError } from '../utils/apiError';

export interface StudentRecord {
  student_id: string;
  prn: string;
  name: string;
  gender: string;
  course: string;
  department: string;
  year: string;
  division: string;
  mobile: string;
  email: string;
  parent_name: string;
  parent_phone: string;
  emergency_contact?: string;
  hostel_id?: string;
  hostel_name?: string;
  room_id?: string;
  room_number?: string;
  bed_number?: string;
  room_type?: string;
  blood_group?: string;
  admission_date: string;
  status: string;
  avatar?: string;
  address?: string;
  created_at?: string;
}

export class StudentService {
  /**
   * Retrieves all students with optional filters
   */
  static async getAllStudents(filters?: { department?: string; year?: string; status?: string }): Promise<StudentRecord[]> {
    let sql = 'SELECT * FROM students WHERE 1=1';
    const params: any[] = [];

    if (filters?.department) {
      sql += ' AND department = ?';
      params.push(filters.department);
    }
    if (filters?.year) {
      sql += ' AND year = ?';
      params.push(filters.year);
    }
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    sql += ' ORDER BY created_at DESC';
    return await query<StudentRecord[]>(sql, params);
  }

  /**
   * Finds student by PRN or ID
   */
  static async getStudentByIdOrPrn(idOrPrn: string): Promise<StudentRecord | null> {
    const sql = 'SELECT * FROM students WHERE student_id = ? OR prn = ? LIMIT 1';
    const rows = await query<StudentRecord[]>(sql, [idOrPrn, idOrPrn]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Creates a new student resident and optionally allocates a bed
   */
  static async registerStudent(data: Partial<StudentRecord>): Promise<StudentRecord> {
    if (!data.name || !data.email) {
      throw ApiError.badRequest('Name and Email are required fields');
    }

    // Auto-generate PRN if missing
    const prn = data.prn || `MCET2026${data.department?.includes('Computer') ? 'CS' : data.department?.includes('Information') ? 'IT' : 'EN'}${Math.floor(100 + Math.random() * 900)}`;
    const studentId = data.student_id || `std-${Date.now()}`;

    const studentRecord: StudentRecord = {
      student_id: studentId,
      prn,
      name: data.name.trim(),
      gender: data.gender || 'Female',
      course: data.course || 'B.Tech',
      department: data.department || 'Computer Science & Engineering',
      year: data.year || '1st Year',
      division: data.division || 'A',
      mobile: data.mobile || '+91 98230 11223',
      email: data.email.toLowerCase().trim(),
      parent_name: data.parent_name || 'Guardian',
      parent_phone: data.parent_phone || '+91 94220 55667',
      emergency_contact: data.emergency_contact || data.parent_phone,
      hostel_id: data.hostel_id || 'hostel-sakhi',
      hostel_name: data.hostel_name || 'Sakhi Girls Hostel',
      room_id: data.room_id || 'room-s-101',
      room_number: data.room_number || 'S-101',
      bed_number: data.bed_number || 'Bed-1',
      room_type: data.room_type || 'Double',
      blood_group: data.blood_group || 'O+',
      admission_date: data.admission_date || new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      address: data.address || 'Maharashtra, India',
    };

    const sql = `
      INSERT INTO students (
        student_id, prn, name, gender, course, department, year, division,
        mobile, email, parent_name, parent_phone, emergency_contact,
        hostel_id, hostel_name, room_id, room_number, bed_number,
        room_type, blood_group, admission_date, status, avatar, address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      studentRecord.student_id,
      studentRecord.prn,
      studentRecord.name,
      studentRecord.gender,
      studentRecord.course,
      studentRecord.department,
      studentRecord.year,
      studentRecord.division,
      studentRecord.mobile,
      studentRecord.email,
      studentRecord.parent_name,
      studentRecord.parent_phone,
      studentRecord.emergency_contact,
      studentRecord.hostel_id,
      studentRecord.hostel_name,
      studentRecord.room_id,
      studentRecord.room_number,
      studentRecord.bed_number,
      studentRecord.room_type,
      studentRecord.blood_group,
      studentRecord.admission_date,
      studentRecord.status,
      studentRecord.avatar,
      studentRecord.address,
    ];

    await query(sql, params);
    return studentRecord;
  }
}
