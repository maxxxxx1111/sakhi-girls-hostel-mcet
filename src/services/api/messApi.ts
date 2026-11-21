import { apiClient } from './client';
import { DayMenu, MealAttendanceRecord } from '../../types';

export interface MessRebateCalculation {
  student_id: string;
  from_date: string;
  to_date: string;
  eligible_days: number;
  daily_rate: number;
  rebate_amount: number;
}

export const messApi = {
  async getWeeklyMenu(): Promise<DayMenu[]> {
    return apiClient.get<DayMenu[]>('/mess/menu');
  },

  async getAttendance(params?: { date?: string; studentId?: string }): Promise<MealAttendanceRecord[]> {
    return apiClient.get<MealAttendanceRecord[]>('/mess/attendance', params);
  },

  async markAttendance(data: Partial<MealAttendanceRecord>): Promise<MealAttendanceRecord> {
    return apiClient.post<MealAttendanceRecord>('/mess/attendance', data);
  },

  async calculateRebate(studentId: string, fromDate: string, toDate: string, dailyRate = 120.0): Promise<MessRebateCalculation> {
    return apiClient.get<MessRebateCalculation>('/mess/rebate', {
      studentId,
      fromDate,
      toDate,
      dailyRate,
    });
  },
};
