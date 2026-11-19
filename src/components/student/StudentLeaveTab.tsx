import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveType, LeaveRequest } from '../../types';
import {
  QrCode,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  X,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Check,
  AlertCircle,
  Printer,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GatePassPrintModal } from './GatePassPrintModal';

export const StudentLeaveTab: React.FC = () => {
  const { currentStudent, leaveRequests, applyLeave } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'history'>('active');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType>('Home Visit');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [parentContact, setParentContact] = useState(currentStudent?.parentPhone || '');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Print modal state
  const [selectedPrintLeave, setSelectedPrintLeave] = useState<LeaveRequest | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (!currentStudent) return null;

  const myLeaves = leaveRequests.filter((l) => l.studentId === currentStudent.id);
  const activePass = myLeaves.find(
    (l) => l.status === 'Approved' || l.status === 'Pending'
  );
  const historyPasses = myLeaves.filter((l) => l.id !== activePass?.id);

  // Calculate duration in days for form
  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;
    const diff = new Date(toDate).getTime() - new Date(fromDate).getTime();
    if (diff < 0) return -1;
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const formDurationDays = calculateDays();
  const isFormRebateEligible = formDurationDays >= 3;
  const formRebateAmount = isFormRebateEligible ? formDurationDays * 85 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim()) return;

    if (new Date(toDate).getTime() < new Date(fromDate).getTime()) {
      setDateError('Return date cannot be earlier than departure date.');
      return;
    }
    setDateError(null);

    applyLeave({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: currentStudent.roomNumber,
      hostelName: currentStudent.hostelName,
      leaveType,
      fromDate,
      toDate,
      reason,
      parentContact: parentContact || currentStudent.parentPhone,
      destination: destination || 'Home Residence',
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsSlideOverOpen(false);
      setReason('');
      setDestination('');
      setActiveSubTab('active');
    }, 1200);
  };

  const handleOpenPrintModal = (pass: LeaveRequest) => {
    setSelectedPrintLeave(pass);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header with single primary action */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
            Gate Passes &amp; Outpasses
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
            Digital permission passes for campus departure, home visits, and curfew clearance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSlideOverOpen(true)}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for gate pass</span>
        </button>
      </section>

      {/* Secondary Navigation (Active Pass vs Pass History) */}
      <div className="flex items-center gap-1 border-b border-[#F3E8EF] dark:border-[#332A3B] pb-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'active'
              ? 'border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6]'
              : 'border-transparent text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
          }`}
        >
          Active Digital Pass
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'history'
              ? 'border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6]'
              : 'border-transparent text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
          }`}
        >
          Pass History ({historyPasses.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE DIGITAL PASS */}
      {activeSubTab === 'active' && (
        <section className="space-y-6">
          {activePass ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Digital Pass Card */}
              <div className="lg:col-span-7 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
                <div className="flex items-start justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#A79CB0]">
                      OUTPASS #{activePass.id.slice(-6).toUpperCase()}
                    </span>
                    <h2 className="text-xl font-bold text-[#1F2937] dark:text-white mt-0.5">
                      {activePass.leaveType}
                    </h2>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      activePass.status === 'Approved'
                        ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/15 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/30'
                        : 'bg-[#FEF3C7] dark:bg-[#F6B657]/15 text-[#B45309] dark:text-[#F6B657] border border-[#FDE68A] dark:border-[#F6B657]/30'
                    }`}
                  >
                    {activePass.status}
                  </span>
                </div>

                {/* Dates & Destination */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A79CB0] block">Departure Date</span>
                    <span className="text-sm font-semibold text-[#1F2937] dark:text-white mt-0.5 block font-mono">
                      {activePass.fromDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A79CB0] block">Expected Return</span>
                    <span className="text-sm font-semibold text-[#1F2937] dark:text-white mt-0.5 block font-mono">
                      {activePass.toDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A79CB0] block">Destination</span>
                    <span className="font-semibold text-[#1F2937] dark:text-white mt-0.5 block">
                      {activePass.destination || 'Home Residence'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] dark:text-[#A79CB0] block">Reason</span>
                    <span className="text-[#1F2937] dark:text-white mt-0.5 block truncate">
                      {activePass.reason}
                    </span>
                  </div>
                </div>

                {/* Digital QR Scan Code & Print Action */}
                <div className="p-4 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-[#1F2937] dark:text-white block">
                      Security Gate Clearance
                    </span>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
                      Present this verified QR code at the Main Gate on exit &amp; return.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPrintModal(activePass)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1B1720] hover:bg-[#FCE7F3] dark:hover:bg-[#261E2E] border border-[#F3E8EF] dark:border-[#332A3B] text-xs font-semibold text-[#1F2937] dark:text-white shadow-2xs transition-all cursor-pointer hover:scale-[1.02]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
                        <span>Print / Download Permit</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center border border-[#F3E8EF] shadow-2xs">
                    <QrCode className="w-14 h-14 text-black" />
                  </div>
                </div>
              </div>

              {/* Approval Timeline */}
              <div className="lg:col-span-5 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">Approval Timeline</h3>

                <div className="space-y-4 text-xs pt-2">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#DCFCE7] dark:bg-[#2DD4A8]/20 text-[#15803D] dark:text-[#2DD4A8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">Pass Request Submitted</p>
                      <p className="text-[#6B7280] dark:text-[#A79CB0] text-[11px]">
                        Logged by {currentStudent.name}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#DCFCE7] dark:bg-[#2DD4A8]/20 text-[#15803D] dark:text-[#2DD4A8] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">
                        Parent SMS Notification Sent
                      </p>
                      <p className="text-[#6B7280] dark:text-[#A79CB0] text-[11px]">
                        To: {activePass.parentContact || currentStudent.parentPhone}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        activePass.status === 'Approved'
                          ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/20 text-[#15803D] dark:text-[#2DD4A8]'
                          : 'bg-[#FEF3C7] dark:bg-[#F6B657]/20 text-[#B45309] dark:text-[#F6B657]'
                      }`}
                    >
                      {activePass.status === 'Approved' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">
                        {activePass.status === 'Approved'
                          ? 'Warden Approval Verified'
                          : 'Warden Review in Progress'}
                      </p>
                      <p className="text-[#6B7280] dark:text-[#A79CB0] text-[11px]">
                        {activePass.status === 'Approved'
                          ? 'Signed by Warden Deshmukh / Joshi'
                          : 'Estimated review within 2 hours'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F3F4F6] dark:bg-[#120F14] border border-[#E5E7EB] dark:border-[#332A3B] text-[#9CA3AF] dark:text-[#6B7280] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#9CA3AF] dark:text-[#6B7280]">
                        Gate Scanner Check
                      </p>
                      <p className="text-[#9CA3AF] dark:text-[#6B7280] text-[11px]">
                        Security desk logs departure &amp; entry
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-10 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5F8] dark:bg-[#261E2E] border border-[#FBCFE8] dark:border-[#38283B] text-[#EC4899] dark:text-[#F472B6] flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                  No Active Gate Pass
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                  You are registered as present on campus. If you are planning a weekend home visit or
                  outing, submit a gate pass request below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSlideOverOpen(true)}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for gate pass</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PASS HISTORY */}
      {activeSubTab === 'history' && (
        <section className="space-y-4">
          {historyPasses.length === 0 ? (
            <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-8 text-center text-xs text-[#6B7280] dark:text-[#A79CB0] shadow-sm">
              No past outpasses on record.
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl divide-y divide-[#F3E8EF] dark:divide-[#2C2436] overflow-hidden shadow-sm">
              {historyPasses.map((pass) => (
                <div
                  key={pass.id}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 text-xs hover:bg-[#FFF5F8]/40 dark:hover:bg-[#261E2E]/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1F2937] dark:text-white">
                        {pass.leaveType}
                      </span>
                      <span className="text-[#6B7280] dark:text-[#A79CB0] font-mono">
                        • {pass.destination || 'Home Residence'}
                      </span>
                    </div>
                    <p className="text-[#6B7280] dark:text-[#D1C5D8]">{pass.reason}</p>
                    <p className="text-[11px] text-[#9CA3AF] dark:text-[#A79CB0] font-mono">
                      {pass.fromDate} → {pass.toDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        pass.status === 'Approved'
                          ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/20'
                          : pass.status === 'Rejected'
                          ? 'bg-[#FEE2E2] dark:bg-[#EF4444]/10 text-[#B91C1C] dark:text-[#EF4444] border border-[#FECACA] dark:border-[#EF4444]/20'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {pass.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenPrintModal(pass)}
                      className="p-2 rounded-xl bg-white dark:bg-[#120F14] hover:bg-[#FFF5F8] dark:hover:bg-[#201B26] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#EC4899] dark:hover:text-[#F472B6] transition-colors cursor-pointer"
                      title="Print Official Pass"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* FOCUSED SLIDE-OVER REQUEST FORM */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
            onClick={() => setIsSlideOverOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-[#1B1720] border-l border-[#F3E8EF] dark:border-[#332A3B] h-full flex flex-col justify-between p-6 sm:p-8 overflow-y-auto shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#F3E8EF] dark:border-[#2C2436]">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
                      Request Gate Pass
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                      Digital leave and outpass application with automated mess rebate
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="w-8 h-8 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] hover:bg-[#FCE7F3] dark:hover:bg-[#261E2E] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#15803D] dark:text-[#2DD4A8] mx-auto" />
                    <h4 className="text-sm font-bold text-[#15803D] dark:text-[#2DD4A8]">
                      Outpass Submitted!
                    </h4>
                    <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                      Your request has been forwarded to the warden for review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Pass Type */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Pass Type
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                      >
                        <option value="Home Visit">Home Visit</option>
                        <option value="Local Outing">Local Outing</option>
                        <option value="Medical Emergency">Medical Emergency</option>
                        <option value="Academic Project">Academic Project</option>
                        <option value="Night Stay">Night Stay</option>
                      </select>
                    </div>

                    {/* From & To Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                          Departure Date
                        </label>
                        <input
                          type="date"
                          required
                          value={fromDate}
                          onChange={(e) => {
                            setFromDate(e.target.value);
                            setDateError(null);
                          }}
                          className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                          Return Date
                        </label>
                        <input
                          type="date"
                          required
                          value={toDate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                            setDateError(null);
                          }}
                          className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                        />
                      </div>
                    </div>

                    {dateError && (
                      <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{dateError}</span>
                      </div>
                    )}

                    {/* Dynamic Mess Rebate Calculation Card */}
                    {formDurationDays > 0 && (
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                          isFormRebateEligible
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <div className="flex-1">
                          <span className="font-bold">
                            Duration: {formDurationDays} Day{formDurationDays > 1 ? 's' : ''}
                          </span>
                          <p className="text-[11px] opacity-90">
                            {isFormRebateEligible
                              ? `Eligible for Mess Rebate: ₹85 × ${formDurationDays} days = ₹${formRebateAmount} auto-credit.`
                              : 'Note: Mess rebate applies automatically for leaves of 3 or more consecutive days.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Destination */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Destination
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pune, Home Residence"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                      />
                    </div>

                    {/* Parent Contact Number */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Parent Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={parentContact}
                        onChange={(e) => setParentContact(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                      />
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Purpose / Reason
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Briefly state the reason for campus departure..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6] resize-none"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full h-10 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)]"
                      >
                        <span>Submit Gate Pass Application</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] pt-4 border-t border-[#F3E8EF] dark:border-[#2C2436]">
                SMS notification will be automatically sent to the registered parent contact upon approval.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Printable Gate Pass Modal */}
      <GatePassPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        leave={selectedPrintLeave}
        student={currentStudent}
      />
    </div>
  );
};
