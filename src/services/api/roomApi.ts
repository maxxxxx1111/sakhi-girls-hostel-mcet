import { apiClient } from './client';
import { Room } from '../../types';

export interface HostelSummary {
  hostel_name: string;
  code: string;
  gender: string;
  total_floors: number;
  total_rooms: number;
  total_beds: number;
  occupied_beds: number;
  available_beds_left: number;
  maintenance_beds: number;
  occupancy_pct: number;
}

export const roomApi = {
  async getAll(floor?: number): Promise<Room[]> {
    return apiClient.get<Room[]>('/rooms', { floor });
  },

  async getSummary(): Promise<HostelSummary> {
    return apiClient.get<HostelSummary>('/rooms/summary');
  },

  async allotBed(roomId: string, bedId: string, studentId: string, studentName: string) {
    return apiClient.post('/rooms/allot', { roomId, bedId, studentId, studentName });
  },

  async vacateBed(roomId: string, bedId: string) {
    return apiClient.post('/rooms/vacate', { roomId, bedId });
  },
};
