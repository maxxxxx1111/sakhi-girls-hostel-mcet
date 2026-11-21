import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { WhatsAppBotService } from './whatsapp.bot';

export interface BaileysStatus {
  isConnected: boolean;
  status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED';
  connectedPhone: string | null;
  qrCodeDataUrl: string | null;
  lastUpdated: string;
}

export class BaileysWhatsAppService {
  private static sock: WASocket | null = null;
  private static isConnected = false;
  private static status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED' = 'DISCONNECTED';
  private static connectedPhone: string | null = null;
  private static qrCodeDataUrl: string | null = null;
  private static rawQr: string | null = null;
  private static authDir = path.resolve(process.cwd(), 'data', 'baileys_auth');
  private static isInitializing = false;

  /**
   * Initialize Baileys WhatsApp Web QR Bridge
   */
  static async initialize(): Promise<void> {
    if (this.isInitializing || this.isConnected) return;
    this.isInitializing = true;
    this.status = 'CONNECTING';

    try {
      // Ensure auth directory exists
      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true, // Shows in console if terminal is visible
        browser: ['Sakhi Hostel ERP', 'Chrome', '1.0.0'],
        syncFullHistory: false,
      });

      this.sock = sock;

      // Handle credentials save
      sock.ev.on('creds.update', saveCreds);

      // Handle connection updates & QR emission
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.rawQr = qr;
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr, {
              width: 300,
              margin: 2,
              color: {
                dark: '#0F172A',
                light: '#FFFFFF',
              },
            });
            this.status = 'SCAN_QR';
            console.log('[WhatsApp QR] 📱 QR Code generated! Scan via WhatsApp -> Linked Devices on your phone.');
          } catch (qrErr) {
            console.error('[WhatsApp QR] Failed to convert QR to DataURL:', qrErr);
          }
        }

        if (connection === 'close') {
          this.isConnected = false;
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(
            `[WhatsApp QR] Connection closed (code: ${statusCode}). Reconnecting: ${shouldReconnect}`
          );

          if (statusCode === DisconnectReason.loggedOut) {
            this.status = 'DISCONNECTED';
            this.connectedPhone = null;
            this.qrCodeDataUrl = null;
            this.sock = null;
            // Clear credentials
            try {
              fs.rmSync(this.authDir, { recursive: true, force: true });
            } catch (rmErr) {
              // Ignore
            }
          } else if (shouldReconnect) {
            this.status = 'CONNECTING';
            setTimeout(() => {
              this.isInitializing = false;
              this.initialize().catch(console.error);
            }, 3000);
          }
        } else if (connection === 'open') {
          this.isConnected = true;
          this.status = 'CONNECTED';
          this.qrCodeDataUrl = null;
          this.rawQr = null;

          const rawId = sock.user?.id || '';
          this.connectedPhone = rawId.split(':')[0].replace(/[^0-9]/g, '') || null;
          console.log(`[WhatsApp QR] ✅ WhatsApp paired successfully! Active phone: +${this.connectedPhone}`);
        }
      });

      // Handle incoming messages from real WhatsApp chats
      sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
          // Ignore messages sent by ourselves
          if (msg.key.fromMe) continue;

          // Only process private chats (not group chats or status updates)
          const remoteJid = msg.key.remoteJid || '';
          if (!remoteJid.endsWith('@s.whatsapp.net') || remoteJid.includes('broadcast')) {
            continue;
          }

          // Extract text from message variants
          const messageText =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.buttonsResponseMessage?.selectedButtonId ||
            msg.message?.templateButtonReplyMessage?.selectedId ||
            '';

          if (!messageText.trim()) continue;

          const fromPhone = remoteJid.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');
          const messageId = msg.key.id || `baileys-${Date.now()}`;

          console.log(`[WhatsApp QR Inbound] From +${fromPhone}: "${messageText}"`);

          // Pass directly to the unified WhatsApp Gate Pass Bot State Machine!
          try {
            await WhatsAppBotService.handleIncomingMessage(fromPhone, messageText, messageId);
          } catch (err: any) {
            console.error('[WhatsApp QR] Error processing incoming message:', err.message);
          }
        }
      });
    } catch (err: any) {
      console.error('[WhatsApp QR] Initialization error:', err);
      this.status = 'DISCONNECTED';
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Get current pairing and connection status
   */
  static getStatus(): BaileysStatus {
    return {
      isConnected: this.isConnected,
      status: this.status,
      connectedPhone: this.connectedPhone,
      qrCodeDataUrl: this.qrCodeDataUrl,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Send outgoing message through Baileys WhatsApp Web socket
   */
  static async sendMessage(toPhone: string, text: string): Promise<boolean> {
    if (!this.sock || !this.isConnected) {
      return false;
    }

    try {
      const cleanDigits = toPhone.replace(/[^0-9]/g, '');
      const remoteJid = `${cleanDigits}@s.whatsapp.net`;
      await this.sock.sendMessage(remoteJid, { text });
      return true;
    } catch (err: any) {
      console.error(`[WhatsApp QR] Failed to send message to ${toPhone}:`, err.message);
      return false;
    }
  }

  /**
   * Check if Baileys is active and connected
   */
  static isSocketConnected(): boolean {
    return this.isConnected && this.sock !== null;
  }

  /**
   * Disconnect and clear credentials to allow pairing another number
   */
  static async disconnect(): Promise<void> {
    try {
      if (this.sock) {
        await this.sock.logout();
        this.sock.end(undefined);
      }
    } catch {
      // Ignore
    } finally {
      this.sock = null;
      this.isConnected = false;
      this.status = 'DISCONNECTED';
      this.connectedPhone = null;
      this.qrCodeDataUrl = null;
      this.rawQr = null;

      try {
        if (fs.existsSync(this.authDir)) {
          fs.rmSync(this.authDir, { recursive: true, force: true });
        }
      } catch {
        // Ignore
      }
    }
  }
}
