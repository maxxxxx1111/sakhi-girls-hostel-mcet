-- =============================================================================
-- MAULI COLLEGE OF ENGINEERING & TECHNOLOGY (MCET), SHEGAON
-- SAKHI GIRLS HOSTEL - WHATSAPP BUSINESS CLOUD API INTEGRATION SUBSYSTEM
-- Database: mcet_hostel_db
-- =============================================================================

USE mcet_hostel_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 2. WHATSAPP CONVERSATIONS TABLE (Session State Machine)
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  phone_number VARCHAR(20) PRIMARY KEY,
  student_id VARCHAR(32) NULL,
  current_step VARCHAR(64) NOT NULL DEFAULT 'IDLE',
  session_data JSON NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  otp_code VARCHAR(8) NULL,
  otp_expires_at TIMESTAMP NULL,
  last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. WHATSAPP MESSAGES TABLE (Audit & Delivery Tracking)
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  message_id VARCHAR(64) PRIMARY KEY,
  wamid VARCHAR(128) NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  direction ENUM('INBOUND', 'OUTBOUND') NOT NULL,
  message_type VARCHAR(32) NOT NULL DEFAULT 'text',
  body TEXT NOT NULL,
  status ENUM('RECEIVED', 'SENT', 'DELIVERED', 'READ', 'FAILED') DEFAULT 'RECEIVED',
  error_message TEXT NULL,
  raw_payload JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. WHATSAPP TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  template_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  category VARCHAR(32) NOT NULL DEFAULT 'UTILITY',
  language VARCHAR(16) NOT NULL DEFAULT 'en',
  body_text TEXT NOT NULL,
  status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'APPROVED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. WHATSAPP CONFIG TABLE (Key-Value Configuration)
CREATE TABLE IF NOT EXISTS whatsapp_config (
  config_key VARCHAR(64) PRIMARY KEY,
  config_value TEXT NOT NULL,
  description VARCHAR(255) NULL,
  is_secret BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SEED DATA: APPROVED MESSAGE TEMPLATES
-- =============================================================================

INSERT INTO whatsapp_templates (template_id, name, category, language, body_text) VALUES
('tmpl-gatepass-submitted', 'gatepass_submitted_v1', 'UTILITY', 'en', '🌸 *Sakhi Girls Hostel, MCET Shegaon*\n\nHello {{1}},\nYour Gate Pass request *{{2}}* has been received and forwarded to Warden Dr. Sunita Gaikwad.\nDestination: {{3}}\nExpected Return: {{4}}\n\nYou will receive a confirmation once reviewed.'),
('tmpl-gatepass-approved', 'gatepass_approved_v1', 'UTILITY', 'en', '✅ *GATE PASS APPROVED*\n\nDear {{1}},\nYour gate pass *{{2}}* for {{3}} has been APPROVED by Warden Dr. Sunita Gaikwad.\n\n📅 Valid From: {{4}}\n⏰ Return By: {{5}}\n🔗 Digital QR Pass: {{6}}\n\nPlease present the QR code at Main Campus Gate 1 when departing and returning.'),
('tmpl-gatepass-rejected', 'gatepass_rejected_v1', 'UTILITY', 'en', '❌ *GATE PASS DECISION: REJECTED*\n\nDear {{1}},\nYour gate pass request *{{2}}* was not approved.\nReason: {{3}}\n\nPlease visit the Warden Office (Cabin 102) if you need assistance.'),
('tmpl-gatepass-reminder', 'gatepass_curfew_reminder_v1', 'UTILITY', 'en', '⚠️ *CURFEW REMINDER — SAKHI GIRLS HOSTEL*\n\nHello {{1}},\nYour approved gate pass *{{2}}* requires you to return by *{{3}}*.\nHostel gates close strictly at 8:30 PM. Please check in with the sentry guard at Main Gate 1.')
ON DUPLICATE KEY UPDATE body_text=VALUES(body_text);

-- =============================================================================
-- SEED DATA: SYSTEM CONFIGURATION
-- =============================================================================

INSERT INTO whatsapp_config (config_key, config_value, description, is_secret) VALUES
('enabled', 'true', 'Master toggle for WhatsApp integration', FALSE),
('business_phone', '+91 7265 252443', 'Registered WhatsApp Business Display Number', FALSE),
('phone_number_id', '512489108612345', 'Meta WhatsApp Cloud API Phone Number ID', FALSE),
('waba_id', '109283746591823', 'Meta WhatsApp Business Account ID', FALSE),
('verify_token', 'sakhi_mcet_whatsapp_verify_token_2026', 'Webhook Verification Token configured in Meta App Dashboard', TRUE),
('api_version', 'v21.0', 'Meta Graph API Version', FALSE),
('auto_notify_warden', 'true', 'Notify Warden on WhatsApp submission', FALSE),
('auto_notify_student', 'true', 'Notify Student on Warden decision', FALSE)
ON DUPLICATE KEY UPDATE config_value=VALUES(config_value);
