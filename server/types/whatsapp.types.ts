export interface WhatsAppIncomingMessage {
  from: string; // sender phone number in E.164
  id: string; // Meta message id (wamid)
  timestamp: string;
  type: 'text' | 'interactive' | 'button' | 'location';
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      value?: {
        messaging_product: string;
        metadata?: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: WhatsAppIncomingMessage[];
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export type ConversationStep =
  | 'IDLE'
  | 'AWAITING_OTP'
  | 'APPLY_CHOOSE_TYPE'
  | 'APPLY_DESTINATION'
  | 'APPLY_DEPARTURE_TIME'
  | 'APPLY_RETURN_TIME'
  | 'APPLY_REASON'
  | 'APPLY_CONFIRM';

export interface GatePassDraftSession {
  outingType?: string;
  destination?: string;
  departureTime?: string;
  returnTime?: string;
  reason?: string;
  emergencyContact?: string;
}

export interface WhatsAppConversationRecord {
  phone_number: string;
  student_id?: string | null;
  current_step: ConversationStep;
  session_data?: GatePassDraftSession | null;
  is_verified: boolean;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  last_interaction: string;
  created_at: string;
}

export interface WhatsAppMessageRecord {
  message_id: string;
  wamid?: string | null;
  phone_number: string;
  direction: 'INBOUND' | 'OUTBOUND';
  message_type: string;
  body: string;
  status: 'RECEIVED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  error_message?: string | null;
  raw_payload?: Record<string, any> | null;
  created_at: string;
}
