-- =============================================================================
-- MAULI COLLEGE OF ENGINEERING & TECHNOLOGY (MCET), SHEGAON
-- CAMPUS HOSTEL & RESIDENTIAL MANAGEMENT ENTERPRISE DATABASE
-- Database: mcet_hostel_db
-- MODULE: ENTERPRISE RBAC & AUTHENTICATION SUBSYSTEM (8 Security Tables)
-- =============================================================================

USE mcet_hostel_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ROLES TABLE (Authority Hierarchy)
CREATE TABLE IF NOT EXISTS roles (
  role_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  hierarchy_level INT NOT NULL DEFAULT 10,
  is_system BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. PERMISSIONS TABLE (Granular Operation Rights)
CREATE TABLE IF NOT EXISTS permissions (
  permission_id VARCHAR(64) PRIMARY KEY,
  module VARCHAR(32) NOT NULL,
  action VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. ROLE_PERMISSIONS TABLE (Many-to-Many Binding)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id VARCHAR(32) NOT NULL,
  permission_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. USERS TABLE (Core Identity & Credential Master)
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(32) PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(128) NOT NULL,
  phone VARCHAR(20),
  role_id VARCHAR(32) NOT NULL DEFAULT 'regular_user',
  account_status ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED') DEFAULT 'ACTIVE',
  is_email_verified BOOLEAN DEFAULT TRUE,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  last_login_ip VARCHAR(45) NULL,
  student_id VARCHAR(32) NULL,
  warden_id VARCHAR(32) NULL,
  department VARCHAR(64) NULL,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(64) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL,
  FOREIGN KEY (warden_id) REFERENCES wardens(warden_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. USER_SESSIONS TABLE (Token & Active Session Lifecycle)
CREATE TABLE IF NOT EXISTS user_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. PASSWORD_RESET_TOKENS TABLE
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  otp_code VARCHAR(8) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. EMAIL_VERIFICATION_TOKENS TABLE
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  token_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(32) NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. SECURITY_AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS security_audit_logs (
  log_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(32) NULL,
  event_type VARCHAR(64) NOT NULL,
  severity ENUM('INFO', 'WARNING', 'CRITICAL') DEFAULT 'INFO',
  ip_address VARCHAR(45),
  user_agent TEXT,
  endpoint VARCHAR(255),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SEED DATA: CONFIGURABLE ROLES (Authority Hierarchy)
-- =============================================================================

INSERT INTO roles (role_id, name, description, hierarchy_level, is_system) VALUES
('super_admin', 'Super Administrator', 'Complete system control across all campus hostels, users, and server configurations', 100, TRUE),
('administrator', 'Administrator', 'Hostel Rector & Chief Warden with full residential, room allotment, and financial permissions', 80, TRUE),
('authority_officer', 'Authority Officer', 'Campus Security Officers and Sentry Gate Supervisors for movement audit & passes', 60, TRUE),
('department_manager', 'Department Manager', 'Engineering Department Heads (HODs) with oversight of student residents in their branch', 50, TRUE),
('moderator', 'Moderator', 'Resident Floor Assistants & Student Mess Council Representatives for ticket triage', 40, TRUE),
('regular_user', 'Regular User', 'Enrolled female engineering scholar resident with access to personal living portal', 20, TRUE),
('guest', 'Guest', 'Prospective scholars and public visitors with read-only public hostel brochure access', 0, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), hierarchy_level=VALUES(hierarchy_level);

-- =============================================================================
-- SEED DATA: GRANULAR PERMISSIONS
-- =============================================================================

INSERT INTO permissions (permission_id, module, action, description) VALUES
-- Users & Roles
('users:read', 'users', 'read', 'View user accounts and profiles'),
('users:write', 'users', 'write', 'Create and modify user accounts'),
('users:delete', 'users', 'delete', 'Delete or deactivate user accounts'),
('users:roles', 'users', 'roles', 'Assign and reconfigure roles and hierarchy levels'),
('users:status', 'users', 'status', 'Activate, suspend, or unlock user accounts'),
-- Rooms & Living
('rooms:read', 'rooms', 'read', 'View room inventory and floor layouts'),
('rooms:allocate', 'rooms', 'allocate', 'Execute bed allocation transactions'),
('rooms:vacate', 'rooms', 'vacate', 'Execute bed vacating transactions'),
('rooms:manage', 'rooms', 'manage', 'Modify room capacity and maintenance states'),
-- Leaves & Gate
('leaves:apply', 'leaves', 'apply', 'Apply for day and outstation gate passes'),
('leaves:read_own', 'leaves', 'read_own', 'View own leave applications and QR passes'),
('leaves:read_all', 'leaves', 'read_all', 'View all residents leave requests'),
('leaves:verify_parent', 'leaves', 'verify_parent', 'Verify parent telephonic consent'),
('leaves:approve', 'leaves', 'approve', 'Approve or reject leave requests'),
('gate:scan', 'gate', 'scan', 'Scan student QR gate passes at sentry post'),
('gate:view_logs', 'gate', 'view_logs', 'Audit gate entry and exit movement logs'),
('gate:override', 'gate', 'override', 'Emergency curfew override authorization'),
-- Complaints & Maintenance
('complaints:create', 'complaints', 'create', 'Log maintenance and living issue tickets'),
('complaints:read_own', 'complaints', 'read_own', 'View own submitted complaints and status'),
('complaints:read_all', 'complaints', 'read_all', 'View all hostel maintenance tickets'),
('complaints:assign', 'complaints', 'assign', 'Assign tickets to maintenance technicians'),
('complaints:resolve', 'complaints', 'resolve', 'Mark complaints as resolved with remarks'),
-- Mess & Dining
('mess:view_menu', 'mess', 'view_menu', 'View 7-day nutritional mess dining menu'),
('mess:manage_menu', 'mess', 'manage_menu', 'Update and publish daily culinary menus'),
('mess:attendance', 'mess', 'attendance', 'Log daily meal attendance check-ins'),
('mess:manage_inventory', 'mess', 'manage_inventory', 'Manage pantry stock and supplier orders'),
('mess:manage_expenses', 'mess', 'manage_expenses', 'Manage mess grocery and utility expenses'),
('mess:feedback', 'mess', 'feedback', 'Submit food quality ratings and reviews'),
-- Fees & Finance
('fees:view_own', 'fees', 'view_own', 'View own fee receipts and pending dues'),
('fees:read_all', 'fees', 'read_all', 'View hostel fee ledgers and collection stats'),
('fees:manage', 'fees', 'manage', 'Record fee payments and issue fee clearances'),
('fees:generate_receipt', 'fees', 'generate_receipt', 'Generate and download official PDF receipts'),
-- Notices & Communications
('notices:view', 'notices', 'view', 'View official circulars and hostel notices'),
('notices:publish', 'notices', 'publish', 'Publish institutional circulars and alerts'),
('notices:delete', 'notices', 'delete', 'Archive or delete expired hostel notices'),
-- Audit & Security
('audit:view_logs', 'audit', 'view_logs', 'Inspect security audit logs and failed logins'),
('system:config', 'system', 'config', 'Manage system settings and RBAC policies')
ON DUPLICATE KEY UPDATE module=VALUES(module), action=VALUES(action), description=VALUES(description);

-- =============================================================================
-- ROLE_PERMISSIONS BINDINGS (Least-Privilege Configuration)
-- =============================================================================

-- Super Admin: All permissions
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'super_admin', permission_id FROM permissions;

-- Administrator (Warden/Rector)
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('administrator', 'users:read'),
('administrator', 'users:write'),
('administrator', 'users:status'),
('administrator', 'rooms:read'),
('administrator', 'rooms:allocate'),
('administrator', 'rooms:vacate'),
('administrator', 'rooms:manage'),
('administrator', 'leaves:read_all'),
('administrator', 'leaves:verify_parent'),
('administrator', 'leaves:approve'),
('administrator', 'gate:scan'),
('administrator', 'gate:view_logs'),
('administrator', 'complaints:read_all'),
('administrator', 'complaints:assign'),
('administrator', 'complaints:resolve'),
('administrator', 'mess:view_menu'),
('administrator', 'mess:manage_menu'),
('administrator', 'mess:attendance'),
('administrator', 'mess:manage_inventory'),
('administrator', 'mess:manage_expenses'),
('administrator', 'fees:read_all'),
('administrator', 'fees:manage'),
('administrator', 'fees:generate_receipt'),
('administrator', 'notices:view'),
('administrator', 'notices:publish'),
('administrator', 'notices:delete'),
('administrator', 'audit:view_logs');

-- Authority Officer (Campus Sentry & Security Head)
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('authority_officer', 'gate:scan'),
('authority_officer', 'gate:view_logs'),
('authority_officer', 'gate:override'),
('authority_officer', 'leaves:read_all'),
('authority_officer', 'users:read'),
('authority_officer', 'rooms:read'),
('authority_officer', 'notices:view'),
('authority_officer', 'audit:view_logs');

-- Department Manager (HOD / Faculty Coordinator)
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('department_manager', 'users:read'),
('department_manager', 'rooms:read'),
('department_manager', 'leaves:read_all'),
('department_manager', 'complaints:read_all'),
('department_manager', 'notices:view');

-- Moderator (Resident Floor Assistant / Mess Council)
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('moderator', 'rooms:read'),
('moderator', 'complaints:read_all'),
('moderator', 'complaints:resolve'),
('moderator', 'mess:view_menu'),
('moderator', 'mess:attendance'),
('moderator', 'notices:view');

-- Regular User (Student Resident Scholar)
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('regular_user', 'rooms:read'),
('regular_user', 'leaves:apply'),
('regular_user', 'leaves:read_own'),
('regular_user', 'complaints:create'),
('regular_user', 'complaints:read_own'),
('regular_user', 'mess:view_menu'),
('regular_user', 'mess:attendance'),
('regular_user', 'mess:feedback'),
('regular_user', 'fees:view_own'),
('regular_user', 'fees:generate_receipt'),
('regular_user', 'notices:view');

-- Guest (Public Visitor)
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
('guest', 'rooms:read'),
('guest', 'mess:view_menu'),
('guest', 'notices:view');

-- =============================================================================
-- SEED INITIAL SYSTEM USERS (All hashed with bcrypt password123)
-- Hash: $2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q
-- =============================================================================

INSERT INTO users (
  user_id, username, email, password_hash, full_name, phone, role_id, account_status, is_email_verified, student_id, warden_id, department
) VALUES
-- 1. Super Admin
('usr-superadmin', 'mcet_superadmin', 'superadmin@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Prof. H. M. Jethe', '+91 94221 55601', 'super_admin', 'ACTIVE', TRUE, NULL, NULL, 'Management'),

-- 2. Administrator (Warden)
('usr-warden-01', 'WARDEN-SAKHI-01', 'warden.sakhi@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Dr. Sunita M. Gaikwad', '+91 94228 77412', 'administrator', 'ACTIVE', TRUE, NULL, 'warden-sakhi-1', 'Hostel Administration'),

-- 3. Authority Officer (Security Head)
('usr-sentry-01', 'sentry_gate1', 'security.gate1@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Subedar B. R. Pawar', '+91 98224 88310', 'authority_officer', 'ACTIVE', TRUE, NULL, NULL, 'Campus Security'),

-- 4. Department Manager (HOD CSE)
('usr-dept-cse', 'cse_manager', 'cse.hod@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Dr. R. R. Karwa', '+91 94234 44109', 'department_manager', 'ACTIVE', TRUE, NULL, NULL, 'Computer Science & Engineering'),

-- 5. Moderator (Senior Resident / Mess Council)
('usr-mod-01', 'MCET2025CS044', 'sneha.joshi@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Sneha K. Joshi', '+91 98224 66102', 'moderator', 'ACTIVE', TRUE, 'std-se-2', NULL, 'Computer Science & Engineering'),

-- 6. Regular User: Pooja M. Shinde (FE CS Resident)
('usr-std-01', 'MCET2026CS012', 'pooja.shinde@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Pooja M. Shinde', '+91 98231 10001', 'regular_user', 'ACTIVE', TRUE, 'std-fe-1', NULL, 'Computer Science & Engineering'),

-- 7. Regular User: Priya S. Patil (SE IT Resident)
('usr-std-02', 'MCET2025IT018', 'priya.patil@maulice.ac.in', '$2b$10$018QHotFGmCuAXjnjFs9kuuG0O.sPO0V9GmHImbJE72UQ1pPhRO1q', 'Priya S. Patil', '+91 98231 10007', 'regular_user', 'ACTIVE', TRUE, 'std-se-1', NULL, 'Information Technology')
ON DUPLICATE KEY UPDATE 
  password_hash=VALUES(password_hash),
  role_id=VALUES(role_id),
  account_status=VALUES(account_status);

-- Indexes are established via PRIMARY KEY and UNIQUE KEY constraints on username, email, token_hash, and role_id foreign key.
