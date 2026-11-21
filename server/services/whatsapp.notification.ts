import { query } from '../db';
import { WhatsAppClient } from './whatsapp.client';
import { config } from '../config';

export class WhatsAppNotificationService {
  /**
   * Notifies student via WhatsApp when their application is reviewed (Approved / Rejected)
   */
  static async notifyDecision(
    leaveId: string,
    decision: 'Approved' | 'Rejected',
    remarks?: string,
    reviewerName = 'Dr. Sunita M. Gaikwad (Chief Warden)'
  ): Promise<void> {
    try {
      const rows = await query<any[]>(
        `SELECT l.*, s.mobile AS student_mobile
         FROM leave_requests l
         LEFT JOIN students s ON l.student_id = s.student_id
         WHERE l.leave_id = ? LIMIT 1`,
        [leaveId]
      );

      if (!rows || rows.length === 0) return;
      const leave = rows[0];

      // Prefer whatsapp_phone from application, fallback to registered student mobile
      const phone = leave.whatsapp_phone || leave.student_mobile;
      if (!phone) return;

      if (decision === 'Approved') {
        const approvedMsg =
          `✅ *CONGRATULATIONS! YOUR GATE PASS HAS BEEN APPROVED*\n` +
          `*Sakhi Girls Hostel — MCET Shegaon*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `👤 *Scholar:* ${leave.student_name} (${leave.room_number})\n` +
          `🎫 *Pass ID:* *${leave.gate_pass_code}*\n` +
          `🎯 *Destination:* ${leave.destination}\n` +
          `🕒 *Departure:* ${leave.departure_time || leave.from_date}\n` +
          `⏰ *Curfew Return:* ${leave.expected_return_time || '8:30 PM'}\n` +
          `👩‍🏫 *Approved By:* ${reviewerName}\n` +
          (remarks ? `💬 *Warden Remarks:* ${remarks}\n` : '') +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `🔗 *Digital Gate Pass QR Link:*\n` +
          `${config.appUrl}/api/leaves/verify/${leave.gate_pass_code}\n\n` +
          `_Present this QR token to the Sentry Guard at Campus Main Gate 1 upon checkout and check-in._`;

        await WhatsAppClient.sendTextMessage(phone, approvedMsg);
      } else {
        const rejectedMsg =
          `❌ *GATE PASS APPLICATION REJECTED*\n` +
          `*Sakhi Girls Hostel — MCET Shegaon*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `👤 *Scholar:* ${leave.student_name}\n` +
          `🎫 *Pass ID:* ${leave.gate_pass_code}\n` +
          `📍 *Destination:* ${leave.destination}\n` +
          `💬 *Reason for Rejection:* ${remarks || 'Parental telephonic consent could not be verified'}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `_Please meet Warden Dr. Sunita Gaikwad at Cabin 102 if you have any questions._`;

        await WhatsAppClient.sendTextMessage(phone, rejectedMsg);
      }

      // Mark notified in database
      await query('UPDATE leave_requests SET whatsapp_notified = TRUE WHERE leave_id = ?', [leaveId]);
    } catch (err: any) {
      console.warn('[WhatsAppNotification] Failed to dispatch decision notification:', err.message);
    }
  }

  /**
   * Dispatches automated curfew reminder approaching 8:30 PM
   */
  static async notifyCurfewReminder(leaveId: string): Promise<void> {
    try {
      const rows = await query<any[]>(
        `SELECT l.*, s.mobile AS student_mobile
         FROM leave_requests l
         LEFT JOIN students s ON l.student_id = s.student_id
         WHERE l.leave_id = ? AND l.status = 'Approved' LIMIT 1`,
        [leaveId]
      );

      if (!rows || rows.length === 0) return;
      const leave = rows[0];
      const phone = leave.whatsapp_phone || leave.student_mobile;
      if (!phone) return;

      const reminderMsg =
        `⚠️ *CURFEW REMINDER — SAKHI GIRLS HOSTEL*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Hello ${leave.student_name},\n` +
        `Your approved gate pass *${leave.gate_pass_code}* requires return by *${leave.expected_return_time || '8:30 PM'}*.\n\n` +
        `Hostel security gates close strictly at 8:30 PM. Please check in with the sentry officer at Main Gate 1.`;

      await WhatsAppClient.sendTextMessage(phone, reminderMsg);
    } catch (err: any) {
      console.warn('[WhatsAppNotification] Curfew reminder error:', err.message);
    }
  }
}
