import { query } from '../db';

export class AnalyticsService {
  /**
   * Provides aggregate statistics across the entire hostel
   */
  static async getOverviewMetrics() {
    const [summary] = await query(`
      SELECT 
        (SELECT COUNT(*) FROM students WHERE status = 'Active') AS total_active_students,
        (SELECT COUNT(*) FROM rooms) AS total_rooms,
        (SELECT SUM(capacity) FROM rooms) AS total_capacity,
        (SELECT SUM(occupied) FROM rooms) AS total_occupied,
        (SELECT COUNT(*) FROM leave_requests WHERE status = 'Approved' AND CURDATE() BETWEEN from_date AND to_date) AS students_on_leave,
        (SELECT COUNT(*) FROM complaints WHERE status = 'Pending') AS pending_complaints,
        (SELECT COUNT(*) FROM beds WHERE status = 'Available') AS vacant_beds
    `);

    return summary;
  }

  /**
   * Fetches branch distribution across the 6 engineering branches
   */
  static async getDepartmentDistribution() {
    try {
      const rows = await query('SELECT * FROM v_department_distribution');
      if (rows.length > 0) return rows;
    } catch {
      // Fallback query
    }

    return await query(`
      SELECT 
        department,
        COUNT(*) AS student_count,
        ROUND((COUNT(*) / (SELECT COUNT(*) FROM students WHERE status = 'Active')) * 100, 1) AS percentage
      FROM students
      WHERE status = 'Active'
      GROUP BY department
      ORDER BY student_count DESC
    `);
  }

  /**
   * Fetches year distribution across FE, SE, TE, and BE floors
   */
  static async getYearDistribution() {
    try {
      const rows = await query('SELECT * FROM v_year_distribution');
      if (rows.length > 0) return rows;
    } catch {
      // Fallback query
    }

    return await query(`
      SELECT 
        year,
        COUNT(*) AS student_count,
        ROUND((COUNT(*) / (SELECT COUNT(*) FROM students WHERE status = 'Active')) * 100, 1) AS percentage
      FROM students
      WHERE status = 'Active'
      GROUP BY year
      ORDER BY FIELD(year, '1st Year', '2nd Year', '3rd Year', '4th Year')
    `);
  }
}
