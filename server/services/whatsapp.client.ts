import { config } from '../config';
import { query } from '../db';
import { WhatsAppMessageRecord } from '../types/whatsapp.types';
import { BaileysWhatsAppService } from './whatsapp.baileys';

export class WhatsAppClient {
  private static baseUrl = `https://graph.facebook.com/${config.whatsapp.apiVersion}`;

  /**
   * Normalizes incoming or outgoing phone number to E.164 digits without symbols
   */
  static normalizePhoneNumber(phone: string): string {
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      return `91${digits}`; // Default to Indian country code (+91)
    }
    return digits;
  }

  /**
   * Sends a plain text message via Meta Cloud API
   */
  static async sendTextMessage(to: string, messageText: string): Promise<{ success: boolean; wamid?: string }> {
    const normalizedPhone = this.normalizePhoneNumber(to);
    const messageId = `msg-out-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let wamid: string | undefined;
    let status: 'SENT' | 'FAILED' = 'SENT';
    let errorMessage: string | null = null;

    // 1. Dispatch via Baileys (WhatsApp Web QR Linked Device) if paired
    if (BaileysWhatsAppService.isSocketConnected()) {
      try {
        const sent = await BaileysWhatsAppService.sendMessage(normalizedPhone, messageText);
        if (sent) {
          wamid = `baileys-${Date.now()}`;
          status = 'SENT';
        }
      } catch (bErr: any) {
        console.error('[WhatsAppClient] Baileys dispatch error:', bErr.message);
      }
    } else if (config.whatsapp.enabled && config.whatsapp.accessToken) {
      try {
        const url = `${this.baseUrl}/${config.whatsapp.phoneNumberId}/messages`;
        const payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: normalizedPhone,
          type: 'text',
          text: {
            preview_url: true,
            body: messageText,
          },
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.whatsapp.accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data: any = await response.json();
        if (!response.ok) {
          status = 'FAILED';
          errorMessage = data?.error?.message || 'Meta Cloud API rejected message';
          console.error('[WhatsAppClient] Meta API error:', data);
        } else {
          wamid = data?.messages?.[0]?.id;
        }
      } catch (err: any) {
        status = 'FAILED';
        errorMessage = err.message || 'Network error communicating with Meta API';
      }
    } else {
      // In development / demo sandbox: simulate successful dispatch
      wamid = `wamid.HBgM${Date.now()}==`;
    }

    // Persist message to database for audit & Warden review
    try {
      await query(
        `INSERT INTO whatsapp_messages 
          (message_id, wamid, phone_number, direction, message_type, body, status, error_message)
         VALUES (?, ?, ?, 'OUTBOUND', 'text', ?, ?, ?)`,
        [messageId, wamid || null, normalizedPhone, messageText, status, errorMessage]
      );
    } catch (dbErr: any) {
      console.warn('[WhatsAppClient] Failed to log outgoing message to DB:', dbErr.message);
    }

    return { success: status === 'SENT', wamid };
  }

  /**
   * Sends an interactive button message (Quick-reply options)
   */
  static async sendButtonMessage(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<{ success: boolean; wamid?: string }> {
    const normalizedPhone = this.normalizePhoneNumber(to);
    const messageId = `msg-btn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let wamid: string | undefined;
    let status: 'SENT' | 'FAILED' = 'SENT';
    let errorMessage: string | null = null;

    // 1. Dispatch via Baileys (WhatsApp Web QR Linked Device) if paired
    if (BaileysWhatsAppService.isSocketConnected()) {
      try {
        const buttonOptions = buttons.map((b, i) => `${i + 1}. ${b.title}`).join('\n');
        const formatted = `${bodyText}\n\n*Options:*\n${buttonOptions}`;
        const sent = await BaileysWhatsAppService.sendMessage(normalizedPhone, formatted);
        if (sent) {
          wamid = `baileys-${Date.now()}`;
          status = 'SENT';
        }
      } catch (bErr: any) {
        console.error('[WhatsAppClient] Baileys dispatch error:', bErr.message);
      }
    } else if (config.whatsapp.enabled && config.whatsapp.accessToken) {
      try {
        const url = `${this.baseUrl}/${config.whatsapp.phoneNumberId}/messages`;
        const payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: normalizedPhone,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
              buttons: buttons.slice(0, 3).map((b) => ({
                type: 'reply',
                reply: {
                  id: b.id,
                  title: b.title.substring(0, 20),
                },
              })),
            },
          },
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.whatsapp.accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data: any = await response.json();
        if (!response.ok) {
          status = 'FAILED';
          errorMessage = data?.error?.message;
        } else {
          wamid = data?.messages?.[0]?.id;
        }
      } catch (err: any) {
        status = 'FAILED';
        errorMessage = err.message;
      }
    } else {
      wamid = `wamid.HBgM${Date.now()}==`;
    }

    // Persist to database
    try {
      await query(
        `INSERT INTO whatsapp_messages 
          (message_id, wamid, phone_number, direction, message_type, body, status, error_message)
         VALUES (?, ?, ?, 'OUTBOUND', 'interactive_button', ?, ?, ?)`,
        [messageId, wamid || null, normalizedPhone, bodyText, status, errorMessage]
      );
    } catch (dbErr: any) {
      console.warn('[WhatsAppClient] DB log error:', dbErr.message);
    }

    return { success: status === 'SENT', wamid };
  }

  /**
   * Sends an approved WhatsApp Template Message (required outside 24h window)
   */
  static async sendTemplateMessage(
    to: string,
    templateName: string,
    parameters: string[]
  ): Promise<{ success: boolean; wamid?: string }> {
    const normalizedPhone = this.normalizePhoneNumber(to);
    const messageId = `msg-tmpl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let wamid: string | undefined;
    let status: 'SENT' | 'FAILED' = 'SENT';
    let errorMessage: string | null = null;

    // 1. Dispatch via Baileys (WhatsApp Web QR Linked Device) if paired
    if (BaileysWhatsAppService.isSocketConnected()) {
      try {
        const formatted = `📋 *${templateName.toUpperCase()}*\n${parameters.join('\n')}`;
        const sent = await BaileysWhatsAppService.sendMessage(normalizedPhone, formatted);
        if (sent) {
          wamid = `baileys-${Date.now()}`;
          status = 'SENT';
        }
      } catch (bErr: any) {
        console.error('[WhatsAppClient] Baileys dispatch error:', bErr.message);
      }
    } else if (config.whatsapp.enabled && config.whatsapp.accessToken) {
      try {
        const url = `${this.baseUrl}/${config.whatsapp.phoneNumberId}/messages`;
        const payload = {
          messaging_product: 'whatsapp',
          to: normalizedPhone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: parameters.map((param) => ({
                  type: 'text',
                  text: param,
                })),
              },
            ],
          },
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.whatsapp.accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data: any = await response.json();
        if (!response.ok) {
          status = 'FAILED';
          errorMessage = data?.error?.message;
        } else {
          wamid = data?.messages?.[0]?.id;
        }
      } catch (err: any) {
        status = 'FAILED';
        errorMessage = err.message;
      }
    } else {
      wamid = `wamid.HBgM${Date.now()}==`;
    }

    // Persist to database
    try {
      await query(
        `INSERT INTO whatsapp_messages 
          (message_id, wamid, phone_number, direction, message_type, body, status, error_message)
         VALUES (?, ?, ?, 'OUTBOUND', 'template', ?, ?, ?)`,
        [
          messageId,
          wamid || null,
          normalizedPhone,
          `[Template: ${templateName}] Variables: ${parameters.join(' | ')}`,
          status,
          errorMessage,
        ]
      );
    } catch (dbErr: any) {
      console.warn('[WhatsAppClient] DB log error:', dbErr.message);
    }

    return { success: status === 'SENT', wamid };
  }
}
