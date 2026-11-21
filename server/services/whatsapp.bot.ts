import { query } from '../db';
import { SecurityUtil } from '../utils/security.util';
import { WhatsAppClient } from './whatsapp.client';
import { ConversationStep, GatePassDraftSession, WhatsAppConversationRecord } from '../types/whatsapp.types';
import { config } from '../config';

export class WhatsAppBotService {
  /**
   * Main entrypoint for processing any incoming WhatsApp message
   */
  static async handleIncomingMessage(
    rawFrom: string,
    text: string,
    wamid?: string
  ): Promise<{ handled: boolean; replyText?: string }> {
    const phone = WhatsAppClient.normalizePhoneNumber(rawFrom);
    const trimmedText = (text || '').trim();

    // 1. Deduplication check using Meta's wamid
    if (wamid) {
      const existing = await query<any[]>(
        'SELECT message_id FROM whatsapp_messages WHERE wamid = ? LIMIT 1',
        [wamid]
      );
      if (existing && existing.length > 0) {
        console.log(`[WhatsAppBot] Duplicate message ignored: ${wamid}`);
        return { handled: true };
      }
    }

    // 2. Log inbound message to database
    const messageId = `msg-in-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    try {
      await query(
        `INSERT INTO whatsapp_messages 
          (message_id, wamid, phone_number, direction, message_type, body, status) 
         VALUES (?, ?, ?, 'INBOUND', 'text', ?, 'RECEIVED')`,
        [messageId, wamid || null, phone, trimmedText]
      );
    } catch (err: any) {
      console.warn('[WhatsAppBot] Error recording inbound message:', err.message);
    }

    // 3. Retrieve or initialize student conversation state
    let conv = await this.getConversation(phone);

    // If new phone number, perform student lookup
    if (!conv) {
      const student = await this.findStudentByPhone(phone);
      if (student) {
        const otp = SecurityUtil.generateNumericOtp(6);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await query(
          `INSERT INTO whatsapp_conversations 
            (phone_number, student_id, current_step, is_verified, otp_code, otp_expires_at) 
           VALUES (?, ?, 'AWAITING_OTP', FALSE, ?, ?)`,
          [phone, student.student_id, otp, expiresAt]
        );

        const greeting =
          `🌸 *Welcome to Sakhi Girls Hostel — MCET Shegaon*\n\n` +
          `Hello, *${student.name}* (Room ${student.room_number || 'S-101'})!\n\n` +
          `To protect your resident account and verify your WhatsApp identity, please reply with your 6-digit verification code:\n\n` +
          `🔐 *OTP: ${otp}*\n\n` +
          `_(Valid for 15 minutes. Send this code to unlock the Gate Pass system)_`;

        await WhatsAppClient.sendTextMessage(phone, greeting);
        return { handled: true, replyText: greeting };
      } else {
        // Unrecognized phone number: ask for PRN
        await query(
          `INSERT INTO whatsapp_conversations 
            (phone_number, current_step, is_verified) 
           VALUES (?, 'AWAITING_PRN', FALSE)`,
          [phone]
        );

        const unrecognizedMsg =
          `🌸 *Sakhi Girls Hostel — MCET Shegaon*\n\n` +
          `Your mobile number (*+${phone}*) is not yet linked to a resident scholar profile.\n\n` +
          `If you are an enrolled female scholar, please reply with your *Student PRN* (e.g., *MCET2026CS012*) to link your account.\n\n` +
          `For assistance, contact Warden Dr. Sunita Gaikwad: +91 94228 77412.`;

        await WhatsAppClient.sendTextMessage(phone, unrecognizedMsg);
        return { handled: true, replyText: unrecognizedMsg };
      }
    }

    // 4. Handle PRN linking if awaiting PRN
    if (conv.current_step === ('AWAITING_PRN' as any)) {
      const prn = trimmedText.toUpperCase().replace(/\s+/g, '');
      const student = await this.findStudentByPrn(prn);

      if (student) {
        const otp = SecurityUtil.generateNumericOtp(6);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await query(
          `UPDATE whatsapp_conversations 
           SET student_id = ?, current_step = 'AWAITING_OTP', otp_code = ?, otp_expires_at = ?
           WHERE phone_number = ?`,
          [student.student_id, otp, expiresAt, phone]
        );

        const verifyMsg =
          `✅ Found resident: *${student.name}* (${student.prn})\n\n` +
          `To confirm linking this WhatsApp number to your student record, enter your verification code:\n\n` +
          `🔐 *OTP: ${otp}*`;

        await WhatsAppClient.sendTextMessage(phone, verifyMsg);
        return { handled: true, replyText: verifyMsg };
      } else {
        const notFoundMsg = `❌ Student PRN *${prn}* was not found. Please verify your enrollment card or contact the Warden office.`;
        await WhatsAppClient.sendTextMessage(phone, notFoundMsg);
        return { handled: true, replyText: notFoundMsg };
      }
    }

    // 5. Handle OTP Verification
    if (conv.current_step === 'AWAITING_OTP') {
      const otpInput = trimmedText.replace(/\s+/g, '');
      if (conv.otp_code && conv.otp_code === otpInput) {
        await query(
          `UPDATE whatsapp_conversations 
           SET is_verified = TRUE, current_step = 'IDLE', otp_code = NULL 
           WHERE phone_number = ?`,
          [phone]
        );

        const student = await this.getStudent(conv.student_id!);
        const successMsg =
          `🎉 *Identity Verified Successfully!*\n\n` +
          `Welcome to the digital portal, *${student?.name || 'Scholar'}*.\n` +
          `You can now apply for gate passes, check approval status, and receive real-time outpass tokens right here on WhatsApp!`;

        await WhatsAppClient.sendTextMessage(phone, successMsg);
        await this.sendMainMenu(phone, student);
        return { handled: true, replyText: successMsg };
      } else {
        const invalidOtpMsg = `❌ Invalid verification code. Please reply with the correct 6-digit OTP code sent above.`;
        await WhatsAppClient.sendTextMessage(phone, invalidOtpMsg);
        return { handled: true, replyText: invalidOtpMsg };
      }
    }

    // 6. Fast commands & menu triggers
    const upperText = trimmedText.toUpperCase();
    if (
      upperText === 'MENU' ||
      upperText === 'HI' ||
      upperText === 'HELLO' ||
      upperText === 'START' ||
      upperText === 'RESET'
    ) {
      await this.resetConversation(phone);
      const student = await this.getStudent(conv.student_id!);
      await this.sendMainMenu(phone, student);
      return { handled: true };
    }

    // 7. Conversational Step Processor
    return this.processConversationStep(phone, conv, trimmedText);
  }

  /**
   * Processes conversational steps for Gate Pass application & status checks
   */
  private static async processConversationStep(
    phone: string,
    conv: WhatsAppConversationRecord,
    userInput: string
  ): Promise<{ handled: boolean; replyText?: string }> {
    const student = await this.getStudent(conv.student_id!);
    const sessionData: GatePassDraftSession = conv.session_data || {};

    switch (conv.current_step) {
      case 'IDLE': {
        const choice = userInput.trim();
        if (choice === '1' || choice.toUpperCase().includes('APPLY')) {
          // Start Application Flow: Step 1
          await this.updateStep(phone, 'APPLY_CHOOSE_TYPE', sessionData);
          const prompt =
            `📝 *STEP 1: Choose Outing Category*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Please reply with a number (1-4):\n\n` +
            `1️⃣ Day Outing (Local Shegaon)\n` +
            `2️⃣ Weekend Home Visit\n` +
            `3️⃣ Academic / College Event\n` +
            `4️⃣ Emergency / Medical Consultation\n\n` +
            `_Reply 'CANCEL' at any time to abort._`;

          await WhatsAppClient.sendTextMessage(phone, prompt);
          return { handled: true, replyText: prompt };
        } else if (choice === '2' || choice.toUpperCase().includes('STATUS')) {
          // Check Gate Pass Status
          return this.handleCheckStatus(phone, student);
        } else if (choice === '3' || choice.toUpperCase().includes('PASS')) {
          // View Approved Digital Pass
          return this.handleViewApprovedPass(phone, student);
        } else if (choice === '4' || choice.toUpperCase().includes('CANCEL')) {
          // Cancel Active Request
          return this.handleCancelPass(phone, student);
        } else if (choice === '5' || choice.toUpperCase().includes('WARDEN') || choice.toUpperCase().includes('CONTACT')) {
          // Contact Warden
          const wardenMsg =
            `📞 *HOSTEL WARDEN & EMERGENCY CONTACTS*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `👩‍🏫 *Chief Warden:* Dr. Sunita M. Gaikwad\n` +
            `📱 *Phone:* +91 94228 77412\n` +
            `🏢 *Office:* Ground Floor Warden Cabin 102\n` +
            `🕒 *Visiting Hours:* 4:30 PM – 7:30 PM\n\n` +
            `🚨 *Campus Ambulance:* +91 98230 44102\n` +
            `🛡️ *Main Gate Sentry Post:* +91 98224 88310\n\n` +
            `_Reply MENU to return to main options._`;
          await WhatsAppClient.sendTextMessage(phone, wardenMsg);
          return { handled: true, replyText: wardenMsg };
        } else if (choice === '6' || choice.toUpperCase().includes('HELP') || choice.toUpperCase().includes('RULES')) {
          // Curfew & Rules
          const rulesMsg =
            `📖 *SAKHI GIRLS HOSTEL RESIDENTIAL RULES*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `1. *Daily Curfew:* 8:30 PM sharp. Sentry gates are locked electronically.\n` +
            `2. *Parent Verification:* Overnight & weekend leaves require warden phone verification with your registered guardian.\n` +
            `3. *Biometric / QR Scan:* Present your digital QR pass at Main Gate 1 for departure and return.\n` +
            `4. *Mess Rebate:* Leave $\ge 3$ consecutive days automatically qualifies for dining fee rebate (₹85/day).\n\n` +
            `_Reply MENU to return to the main menu._`;
          await WhatsAppClient.sendTextMessage(phone, rulesMsg);
          return { handled: true, replyText: rulesMsg };
        } else {
          // Invalid choice in IDLE: re-send menu
          await this.sendMainMenu(phone, student);
          return { handled: true };
        }
      }

      case 'APPLY_CHOOSE_TYPE': {
        if (userInput.toUpperCase() === 'CANCEL') {
          await this.resetConversation(phone);
          await WhatsAppClient.sendTextMessage(phone, '❌ Application cancelled. Reply MENU for options.');
          return { handled: true };
        }

        const typeMap: Record<string, string> = {
          '1': 'Day Outing',
          '2': 'Weekend Home',
          '3': 'Academic / Conference',
          '4': 'Emergency / Medical',
        };

        const outingType = typeMap[userInput.trim()] || userInput.trim();
        sessionData.outingType = outingType;

        await this.updateStep(phone, 'APPLY_DESTINATION', sessionData);
        const prompt =
          `📍 *STEP 2: Destination*\n\n` +
          `Outing Type: *${outingType}*\n\n` +
          `Where are you travelling to?\n` +
          `_(e.g., Anand Sagar Shegaon, Railway Station, Home - Akola)_`;

        await WhatsAppClient.sendTextMessage(phone, prompt);
        return { handled: true, replyText: prompt };
      }

      case 'APPLY_DESTINATION': {
        if (userInput.toUpperCase() === 'CANCEL') {
          await this.resetConversation(phone);
          await WhatsAppClient.sendTextMessage(phone, '❌ Application cancelled. Reply MENU for options.');
          return { handled: true };
        }

        sessionData.destination = userInput.trim();
        await this.updateStep(phone, 'APPLY_DEPARTURE_TIME', sessionData);

        const prompt =
          `🕒 *STEP 3: Departure Date & Time*\n\n` +
          `Destination: *${sessionData.destination}*\n\n` +
          `When do you plan to leave the hostel?\n` +
          `_(e.g., Today 4:30 PM, or Tomorrow 9:00 AM)_`;

        await WhatsAppClient.sendTextMessage(phone, prompt);
        return { handled: true, replyText: prompt };
      }

      case 'APPLY_DEPARTURE_TIME': {
        if (userInput.toUpperCase() === 'CANCEL') {
          await this.resetConversation(phone);
          await WhatsAppClient.sendTextMessage(phone, '❌ Application cancelled. Reply MENU for options.');
          return { handled: true };
        }

        sessionData.departureTime = userInput.trim();
        await this.updateStep(phone, 'APPLY_RETURN_TIME', sessionData);

        const prompt =
          `⏰ *STEP 4: Expected Return Date & Time*\n\n` +
          `Departure: *${sessionData.departureTime}*\n\n` +
          `When will you return to Sakhi Girls Hostel?\n` +
          `_(Note: Hostel curfew is 8:30 PM daily)_`;

        await WhatsAppClient.sendTextMessage(phone, prompt);
        return { handled: true, replyText: prompt };
      }

      case 'APPLY_RETURN_TIME': {
        if (userInput.toUpperCase() === 'CANCEL') {
          await this.resetConversation(phone);
          await WhatsAppClient.sendTextMessage(phone, '❌ Application cancelled. Reply MENU for options.');
          return { handled: true };
        }

        sessionData.returnTime = userInput.trim();
        await this.updateStep(phone, 'APPLY_REASON', sessionData);

        const prompt =
          `📝 *STEP 5: Purpose / Reason for Outing*\n\n` +
          `Please provide a brief reason for Warden Dr. Sunita Gaikwad's review:\n` +
          `_(e.g., Library book purchase, family visit, medical clinic checkup)_`;

        await WhatsAppClient.sendTextMessage(phone, prompt);
        return { handled: true, replyText: prompt };
      }

      case 'APPLY_REASON': {
        if (userInput.toUpperCase() === 'CANCEL') {
          await this.resetConversation(phone);
          await WhatsAppClient.sendTextMessage(phone, '❌ Application cancelled. Reply MENU for options.');
          return { handled: true };
        }

        sessionData.reason = userInput.trim();
        sessionData.emergencyContact = student?.parent_phone || '+91 94228 11223';

        await this.updateStep(phone, 'APPLY_CONFIRM', sessionData);

        // Show complete application summary
        const summary =
          `📋 *GATE PASS APPLICATION SUMMARY*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `👤 *Scholar:* ${student?.name} (${student?.prn})\n` +
          `🏠 *Hostel:* Sakhi Girls Hostel, Room ${student?.room_number || 'S-101'}\n` +
          `📍 *Type:* ${sessionData.outingType}\n` +
          `🎯 *Destination:* ${sessionData.destination}\n` +
          `🕒 *Departure:* ${sessionData.departureTime}\n` +
          `⏰ *Expected Return:* ${sessionData.returnTime}\n` +
          `📝 *Reason:* ${sessionData.reason}\n` +
          `📞 *Parent Contact:* ${student?.parent_name} (${sessionData.emergencyContact})\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `Please confirm submission to the Warden office:\n` +
          `👉 Reply *YES* to Submit\n` +
          `👉 Reply *NO* to Cancel`;

        await WhatsAppClient.sendTextMessage(phone, summary);
        return { handled: true, replyText: summary };
      }

      case 'APPLY_CONFIRM': {
        const answer = userInput.trim().toUpperCase();

        if (answer === 'YES' || answer === 'Y' || answer === '1' || answer === 'CONFIRM') {
          // Submit application to MySQL database
          const leaveId = `lv-wa-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          const passCode = `GP-WA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const todayDate = new Date().toISOString().split('T')[0];

          await query(
            `INSERT INTO leave_requests (
              leave_id, student_id, student_name, room_number, hostel_name, 
              leave_type, from_date, to_date, reason, destination, parent_contact, 
              status, gate_pass_code, applied_date, source, whatsapp_phone, 
              departure_time, expected_return_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, 'WhatsApp', ?, ?, ?)`,
            [
              leaveId,
              student?.student_id || 'std-fe-1',
              student?.name || 'Female Scholar',
              student?.room_number || 'S-101',
              student?.hostel_name || 'Sakhi Girls Hostel',
              sessionData.outingType || 'Day Outing',
              todayDate,
              todayDate,
              sessionData.reason || 'General Outing',
              sessionData.destination || 'Shegaon',
              sessionData.emergencyContact || student?.parent_phone || '+91 94228 11223',
              passCode,
              todayDate,
              phone,
              sessionData.departureTime || '4:00 PM',
              sessionData.returnTime || '8:00 PM',
            ]
          );

          await this.resetConversation(phone);

          const successMsg =
            `🎉 *GATE PASS SUBMITTED TO WARDEN!*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🎫 *Pass ID:* ${passCode}\n` +
            `🕒 *Status:* 🟡 *Pending Warden Review*\n\n` +
            `Your request has been forwarded to *Dr. Sunita Gaikwad (Chief Warden)* for review.\n\n` +
            `📲 You will receive an instant WhatsApp notification once reviewed!\n` +
            `_Reply STATUS to check anytime._`;

          await WhatsAppClient.sendTextMessage(phone, successMsg);
          return { handled: true, replyText: successMsg };
        } else {
          await this.resetConversation(phone);
          const cancelMsg = `❌ Gate Pass application cancelled. Reply MENU whenever you wish to start again.`;
          await WhatsAppClient.sendTextMessage(phone, cancelMsg);
          return { handled: true, replyText: cancelMsg };
        }
      }

      default:
        await this.resetConversation(phone);
        await this.sendMainMenu(phone, student);
        return { handled: true };
    }
  }

  /**
   * Checks student's latest gate pass status
   */
  private static async handleCheckStatus(phone: string, student: any): Promise<{ handled: boolean; replyText?: string }> {
    const leaves = await query<any[]>(
      `SELECT * FROM leave_requests 
       WHERE student_id = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [student?.student_id]
    );

    if (!leaves || leaves.length === 0) {
      const msg = `ℹ️ You have no active or previous gate pass applications on file. Reply *1* to apply now!`;
      await WhatsAppClient.sendTextMessage(phone, msg);
      return { handled: true, replyText: msg };
    }

    const leave = leaves[0];
    const statusEmoji =
      leave.status === 'Approved'
        ? '🟢'
        : leave.status === 'Rejected'
        ? '🔴'
        : leave.status === 'Cancelled'
        ? '⚪'
        : '🟡';

    const statusMsg =
      `📋 *LATEST GATE PASS STATUS*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎫 *Pass ID:* ${leave.gate_pass_code}\n` +
      `📊 *Status:* ${statusEmoji} *${leave.status.toUpperCase()}*\n` +
      `📍 *Destination:* ${leave.destination}\n` +
      `🕒 *Departure:* ${leave.departure_time || leave.from_date}\n` +
      `⏰ *Return:* ${leave.expected_return_time || leave.to_date}\n` +
      `📝 *Source:* ${leave.source || 'Web Portal'}\n` +
      (leave.warden_remarks ? `💬 *Remarks:* ${leave.warden_remarks}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      (leave.status === 'Approved'
        ? `\n🔗 *Digital Pass Link:* ${config.appUrl}/api/leaves/verify/${leave.gate_pass_code}\nPresent this code at Gate 1 sentry post.`
        : `\n_Reply MENU to return to options._`);

    await WhatsAppClient.sendTextMessage(phone, statusMsg);
    return { handled: true, replyText: statusMsg };
  }

  /**
   * Shows approved gate pass and verification link
   */
  private static async handleViewApprovedPass(phone: string, student: any): Promise<{ handled: boolean; replyText?: string }> {
    const approved = await query<any[]>(
      `SELECT * FROM leave_requests 
       WHERE student_id = ? AND status = 'Approved' 
       ORDER BY created_at DESC LIMIT 1`,
      [student?.student_id]
    );

    if (!approved || approved.length === 0) {
      const msg = `ℹ️ You have no currently approved gate passes. Reply *2* to check status or *1* to apply.`;
      await WhatsAppClient.sendTextMessage(phone, msg);
      return { handled: true, replyText: msg };
    }

    const pass = approved[0];
    const passMsg =
      `🎫 *OFFICIAL DIGITAL GATE PASS*\n` +
      `*Mauli College of Engineering & Technology, Shegaon*\n` +
      `*Sakhi Girls Hostel — Residential Wing*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Scholar:* ${pass.student_name}\n` +
      `🏠 *Room:* ${pass.room_number}\n` +
      `🎯 *Destination:* ${pass.destination}\n` +
      `🕒 *Departure:* ${pass.departure_time || pass.from_date}\n` +
      `⏰ *Curfew Return:* ${pass.expected_return_time || '8:30 PM'}\n` +
      `🔑 *Token ID:* ${pass.gate_pass_code}\n` +
      `👩‍🏫 *Approved By:* ${pass.reviewed_by || 'Dr. Sunita Gaikwad (Chief Warden)'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🔗 *Sentry Security Verification Link:*\n` +
      `${config.appUrl}/api/leaves/verify/${pass.gate_pass_code}\n\n` +
      `Show this message & link to the Sentry Guard at Campus Main Gate 1.`;

    await WhatsAppClient.sendTextMessage(phone, passMsg);
    return { handled: true, replyText: passMsg };
  }

  /**
   * Cancels a pending gate pass application
   */
  private static async handleCancelPass(phone: string, student: any): Promise<{ handled: boolean; replyText?: string }> {
    const pending = await query<any[]>(
      `SELECT leave_id, gate_pass_code FROM leave_requests 
       WHERE student_id = ? AND status = 'Pending' 
       ORDER BY created_at DESC LIMIT 1`,
      [student?.student_id]
    );

    if (!pending || pending.length === 0) {
      const msg = `ℹ️ You have no pending gate pass applications to cancel.`;
      await WhatsAppClient.sendTextMessage(phone, msg);
      return { handled: true, replyText: msg };
    }

    const target = pending[0];
    await query(
      `UPDATE leave_requests SET status = 'Cancelled', warden_remarks = 'Cancelled by student via WhatsApp' WHERE leave_id = ?`,
      [target.leave_id]
    );

    const cancelledMsg = `✅ Gate pass *${target.gate_pass_code}* has been successfully cancelled.`;
    await WhatsAppClient.sendTextMessage(phone, cancelledMsg);
    return { handled: true, replyText: cancelledMsg };
  }

  /**
   * Helper: Sends formatted Main Menu
   */
  static async sendMainMenu(phone: string, student: any): Promise<void> {
    const menu =
      `🌸 *Sakhi Girls Hostel — MCET Shegaon* 🌸\n` +
      `Collegiate Living & Operations Management\n\n` +
      `Hello, *${student?.name || 'Scholar'}* (Room ${student?.room_number || 'S-101'})\n\n` +
      `Please choose an option by sending a number (1-6):\n\n` +
      `1️⃣ *Apply for Gate Pass*\n` +
      `2️⃣ *Check Gate Pass Status*\n` +
      `3️⃣ *View Approved Digital Pass*\n` +
      `4️⃣ *Cancel Pending Pass*\n` +
      `5️⃣ *Contact Warden & Emergency*\n` +
      `6️⃣ *Help & Curfew Rules*\n\n` +
      `_Type 'MENU' anytime to see these options._`;

    await WhatsAppClient.sendTextMessage(phone, menu);
  }

  // --- Helpers for Database Persistence ---

  private static async getConversation(phone: string): Promise<WhatsAppConversationRecord | null> {
    const rows = await query<any[]>(
      'SELECT * FROM whatsapp_conversations WHERE phone_number = ? LIMIT 1',
      [phone]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      ...r,
      is_verified: Boolean(r.is_verified),
      session_data: typeof r.session_data === 'string' ? JSON.parse(r.session_data) : r.session_data,
    };
  }

  private static async updateStep(
    phone: string,
    step: ConversationStep,
    sessionData?: GatePassDraftSession
  ): Promise<void> {
    await query(
      `UPDATE whatsapp_conversations 
       SET current_step = ?, session_data = ?, last_interaction = NOW() 
       WHERE phone_number = ?`,
      [step, sessionData ? JSON.stringify(sessionData) : null, phone]
    );
  }

  private static async resetConversation(phone: string): Promise<void> {
    await query(
      `UPDATE whatsapp_conversations 
       SET current_step = 'IDLE', session_data = NULL, last_interaction = NOW() 
       WHERE phone_number = ?`,
      [phone]
    );
  }

  private static async findStudentByPhone(phone: string): Promise<any> {
    // Extract last 10 digits
    const last10 = phone.slice(-10);
    const rows = await query<any[]>(
      `SELECT * FROM students 
       WHERE REPLACE(REPLACE(REPLACE(mobile, ' ', ''), '-', ''), '+', '') LIKE ? 
       LIMIT 1`,
      [`%${last10}`]
    );
    return rows && rows.length > 0 ? rows[0] : null;
  }

  private static async findStudentByPrn(prn: string): Promise<any> {
    const rows = await query<any[]>(
      'SELECT * FROM students WHERE prn = ? OR student_id = ? LIMIT 1',
      [prn, prn]
    );
    return rows && rows.length > 0 ? rows[0] : null;
  }

  private static async getStudent(studentId: string): Promise<any> {
    const rows = await query<any[]>('SELECT * FROM students WHERE student_id = ? LIMIT 1', [studentId]);
    return rows && rows.length > 0 ? rows[0] : null;
  }
}
