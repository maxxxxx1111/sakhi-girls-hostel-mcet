import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import { query } from '../db';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { WhatsAppBotService } from '../services/whatsapp.bot';
import { WhatsAppClient } from '../services/whatsapp.client';
import { BaileysWhatsAppService } from '../services/whatsapp.baileys';
import { WhatsAppWebhookPayload } from '../types/whatsapp.types';

export class WhatsAppController {
  /**
   * GET /api/whatsapp/webhook
   * Verification challenge endpoint required by Meta WhatsApp Cloud API
   */
  static verifyWebhook(req: Request, res: Response): void {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
      console.log('[WhatsAppWebhook] Verification challenge succeeded from Meta');
      res.status(200).send(challenge);
      return;
    }

    console.warn('[WhatsAppWebhook] Verification failed: Invalid verify token');
    res.status(403).json({ error: 'Verification token mismatch' });
  }

  /**
   * POST /api/whatsapp/webhook
   * Incoming messages receiver from Meta WhatsApp Cloud API
   */
  static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Signature validation if X-Hub-Signature-256 is present
      const signature = req.headers['x-hub-signature-256'] as string;
      if (signature && config.whatsapp.appSecret) {
        const rawBody = (req as any).rawBody || JSON.stringify(req.body);
        const expectedSig = 'sha256=' + crypto.createHmac('sha256', config.whatsapp.appSecret).update(rawBody).digest('hex');
        if (signature !== expectedSig) {
          console.warn('[WhatsAppWebhook] Invalid HMAC signature detected');
          res.status(403).json({ error: 'Invalid webhook signature' });
          return;
        }
      }

      // Return 200 OK immediately to Meta to prevent timeout/retries
      res.status(200).json({ status: 'EVENT_RECEIVED' });

      const payload = req.body as WhatsAppWebhookPayload;
      if (!payload.entry || payload.entry.length === 0) return;

      for (const entry of payload.entry) {
        if (!entry.changes) continue;
        for (const change of entry.changes) {
          const value = change.value;
          if (!value || !value.messages) continue;

          for (const msg of value.messages) {
            let messageText = '';
            if (msg.type === 'text' && msg.text) {
              messageText = msg.text.body;
            } else if (msg.type === 'interactive' && msg.interactive) {
              messageText =
                msg.interactive.button_reply?.title ||
                msg.interactive.list_reply?.title ||
                '';
            }

            if (msg.from && messageText) {
              // Asynchronously pass to bot service
              WhatsAppBotService.handleIncomingMessage(msg.from, messageText, msg.id).catch((err) => {
                console.error('[WhatsAppController] Error processing message:', err);
              });
            }
          }
        }
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/whatsapp/simulate
   * Direct simulator for developer testing & Warden in-browser test sandbox
   */
  static async simulateMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const phone = req.body.phone || req.body.phoneNumber;
      const text = req.body.text || req.body.messageText;
      const messageId = req.body.messageId;
      if (!phone || !text) {
        throw ApiError.badRequest('Phone number and message text are required');
      }

      const result = await WhatsAppBotService.handleIncomingMessage(phone, text, messageId);
      const normalizedPhone = WhatsAppClient.normalizePhoneNumber(phone);
      const replies = await query<any[]>(
        'SELECT message_id, body, message_type, created_at FROM whatsapp_messages WHERE phone_number = ? AND direction = "OUTBOUND" ORDER BY created_at DESC LIMIT 2',
        [normalizedPhone]
      );

      ApiResponse.success(
        res,
        {
          handled: result.handled,
          replyText: result.replyText,
          replies: replies.reverse().map((r) => ({
            type: r.message_type,
            recipient: normalizedPhone,
            content: r.body,
            dispatchedAt: r.created_at,
          })),
        },
        'Simulated WhatsApp message processed'
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/whatsapp/config
   * Admin view of WhatsApp integration status & credentials
   */
  static async getConfig(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbConfigRows = await query<any[]>('SELECT * FROM whatsapp_config');
      const configMap: Record<string, string> = {};
      dbConfigRows.forEach((r) => {
        configMap[r.config_key] = r.is_secret ? '••••••••••••' : r.config_value;
      });

      const [msgCount] = await query<any[]>('SELECT COUNT(*) AS total FROM whatsapp_messages');
      const [convCount] = await query<any[]>('SELECT COUNT(*) AS total FROM whatsapp_conversations');

      const configData = {
        enabled: config.whatsapp.enabled,
        businessPhone: config.whatsapp.businessPhone,
        phoneNumberId: config.whatsapp.phoneNumberId,
        wabaId: config.whatsapp.businessAccountId,
        apiVersion: config.whatsapp.apiVersion,
        webhookUrl: `${config.appUrl}/api/whatsapp/webhook`,
        verifyToken: config.whatsapp.verifyToken,
        hasAccessToken: Boolean(config.whatsapp.accessToken),
        stats: {
          totalMessages: msgCount?.[0]?.total || 0,
          activeConversations: convCount?.[0]?.total || 0,
        },
      };

      ApiResponse.success(res, configData, 'WhatsApp configuration retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/whatsapp/config
   */
  static async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessPhone, enabled } = req.body;

      if (businessPhone !== undefined) {
        await query(
          'INSERT INTO whatsapp_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
          ['business_phone', businessPhone, businessPhone]
        );
      }
      if (enabled !== undefined) {
        await query(
          'INSERT INTO whatsapp_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
          ['enabled', String(enabled), String(enabled)]
        );
      }

      ApiResponse.success(res, { updated: true }, 'WhatsApp settings updated successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/whatsapp/messages
   */
  static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const messages = await query<any[]>(
        'SELECT * FROM whatsapp_messages ORDER BY created_at DESC LIMIT ?',
        [limit]
      );
      ApiResponse.success(res, messages, 'WhatsApp message audit history retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/whatsapp/templates
   */
  static async getTemplates(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const templates = await query<any[]>('SELECT * FROM whatsapp_templates ORDER BY created_at DESC');
      ApiResponse.success(res, templates, 'Approved WhatsApp templates retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/whatsapp/qr
   * Retrieves live QR code data URL and connection status for linked device
   */
  static async getQrStatus(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = BaileysWhatsAppService.getStatus();
      ApiResponse.success(res, status, 'WhatsApp QR pairing status retrieved');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/whatsapp/qr/start
   * Starts or triggers Baileys WhatsApp Web QR pairing session
   */
  static async startQrSession(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      BaileysWhatsAppService.initialize().catch((err) =>
        console.error('[WhatsApp QR] Background init error:', err)
      );
      await new Promise((r) => setTimeout(r, 800));
      const status = BaileysWhatsAppService.getStatus();
      ApiResponse.success(res, status, 'WhatsApp QR pairing session started');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/whatsapp/qr/disconnect
   * Disconnects linked WhatsApp device and clears credentials
   */
  static async disconnectQrSession(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await BaileysWhatsAppService.disconnect();
      const status = BaileysWhatsAppService.getStatus();
      ApiResponse.success(res, status, 'WhatsApp QR session disconnected');
    } catch (err) {
      next(err);
    }
  }
}
