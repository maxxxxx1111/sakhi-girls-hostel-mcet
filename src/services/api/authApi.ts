import { apiClient } from './client';

export interface AuthUserData {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role_id: string;
  role_name: string;
  hierarchy_level: number;
  account_status: string;
  is_email_verified: boolean;
  student_id?: string | null;
  warden_id?: string | null;
  department?: string | null;
  mfa_enabled: boolean;
  permissions: string[];
  session_id?: string;
}

export interface AuthResponse {
  user: AuthUserData;
  accessToken: string;
  sessionId: string;
}

export const authApi = {
  login: async (identifier: string, password: string, rememberMe = true): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', {
      identifier,
      password,
      rememberMe,
    });
    if (res?.accessToken) {
      apiClient.setAuthToken(res.accessToken);
    }
    return res;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    studentPrn?: string;
    department?: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res?.accessToken) {
      apiClient.setAuthToken(res.accessToken);
    }
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.setAuthToken(null);
    }
  },

  logoutAll: async (): Promise<{ revokedCount: number }> => {
    const res = await apiClient.post<{ revokedCount: number }>('/auth/logout-all');
    apiClient.setAuthToken(null);
    return res;
  },

  forgotPassword: async (identifier: string): Promise<{ success: boolean; message: string; otpCode?: string }> => {
    return apiClient.post('/auth/forgot-password', { identifier });
  },

  resetPassword: async (
    identifier: string,
    otpCode: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post('/auth/reset-password', { identifier, otpCode, newPassword });
  },

  getMe: async (): Promise<AuthUserData> => {
    return apiClient.get<AuthUserData>('/auth/me');
  },

  updateProfile: async (data: { fullName?: string; phone?: string; department?: string }): Promise<AuthUserData> => {
    return apiClient.put<AuthUserData>('/auth/profile', data);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.put('/auth/change-password', { currentPassword, newPassword });
  },
};
