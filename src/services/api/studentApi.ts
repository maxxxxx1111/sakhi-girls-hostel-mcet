import { apiClient } from './client';
import { Student } from '../../types';

export const studentApi = {
  async getAll(params?: { department?: string; year?: string; status?: string }): Promise<Student[]> {
    return apiClient.get<Student[]>('/students', params);
  },

  async getById(id: string): Promise<Student> {
    return apiClient.get<Student>(`/students/${id}`);
  },

  async register(studentData: Partial<Student>): Promise<Student> {
    return apiClient.post<Student>('/students/register', studentData);
  },
};
