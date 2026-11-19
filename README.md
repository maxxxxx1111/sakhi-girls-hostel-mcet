# 🌸 Sakhi Girls Hostel — Residential Operations & Campus ERP System
### Mauli College of Engineering and Technology (MCET), Shegaon
**Approved by AICTE New Delhi • Affiliated to Sant Gadge Baba Amravati University (SGBAU)**

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%20%2F%2026.10-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📌 Project Overview

**Sakhi Girls Hostel** is a specialized, production-ready collegiate residential management and Database Management System (DBMS) platform built exclusively for female engineering scholars at **MCET Shegaon**.

The system manages a single premier residential complex organized across **4 residential floors**, mapping residents to **all 4 undergraduate academic years** from all **6 accredited engineering departments**, providing real-time room and bed availability counters, automated dining rebates, biometric gate checkposts, maintenance ticket dispatch, and bi-directional synchronization with **MySQL Workbench**.

---

## 🏛️ Residential Architecture & Floor Mapping

The hostel is structured into 16 residential suites with a total capacity of **36 beds**:

| Residential Floor | Academic Year | Branch Allocations | Room Suite IDs | Total Capacity | Occupied Beds | **Available Beds Left** | Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Floor 1** | **1st Year (FE)** | CS, IT, ENTC, ELPO, CIVIL, MECHANICAL | `S-101`, `S-102`, `S-103`, `S-104` | 10 Beds | 6 | **4 Beds Left** | Partially Occupied |
| **Floor 2** | **2nd Year (SE)** | IT, ELPO, ENTC, MECHANICAL, CS | `S-201`, `S-202`, `S-203`, `S-204` | 10 Beds | 5 | **5 Beds Left** | Partially Occupied |
| **Floor 3** | **3rd Year (TE)** | CS, CIVIL, ELPO, ENTC | `S-301`, `S-302`, `S-303`, `S-304` | 10 Beds | 4 | **3 Available + 3 Maint.** | Partially Occupied |
| **Floor 4** | **4th Year (BE)** | MECHANICAL, IT, CS, CIVIL | `S-401`, `S-402`, `S-403`, `S-404` | 6 Beds | 4 | **2 Beds Left** | Fully Occupied / Studio |
| **TOTAL** | **All 4 Years** | **All 6 Departments** | **16 Rooms** | **36 Beds** | **19** | **14 Beds Left (+ 3 Maint.)** | **52.8% Occupied** |

---

## 🎓 6 Engineering Departments Representation

Female residents are evenly enrolled across all 6 technical disciplines:

1. **Computer Science & Engineering (`CS`)**: 4 scholars (FE: 1, SE: 1, TE: 1, BE: 1)
2. **Information Technology (`IT`)**: 3 scholars (FE: 1, SE: 1, TE: 0, BE: 1)
3. **Electronics & Telecommunication (`ENTC`)**: 3 scholars (FE: 1, SE: 1, TE: 1, BE: 0)
4. **Electrical Power Systems (`ELPO`)**: 3 scholars (FE: 1, SE: 1, TE: 1, BE: 0)
5. **Civil Engineering (`CIVIL`)**: 3 scholars (FE: 1, SE: 0, TE: 1, BE: 1)
6. **Mechanical Engineering (`MECHANICAL`)**: 3 scholars (FE: 1, SE: 1, TE: 0, BE: 1)

---

## ✨ Key System Features

### 1. 🛏️ Live Room & Bed Availability Matrix
- Visual bed grid showing exact status: `Occupied`, `Available (Vacant) • Ready to Allot`, or `Maintenance`.
- Floor-by-floor availability breakdown.
- Dynamic department tags (`CS`, `IT`, `ENTC`, `ELPO`, `CIVIL`, `MECHANICAL`) with distinct branch color coding.
- Instant room status toggling (`Available`, `Partially Occupied`, `Full`, `Maintenance`).

### 2. 🛡️ Warden Operations & Administration Desk
- **Chief Rector**: Dr. Sunita M. Gaikwad (`+91 94228 77412`)
- **Assistant Warden**: Mrs. Pratibha S. Deshmukh (`+91 98230 44102`)
- **Mess Supervisor**: Mrs. Mangala R. Chavan (`+91 98224 99120`)
- **Security Sentry**: Havaldar Shobha Jadhav (`+91 98500 33412`)
- Real-time gate pass approval with parental phone verification logs.
- Emergency maintenance dispatch with high-priority SLA tracking.
- Student admission modal with branch, floor, and bed allotment.

### 3. 👩‍🎓 Student Living Desk
- Digital ID card with verifiable QR code.
- Interactive 3D/Isometric room preview with lighting controls.
- Digital Outstation & Home Visit leave application with Gate Pass generation (`GP-SAKHI-2026-XXXX`).
- Mutual room swap and room transfer request tracker.
- Semester fee receipts and dues calculator.
- One-touch campus SOS emergency broadcast trigger.

### 4. 🍲 Annapurna Central Dining Hall
- 7-day revolving Maharashtrian & North Indian pure-vegetarian menu.
- Meal-by-meal attendance logger (Breakfast, Lunch, Snacks, Dinner).
- Automated dining rebate calculation for approved leaves $\ge$ 3 days (₹85/day credit).
- Ration pantry inventory with low-stock threshold triggers.

---

## 🗄️ Relational Database Architecture (MySQL Workbench)

The project includes a 3NF normalized schema across **17 relational tables** and **5 analytical views** inside the `mcet_hostel_db` database:

### Tables (17)
1. `hostels` — Sakhi Girls Hostel facility profile & configuration
2. `rooms` — 16 suites across Floors 1–4 with capacity and occupancy
3. `beds` — Individual bed IDs with occupant student foreign keys
4. `wardens` — Administrative staff profiles and contact directories
5. `students` — Comprehensive resident profiles, PRNs, branches, and parent contacts
6. `leave_requests` — Outstation gate pass applications, warden remarks, and parental verification
7. `gate_logs` — Biometric gate checkpost entries (Departures and Returns)
8. `complaints` — Electrical, plumbing, Wi-Fi, and cleaning maintenance tickets
9. `fee_records` — Semester tuition, hostel, and mess fee ledgers
10. `room_change_requests` — Internal room swap and preference applications
11. `mess_menu` — Weekly timetable with calorie counts and festive specialties
12. `meal_attendance` — Daily meal check-ins
13. `mess_feedback` — Resident taste, cleanliness, and portion ratings
14. `mess_inventory` — Raw rations, flours, grains, and LPG stock
15. `mess_expenses` — Procurement vouchers, supplier invoices, and payment modes
16. `notices` — College circulars, curfew reminders, and maintenance bulletins
17. `app_notifications` — Targeted broadcast notifications

### Analytical Views (5)
- `v_sakhi_hostel_summary` — High-level total rooms, capacity, occupied beds, and remaining beds.
- `v_room_availability` — Room-by-room capacity, occupied count, and beds left.
- `v_department_distribution` — Resident count across all 6 departments and 4 academic years.
- `v_year_distribution` — Resident breakdown by academic year (FE, SE, TE, BE).
- `v_vacant_beds` — Immediate list of vacant beds ready for allocation.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0+ / MySQL Server 26.10)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

### 1. Clone the Repository
```bash
git clone https://github.com/yashmanwar-11/sakhi-girls-hostel-mcet.git
cd sakhi-girls-hostel-mcet
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup MySQL Database
Configure your `.env` file (copied from `.env.example`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mcet_hostel_db
```

Seed the entire database and create all 17 tables and 5 analytical views:
```bash
npx tsx server/seed-all-to-mysql.ts
```

Alternatively, open **MySQL Workbench**, click `File ➔ Open SQL Script`, choose `database/schema.sql`, and execute with `Ctrl + Shift + Enter`.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📊 Useful Queries for MySQL Workbench

Open MySQL Workbench and run any of these queries:

```sql
-- 1. High-level hostel vacancy summary
SELECT * FROM v_sakhi_hostel_summary;

-- 2. Room vacancy and remaining beds by floor
SELECT * FROM v_room_availability;

-- 3. Resident counts across CS, IT, ENTC, ELPO, CIVIL, MECHANICAL
SELECT * FROM v_department_distribution;

-- 4. Find all currently available beds
SELECT * FROM v_vacant_beds;
```

---

## 👩‍💻 Authors & Academic Credits
- **Project**: DBMS Course Mini-Project & Collegiate ERP
- **Institution**: Mauli College of Engineering and Technology (MCET), Shegaon - 444203
- **Repository**: [https://github.com/yashmanwar-11/sakhi-girls-hostel-mcet](https://github.com/yashmanwar-11/sakhi-girls-hostel-mcet)
