-- =============================================================================
-- MAULI COLLEGE OF ENGINEERING & TECHNOLOGY (MCET), SHEGAON
-- CAMPUS HOSTEL & RESIDENTIAL MANAGEMENT ENTERPRISE DATABASE
-- Database Name: mcet_hostel_db
-- Target Engine: MySQL 8.0+ / MySQL Server 26.10+ / MySQL Workbench
-- Normalization: 3NF Normalized Complete Relational Architecture (17 Tables)
-- =============================================================================

DROP DATABASE IF EXISTS mcet_hostel_db;
CREATE DATABASE mcet_hostel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mcet_hostel_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. HOSTELS TABLE
CREATE TABLE hostels (
  hostel_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  code VARCHAR(16) NOT NULL UNIQUE,
  gender VARCHAR(32) NOT NULL DEFAULT 'Boys',
  total_floors INT NOT NULL DEFAULT 4,
  total_rooms INT NOT NULL DEFAULT 60,
  total_capacity INT NOT NULL DEFAULT 180,
  warden_name VARCHAR(128) NOT NULL,
  warden_phone VARCHAR(20) NOT NULL,
  caretaker_contact VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. ROOMS TABLE
CREATE TABLE rooms (
  room_id VARCHAR(32) PRIMARY KEY,
  hostel_id VARCHAR(32) NOT NULL,
  room_number VARCHAR(16) NOT NULL,
  floor INT NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  occupied INT NOT NULL DEFAULT 0,
  room_type VARCHAR(32) NOT NULL DEFAULT 'Double',
  status VARCHAR(32) NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
  UNIQUE KEY uq_room_hostel (hostel_id, room_number)
) ENGINE=InnoDB;

-- 3. BEDS TABLE
CREATE TABLE beds (
  bed_id VARCHAR(32) PRIMARY KEY,
  room_id VARCHAR(32) NOT NULL,
  bed_number VARCHAR(16) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Available',
  student_id VARCHAR(32) NULL,
  student_name VARCHAR(128) NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
  UNIQUE KEY uq_bed_room (room_id, bed_number)
) ENGINE=InnoDB;

-- 4. WARDENS TABLE
CREATE TABLE wardens (
  warden_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(64) NOT NULL,
  hostel_id VARCHAR(32),
  hostel_name VARCHAR(128),
  cabin_location VARCHAR(128),
  office_hours VARCHAR(128),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. STUDENTS TABLE
CREATE TABLE students (
  student_id VARCHAR(32) PRIMARY KEY,
  prn VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  gender VARCHAR(32) NOT NULL,
  course VARCHAR(64) NOT NULL DEFAULT 'B.Tech',
  department VARCHAR(64) NOT NULL,
  year VARCHAR(16) NOT NULL,
  division VARCHAR(8) DEFAULT 'A',
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  parent_name VARCHAR(128) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  emergency_contact VARCHAR(128),
  hostel_id VARCHAR(32),
  hostel_name VARCHAR(128),
  room_id VARCHAR(32),
  room_number VARCHAR(16),
  bed_number VARCHAR(16),
  room_type VARCHAR(32),
  blood_group VARCHAR(8) DEFAULT 'O+',
  admission_date VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'Active',
  avatar TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE SET NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. LEAVE REQUESTS TABLE
CREATE TABLE leave_requests (
  leave_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  room_number VARCHAR(16) NOT NULL,
  hostel_name VARCHAR(128) NOT NULL,
  leave_type VARCHAR(32) NOT NULL,
  from_date VARCHAR(32) NOT NULL,
  to_date VARCHAR(32) NOT NULL,
  reason TEXT NOT NULL,
  destination VARCHAR(128),
  parent_contact VARCHAR(20) NOT NULL,
  status VARCHAR(32) DEFAULT 'Pending',
  gate_pass_code VARCHAR(64) UNIQUE,
  applied_date VARCHAR(32) NOT NULL,
  reviewed_date VARCHAR(32),
  reviewed_by VARCHAR(128),
  warden_remarks TEXT,
  parent_verified BOOLEAN DEFAULT FALSE,
  parent_call_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. GATE LOGS TABLE
CREATE TABLE gate_logs (
  log_id VARCHAR(32) PRIMARY KEY,
  gate_pass_code VARCHAR(64) NOT NULL,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  room_number VARCHAR(16) NOT NULL,
  action VARCHAR(32) NOT NULL,
  timestamp VARCHAR(64) NOT NULL,
  guard_name VARCHAR(64) NOT NULL,
  gate_name VARCHAR(64) DEFAULT 'Main Campus Gate 1',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. COMPLAINTS TABLE
CREATE TABLE complaints (
  complaint_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  room_number VARCHAR(16) NOT NULL,
  category VARCHAR(32) NOT NULL,
  subject VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(32) DEFAULT 'Medium',
  status VARCHAR(32) DEFAULT 'Submitted',
  assigned_to VARCHAR(64),
  sla_target_hours INT DEFAULT 24,
  resolution_remarks TEXT,
  satisfaction_rating INT,
  date_submitted VARCHAR(64),
  resolved_at VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. FEE RECORDS TABLE
CREATE TABLE fee_records (
  fee_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  academic_year VARCHAR(32) NOT NULL,
  hostel_fee DECIMAL(10,2) NOT NULL DEFAULT 24000.00,
  mess_fee DECIMAL(10,2) NOT NULL DEFAULT 16000.00,
  maintenance_fee DECIMAL(10,2) NOT NULL DEFAULT 2000.00,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  pending_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(32) DEFAULT 'Unpaid',
  due_date VARCHAR(32) NOT NULL,
  paid_date VARCHAR(32),
  receipt_no VARCHAR(64),
  payment_mode VARCHAR(32),
  transaction_ref VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. ROOM CHANGE REQUESTS TABLE
CREATE TABLE room_change_requests (
  request_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  current_room VARCHAR(16) NOT NULL,
  preferred_room_type VARCHAR(32) NOT NULL,
  preferred_block VARCHAR(64) NOT NULL,
  reason_category VARCHAR(32) NOT NULL,
  reason TEXT NOT NULL,
  mutual_student_prn VARCHAR(32),
  status VARCHAR(32) DEFAULT 'Pending',
  applied_date VARCHAR(32) NOT NULL,
  reviewed_date VARCHAR(32),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. MESS MENU TABLE
CREATE TABLE mess_menu (
  menu_id VARCHAR(64) PRIMARY KEY,
  day_of_week VARCHAR(16) NOT NULL,
  meal_type VARCHAR(32) NOT NULL,
  time_window VARCHAR(64) NOT NULL,
  items_json JSON NOT NULL,
  is_veg BOOLEAN DEFAULT TRUE,
  calories VARCHAR(32),
  special_dish VARCHAR(128),
  dessert VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_day_meal (day_of_week, meal_type)
) ENGINE=InnoDB;

-- 12. MEAL ATTENDANCE TABLE
CREATE TABLE meal_attendance (
  attendance_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  date VARCHAR(32) NOT NULL,
  breakfast BOOLEAN DEFAULT FALSE,
  lunch BOOLEAN DEFAULT FALSE,
  snacks BOOLEAN DEFAULT FALSE,
  dinner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. MESS FEEDBACK TABLE
CREATE TABLE mess_feedback (
  feedback_id VARCHAR(32) PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  room_number VARCHAR(16) NULL,
  date VARCHAR(32) NOT NULL,
  meal VARCHAR(32) NOT NULL,
  food_quality INT DEFAULT 5,
  taste INT DEFAULT 5,
  cleanliness INT DEFAULT 5,
  quantity INT DEFAULT 5,
  service INT DEFAULT 5,
  overall_rating DECIMAL(3,1) DEFAULT 5.0,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. MESS INVENTORY TABLE
CREATE TABLE mess_inventory (
  item_id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL,
  current_stock DECIMAL(10,2) NOT NULL,
  unit VARCHAR(16) NOT NULL,
  minimum_stock DECIMAL(10,2) NOT NULL,
  cost_per_unit DECIMAL(10,2) NOT NULL,
  vendor VARCHAR(128) NOT NULL,
  last_restocked VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'Normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 15. MESS EXPENSES TABLE
CREATE TABLE mess_expenses (
  expense_id VARCHAR(32) PRIMARY KEY,
  date VARCHAR(32) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT NULL,
  amount DECIMAL(10,2) NOT NULL,
  invoice_no VARCHAR(64) NULL,
  vendor VARCHAR(128) NOT NULL,
  payment_method VARCHAR(64) NULL,
  approved_by VARCHAR(128) NULL,
  status VARCHAR(32) DEFAULT 'Paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 16. NOTICES TABLE
CREATE TABLE notices (
  notice_id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  priority VARCHAR(32) NOT NULL,
  target_audience VARCHAR(32) NOT NULL DEFAULT 'All',
  date VARCHAR(32) NOT NULL,
  expiry_date VARCHAR(32),
  posted_by VARCHAR(128) NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 17. APP NOTIFICATIONS TABLE
CREATE TABLE app_notifications (
  notification_id VARCHAR(32) PRIMARY KEY,
  recipient_id VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL,
  link_tab VARCHAR(32),
  is_read BOOLEAN DEFAULT FALSE,
  timestamp VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- COMPLETE DATASET INSERTIONS (CAMPUS REPOSITORY SEED)
-- =============================================================================

-- 1. Hostels
INSERT INTO hostels (hostel_id, name, code, gender, total_floors, total_rooms, total_capacity, warden_name, warden_phone, caretaker_contact, description) VALUES ('hostel-sakhi', 'Sakhi Girls Hostel', 'SGH', 'Girls', 4, 16, 36, 'Dr. Sunita M. Gaikwad', '+91 94228 77412', '+91 98230 44102', 'Premier collegiate residential facility exclusively for female engineering scholars across 1st, 2nd, 3rd, and 4th year from CS, IT, ENTC, ELPO, CIVIL, and MECHANICAL branches. Features 24/7 CCTV, biometric sentry gate, Wi-Fi 6, solar hot water, study library, and Annapurna dining hall.');

-- 2. Rooms & 3. Beds
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-101', 'hostel-sakhi', 'S-101', 1, 3, 2, 'Triple', 'Partially Occupied');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-101-bed-1', 'room-s-101', 'Bed-1', 'Occupied', 'std-fe-1', 'Pooja M. Shinde');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-101-bed-2', 'room-s-101', 'Bed-2', 'Occupied', 'std-fe-2', 'Riya A. Deshmukh');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-101-bed-3', 'room-s-101', 'Bed-3', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-102', 'hostel-sakhi', 'S-102', 1, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-102-bed-1', 'room-s-102', 'Bed-1', 'Occupied', 'std-fe-3', 'Kavita B. Gayakwad');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-102-bed-2', 'room-s-102', 'Bed-2', 'Occupied', 'std-fe-4', 'Bhakti S. Kadam');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-103', 'hostel-sakhi', 'S-103', 1, 3, 2, 'Triple', 'Partially Occupied');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-103-bed-1', 'room-s-103', 'Bed-1', 'Occupied', 'std-fe-5', 'Divya A. Ingle');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-103-bed-2', 'room-s-103', 'Bed-2', 'Occupied', 'std-fe-6', 'Samiksha G. Patil');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-103-bed-3', 'room-s-103', 'Bed-3', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-104', 'hostel-sakhi', 'S-104', 1, 2, 0, 'Double', 'Available');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-104-bed-1', 'room-s-104', 'Bed-1', 'Available', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-104-bed-2', 'room-s-104', 'Bed-2', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-201', 'hostel-sakhi', 'S-201', 2, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-201-bed-1', 'room-s-201', 'Bed-1', 'Occupied', 'std-se-1', 'Priya S. Patil');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-201-bed-2', 'room-s-201', 'Bed-2', 'Occupied', 'std-se-2', 'Sneha K. Joshi');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-202', 'hostel-sakhi', 'S-202', 2, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-202-bed-1', 'room-s-202', 'Bed-1', 'Occupied', 'std-se-3', 'Sayali V. Deshpande');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-202-bed-2', 'room-s-202', 'Bed-2', 'Occupied', 'std-se-4', 'Sakshi M. Gaikwad');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-203', 'hostel-sakhi', 'S-203', 2, 3, 1, 'Triple', 'Partially Occupied');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-203-bed-1', 'room-s-203', 'Bed-1', 'Occupied', 'std-se-5', 'Aishwarya R. Sonwane');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-203-bed-2', 'room-s-203', 'Bed-2', 'Available', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-203-bed-3', 'room-s-203', 'Bed-3', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-204', 'hostel-sakhi', 'S-204', 2, 3, 0, 'Triple', 'Available');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-204-bed-1', 'room-s-204', 'Bed-1', 'Available', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-204-bed-2', 'room-s-204', 'Bed-2', 'Available', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-204-bed-3', 'room-s-204', 'Bed-3', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-301', 'hostel-sakhi', 'S-301', 3, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-301-bed-1', 'room-s-301', 'Bed-1', 'Occupied', 'std-te-1', 'Ananya R. Kulkarni');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-301-bed-2', 'room-s-301', 'Bed-2', 'Occupied', 'std-te-2', 'Rutuja N. Jadhav');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-302', 'hostel-sakhi', 'S-302', 3, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-302-bed-1', 'room-s-302', 'Bed-1', 'Occupied', 'std-te-3', 'Vaishnavi D. Chavan');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-302-bed-2', 'room-s-302', 'Bed-2', 'Occupied', 'std-te-4', 'Shruti K. Solanke');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-303', 'hostel-sakhi', 'S-303', 3, 3, 0, 'Triple', 'Available');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-303-bed-1', 'room-s-303', 'Bed-1', 'Available', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-303-bed-2', 'room-s-303', 'Bed-2', 'Available', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-303-bed-3', 'room-s-303', 'Bed-3', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-304', 'hostel-sakhi', 'S-304', 3, 3, 0, 'Triple', 'Maintenance');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-304-bed-1', 'room-s-304', 'Bed-1', 'Reserved', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-304-bed-2', 'room-s-304', 'Bed-2', 'Reserved', NULL, NULL);
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-304-bed-3', 'room-s-304', 'Bed-3', 'Reserved', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-401', 'hostel-sakhi', 'S-401', 4, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-401-bed-1', 'room-s-401', 'Bed-1', 'Occupied', 'std-be-1', 'Neha S. Wagh');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-401-bed-2', 'room-s-401', 'Bed-2', 'Occupied', 'std-be-2', 'Tanvi P. More');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-402', 'hostel-sakhi', 'S-402', 4, 2, 2, 'Double', 'Full');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-402-bed-1', 'room-s-402', 'Bed-1', 'Occupied', 'std-be-3', 'Manasi G. Raut');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-402-bed-2', 'room-s-402', 'Bed-2', 'Occupied', 'std-be-4', 'Radha V. Kale');
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-403', 'hostel-sakhi', 'S-403', 4, 1, 0, 'Single', 'Available');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-403-bed-1', 'room-s-403', 'Bed-1', 'Available', NULL, NULL);
INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES ('room-s-404', 'hostel-sakhi', 'S-404', 4, 1, 0, 'Single', 'Available');
INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES ('room-s-404-bed-1', 'room-s-404', 'Bed-1', 'Available', NULL, NULL);

-- 4. Wardens
INSERT INTO wardens (warden_id, name, email, phone, role, hostel_id, hostel_name, cabin_location, office_hours, avatar) VALUES ('warden-sakhi-1', 'Dr. Sunita M. Gaikwad', 'warden.sakhi@maulice.ac.in', '+91 94228 77412', 'Chief Warden', NULL, NULL, NULL, NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
INSERT INTO wardens (warden_id, name, email, phone, role, hostel_id, hostel_name, cabin_location, office_hours, avatar) VALUES ('warden-sakhi-2', 'Mrs. Pratibha S. Deshmukh', 'asst.warden@maulice.ac.in', '+91 98230 44102', 'Assistant Warden', NULL, NULL, NULL, NULL, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80');
INSERT INTO wardens (warden_id, name, email, phone, role, hostel_id, hostel_name, cabin_location, office_hours, avatar) VALUES ('warden-sakhi-3', 'Mrs. Mangala R. Chavan', 'mess.supervisor@maulice.ac.in', '+91 98224 99120', 'Mess Supervisor', NULL, NULL, NULL, NULL, 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80');
INSERT INTO wardens (warden_id, name, email, phone, role, hostel_id, hostel_name, cabin_location, office_hours, avatar) VALUES ('warden-sakhi-4', 'Havaldar Shobha Jadhav', 'security.sakhi@maulice.ac.in', '+91 98500 33412', 'Security Sentry', NULL, NULL, NULL, NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80');

-- 5. Students
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-fe-1', 'MCET2026CS012', 'Pooja M. Shinde', 'Female', 'B.Tech', 'Computer Science & Engineering', '1st Year', 'A', '+91 99220 33412', 'pooja.shinde@maulice.ac.in', 'Madhav Shinde', '+91 98233 77881', '+91 98233 77881 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-101', 'S-101', 'Bed-1', 'Triple', 'B+', '2026-08-01', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Plot 42, Anand Nagar, Akola Road, Shegaon - 444203');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-fe-2', 'MCET2026ET019', 'Riya A. Deshmukh', 'Female', 'B.Tech', 'Electronics & Telecommunication', '1st Year', 'B', '+91 98509 11234', 'riya.deshmukh@maulice.ac.in', 'Anand Deshmukh', '+91 94228 33211', '+91 94228 33211 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-101', 'S-101', 'Bed-2', 'Triple', 'A+', '2026-08-01', 'Active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Shivaji Ward, Nandura Road, Khamgaon - 444303');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-fe-3', 'MCET2026CV008', 'Kavita B. Gayakwad', 'Female', 'B.Tech', 'Civil Engineering', '1st Year', 'A', '+91 96572 33445', 'kavita.gayakwad@maulice.ac.in', 'Bharat Gayakwad', '+91 98221 99001', '+91 98221 99001 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-102', 'S-102', 'Bed-1', 'Double', 'O+', '2026-08-05', 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Samarth Colony, Malkapur Road, Buldhana - 443001');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-fe-4', 'MCET2026EP006', 'Bhakti S. Kadam', 'Female', 'B.Tech', 'Electrical Power Systems (ELPO)', '1st Year', 'A', '+91 98221 77889', 'bhakti.kadam@maulice.ac.in', 'Shantaram Kadam', '+91 98900 11223', '+91 98900 11223 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-102', 'S-102', 'Bed-2', 'Double', 'AB+', '2026-08-05', 'Active', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'Near Gandhi Park, Mehkar - 443301');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-fe-5', 'MCET2026IT027', 'Divya A. Ingle', 'Female', 'B.Tech', 'Information Technology', '1st Year', 'B', '+91 98228 99112', 'divya.ingle@maulice.ac.in', 'Ashok Ingle', '+91 98905 44332', '+91 98905 44332 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-103', 'S-103', 'Bed-1', 'Triple', 'O+', '2026-08-08', 'Active', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80', 'Krishi Nagar, Chikhli - 443201');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-fe-6', 'MCET2026ME015', 'Samiksha G. Patil', 'Female', 'B.Tech', 'Mechanical Engineering', '1st Year', 'A', '+91 97631 88992', 'samiksha.patil@maulice.ac.in', 'Gajanan Patil', '+91 98224 66778', '+91 98224 66778 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-103', 'S-103', 'Bed-2', 'Triple', 'B+', '2026-08-08', 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Near Old Bus Stand, Jalamb - 444304');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-se-1', 'MCET2025IT018', 'Priya S. Patil', 'Female', 'B.Tech', 'Information Technology', '2nd Year', 'A', '+91 98501 23456', 'priya.patil@maulice.ac.in', 'Suresh Patil', '+91 94221 44556', '+91 94221 44556 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-201', 'S-201', 'Bed-1', 'Double', 'B+', '2025-08-02', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Plot 12, Sai Nagar, Malkapur Road, Buldhana - 443001');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-se-2', 'MCET2025EP029', 'Sneha K. Joshi', 'Female', 'B.Tech', 'Electrical Power Systems (ELPO)', '2nd Year', 'A', '+91 96570 12890', 'sneha.joshi@maulice.ac.in', 'Keshav Joshi', '+91 94230 77112', '+91 94230 77112 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-201', 'S-201', 'Bed-2', 'Double', 'AB+', '2025-08-02', 'Active', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', 'Samarth Colony, Jalgaon - 425001');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-se-3', 'MCET2025ET014', 'Sayali V. Deshpande', 'Female', 'B.Tech', 'Electronics & Telecommunication', '2nd Year', 'B', '+91 98224 88312', 'sayali.deshpande@maulice.ac.in', 'Vilas Deshpande', '+91 98900 44321', '+91 98900 44321 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-202', 'S-202', 'Bed-1', 'Double', 'A+', '2025-08-04', 'Active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Vidharbha Housing Board, Akola - 444001');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-se-4', 'MCET2025ME021', 'Sakshi M. Gaikwad', 'Female', 'B.Tech', 'Mechanical Engineering', '2nd Year', 'A', '+91 97630 44556', 'sakshi.gaikwad@maulice.ac.in', 'Manoj Gaikwad', '+91 94231 66778', '+91 94231 66778 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-202', 'S-202', 'Bed-2', 'Double', 'O+', '2025-08-04', 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Near Gajanan Maharaj Temple, Shegaon - 444203');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-se-5', 'MCET2025CS055', 'Aishwarya R. Sonwane', 'Female', 'B.Tech', 'Computer Science & Engineering', '2nd Year', 'A', '+91 98507 88221', 'aishwarya.sonwane@maulice.ac.in', 'Ramesh Sonwane', '+91 94232 55443', '+91 94232 55443 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-203', 'S-203', 'Bed-1', 'Triple', 'B+', '2025-08-06', 'Active', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'Shivaji Nagar, Jalamb Road, Shegaon - 444203');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-te-1', 'MCET2024CS042', 'Ananya R. Kulkarni', 'Female', 'B.Tech', 'Computer Science & Engineering', '3rd Year', 'A', '+91 98231 10011', 'ananya.kulkarni@maulice.ac.in', 'Rajendra Kulkarni', '+91 94221 11223', '+91 94221 11223 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-301', 'S-301', 'Bed-1', 'Double', 'O+', '2024-08-01', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Flat 402, Shiv Plaza, Akola Road, Shegaon - 444203');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-te-2', 'MCET2024CV027', 'Rutuja N. Jadhav', 'Female', 'B.Tech', 'Civil Engineering', '3rd Year', 'A', '+91 97632 44510', 'rutuja.jadhav@maulice.ac.in', 'Nitin Jadhav', '+91 98220 55678', '+91 98220 55678 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-301', 'S-301', 'Bed-2', 'Double', 'B+', '2024-08-01', 'Active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Near Old Cotton Market, Khamgaon - 444303');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-te-3', 'MCET2024EP015', 'Vaishnavi D. Chavan', 'Female', 'B.Tech', 'Electrical Power Systems (ELPO)', '3rd Year', 'A', '+91 98901 22334', 'vaishnavi.chavan@maulice.ac.in', 'Dattatray Chavan', '+91 98234 55667', '+91 98234 55667 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-302', 'S-302', 'Bed-1', 'Double', 'A+', '2024-08-03', 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Pratap Nagar, Malkapur - 443101');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-te-4', 'MCET2024ET041', 'Shruti K. Solanke', 'Female', 'B.Tech', 'Electronics & Telecommunication', '3rd Year', 'B', '+91 99225 66778', 'shruti.solanke@maulice.ac.in', 'Kailas Solanke', '+91 94229 88990', '+91 94229 88990 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-302', 'S-302', 'Bed-2', 'Double', 'AB+', '2024-08-03', 'Active', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80', 'Pawan Nagar, Amravati - 444605');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-be-1', 'MCET2023ME005', 'Neha S. Wagh', 'Female', 'B.Tech', 'Mechanical Engineering', '4th Year', 'A', '+91 97632 99881', 'neha.wagh@maulice.ac.in', 'Sanjay Wagh', '+91 98900 66778', '+91 98900 66778 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-401', 'S-401', 'Bed-1', 'Double', 'A+', '2023-08-01', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Krishi Nagar, Nandura Road, Khamgaon - 444303');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-be-2', 'MCET2023IT033', 'Tanvi P. More', 'Female', 'B.Tech', 'Information Technology', '4th Year', 'A', '+91 98220 66712', 'tanvi.more@maulice.ac.in', 'Prakash More', '+91 94220 33441', '+91 94220 33441 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-401', 'S-401', 'Bed-2', 'Double', 'B+', '2023-08-01', 'Active', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', 'Civil Lines, Buldhana - 443001');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-be-3', 'MCET2023CS002', 'Manasi G. Raut', 'Female', 'B.Tech', 'Computer Science & Engineering', '4th Year', 'A', '+91 98503 44556', 'manasi.raut@maulice.ac.in', 'Gajanan Raut', '+91 98223 11445', '+91 98223 11445 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-402', 'S-402', 'Bed-1', 'Double', 'O+', '2023-08-02', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Adarsh Nagar, Shegaon - 444203');
INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES ('std-be-4', 'MCET2023CV018', 'Radha V. Kale', 'Female', 'B.Tech', 'Civil Engineering', '4th Year', 'B', '+91 97633 55667', 'radha.kale@maulice.ac.in', 'Vasant Kale', '+91 94230 22334', '+91 94230 22334 (Father)', 'hostel-sakhi', 'Sakhi Girls Hostel', 'room-s-402', 'S-402', 'Bed-2', 'Double', 'A+', '2023-08-02', 'Active', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'Sai Nagar, Mehkar - 443301');

-- 6. Leave Requests
INSERT INTO leave_requests (leave_id, student_id, student_name, room_number, hostel_name, leave_type, from_date, to_date, reason, destination, parent_contact, status, gate_pass_code, applied_date, reviewed_date, reviewed_by, warden_remarks, parent_verified) VALUES ('leave-101', 'std-te-1', 'Ananya R. Kulkarni', 'S-301', 'Sakhi Girls Hostel', 'Home Visit', '2026-09-02', '2026-09-05', 'Family religious function and festival in hometown Akola.', 'Akola, Maharashtra', '+91 94221 11223', 'Approved', 'GP-SAKHI-2026-0941', '2026-08-27', '2026-08-28', 'Dr. Sunita M. Gaikwad (Chief Rector)', 'Verified over phone with parent Mr. Rajendra Kulkarni. Approved for 3 days.', 0);
INSERT INTO leave_requests (leave_id, student_id, student_name, room_number, hostel_name, leave_type, from_date, to_date, reason, destination, parent_contact, status, gate_pass_code, applied_date, reviewed_date, reviewed_by, warden_remarks, parent_verified) VALUES ('leave-102', 'std-se-1', 'Priya S. Patil', 'S-201', 'Sakhi Girls Hostel', 'Academic / Internship', '2026-09-10', '2026-09-14', 'State Level Technical Hackathon & Paper Presentation at COEP Pune.', 'COEP Tech University, Pune', '+91 94221 44556', 'Pending', NULL, '2026-08-29', NULL, NULL, NULL, 0);
INSERT INTO leave_requests (leave_id, student_id, student_name, room_number, hostel_name, leave_type, from_date, to_date, reason, destination, parent_contact, status, gate_pass_code, applied_date, reviewed_date, reviewed_by, warden_remarks, parent_verified) VALUES ('leave-103', 'std-be-1', 'Neha S. Wagh', 'S-401', 'Sakhi Girls Hostel', 'Medical', '2026-08-20', '2026-08-24', 'Dental surgery and prescribed recovery period in Khamgaon.', 'Khamgaon Hospital', '+91 98900 66778', 'Approved', 'GP-SAKHI-2026-0882', '2026-08-18', '2026-08-19', 'Dr. Sunita M. Gaikwad', 'Medical certificate verified. Approved.', 0);
INSERT INTO leave_requests (leave_id, student_id, student_name, room_number, hostel_name, leave_type, from_date, to_date, reason, destination, parent_contact, status, gate_pass_code, applied_date, reviewed_date, reviewed_by, warden_remarks, parent_verified) VALUES ('leave-104', 'std-fe-1', 'Pooja M. Shinde', 'S-101', 'Sakhi Girls Hostel', 'Personal', '2026-09-01', '2026-09-02', 'Weekend visit to local guardian in Shegaon town.', 'Shegaon Town', '+91 98233 77881', 'Pending', NULL, '2026-08-29', NULL, NULL, NULL, 0);

-- 7. Gate Logs
INSERT INTO gate_logs (log_id, gate_pass_code, student_id, student_name, room_number, action, timestamp, guard_name, gate_name, remarks) VALUES ('gl-01', 'GP-SAKHI-2026-0941', 'std-te-1', 'Ananya R. Kulkarni', 'S-301', 'Departure', '2026-09-02 08:45 AM', 'Havaldar Shobha Jadhav', 'Sakhi Girls Hostel Biometric Gate', 'Outward journey confirmed. Parent telephonically verified.');
INSERT INTO gate_logs (log_id, gate_pass_code, student_id, student_name, room_number, action, timestamp, guard_name, gate_name, remarks) VALUES ('gl-02', 'GP-SAKHI-2026-0941', 'std-te-1', 'Ananya R. Kulkarni', 'S-301', 'Return', '2026-09-05 06:15 PM', 'Havaldar Shobha Jadhav', 'Sakhi Girls Hostel Biometric Gate', 'Returned safely before 09:30 PM curfew.');

-- 8. Complaints
INSERT INTO complaints (complaint_id, student_id, student_name, room_number, category, subject, description, priority, status, assigned_to, sla_target_hours, resolution_remarks, satisfaction_rating, date_submitted, resolved_at) VALUES ('comp-201', 'std-te-1', 'Ananya R. Kulkarni', 'S-301', 'Electrical', 'Study table reading lamp socket sparking', 'The right-side 5A wall socket near Desk 1 sparks when laptop charger is inserted. Needs urgent replacement to prevent fuse trips.', 'High', 'In Progress', 'Campus Electrician - Mr. Sandeep Patil', 24, 'Electrician inspected; spare modular switch requisitioned from central store.', NULL, '2026-08-28 09:30 AM', NULL);
INSERT INTO complaints (complaint_id, student_id, student_name, room_number, category, subject, description, priority, status, assigned_to, sla_target_hours, resolution_remarks, satisfaction_rating, date_submitted, resolved_at) VALUES ('comp-202', 'std-se-1', 'Priya S. Patil', 'S-201', 'Wi-Fi', 'Low signal strength on Floor 2 East Wing', 'Wi-Fi Access Point AP-S2-02 keeps dropping connection during evening study hours (8 PM - 11 PM).', 'Medium', 'Under Review', NULL, 24, NULL, NULL, '2026-08-28 08:15 PM', NULL);
INSERT INTO complaints (complaint_id, student_id, student_name, room_number, category, subject, description, priority, status, assigned_to, sla_target_hours, resolution_remarks, satisfaction_rating, date_submitted, resolved_at) VALUES ('comp-203', 'std-be-1', 'Neha S. Wagh', 'S-401', 'Plumbing', 'Water tap dripping in 4th Floor washroom', 'Tap number 2 near washbasin has a continuous leak, wasting water.', 'Low', 'Resolved', 'Plumber - Mr. Dilip Rathod', 24, 'Washer replaced and valve tightened. Verified leak-free.', NULL, '2026-08-25 07:45 AM', '2026-08-25 04:00 PM');
INSERT INTO complaints (complaint_id, student_id, student_name, room_number, category, subject, description, priority, status, assigned_to, sla_target_hours, resolution_remarks, satisfaction_rating, date_submitted, resolved_at) VALUES ('comp-204', 'std-se-2', 'Sneha K. Joshi', 'S-201', 'Cleaning', 'Floor 2 corridor recycling bin clearance', 'Recycle bin outside Room S-201 is overflowing with study cardboard packages from weekend deliveries.', 'Medium', 'Submitted', NULL, 24, NULL, NULL, '2026-08-29 07:15 AM', NULL);

-- 9. Fee Records
INSERT INTO fee_records (fee_id, student_id, student_name, academic_year, hostel_fee, mess_fee, maintenance_fee, total_amount, paid_amount, pending_amount, payment_status, due_date, paid_date, receipt_no, payment_mode, transaction_ref) VALUES ('fee-1', 'std-te-1', 'Ananya R. Kulkarni', '2026-2027', 32000, 36000, 4000, 72000, 72000, 0, 'Paid', '2026-08-31', NULL, NULL, NULL, NULL);
INSERT INTO fee_records (fee_id, student_id, student_name, academic_year, hostel_fee, mess_fee, maintenance_fee, total_amount, paid_amount, pending_amount, payment_status, due_date, paid_date, receipt_no, payment_mode, transaction_ref) VALUES ('fee-2', 'std-se-1', 'Priya S. Patil', '2026-2027', 35000, 36000, 4000, 75000, 45000, 30000, 'Partially Paid', '2026-09-15', NULL, NULL, NULL, NULL);
INSERT INTO fee_records (fee_id, student_id, student_name, academic_year, hostel_fee, mess_fee, maintenance_fee, total_amount, paid_amount, pending_amount, payment_status, due_date, paid_date, receipt_no, payment_mode, transaction_ref) VALUES ('fee-3', 'std-be-1', 'Neha S. Wagh', '2026-2027', 32000, 36000, 4000, 72000, 72000, 0, 'Paid', '2026-08-31', NULL, NULL, NULL, NULL);

-- 10. Room Change Requests
INSERT INTO room_change_requests (request_id, student_id, student_name, current_room, preferred_room_type, preferred_block, reason_category, reason, mutual_student_prn, status, applied_date, reviewed_date, remarks) VALUES ('rc-101', 'std-fe-1', 'Pooja M. Shinde', 'S-101', 'Double', 'Sakhi Girls Hostel (Floor 1)', 'Academic', 'Preparing for first semester examinations and requesting quiet 2-seater room with department senior.', NULL, 'Pending', '2026-08-28', NULL, NULL);
INSERT INTO room_change_requests (request_id, student_id, student_name, current_room, preferred_room_type, preferred_block, reason_category, reason, mutual_student_prn, status, applied_date, reviewed_date, remarks) VALUES ('rc-102', 'std-se-1', 'Priya S. Patil', 'S-201', 'Single', 'Sakhi Girls Hostel (Floor 4 Studio)', 'Medical', 'Mild dust allergy requiring single occupancy studio accommodation on higher floor.', NULL, 'Approved', '2026-08-15', '2026-08-17', 'Medical certificate verified. Single Room S-403 earmarked for next academic semester.');

-- 11. Mess Menu
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-monday-breakfast', 'Monday', 'Breakfast', '07:30 AM - 09:30 AM', '["Kande Pohe with Fresh Coconut & Lemon","Boiled Sprouts (Usal)","Tea / Coffee / Warm Milk","Banana"]', 1, '420 kcal', NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-monday-lunch', 'Monday', 'Lunch', '12:15 PM - 02:30 PM', '["Soft Phulkas (3 pcs)","Paneer Kolhapuri (Rich Gravy)","Dal Tadka with Jeera Rice","Fresh Cucumber Salad & Curd","Gulab Jamun"]', 1, NULL, 'Paneer Kolhapuri & Hot Gulab Jamun', NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-monday-snacks', 'Monday', 'Snacks', '05:00 PM - 06:15 PM', '["Crispy Onion Bhajji (Pakoda)","Green Mint Chutney","Masala Chai"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-monday-dinner', 'Monday', 'Dinner', '07:45 PM - 09:45 PM', '["Bhakri / Chapati","Sev Tamatar Ki Sabji (Maharashtrian style)","Moong Dal Khichdi with Pure Ghee","Papad & Pickle","Sweet Mango Shrikhand"]', 1, NULL, NULL, 'Mango Shrikhand');
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-tuesday-breakfast', 'Tuesday', 'Breakfast', '07:30 AM - 09:30 AM', '["Steamed Idli Sambar (3 pcs)","Fresh Coconut Chutney","Filter Coffee / Tea","Fruit Cup"]', 1, '390 kcal', NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-tuesday-lunch', 'Tuesday', 'Lunch', '12:15 PM - 02:30 PM', '["Hot Rotis with Butter","Aloo Gobi Matar Masala","Gujarati Kadi with Steamed Rice","Roasted Papad & Green Salad","Fruit Custard"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-tuesday-snacks', 'Tuesday', 'Snacks', '05:00 PM - 06:15 PM', '["Mumbai Style Veg Sandwich","Tomato Sauce","Adrak Ginger Chai"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-tuesday-dinner', 'Tuesday', 'Dinner', '07:45 PM - 09:45 PM', '["Chapati","Mix Veg Curry (Hyderabadi style)","Dal Fry & Steamed Basmati Rice","Cucumber Raita","Jalebi"]', 1, NULL, NULL, 'Jalebi');
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-wednesday-breakfast', 'Wednesday', 'Breakfast', '07:30 AM - 09:30 AM', '["Maharashtrian Misal Pav (Spicy Usal + 2 Pav)","Chopped Onions, Farsan & Lemon","Tea / Milk","Seasonal Apple"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-wednesday-lunch', 'Wednesday', 'Lunch', '12:15 PM - 02:30 PM', '["Tandoori Roti / Chapati","Paneer Butter Masala (Veg)","Dal Makhani","Jeera Rice & Boondi Raita","Ice Cream Cup"]', 1, NULL, 'Dal Makhani & Paneer Butter Masala', NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-wednesday-snacks', 'Wednesday', 'Snacks', '05:00 PM - 06:15 PM', '["Batata Vada (2 pcs) with Fried Green Chilli","Sweet & Sour Tamarind Dip","Cutting Chai"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-wednesday-dinner', 'Wednesday', 'Dinner', '07:45 PM - 09:45 PM', '["Garma Garam Phulkas","Baingan Bharta (Roasted Eggplant)","Varana Bhat (Toor Dal Rice with Ghee)","Limbu Lonache (Lemon Pickle)","Gajar Ka Halwa"]', 1, NULL, NULL, 'Gajar Ka Halwa');
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-thursday-breakfast', 'Thursday', 'Breakfast', '07:30 AM - 09:30 AM', '["Upma with Roasted Cashews & Sev","Coconut Chutney","Tea / Coffee","Banana"]', 1, '380 kcal', NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-thursday-lunch', 'Thursday', 'Lunch', '12:15 PM - 02:30 PM', '["Chapati","Chole Masala (Amritsari style)","Bhature (1 pc) / Steamed Rice","Dal Palak (Spinach Dal)","Onion Salad & Curd"]', 1, NULL, 'Amritsari Chole Bhature Feast', NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-thursday-snacks', 'Thursday', 'Snacks', '05:00 PM - 06:15 PM', '["Sweet Corn Chaat / Masala Corn","Lemon Twist","Cardamom Tea"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-thursday-dinner', 'Thursday', 'Dinner', '07:45 PM - 09:45 PM', '["Roti","Methi Malai Matar Sabji","Dal Panchmel with Steamed Rice","Roasted Papad & Salad","Seviyan Kheer"]', 1, NULL, NULL, 'Badam Seviyan Kheer');
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-friday-breakfast', 'Friday', 'Breakfast', '07:30 AM - 09:30 AM', '["Crispy Medu Vada (2 pcs)","Spicy Sambar & Chutney","Tea / Milk","Papaya Slices"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-friday-lunch', 'Friday', 'Lunch', '12:15 PM - 02:30 PM', '["Chapati","Rajma Masala (Punjabi style)","Jeera Rice","Boondi Raita & Salad","Rasgulla (2 pcs)"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-friday-snacks', 'Friday', 'Snacks', '05:00 PM - 06:15 PM', '["Samosa (1 pc) with Mint Dip","Chai"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-friday-dinner', 'Friday', 'Dinner', '07:45 PM - 09:45 PM', '["Bhakri / Chapati","Pithla Bhakri with Thecha","Steamed Rice & Dal","Pickle","Kheer"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-saturday-breakfast', 'Saturday', 'Breakfast', '07:30 AM - 09:30 AM', '["Aloo Paratha with Curd & Butter","Green Chutney","Tea / Coffee"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-saturday-lunch', 'Saturday', 'Lunch', '12:15 PM - 02:30 PM', '["Roti","Veg Dum Biryani","Mirchi Ka Salan & Onion Raita","Papad","Fruit Custard"]', 1, NULL, 'Hyderabadi Veg Dum Biryani', NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-saturday-snacks', 'Saturday', 'Snacks', '05:00 PM - 06:15 PM', '["Bhel Puri with Sev & Coriander","Tea"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-saturday-dinner', 'Saturday', 'Dinner', '07:45 PM - 09:45 PM', '["Chapati","Bhindi Masala","Moong Dal Tadka with Steamed Rice","Salad","Ice Cream"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-sunday-breakfast', 'Sunday', 'Breakfast', '08:00 AM - 10:00 AM', '["Masala Dosa with Potato Palya","Sambar & Coconut Chutney","Special Filter Coffee"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-sunday-lunch', 'Sunday', 'Lunch', '12:30 PM - 03:00 PM', '["Puri (4 pcs)","Shrikhand / Basundi Feast","Chana Masala","Jeera Pulao & Dal Tadka","Papad & Pickle"]', 1, NULL, 'Maharashtrian Festive Thali (Shrikhand Puri Feast)', NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-sunday-snacks', 'Sunday', 'Snacks', '05:00 PM - 06:15 PM', '["Biscuits / Khari","Masala Chai"]', 1, NULL, NULL, NULL);
INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES ('menu-sunday-dinner', 'Sunday', 'Dinner', '07:45 PM - 09:45 PM', '["Light Phulkas","Khichdi with Kadhi","Papad & Pickle","Warm Haldi Milk Counter"]', 1, NULL, NULL, NULL);

-- 12. Meal Attendance
INSERT INTO meal_attendance (attendance_id, student_id, student_name, date, breakfast, lunch, snacks, dinner) VALUES ('ma-1', 'std-te-1', 'Ananya R. Kulkarni', '2026-08-29', 1, 1, 0, 1);
INSERT INTO meal_attendance (attendance_id, student_id, student_name, date, breakfast, lunch, snacks, dinner) VALUES ('ma-2', 'std-se-1', 'Priya S. Patil', '2026-08-28', 1, 1, 1, 1);

-- 13. Mess Feedback
INSERT INTO mess_feedback (feedback_id, student_id, student_name, room_number, date, meal, food_quality, taste, cleanliness, quantity, service, overall_rating, comments) VALUES ('fb-1', 'std-te-1', 'Ananya R. Kulkarni', 'S-301', '2026-08-27', 'lunch', 5, 5, 5, 5, 5, 5, 'The Dal Makhani and soft phulkas on Wednesday lunch were excellent! Fresh and authentic.');
INSERT INTO mess_feedback (feedback_id, student_id, student_name, room_number, date, meal, food_quality, taste, cleanliness, quantity, service, overall_rating, comments) VALUES ('fb-2', 'std-se-1', 'Priya S. Patil', 'S-201', '2026-08-28', 'breakfast', 5, 5, 5, 5, 5, 5, 'Pohe was warm and tasty. Would love to have coconut chutney served along with it.');

-- 14. Mess Inventory
INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status) VALUES ('inv-1', 'Lokwan Whole Wheat Atta', 'Grains & Flours', 450, 'kg', 100, 38, 'Buldhana Agro Grain Mandi', '2026-08-22', 'In Stock');
INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status) VALUES ('inv-2', 'Kolam Premium Steam Rice', 'Grains & Flours', 620, 'kg', 150, 52, 'Shegaon Wholesale Traders', '2026-08-20', 'In Stock');
INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status) VALUES ('inv-3', 'Organic Toor Dal (Polished)', 'Pulses & Legumes', 35, 'kg', 50, 145, 'Khamgaon Pulses Co-op', '2026-08-10', 'Low Stock');
INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status) VALUES ('inv-4', 'Refined Sunflower Cooking Oil', 'Oils & Ghee', 18, 'Liters', 40, 135, 'Pravin Oil Mill Akola', '2026-08-12', 'Low Stock');
INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status) VALUES ('inv-5', 'Pure Desi Cow Ghee', 'Oils & Ghee', 42, 'kg', 20, 580, 'Mahanand Dairy Shegaon', '2026-08-25', 'In Stock');

-- 15. Mess Expenses
INSERT INTO mess_expenses (expense_id, date, category, description, amount, invoice_no, vendor, payment_method, approved_by, status) VALUES ('exp-1001', '2026-08-28', 'Dairy', 'Daily Fresh Dairy (Milk 120L, Paneer 25kg, Curd 40L)', 19850, 'INV-VKD-2026-882', 'Vikas Dairy Milk Producers Union', 'Bank NEFT / RTGS', 'Dr. S. K. Deshmukh', 'Paid');
INSERT INTO mess_expenses (expense_id, date, category, description, amount, invoice_no, vendor, payment_method, approved_by, status) VALUES ('exp-1002', '2026-08-27', 'Vegetables', 'Fresh Vegetables & Greens (Tomatoes, Cauliflower, Palak)', 9800, 'INV-SMM-4491', 'Shegaon Sabji Mandi Wholesale', 'UPI / Direct Bank', 'Dr. S. K. Deshmukh', 'Paid');
INSERT INTO mess_expenses (expense_id, date, category, description, amount, invoice_no, vendor, payment_method, approved_by, status) VALUES ('exp-1003', '2026-08-22', 'Grains', 'Grains & Pulses Restock (Atta 350kg, Rice 400kg)', 36500, 'INV-BAM-0918', 'Buldhana Agro Flour Mills', 'Cheque No. 491028', 'Dr. S. K. Deshmukh', 'Paid');
INSERT INTO mess_expenses (expense_id, date, category, description, amount, invoice_no, vendor, payment_method, approved_by, status) VALUES ('exp-1004', '2026-08-20', 'Fuel & Gas', 'Commercial LPG Cylinder Refills (4 Cylinders)', 7200, 'INV-BGA-1290', 'Bharat Gas Shegaon Agency', 'Direct Debit', 'Dr. S. K. Deshmukh', 'Paid');

-- 16. Notices
INSERT INTO notices (notice_id, title, content, category, priority, target_audience, date, expiry_date, posted_by, is_pinned) VALUES ('not-1', 'Ganesh Chaturthi Festive Feast at Annapurna Mess', 'Special Maharashtrian festive dinner featuring Modak, Puran Poli, Shrikhand, and Kheer will be served in Annapurna Mess for Sakhi Girls Hostel on Sunday, Sep 7th from 7:00 PM to 10:30 PM.', 'Mess', 'High', 'All', '2026-08-28', '2026-09-08', 'Dr. Sunita M. Gaikwad (Chief Rector)', 1);
INSERT INTO notices (notice_id, title, content, category, priority, target_audience, date, expiry_date, posted_by, is_pinned) VALUES ('not-2', 'Floor 3 Solar Hot Water System Inspection', 'Routine preventative maintenance of rooftop solar hot water coils in Sakhi Girls Hostel will take place on Saturday 30th August from 10:00 AM to 02:00 PM. Hot water supply will resume normally by 4:00 PM.', 'Maintenance', 'Medium', 'All', '2026-08-27', '2026-08-31', 'Mrs. Pratibha Deshmukh (Asst. Warden)', 0);
INSERT INTO notices (notice_id, title, content, category, priority, target_audience, date, expiry_date, posted_by, is_pinned) VALUES ('not-3', 'Mandatory Night Biometric Curfew Timings Reminder', 'As per college disciplinary and safety norms, the Sakhi Girls Hostel main biometric gate locks strictly at 09:30 PM. Scholars requiring extended library or lab access for BE project work must obtain guide endorsement before 06:00 PM.', 'Hostel', 'Urgent', 'All', '2026-08-25', '2026-10-31', 'Dr. Sunita M. Gaikwad (Chief Rector)', 1);

-- 17. App Notifications
INSERT INTO app_notifications (notification_id, recipient_id, title, message, type, link_tab, is_read, timestamp) VALUES ('ntf-1', 'std-te-1', 'Leave Request Approved', 'Your leave application for Home Visit (Sep 2 - Sep 5) has been approved by Rector Dr. Sunita M. Gaikwad. Gate Pass generated: GP-SAKHI-2026-0941.', 'leave_update', 'leave', 0, '2026-08-28 11:30 AM');
INSERT INTO app_notifications (notification_id, recipient_id, title, message, type, link_tab, is_read, timestamp) VALUES ('ntf-2', 'std-te-1', 'Maintenance Assigned', 'Campus Electrician Mr. Sandeep Patil has been assigned to inspect Room S-301 reading lamp socket.', 'complaint_update', 'complaints', 0, '2026-08-28 02:15 PM');
INSERT INTO app_notifications (notification_id, recipient_id, title, message, type, link_tab, is_read, timestamp) VALUES ('ntf-3', 'all', 'Festive Feast Circular', 'Check out the festive dinner announcement for upcoming festival celebrations in Annapurna Central Dining.', 'mess_update', 'mess', 1, '2026-08-28 05:00 PM');
INSERT INTO app_notifications (notification_id, recipient_id, title, message, type, link_tab, is_read, timestamp) VALUES ('ntf-4', 'wardens', 'New Leave Request Submitted', 'Priya S. Patil (Room S-201) submitted a new leave application for Academic Hackathon at COEP Pune.', 'leave_update', 'leaves', 0, '2026-08-29 08:30 AM');

-- =============================================================================
-- SAKHI GIRLS HOSTEL ANALYTICAL VIEWS (Instant Queries for MySQL Workbench)
-- =============================================================================

-- View 1: Sakhi Girls Hostel High-Level Summary
CREATE OR REPLACE VIEW v_sakhi_hostel_summary AS
SELECT 
  h.name AS hostel_name,
  h.code,
  h.gender,
  h.total_floors,
  COUNT(DISTINCT r.room_id) AS total_rooms,
  COUNT(b.bed_id) AS total_beds,
  SUM(CASE WHEN b.status = 'Occupied' THEN 1 ELSE 0 END) AS occupied_beds,
  SUM(CASE WHEN b.status = 'Available' AND r.status != 'Maintenance' THEN 1 ELSE 0 END) AS available_beds_left,
  SUM(CASE WHEN b.status = 'Reserved' OR r.status = 'Maintenance' THEN 1 ELSE 0 END) AS maintenance_beds,
  ROUND((SUM(CASE WHEN b.status = 'Occupied' THEN 1 ELSE 0 END) * 100.0 / COUNT(b.bed_id)), 1) AS occupancy_pct
FROM hostels h
LEFT JOIN rooms r ON h.hostel_id = r.hostel_id
LEFT JOIN beds b ON r.room_id = b.room_id
GROUP BY h.hostel_id, h.name, h.code, h.gender, h.total_floors;

-- View 2: Room Availability & Beds Left by Floor (1st, 2nd, 3rd, 4th Year)
CREATE OR REPLACE VIEW v_room_availability AS
SELECT 
  r.room_number,
  r.floor,
  CASE r.floor
    WHEN 1 THEN '1st Year (FE Wing)'
    WHEN 2 THEN '2nd Year (SE Wing)'
    WHEN 3 THEN '3rd Year (TE Wing)'
    WHEN 4 THEN '4th Year (BE Senior Wing)'
    ELSE 'Senior Wing'
  END AS academic_year_wing,
  r.room_type,
  r.capacity AS total_capacity,
  COUNT(CASE WHEN b.status = 'Occupied' THEN 1 END) AS occupied_beds,
  COUNT(CASE WHEN b.status = 'Available' AND r.status != 'Maintenance' THEN 1 END) AS beds_left,
  r.status AS room_status
FROM rooms r
LEFT JOIN beds b ON r.room_id = b.room_id
GROUP BY r.room_id, r.room_number, r.floor, r.room_type, r.capacity, r.status
ORDER BY r.floor, r.room_number;

-- View 3: Resident Distribution across 6 Departments (CS, IT, ENTC, ELPO, CIVIL, MECHANICAL)
CREATE OR REPLACE VIEW v_department_distribution AS
SELECT 
  department,
  COUNT(student_id) AS total_female_residents,
  SUM(CASE WHEN year LIKE '%1st%' OR year LIKE '%First%' THEN 1 ELSE 0 END) AS fe_1st_year,
  SUM(CASE WHEN year LIKE '%2nd%' OR year LIKE '%Second%' THEN 1 ELSE 0 END) AS se_2nd_year,
  SUM(CASE WHEN year LIKE '%3rd%' OR year LIKE '%Third%' THEN 1 ELSE 0 END) AS te_3rd_year,
  SUM(CASE WHEN year LIKE '%4th%' OR year LIKE '%Final%' THEN 1 ELSE 0 END) AS be_4th_year
FROM students
GROUP BY department
ORDER BY total_female_residents DESC;

-- View 4: Resident Distribution across 4 Academic Years
CREATE OR REPLACE VIEW v_year_distribution AS
SELECT 
  year AS academic_year,
  COUNT(student_id) AS total_residents,
  GROUP_CONCAT(DISTINCT room_number ORDER BY room_number SEPARATOR ', ') AS rooms_allocated
FROM students
GROUP BY year
ORDER BY year;

-- View 5: Vacant Beds Immediately Available for Allocation
CREATE OR REPLACE VIEW v_vacant_beds AS
SELECT 
  r.room_number,
  r.floor,
  b.bed_number,
  r.room_type,
  h.name AS hostel_name
FROM beds b
JOIN rooms r ON b.room_id = r.room_id
JOIN hostels h ON r.hostel_id = h.hostel_id
WHERE b.status = 'Available' AND r.status != 'Maintenance'
ORDER BY r.floor, r.room_number, b.bed_number;

-- =============================================================================
-- PERFORMANCE INDEXES (Optimized for MySQL Workbench & Production Queries)
-- =============================================================================

CREATE INDEX idx_students_dept ON students(department);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_beds_status ON beds(status);
CREATE INDEX idx_rooms_floor ON rooms(floor);
CREATE INDEX idx_leaves_status ON leave_requests(status);
CREATE INDEX idx_complaints_priority ON complaints(priority, status);
CREATE INDEX idx_fees_status ON fee_records(status);
CREATE INDEX idx_gate_type ON gate_logs(entry_type, checkpost_gate);

-- =============================================================================
-- STORED PROCEDURES (Relational Business Logic in MySQL Workbench)
-- =============================================================================

DROP PROCEDURE IF EXISTS sp_allot_bed;
DELIMITER //
CREATE PROCEDURE sp_allot_bed(
  IN p_room_id VARCHAR(32),
  IN p_bed_id VARCHAR(32),
  IN p_student_id VARCHAR(32),
  OUT p_status_msg VARCHAR(255)
)
BEGIN
  DECLARE v_bed_status VARCHAR(32);
  DECLARE v_std_name VARCHAR(128);
  DECLARE v_room_no VARCHAR(16);
  DECLARE v_hostel_id VARCHAR(32);
  DECLARE v_hostel_name VARCHAR(128);
  DECLARE v_bed_no VARCHAR(16);

  SELECT status, bed_number INTO v_bed_status, v_bed_no FROM beds WHERE bed_id = p_bed_id AND room_id = p_room_id;
  SELECT name INTO v_std_name FROM students WHERE student_id = p_student_id;
  SELECT room_number, hostel_id INTO v_room_no, v_hostel_id FROM rooms WHERE room_id = p_room_id;
  SELECT name INTO v_hostel_name FROM hostels WHERE hostel_id = v_hostel_id;

  IF v_bed_status = 'Available' THEN
    START TRANSACTION;
      UPDATE beds 
      SET status = 'Occupied', student_id = p_student_id, student_name = v_std_name 
      WHERE bed_id = p_bed_id;

      UPDATE students 
      SET room_id = p_room_id, room_number = v_room_no, bed_number = v_bed_no, hostel_id = v_hostel_id, hostel_name = v_hostel_name, status = 'Active' 
      WHERE student_id = p_student_id;

      UPDATE rooms 
      SET occupied = (SELECT COUNT(*) FROM beds WHERE room_id = p_room_id AND status = 'Occupied'),
          status = CASE WHEN (SELECT COUNT(*) FROM beds WHERE room_id = p_room_id AND status = 'Occupied') >= capacity THEN 'Full' ELSE 'Partially Occupied' END
      WHERE room_id = p_room_id;
    COMMIT;
    SET p_status_msg = CONCAT('SUCCESS: Bed ', v_bed_no, ' in Room ', v_room_no, ' allotted to ', v_std_name);
  ELSE
    SET p_status_msg = 'ERROR: Bed is not available for allotment';
  END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_vacate_bed;
DELIMITER //
CREATE PROCEDURE sp_vacate_bed(
  IN p_room_id VARCHAR(32),
  IN p_bed_id VARCHAR(32),
  OUT p_status_msg VARCHAR(255)
)
BEGIN
  DECLARE v_std_id VARCHAR(32);
  DECLARE v_bed_no VARCHAR(16);
  DECLARE v_room_no VARCHAR(16);

  SELECT student_id, bed_number INTO v_std_id, v_bed_no FROM beds WHERE bed_id = p_bed_id AND room_id = p_room_id;
  SELECT room_number INTO v_room_no FROM rooms WHERE room_id = p_room_id;

  START TRANSACTION;
    UPDATE beds 
    SET status = 'Available', student_id = NULL, student_name = NULL 
    WHERE bed_id = p_bed_id;

    IF v_std_id IS NOT NULL THEN
      UPDATE students 
      SET room_id = NULL, room_number = 'Unassigned', bed_number = 'None', status = 'Vacated' 
      WHERE student_id = v_std_id;
    END IF;

    UPDATE rooms 
    SET occupied = (SELECT COUNT(*) FROM beds WHERE room_id = p_room_id AND status = 'Occupied'),
        status = CASE WHEN (SELECT COUNT(*) FROM beds WHERE room_id = p_room_id AND status = 'Occupied') = 0 THEN 'Available' ELSE 'Partially Occupied' END
    WHERE room_id = p_room_id;
  COMMIT;
  SET p_status_msg = CONCAT('SUCCESS: Bed ', v_bed_no, ' in Room ', v_room_no, ' vacated');
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_calculate_mess_rebate;
DELIMITER //
CREATE PROCEDURE sp_calculate_mess_rebate(
  IN p_leave_id VARCHAR(32),
  OUT p_rebate_amount DECIMAL(10,2)
)
BEGIN
  DECLARE v_days INT;
  DECLARE v_rate DECIMAL(10,2) DEFAULT 85.00;

  SELECT DATEDIFF(to_date, from_date) INTO v_days 
  FROM leave_requests 
  WHERE leave_id = p_leave_id AND status = 'Approved';

  IF v_days >= 3 THEN
    SET p_rebate_amount = v_days * v_rate;
    UPDATE leave_requests 
    SET rebate_days = v_days, mess_rebate_inr = p_rebate_amount 
    WHERE leave_id = p_leave_id;
  ELSE
    SET p_rebate_amount = 0.00;
  END IF;
END //
DELIMITER ;

-- =============================================================================
-- TRIGGERS (Automated Business Rule Enforcement)
-- =============================================================================

DROP TRIGGER IF EXISTS trg_auto_rebate_on_approval;
DELIMITER //
CREATE TRIGGER trg_auto_rebate_on_approval
BEFORE UPDATE ON leave_requests
FOR EACH ROW
BEGIN
  IF NEW.status = 'Approved' AND DATEDIFF(NEW.to_date, NEW.from_date) >= 3 THEN
    SET NEW.rebate_days = DATEDIFF(NEW.to_date, NEW.from_date);
    SET NEW.mess_rebate_inr = NEW.rebate_days * 85.00;
  END IF;
END //
DELIMITER ;

-- =============================================================================
-- 10 READY-TO-RUN ANALYTICAL QUERIES FOR MYSQL WORKBENCH
-- (Execute any query directly to evaluate database state & academic insights)
-- =============================================================================

-- Query 1: Sakhi Girls Hostel Overall Occupancy & Bed Inventory
-- SELECT * FROM v_sakhi_hostel_summary;

-- Query 2: Room-by-Room Vacancy & Remaining Beds by Academic Year Wing
-- SELECT * FROM v_room_availability WHERE beds_left > 0;

-- Query 3: Resident Distribution across the 6 Engineering Branches
-- SELECT * FROM v_department_distribution;

-- Query 4: Approved Outstation Leaves Eligible for Dining Fee Rebate (>= 3 days at ₹85/day)
-- SELECT student_name, room_number, from_date, to_date, DATEDIFF(to_date, from_date) AS days_absent, 
--        (DATEDIFF(to_date, from_date) * 85.00) AS mess_rebate_credited_inr
-- FROM leave_requests 
-- WHERE status = 'Approved' AND DATEDIFF(to_date, from_date) >= 3;

-- Query 5: Unresolved Maintenance Complaints with Assigned Technicians & SLAs
-- SELECT complaint_id, room_number, category, title, priority, sla_target_hours, assigned_to, date_submitted 
-- FROM complaints 
-- WHERE status != 'Resolved' 
-- ORDER BY priority = 'Emergency' DESC, priority = 'Urgent' DESC, date_submitted ASC;

-- Query 6: Outstanding Term Fee & Mess Fee Dues Register
-- SELECT s.name, s.department, s.year, s.room_number, f.total_dues, f.paid_amount, f.pending_amount, f.due_date 
-- FROM fee_records f 
-- JOIN students s ON f.student_id = s.student_id 
-- WHERE f.status != 'Paid' 
-- ORDER BY f.pending_amount DESC;

-- Query 7: Sentry Gate Movements & Curfew Monitoring (Gate 1 Post)
-- SELECT pass_code, student_name, room_number, entry_type, movement_timestamp, verification_method, checkpost_gate 
-- FROM gate_logs 
-- ORDER BY movement_timestamp DESC 
-- LIMIT 15;

-- Query 8: Critical Annapurna Mess Food Inventory Below Minimum Re-order Stock
-- SELECT item_id, name, category, current_stock, minimum_stock, unit, vendor, status 
-- FROM mess_inventory 
-- WHERE current_stock <= minimum_stock;

-- Query 9: Average Resident Satisfaction Rating for Annapurna Mess Meals
-- SELECT meal, COUNT(*) AS total_reviews, ROUND(AVG(overall_rating), 2) AS avg_rating, 
--        ROUND(AVG(food_quality), 2) AS avg_quality, ROUND(AVG(cleanliness), 2) AS avg_hygiene 
-- FROM mess_feedback 
-- GROUP BY meal;

-- Query 10: Immediately Available Vacant Beds Ready for Allotment
-- SELECT * FROM v_vacant_beds;


