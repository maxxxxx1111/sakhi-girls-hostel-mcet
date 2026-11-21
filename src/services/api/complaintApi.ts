import { apiClient } from './client';
import { Complaint } from '../../types';

export const complaintApi = {
  async getAll(params?: { studentId?: string; status?: string; category?: string }): Promise<Complaint[]> {
    return apiClient.get<Complaint[]>('/complaints', params);
  },

  async create(complaintData: Partial<Complaint>): Promise<Complaint> {
    return apiClient.post<Complaint>('/complaints', complaintData);
  },

  async updateStatus(complaintId: string, status: 'In Progress' | 'Resolved', wardenId: string, notes?: string) {
    return apiClient.patch(`/complaints/${complaintId}/status`, { status, wardenId, notes });
  },
};
