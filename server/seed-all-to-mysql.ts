import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
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

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  multipleStatements: true,
};

async function seedEverything() {
  console.log('Connecting to MySQL Server on', `${dbConfig.host}:${dbConfig.port}`, 'as', dbConfig.user);
  const conn = await mysql.createConnection(dbConfig);

  console.log('Creating database mcet_hostel_db if not exists...');
  await conn.query(`
    CREATE DATABASE IF NOT EXISTS mcet_hostel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    USE mcet_hostel_db;
  `);

  console.log('Creating all 17 Relational Tables...');
  await conn.query(`
    SET FOREIGN_KEY_CHECKS = 0;

    DROP TABLE IF EXISTS app_notifications;
    DROP TABLE IF EXISTS notices;
    DROP TABLE IF EXISTS mess_expenses;
    DROP TABLE IF EXISTS mess_inventory;
    DROP TABLE IF EXISTS mess_feedback;
    DROP TABLE IF EXISTS meal_attendance;
    DROP TABLE IF EXISTS mess_menu;
    DROP TABLE IF EXISTS room_change_requests;
    DROP TABLE IF EXISTS fee_records;
    DROP TABLE IF EXISTS complaints;
    DROP TABLE IF EXISTS gate_logs;
    DROP TABLE IF EXISTS leave_requests;
    DROP TABLE IF EXISTS wardens;
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS beds;
    DROP TABLE IF EXISTS rooms;
    DROP TABLE IF EXISTS hostels;

    SET FOREIGN_KEY_CHECKS = 1;
  `);

  // 1. Hostels
  await conn.query(`
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
  `);

  // 2. Rooms
  await conn.query(`
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
  `);

  // 3. Beds
  await conn.query(`
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
  `);

  // 4. Wardens
  await conn.query(`
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
  `);

  // 5. Students
  await conn.query(`
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
  `);

  // 6. Leave Requests
  await conn.query(`
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
  `);

  // 7. Gate Logs
  await conn.query(`
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
  `);

  // 8. Complaints
  await conn.query(`
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
  `);

  // 9. Fee Records
  await conn.query(`
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
  `);

  // 10. Room Change Requests
  await conn.query(`
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
  `);

  // 11. Mess Menu (Weekly Dining Schedule)
  await conn.query(`
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
  `);

  // 12. Meal Attendance (Dining Turnstile Logs)
  await conn.query(`
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
  `);

  // 13. Mess Feedback
  await conn.query(`
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
  `);

  // 14. Mess Inventory (Kitchen Ration Ledger)
  await conn.query(`
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
  `);

  // 15. Mess Expenses (Procurement Invoices)
  await conn.query(`
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
  `);

  // 16. Notices & Circulars
  await conn.query(`
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
  `);

  // 17. App Notifications
  await conn.query(`
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
  `);

  console.log('✓ All 17 tables created successfully.');

  // ==========================================
  // INSERTING FULL DATA FROM MOCK DATA
  // ==========================================
  console.log('Populating 1. Hostels...');
  for (const h of INITIAL_HOSTELS) {
    await conn.query(
      `INSERT INTO hostels (hostel_id, name, code, gender, total_floors, total_rooms, total_capacity, warden_name, warden_phone, caretaker_contact, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [h.id, h.name, h.code, h.gender, h.totalFloors, h.totalRooms, h.totalCapacity, h.wardenName, h.wardenPhone, h.caretakerContact, h.description]
    );
  }

  console.log('Populating 2. Rooms & 3. Beds...');
  for (const r of INITIAL_ROOMS) {
    await conn.query(
      `INSERT INTO rooms (room_id, hostel_id, room_number, floor, capacity, occupied, room_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.id, r.hostelId, r.roomNumber, r.floor, r.capacity, r.occupied, r.roomType, r.status]
    );

    for (const b of r.beds) {
      const bedId = (b as any).id || `${r.id}-${b.bedNumber.replace(/\s+/g, '-').toLowerCase()}`;
      await conn.query(
        `INSERT INTO beds (bed_id, room_id, bed_number, status, student_id, student_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [bedId, r.id, b.bedNumber, b.status, b.studentId || null, b.studentName || null]
      );
    }
  }

  console.log('Populating 4. Wardens...');
  for (const w of INITIAL_WARDENS) {
    const wa = w as any;
    await conn.query(
      `INSERT INTO wardens (warden_id, name, email, phone, role, hostel_id, hostel_name, cabin_location, office_hours, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [w.id, w.name, w.email, w.phone, w.role, wa.hostelId || null, wa.hostelName || null, wa.cabinLocation || null, wa.officeHours || null, w.avatar || null]
    );
  }

  console.log('Populating 5. Students...');
  for (const s of INITIAL_STUDENTS) {
    await conn.query(
      `INSERT INTO students (student_id, prn, name, gender, course, department, year, division, mobile, email, parent_name, parent_phone, emergency_contact, hostel_id, hostel_name, room_id, room_number, bed_number, room_type, blood_group, admission_date, status, avatar, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id,
        s.studentId,
        s.name,
        s.gender,
        s.course,
        s.department,
        s.year,
        s.division,
        s.mobile,
        s.email,
        s.parentName,
        s.parentPhone,
        s.emergencyContact || null,
        s.hostelId || null,
        s.hostelName || null,
        s.roomId || null,
        s.roomNumber || null,
        s.bedNumber || null,
        s.roomType || null,
        s.bloodGroup || 'O+',
        s.admissionDate,
        s.status,
        s.avatar || null,
        s.address || null,
      ]
    );
  }

  console.log('Populating 6. Leave Requests...');
  for (const l of INITIAL_LEAVES) {
    const la = l as any;
    await conn.query(
      `INSERT INTO leave_requests (leave_id, student_id, student_name, room_number, hostel_name, leave_type, from_date, to_date, reason, destination, parent_contact, status, gate_pass_code, applied_date, reviewed_date, reviewed_by, warden_remarks, parent_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        l.id,
        l.studentId,
        l.studentName,
        l.roomNumber,
        l.hostelName,
        l.leaveType,
        l.fromDate,
        l.toDate,
        l.reason,
        l.destination || null,
        l.parentContact,
        l.status,
        l.gatePassCode || null,
        l.appliedDate,
        l.reviewedDate || null,
        l.reviewedBy || null,
        l.wardenRemarks || null,
        la.parentVerified ? 1 : 0,
      ]
    );
  }

  console.log('Populating 7. Gate Logs...');
  for (const g of INITIAL_GATE_LOGS) {
    await conn.query(
      `INSERT INTO gate_logs (log_id, gate_pass_code, student_id, student_name, room_number, action, timestamp, guard_name, gate_name, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [g.id, g.gatePassCode, g.studentId, g.studentName, g.roomNumber, g.action, g.timestamp, g.guardName, g.gateName || 'Main Campus Gate 1', g.remarks || null]
    );
  }

  console.log('Populating 8. Complaints...');
  for (const c of INITIAL_COMPLAINTS) {
    const ca = c as any;
    await conn.query(
      `INSERT INTO complaints (complaint_id, student_id, student_name, room_number, category, subject, description, priority, status, assigned_to, sla_target_hours, resolution_remarks, satisfaction_rating, date_submitted, resolved_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        c.studentId,
        c.studentName,
        c.roomNumber,
        c.category,
        c.subject,
        c.description,
        c.priority,
        c.status,
        c.assignedTo || null,
        c.slaTargetHours || 24,
        c.resolutionRemarks || null,
        c.satisfactionRating || null,
        c.dateSubmitted,
        ca.resolvedAt || ca.resolvedDate || null,
      ]
    );
  }

  console.log('Populating 9. Fee Records...');
  for (const f of INITIAL_FEES) {
    const fa = f as any;
    await conn.query(
      `INSERT INTO fee_records (fee_id, student_id, student_name, academic_year, hostel_fee, mess_fee, maintenance_fee, total_amount, paid_amount, pending_amount, payment_status, due_date, paid_date, receipt_no, payment_mode, transaction_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        f.id,
        f.studentId,
        f.studentName,
        f.academicYear,
        f.hostelFee,
        f.messFee,
        f.maintenanceFee,
        f.totalAmount,
        f.paidAmount,
        f.pendingAmount,
        f.paymentStatus,
        f.dueDate,
        fa.paidDate || null,
        fa.receiptNo || null,
        fa.paymentMode || null,
        fa.transactionRef || null,
      ]
    );
  }

  console.log('Populating 10. Room Change Requests...');
  for (const rc of INITIAL_ROOM_CHANGES) {
    await conn.query(
      `INSERT INTO room_change_requests (request_id, student_id, student_name, current_room, preferred_room_type, preferred_block, reason_category, reason, mutual_student_prn, status, applied_date, reviewed_date, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rc.id,
        rc.studentId,
        rc.studentName,
        rc.currentRoom,
        rc.preferredRoomType,
        rc.preferredBlock,
        rc.reasonCategory,
        rc.reason,
        rc.mutualStudentPRN || null,
        rc.status,
        rc.appliedDate,
        rc.reviewedDate || null,
        rc.remarks || null,
      ]
    );
  }

  console.log('Populating 11. Mess Menu...');
  const mealTypes: ('breakfast' | 'lunch' | 'snacks' | 'dinner')[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
  for (const day of INITIAL_WEEKLY_MENU) {
    for (const mt of mealTypes) {
      const meal = (day as any)[mt];
      if (meal) {
        const menuId = `menu-${day.dayOfWeek.toLowerCase()}-${mt}`;
        const mealTitle = mt.charAt(0).toUpperCase() + mt.slice(1);
        await conn.query(
          `INSERT INTO mess_menu (menu_id, day_of_week, meal_type, time_window, items_json, is_veg, calories, special_dish, dessert)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            menuId,
            day.dayOfWeek,
            mealTitle,
            meal.time,
            JSON.stringify(meal.items),
            meal.isVeg ? 1 : 0,
            meal.calories || null,
            meal.specialDish || null,
            meal.dessert || null,
          ]
        );
      }
    }
  }

  console.log('Populating 12. Meal Attendance...');
  for (const ma of INITIAL_MEAL_ATTENDANCE) {
    await conn.query(
      `INSERT INTO meal_attendance (attendance_id, student_id, student_name, date, breakfast, lunch, snacks, dinner)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ma.id, ma.studentId, ma.studentName, ma.date, ma.breakfast ? 1 : 0, ma.lunch ? 1 : 0, ma.snacks ? 1 : 0, ma.dinner ? 1 : 0]
    );
  }

  console.log('Populating 13. Mess Feedback...');
  for (const fb of INITIAL_MESS_FEEDBACKS) {
    await conn.query(
      `INSERT INTO mess_feedback (feedback_id, student_id, student_name, room_number, date, meal, food_quality, taste, cleanliness, quantity, service, overall_rating, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fb.id,
        fb.studentId,
        fb.studentName,
        fb.roomNumber || null,
        fb.date,
        fb.meal || fb.mealType || 'Meal',
        fb.ratings?.foodQuality || 5,
        fb.ratings?.taste || 5,
        fb.ratings?.cleanliness || 5,
        fb.ratings?.quantity || 5,
        fb.ratings?.service || 5,
        fb.ratings?.overall || 5.0,
        fb.comments || null,
      ]
    );
  }

  console.log('Populating 14. Mess Inventory...');
  for (const inv of INITIAL_INVENTORY) {
    await conn.query(
      `INSERT INTO mess_inventory (item_id, name, category, current_stock, unit, minimum_stock, cost_per_unit, vendor, last_restocked, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [inv.id, inv.name, inv.category, inv.currentStock, inv.unit, inv.minimumStock, inv.costPerUnit, inv.vendor, inv.lastRestocked, inv.status]
    );
  }

  console.log('Populating 15. Mess Expenses...');
  for (const exp of INITIAL_EXPENSES) {
    const expA = exp as any;
    const desc = expA.title || expA.item || expA.description || 'Mess Procurement';
    const invNo = expA.invoiceNumber || expA.receiptNumber || expA.invoiceNo || 'INV-MCET';
    const vendor = exp.vendor || expA.paidTo || 'Campus Vendor';
    const payMethod = exp.paymentMethod || 'Bank Transfer';
    const approvedBy = expA.approvedBy || 'Dr. S. K. Deshmukh';
    const status = expA.status || 'Paid';
    await conn.query(
      `INSERT INTO mess_expenses (expense_id, date, category, description, amount, invoice_no, vendor, payment_method, approved_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [exp.id, exp.date || expA.purchaseDate, exp.category, desc, exp.amount, invNo, vendor, payMethod, approvedBy, status]
    );
  }

  console.log('Populating 16. Notices...');
  for (const not of INITIAL_NOTICES) {
    await conn.query(
      `INSERT INTO notices (notice_id, title, content, category, priority, target_audience, date, expiry_date, posted_by, is_pinned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [not.id, not.title, not.content, not.category, not.priority, not.targetAudience, not.date, not.expiryDate || null, not.postedBy, not.isPinned ? 1 : 0]
    );
  }

  console.log('Populating 17. App Notifications...');
  for (const ntf of INITIAL_NOTIFICATIONS) {
    await conn.query(
      `INSERT INTO app_notifications (notification_id, recipient_id, title, message, type, link_tab, is_read, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [ntf.id, ntf.recipientId, ntf.title, ntf.message, ntf.type, ntf.linkTab || null, ntf.read ? 1 : 0, ntf.timestamp]
    );
  }

  console.log('Creating 5 Analytical Views for MySQL Workbench...');

  await conn.query(`
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
  `);

  await conn.query(`
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
  `);

  await conn.query(`
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
  `);

  await conn.query(`
    CREATE OR REPLACE VIEW v_year_distribution AS
    SELECT 
      year AS academic_year,
      COUNT(student_id) AS total_residents,
      GROUP_CONCAT(DISTINCT room_number ORDER BY room_number SEPARATOR ', ') AS rooms_allocated
    FROM students
    GROUP BY year
    ORDER BY year;
  `);

  await conn.query(`
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
  `);

  console.log('✅ ALL 17 TABLES & 5 VIEWS SUCCESSFULLY CREATED AND POPULATED IN MYSQL WORKBENCH!');
  await conn.end();
}

seedEverything().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
