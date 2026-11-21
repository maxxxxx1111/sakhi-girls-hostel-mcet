import { query, transaction } from '../db';
import { ApiError } from '../utils/apiError';

export interface RoomRecord {
  room_id: string;
  hostel_id: string;
  room_number: string;
  floor: number;
  capacity: number;
  occupied: number;
  room_type: string;
  status: string;
  beds?: BedRecord[];
}

export interface BedRecord {
  bed_id: string;
  room_id: string;
  bed_number: string;
  status: string;
  student_id: string | null;
  student_name: string | null;
}

export class RoomService {
  /**
   * Retrieves all rooms with nested bed status
   */
  static async getAllRooms(floor?: number): Promise<RoomRecord[]> {
    let sql = 'SELECT * FROM rooms';
    const params: any[] = [];

    if (floor !== undefined) {
      sql += ' WHERE floor = ?';
      params.push(floor);
    }
    sql += ' ORDER BY floor ASC, room_number ASC';

    const rooms = await query<RoomRecord[]>(sql, params);
    const beds = await query<BedRecord[]>('SELECT * FROM beds ORDER BY bed_number ASC');

    // Group beds by room
    const bedsByRoom = new Map<string, BedRecord[]>();
    for (const b of beds) {
      if (!bedsByRoom.has(b.room_id)) {
        bedsByRoom.set(b.room_id, []);
      }
      bedsByRoom.get(b.room_id)!.push(b);
    }

    return rooms.map((r) => ({
      ...r,
      beds: bedsByRoom.get(r.room_id) || [],
    }));
  }

  /**
   * Fetches high-level hostel occupancy metrics
   */
  static async getHostelSummary() {
    try {
      const summaryRows = await query('SELECT * FROM v_sakhi_hostel_summary LIMIT 1');
      if (summaryRows.length > 0) {
        return summaryRows[0];
      }
    } catch {
      // Fallback calculation directly from rooms if view is pending
    }

    const [agg] = await query(`
      SELECT 
        COUNT(*) AS total_rooms,
        SUM(capacity) AS total_beds,
        SUM(occupied) AS occupied_beds,
        (SUM(capacity) - SUM(occupied)) AS available_beds,
        ROUND((SUM(occupied) / SUM(capacity)) * 100, 1) AS occupancy_pct
      FROM rooms
    `);

    return agg;
  }

  /**
   * Allots an available bed to a student
   */
  static async allotBed(roomId: string, bedId: string, studentId: string, studentName: string) {
    return await transaction(async (conn) => {
      // Verify bed is available
      const [bedRows]: any = await conn.query(
        'SELECT * FROM beds WHERE bed_id = ? AND room_id = ? FOR UPDATE',
        [bedId, roomId]
      );

      if (bedRows.length === 0) {
        throw ApiError.notFound('Bed not found in the specified room');
      }

      const bed = bedRows[0];
      if (bed.status === 'Occupied') {
        throw ApiError.conflict('This bed is already occupied');
      }

      // Update bed
      await conn.query(
        'UPDATE beds SET status = ?, student_id = ?, student_name = ? WHERE bed_id = ?',
        ['Occupied', studentId, studentName, bedId]
      );

      // Recalculate room occupancy
      const [countRows]: any = await conn.query(
        'SELECT COUNT(*) as occupied_count FROM beds WHERE room_id = ? AND status = ?',
        [roomId, 'Occupied']
      );
      const occupied = countRows[0].occupied_count;

      const [roomRows]: any = await conn.query('SELECT capacity FROM rooms WHERE room_id = ?', [roomId]);
      const capacity = roomRows[0]?.capacity || 2;
      const status = occupied >= capacity ? 'Full' : occupied > 0 ? 'Partially Occupied' : 'Available';

      await conn.query(
        'UPDATE rooms SET occupied = ?, status = ? WHERE room_id = ?',
        [occupied, status, roomId]
      );

      return { roomId, bedId, studentId, studentName, status: 'Occupied' };
    });
  }

  /**
   * Vacates an occupied bed
   */
  static async vacateBed(roomId: string, bedId: string) {
    return await transaction(async (conn) => {
      const [bedRows]: any = await conn.query(
        'SELECT * FROM beds WHERE bed_id = ? AND room_id = ? FOR UPDATE',
        [bedId, roomId]
      );

      if (bedRows.length === 0) {
        throw ApiError.notFound('Bed not found');
      }

      // Update bed to Available
      await conn.query(
        'UPDATE beds SET status = ?, student_id = NULL, student_name = NULL WHERE bed_id = ?',
        ['Available', bedId]
      );

      // Recalculate room occupancy
      const [countRows]: any = await conn.query(
        'SELECT COUNT(*) as occupied_count FROM beds WHERE room_id = ? AND status = ?',
        [roomId, 'Occupied']
      );
      const occupied = countRows[0].occupied_count;

      const [roomRows]: any = await conn.query('SELECT capacity FROM rooms WHERE room_id = ?', [roomId]);
      const capacity = roomRows[0]?.capacity || 2;
      const status = occupied >= capacity ? 'Full' : occupied > 0 ? 'Partially Occupied' : 'Available';

      await conn.query(
        'UPDATE rooms SET occupied = ?, status = ? WHERE room_id = ?',
        [occupied, status, roomId]
      );

      return { roomId, bedId, status: 'Available' };
    });
  }
}
