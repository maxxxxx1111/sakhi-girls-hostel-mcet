import React from 'react';
import { LeaveRequest, Student } from '../../types';
import {
  X,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  MapPin,
  Clock,
  Phone,
  FileCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GatePassPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveRequest | null;
  student: Student;
}

export const GatePassPrintModal: React.FC<GatePassPrintModalProps> = ({
  isOpen,
  onClose,
  leave,
  student,
}) => {
  if (!isOpen || !leave) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculate duration in days
  const fromTime = new Date(leave.fromDate).getTime();
  const toTime = new Date(leave.toDate).getTime();
  const diffDays = Math.max(1, Math.round((toTime - fromTime) / (1000 * 60 * 60 * 24)) + 1);
  const isMessRebateEligible = diffDays >= 3;
  const messRebateAmount = isMessRebateEligible ? diffDays * 85 : 0;

  const passCode =
    leave.gatePassCode ||
    `GP-MCET-${new Date().getFullYear()}-${leave.id.slice(-4).toUpperCase() || '0882'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto"
        >
          {/* Top Control Bar (Non-printable) */}
          <div className="print:hidden bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-[#EC4899]/20 text-[#F472B6]">
                <FileCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Official Digital Gate Pass</h3>
                <p className="text-[11px] text-zinc-400">
                  Approved &amp; verified by Chief Warden Office
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="h-8 px-3.5 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Gate Pass Document Container */}
          <div id="printable-gate-pass" className="p-6 sm:p-8 space-y-6 text-zinc-900 font-body">
            {/* 1. College Official Letterhead */}
            <div className="text-center pb-4 border-b-2 border-zinc-900 space-y-1">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EC4899] text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                  M
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 uppercase">
                    Mauli College of Engineering &amp; Technology
                  </h1>
                  <p className="text-[11px] font-semibold tracking-wide text-zinc-600 uppercase">
                    Khamgaon Road, Shegaon – 444203, Maharashtra • NAAC 'A+' Accredited
                  </p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 mt-2 rounded-md bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs font-bold uppercase tracking-widest">
                Office of the Chief Warden • Campus Residence Gate Pass
              </div>
            </div>

            {/* 2. Pass Meta Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
              <div className="sm:col-span-8 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-500">PASS CODE:</span>
                  <span className="text-sm font-mono font-black text-[#DB2777] tracking-wider">
                    {passCode}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    {leave.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-base font-bold text-zinc-900">
                  {leave.leaveType} Permit • {leave.destination || 'Home Residence'}
                </h2>
                <p className="text-xs text-zinc-600">
                  Applied: {leave.appliedDate} • Review Code: MCET/HOSTEL/GP-2026
                </p>
              </div>

              {/* QR Code Container */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-white border border-zinc-300 rounded-xl shadow-2xs">
                <QrCode className="w-20 h-20 text-zinc-900" />
                <span className="text-[9px] font-mono font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                  Gate Scan Verified
                </span>
              </div>
            </div>

            {/* 3. Resident Student Details */}
            <div className="border border-zinc-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-zinc-100 px-4 py-2 border-b border-zinc-200 font-bold text-zinc-800 flex items-center justify-between">
                <span>Resident Student Information</span>
                <span className="font-mono text-zinc-600 font-normal">PRN: {student.studentId}</span>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-zinc-500 text-[11px] block">Student Name</span>
                  <span className="font-bold text-zinc-900 text-xs block mt-0.5">
                    {student.name}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Branch &amp; Year</span>
                  <span className="font-semibold text-zinc-800 text-xs block mt-0.5">
                    {student.department} • {student.year}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Hostel &amp; Allotment</span>
                  <span className="font-bold text-zinc-900 text-xs block mt-0.5">
                    Room {student.roomNumber} ({student.bedNumber})
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Student Mobile</span>
                  <span className="font-mono font-semibold text-zinc-800 text-xs block mt-0.5">
                    {student.mobile}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Travel Schedule & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Departure Date</span>
                </span>
                <p className="text-sm font-bold font-mono text-zinc-900">{leave.fromDate}</p>
                <span className="text-[10px] text-zinc-500">Allowed Exit: 06:00 AM – 09:30 PM</span>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Expected Return Date</span>
                </span>
                <p className="text-sm font-bold font-mono text-zinc-900">{leave.toDate}</p>
                <span className="text-[10px] text-zinc-500">Curfew: Strict entry by 10:00 PM</span>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EC4899]" />
                  <span>Duration &amp; Rebate</span>
                </span>
                <p className="text-sm font-bold text-zinc-900">
                  {diffDays} Day{diffDays > 1 ? 's' : ''} Leave
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {isMessRebateEligible
                    ? `✓ Mess Rebate: ₹${messRebateAmount} credited`
                    : 'Duration < 3 days (No mess rebate)'}
                </span>
              </div>
            </div>

            {/* Reason & Emergency Contact */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-zinc-800">Destination Address: </span>
                  <span className="text-zinc-700">{leave.destination || 'Home Residence'}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-800">Parent Phone: </span>
                  <span className="font-mono text-zinc-700">
                    {leave.parentContact || student.parentPhone}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-bold text-zinc-800">Declared Purpose: </span>
                <span className="text-zinc-700 italic">"{leave.reason}"</span>
              </div>
            </div>

            {/* 5. Verifications & Signatures Section */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center border-t border-zinc-200 text-xs">
              {/* Parent Consent */}
              <div className="space-y-1">
                <div className="h-14 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    SMS Verified
                  </span>
                </div>
                <p className="font-bold text-zinc-900">Parent / Guardian</p>
                <p className="text-[10px] text-zinc-500">Consent Logged via SMS OTP</p>
              </div>

              {/* Warden Signature & Digital Seal */}
              <div className="space-y-1">
                <div className="h-14 flex flex-col items-center justify-center">
                  <span className="font-serif italic font-bold text-base text-zinc-900">
                    Dr. S. K. Deshmukh
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">Chief Warden • MCET Shegaon</span>
                </div>
                <p className="font-bold text-zinc-900">Warden Approval Stamp</p>
                <p className="text-[10px] text-zinc-500">Digital Seal &amp; Authority</p>
              </div>

              {/* Main Gate Security */}
              <div className="space-y-1">
                <div className="h-14 border border-dashed border-zinc-300 rounded-lg flex items-center justify-center text-[10px] text-zinc-400">
                  [ Gate Sentry In / Out Stamp ]
                </div>
                <p className="font-bold text-zinc-900">Main Campus Security Gate</p>
                <p className="text-[10px] text-zinc-500">Physical Sentry Inspection</p>
              </div>
            </div>

            {/* Security Notice Footer */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>MCET Campus Residence Management Board</span>
              <span>Pass valid only for dates stated above</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
