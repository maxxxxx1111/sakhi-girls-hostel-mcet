import { apiClient } from './client';
import { LeaveRequest } from '../../types';

export const leaveApi = {
  async getAll(params?: { studentId?: string; status?: string }): Promise<LeaveRequest[]> {
    return apiClient.get<LeaveRequest[]>('/leaves', params);
  },

  async create(leaveData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    return apiClient.post<LeaveRequest>('/leaves', leaveData);
  },

  async approve(leaveId: string, wardenId: string) {
    return apiClient.post(`/leaves/${leaveId}/approve`, { wardenId });
  },

  async reject(leaveId: string, wardenId: string, reason: string) {
    return apiClient.post(`/leaves/${leaveId}/reject`, { wardenId, reason });
  },

  async verifyPass(code: string): Promise<LeaveRequest> {
    return apiClient.get<LeaveRequest>(`/leaves/verify/${code}`);
  },
};
