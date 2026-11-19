import fs from 'fs';
import path from 'path';
import {
  INITIAL_HOSTELS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_WARDENS,
  INITIAL_LEAVES,
  INITIAL_GATE_LOGS,
  INITIAL_COMPLAINTS,
  INITIAL_FEES,
  INITIAL_ROOM_CHANGES,
  INITIAL_WEEKLY_MENU,
  INITIAL_MEAL_ATTENDANCE,
  INITIAL_MESS_FEEDBACKS,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
} from '../src/data/mockData';

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

function generateFullSql(): string {
  let sql = `-- =============================================================================
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

`;

  // Hostels
  sql += `-- 1. Hostels\n`;
  for (const h of INITIAL_HOSTELS) {
    sql += `INSERT INTO hostels (hostel_id, name, code, gender, total_floors, total_rooms, total_capacity, warden_name, warden_phone, caretaker_contact, description) VALUES (${escapeSql(h.id)}, ${escapeSql(h.name)}, ${escapeSql(h.code)}, ${escapeSql(h.gender)}, ${h.totalFloors}, ${h.totalRooms}, ${h.totalCapacity}, ${escapeSql(h.wardenName)}, ${escapeSql(h.wardenPhone)}, ${escapeSql(h.caretakerContact)}, ${escapeSql(h.description)});\n`;
  }

  // Rooms & Beds
  sql += `\n-- 2. Rooms & 3. Beds\n`;
  for (const r of INITIAL_ROOMS) {
    sql += `INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status) VALUES (${escapeSql(r.id)}, ${escapeSql(r.hostelId)}, ${escapeSql(r.roomNumber)}, ${r.floor}, ${r.capacity}, ${r.occupied}, ${escapeSql(r.roomType)}, ${escapeSql(r.status)});\n`;
    for (const b of r.beds) {
      const bedId = (b as any).id || `${r.id}-${b.bedNumber.replace(/\s+/g, '-').toLowerCase()}`;
      sql += `INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name) VALUES (${escapeSql(bedId)}, ${escapeSql(r.id)}, ${escapeSql(b.bedNumber)}, ${escapeSql(b.status)}, ${escapeSql(b.studentId || null)}, ${escapeSql(b.studentName || null)});\n`;
    }
  }

  // Wardens
  sql += `\n-- 4. Wardens\n`;
  for (const w of INITIAL_WARDENS) {
    const wa = w as any;
    sql += `INSERT INTO wardens (warden_id, name, email, phone, role, hostel_id, hostel_name, cabin_location, office_hours, avatar) VALUES (${escapeSql(w.id)}, ${escapeSql(w.name)}, ${escapeSql(w.email)}, ${escapeSql(w.phone)}, ${escapeSql(w.role)}, ${escapeSql(wa.hostelId || null)}, ${escapeSql(wa.hostelName || null)}, ${escapeSql(wa.cabinLocation || null)}, ${escapeSql(wa.officeHours || null)}, ${escapeSql(w.avatar || null)});\n`;
  }

  // Students
  sql += `\n-- 5. Students\n`;
  for (const s of INITIAL_STUDENTS) {
    sql += `INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address) VALUES (${escapeSql(s.id)}, ${escapeSql(s.studentId)}, ${escapeSql(s.name)}, ${escapeSql(s.gender)}, ${escapeSql(s.course)}, ${escapeSql(s.department)}, ${escapeSql(s.year)}, ${escapeSql(s.division)}, ${escapeSql(s.mobile)}, ${escapeSql(s.email)}, ${escapeSql(s.parentName)}, ${escapeSql(s.parentPhone)}, ${escapeSql(s.emergencyContact || null)}, ${escapeSql(s.hostelId || null)}, ${escapeSql(s.hostelName || null)}, ${escapeSql(s.roomId || null)}, ${escapeSql(s.roomNumber || null)}, ${escapeSql(s.bedNumber || null)}, ${escapeSql(s.roomType || null)}, ${escapeSql(s.bloodGroup || 'O+')}, ${escapeSql(s.admissionDate)}, ${escapeSql(s.status)}, ${escapeSql(s.avatar || null)}, ${escapeSql(s.address || null)});\n`;
  }

  // Leave Requests
  sql += `\n-- 6. Leave Requests\n`;
  for (const l of INITIAL_LEAVES) {
    const la = l as any;
    sql += `INSERT INTO leave_requests (leave_id, student_id, student_name, room_number, hostel_name, leave_type, from_date, to_date, reason, destination, parent_contact, status, gate_pass_code, applied_date, reviewed_date, reviewed_by, warden_remarks, parent_verified) VALUES (${escapeSql(l.id)}, ${escapeSql(l.studentId)}, ${escapeSql(l.studentName)}, ${escapeSql(l.roomNumber)}, ${escapeSql(l.hostelName)}, ${escapeSql(l.leaveType)}, ${escapeSql(l.fromDate)}, ${escapeSql(l.toDate)}, ${escapeSql(l.reason)}, ${escapeSql(l.destination || null)}, ${escapeSql(l.parentContact)}, ${escapeSql(l.status)}, ${escapeSql(l.gatePassCode || null)}, ${escapeSql(l.appliedDate)}, ${escapeSql(l.reviewedDate || null)}, ${escapeSql(l.reviewedBy || null)}, ${escapeSql(l.wardenRemarks || null)}, ${la.parentVerified ? 1 : 0});\n`;
  }

  // Gate Logs
  sql += `\n-- 7. Gate Logs\n`;
  for (const g of INITIAL_GATE_LOGS) {
    sql += `INSERT INTO gate_logs (log_id, gate_pass_code, student_id, student_name, room_number, action, timestamp, guard_name, gate_name, remarks) VALUES (${escapeSql(g.id)}, ${escapeSql(g.gatePassCode)}, ${escapeSql(g.studentId)}, ${escapeSql(g.studentName)}, ${escapeSql(g.roomNumber)}, ${escapeSql(g.action)}, ${escapeSql(g.timestamp)}, ${escapeSql(g.guardName)}, ${escapeSql(g.gateName || 'Main Campus Gate 1')}, ${escapeSql(g.remarks || null)});\n`;
  }

  // Complaints
  sql += `\n-- 8. Complaints\n`;
  for (const c of INITIAL_COMPLAINTS) {
    const ca = c as any;
    sql += `INSERT INTO complaints (complaint_id, student_id, student_name, room_number, category, subject, description, priority, status, assigned_to, sla_target_hours, resolution_remarks, satisfaction_rating, date_submitted, resolved_at) VALUES (${escapeSql(c.id)}, ${escapeSql(c.studentId)}, ${escapeSql(c.studentName)}, ${escapeSql(c.roomNumber)}, ${escapeSql(c.category)}, ${escapeSql(c.subject)}, ${escapeSql(c.description)}, ${escapeSql(c.priority)}, ${escapeSql(c.status)}, ${escapeSql(c.assignedTo || null)}, ${c.slaTargetHours || 24}, ${escapeSql(c.resolutionRemarks || null)}, ${c.satisfactionRating || 'NULL'}, ${escapeSql(c.dateSubmitted)}, ${escapeSql(ca.resolvedAt || ca.resolvedDate || null)});\n`;
  }

  // Fee Records
  sql += `\n-- 9. Fee Records\n`;
  for (const f of INITIAL_FEES) {
    const fa = f as any;
    sql += `INSERT INTO fee_records (fee_id, student_id, student_name, academic_year, hostel_fee, mess_fee, maintenance_fee, total_amount, paid_amount, pending_amount, payment_status, due_date, paid_date, receipt_no, payment_mode, transaction_ref) VALUES (${escapeSql(f.id)}, ${escapeSql(f.studentId)}, ${escapeSql(f.studentName)}, ${escapeSql(f.academicYear)}, ${f.hostelFee}, ${f.messFee}, ${f.maintenanceFee}, ${f.totalAmount}, ${f.paidAmount}, ${f.pendingAmount}, ${escapeSql(f.paymentStatus)}, ${escapeSql(f.dueDate)}, ${escapeSql(fa.paidDate || null)}, ${escapeSql(fa.receiptNo || null)}, ${escapeSql(fa.paymentMode || null)}, ${escapeSql(fa.transactionRef || null)});\n`;
  }

  // Room Changes
  sql += `\n-- 10. Room Change Requests\n`;
  for (const rc of INITIAL_ROOM_CHANGES) {
    sql += `INSERT INTO room_change_requests (request_id, student_id, student_name, current_room, preferred_room_type, preferred_block, reason_category, reason, mutual_student_prn, status, applied_date, reviewed_date, remarks) VALUES (${escapeSql(rc.id)}, ${escapeSql(rc.studentId)}, ${escapeSql(rc.studentName)}, ${escapeSql(rc.currentRoom)}, ${escapeSql(rc.preferredRoomType)}, ${escapeSql(rc.preferredBlock)}, ${escapeSql(rc.reasonCategory)}, ${escapeSql(rc.reason)}, ${escapeSql(rc.mutualStudentPRN || null)}, ${escapeSql(rc.status)}, ${escapeSql(rc.appliedDate)}, ${escapeSql(rc.reviewedDate || null)}, ${escapeSql(rc.remarks || null)});\n`;
  }

  // Mess Menu
  sql += `\n-- 11. Mess Menu\n`;
  const mealTypes: ('breakfast' | 'lunch' | 'snacks' | 'dinner')[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
  for (const day of INITIAL_WEEKLY_MENU) {
    for (const mt of mealTypes) {
      const meal = (day as any)[mt];
      if (meal) {
        const menuId = `menu-${day.dayOfWeek.toLowerCase()}-${mt}`;
        const mealTitle = mt.charAt(0).toUpperCase() + mt.slice(1);
        sql += `INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert) VALUES (${escapeSql(menuId)}, ${escapeSql(day.dayOfWeek)}, ${escapeSql(mealTitle)}, ${escapeSql(meal.time)}, ${escapeSql(JSON.stringify(meal.items))}, ${meal.isVeg ? 1 : 0}, ${escapeSql(meal.calories || null)}, ${escapeSql(meal.specialDish || null)}, ${escapeSql(meal.dessert || null)});\n`;
      }
    }
  }

  // Meal Attendance
  sql += `\n-- 12. Meal Attendance\n`;
  for (const ma of INITIAL_MEAL_ATTENDANCE) {
    sql += `INSERT INTO meal_attendance (attendance_id, student_id, student_name, date, breakfast, lunch, snacks, dinner) VALUES (${escapeSql(ma.id)}, ${escapeSql(ma.studentId)}, ${escapeSql(ma.studentName)}, ${escapeSql(ma.date)}, ${ma.breakfast ? 1 : 0}, ${ma.lunch ? 1 : 0}, ${ma.snacks ? 1 : 0}, ${ma.dinner ? 1 : 0});\n`;
  }

  // Mess Feedback
  sql += `\n-- 13. Mess Feedback\n`;
  for (const fb of INITIAL_MESS_FEEDBACKS) {
    sql += `INSERT INTO mess_feedback (feedback_id, student_id, student_name, room_number, date, meal, food_quality, taste, cleanliness, quantity, service, overall_rating, comments) VALUES (${escapeSql(fb.id)}, ${escapeSql(fb.studentId)}, ${escapeSql(fb.studentName)}, ${escapeSql(fb.roomNumber || null)}, ${escapeSql(fb.date)}, ${escapeSql(fb.meal || fb.mealType || 'Meal')}, ${fb.ratings?.foodQuality || 5}, ${fb.ratings?.taste || 5}, ${fb.ratings?.cleanliness || 5}, ${fb.ratings?.quantity || 5}, ${fb.ratings?.service || 5}, ${fb.ratings?.overall || 5.0}, ${escapeSql(fb.comments || null)});\n`;
  }

  // Mess Inventory
  sql += `\n-- 14. Mess Inventory\n`;
  for (const inv of INITIAL_INVENTORY) {
    sql += `INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status) VALUES (${escapeSql(inv.id)}, ${escapeSql(inv.name)}, ${escapeSql(inv.category)}, ${inv.currentStock}, ${escapeSql(inv.unit)}, ${inv.minimumStock}, ${inv.costPerUnit}, ${escapeSql(inv.vendor)}, ${escapeSql(inv.lastRestocked)}, ${escapeSql(inv.status)});\n`;
  }

  // Mess Expenses
  sql += `\n-- 15. Mess Expenses\n`;
  for (const exp of INITIAL_EXPENSES) {
    const expA = exp as any;
    const desc = expA.title || expA.item || expA.description || 'Mess Procurement';
    const invNo = expA.invoiceNumber || expA.receiptNumber || expA.invoiceNo || 'INV-MCET';
    const vendor = exp.vendor || expA.paidTo || 'Campus Vendor';
    const payMethod = exp.paymentMethod || 'Bank Transfer';
    const approvedBy = expA.approvedBy || 'Dr. S. K. Deshmukh';
    const status = expA.status || 'Paid';
    sql += `INSERT INTO mess_expenses (expense_id, date, category, description, amount, invoice_no, vendor, payment_method, approved_by, status) VALUES (${escapeSql(exp.id)}, ${escapeSql(exp.date || expA.purchaseDate)}, ${escapeSql(exp.category)}, ${escapeSql(desc)}, ${exp.amount}, ${escapeSql(invNo)}, ${escapeSql(vendor)}, ${escapeSql(payMethod)}, ${escapeSql(approvedBy)}, ${escapeSql(status)});\n`;
  }

  // Notices
  sql += `\n-- 16. Notices\n`;
  for (const not of INITIAL_NOTICES) {
    sql += `INSERT INTO notices (notice_id, title, content, category, priority, target_audience, date, expiry_date, posted_by, is_pinned) VALUES (${escapeSql(not.id)}, ${escapeSql(not.title)}, ${escapeSql(not.content)}, ${escapeSql(not.category)}, ${escapeSql(not.priority)}, ${escapeSql(not.targetAudience)}, ${escapeSql(not.date)}, ${escapeSql(not.expiryDate || null)}, ${escapeSql(not.postedBy)}, ${not.isPinned ? 1 : 0});\n`;
  }

  // App Notifications
  sql += `\n-- 17. App Notifications\n`;
  for (const ntf of INITIAL_NOTIFICATIONS) {
    sql += `INSERT INTO app_notifications (notification_id, recipient_id, title, message, type, link_tab, is_read, timestamp) VALUES (${escapeSql(ntf.id)}, ${escapeSql(ntf.recipientId)}, ${escapeSql(ntf.title)}, ${escapeSql(ntf.message)}, ${escapeSql(ntf.type)}, ${escapeSql(ntf.linkTab || null)}, ${ntf.read ? 1 : 0}, ${escapeSql(ntf.timestamp)});\n`;
  }

  // Analytical Views for MySQL Workbench
  sql += `\n-- =============================================================================\n`;
  sql += `-- SAKHI GIRLS HOSTEL ANALYTICAL VIEWS (Instant Queries for MySQL Workbench)\n`;
  sql += `-- =============================================================================\n\n`;

  sql += `-- View 1: Sakhi Girls Hostel High-Level Summary\n`;
  sql += `CREATE OR REPLACE VIEW v_sakhi_hostel_summary AS
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
GROUP BY h.hostel_id, h.name, h.code, h.gender, h.total_floors;\n\n`;

  sql += `-- View 2: Room Availability & Beds Left by Floor (1st, 2nd, 3rd, 4th Year)\n`;
  sql += `CREATE OR REPLACE VIEW v_room_availability AS
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
ORDER BY r.floor, r.room_number;\n\n`;

  sql += `-- View 3: Resident Distribution across 6 Departments (CS, IT, ENTC, ELPO, CIVIL, MECHANICAL)\n`;
  sql += `CREATE OR REPLACE VIEW v_department_distribution AS
SELECT 
  department,
  COUNT(student_id) AS total_female_residents,
  SUM(CASE WHEN year LIKE '%1st%' OR year LIKE '%First%' THEN 1 ELSE 0 END) AS fe_1st_year,
  SUM(CASE WHEN year LIKE '%2nd%' OR year LIKE '%Second%' THEN 1 ELSE 0 END) AS se_2nd_year,
  SUM(CASE WHEN year LIKE '%3rd%' OR year LIKE '%Third%' THEN 1 ELSE 0 END) AS te_3rd_year,
  SUM(CASE WHEN year LIKE '%4th%' OR year LIKE '%Final%' THEN 1 ELSE 0 END) AS be_4th_year
FROM students
GROUP BY department
ORDER BY total_female_residents DESC;\n\n`;

  sql += `-- View 4: Resident Distribution across 4 Academic Years\n`;
  sql += `CREATE OR REPLACE VIEW v_year_distribution AS
SELECT 
  year AS academic_year,
  COUNT(student_id) AS total_residents,
  GROUP_CONCAT(DISTINCT room_number ORDER BY room_number SEPARATOR ', ') AS rooms_allocated
FROM students
GROUP BY year
ORDER BY year;\n\n`;

  sql += `-- View 5: Vacant Beds Immediately Available for Allocation\n`;
  sql += `CREATE OR REPLACE VIEW v_vacant_beds AS
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
ORDER BY r.floor, r.room_number, b.bed_number;\n\n`;

  return sql;
}

const fullSql = generateFullSql();
const outPath = path.join(process.cwd(), 'database', 'schema.sql');
fs.writeFileSync(outPath, fullSql, 'utf-8');
console.log('✓ Successfully exported complete 17-table schema.sql to:', outPath);
