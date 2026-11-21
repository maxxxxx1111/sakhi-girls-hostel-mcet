import { apiClient } from './client';

export interface WhatsAppSimulationResponse {
  received: {
    from: string;
    text: string;
    messageId: string;
    timestamp: number;
  };
  replies: Array<{
    type: string;
    recipient: string;
    content: any;
    dispatchedAt: string;
  }>;
}

export interface WhatsAppMessageRecord {
  message_id: string;
  wamid: string;
  direction: 'INBOUND' | 'OUTBOUND';
  phone_number: string;
  student_id?: string;
  message_type: string;
  content: string;
  status: string;
  error_message?: string;
  created_at: string;
}

export interface WhatsAppConfigRecord {
  config_id: string;
  phone_number_id: string;
  business_account_id: string;
  business_phone: string;
  is_active: boolean;
  webhook_verify_token: string;
  updated_at: string;
}

export interface WhatsAppTemplateRecord {
  template_id: string;
  template_name: string;
  category: string;
  language: string;
  header_text?: string;
  body_text: string;
  footer_text?: string;
  status: string;
}

export const whatsappApi = {
  simulateMessage: async (phoneNumber: string, messageText: string, messageId?: string) => {
    return apiClient.post<WhatsAppSimulationResponse>('/whatsapp/simulate', {
      phoneNumber,
      messageText,
      messageId,
    });
  },

  getConfig: async () => {
    return apiClient.get<WhatsAppConfigRecord>('/whatsapp/config');
  },

  updateConfig: async (configData: Partial<WhatsAppConfigRecord>) => {
    return apiClient.put<any>('/whatsapp/config', configData);
  },

  getMessages: async (limit: number = 25) => {
    return apiClient.get<WhatsAppMessageRecord[]>(`/whatsapp/messages?limit=${limit}`);
  },

  getTemplates: async () => {
    return apiClient.get<WhatsAppTemplateRecord[]>('/whatsapp/templates');
  },
};
