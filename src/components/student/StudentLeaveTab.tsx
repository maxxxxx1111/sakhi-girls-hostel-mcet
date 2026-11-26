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
  Compass,
  FileCheck2,
  Lock,
  DoorOpen,
  MapPin,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GatePassPrintModal } from './GatePassPrintModal';

export const StudentLeaveTab: React.FC = () => {
  const { currentStudent, leaveRequests, applyLeave } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'history'>('active');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'Approved' | 'Pending' | 'Rejected'>('all');
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

  const filteredHistory = historyFilter === 'all'
    ? historyPasses
    : historyPasses.filter((p) => p.status === historyFilter);

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

  // Accrued rebate from approved leaves
  const approvedLeavesWithRebate = myLeaves.filter((l) => l.status === 'Approved');
  const totalRebateAccrued = approvedLeavesWithRebate.reduce((acc, curr) => {
    const diff = new Date(curr.toDate).getTime() - new Date(curr.fromDate).getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
    return days >= 3 ? acc + days * 85 : acc;
  }, 0);

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
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-16">
      {/* 1. Command Center Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-950/40 dark:via-purple-950/20 dark:to-zinc-950/60 border border-pink-200/60 dark:border-pink-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-500/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-pink-800/60 text-xs font-semibold text-pink-700 dark:text-pink-300 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
              <span>Sentry Gate Clearance System</span>
              <span className="w-1 h-1 rounded-full bg-pink-400" />
              <span>Curfew 10:00 PM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Gate Passes &amp; Outpass Hub
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Institutional gate clearance for academic outings, weekend home visits, and curfew permissions with automated parent SMS verification and dining rebate credits.
            </p>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-medium">
                <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                In Residence
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Night Turnstiles Lock at 22:00
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                ₹85/Day Mess Rebate for ≥ 3 Days
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSlideOverOpen(true)}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Gate Pass</span>
            </button>

            <a
              href="https://wa.me/918007991234?text=Hi%2C%20I%20want%20to%20apply%20for%20a%20gate%20pass"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Apply via WhatsApp Bot</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Three Metric KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Active Digital Pass</span>
            <QrCode className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-white">
            {activePass ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {activePass.status} Pass #{activePass.id.slice(-6).toUpperCase()}
              </span>
            ) : (
              <span className="text-zinc-500 dark:text-zinc-400">None Active</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {activePass ? `${activePass.leaveType} to ${activePass.destination || 'Home'}` : 'Clear for on-campus activities'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Semester Passes Logged</span>
            <FileCheck2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-white">
            {myLeaves.length} Passes
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {approvedLeavesWithRebate.length} approved • 0 curfew infractions
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Dining Rebates Accrued</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{totalRebateAccrued > 0 ? totalRebateAccrued : 255}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Auto-credited towards next semester mess bill
          </p>
        </div>
      </section>

      {/* 3. Sub Navigation Tabs: Active vs History */}
      <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#332A3B] pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('active')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'active'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Active Digital Pass</span>
            {activePass && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'history'
                ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Pass History ({historyPasses.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE DIGITAL PASS */}
      {activeSubTab === 'active' && (
        <section className="space-y-6">
          {activePass ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Security Pass Visual Card */}
              <div className="lg:col-span-7 bg-white dark:bg-[#1B1720] border-2 border-pink-300 dark:border-pink-800/60 rounded-3xl p-6 sm:p-7 space-y-6 shadow-md shadow-pink-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Pass Brand */}
                <div className="flex items-start justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold block">
                      OFFICIAL SAKHI GATE CLEARANCE PASS
                    </span>
                    <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                      {activePass.leaveType}
                    </h2>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      PASS ID: #{activePass.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                      activePass.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activePass.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {activePass.status}
                  </span>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-pink-50/50 dark:bg-[#151218] border border-pink-100 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Departure Window</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5 block font-mono">
                      {activePass.fromDate}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-pink-50/50 dark:bg-[#151218] border border-pink-100 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Expected Return Curfew</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5 block font-mono">
                      {activePass.toDate} • 22:00
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Destination</span>
                    <span className="font-semibold text-zinc-900 dark:text-white mt-0.5 block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-pink-500" />
                      {activePass.destination || 'Home Residence'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Parent Contact</span>
                    <span className="font-mono text-zinc-900 dark:text-white mt-0.5 block flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      {activePass.parentContact || currentStudent.parentPhone}
                    </span>
                  </div>
                </div>

                {/* Reason description */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#151218] border border-zinc-200/80 dark:border-zinc-800 text-xs">
                  <span className="text-zinc-400 text-[11px] block">Purpose / Reason Logged:</span>
                  <p className="text-zinc-800 dark:text-zinc-200 font-medium mt-0.5">
                    "{activePass.reason}"
                  </p>
                </div>

                {/* QR Code Presentation Box & Print Trigger */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-[#261E2E] dark:to-[#1B1720] border border-pink-200 dark:border-pink-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                      Main Gate Security Clearance
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      Scan this cryptographic pass at the turnstile scanner when departing and returning.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenPrintModal(activePass)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-zinc-700 border border-pink-200 dark:border-zinc-700 text-xs font-bold text-zinc-900 dark:text-white shadow-2xs transition-all cursor-pointer hover:scale-[1.02]"
                      >
                        <Printer className="w-4 h-4 text-pink-500" />
                        <span>Print Official Gate Permit</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center border-2 border-pink-300 shadow-sm">
                    <QrCode className="w-16 h-16 text-black" />
                  </div>
                </div>
              </div>

              {/* Right: Approval Pipeline Stepper */}
              <div className="lg:col-span-5 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-3">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      Clearance Pipeline
                    </h3>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      Multi-Tier Security
                    </span>
                  </div>

                  <div className="space-y-4 text-xs pt-1">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">1. Outpass Request Submitted</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          Logged by {currentStudent.name} (PRN #{currentStudent.prn || '2024CS109'})
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          2. Parent SMS Dispatch Verified
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          Automated SMS transmitted to {activePass.parentContact || currentStudent.parentPhone}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                          activePass.status === 'Approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {activePass.status === 'Approved' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {activePass.status === 'Approved'
                            ? '3. Warden Rector Desk Authorization'
                            : '3. Warden Review in Progress'}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          {activePass.status === 'Approved'
                            ? 'Digitally signed by Chief Warden Mrs. Deshmukh'
                            : 'Pending sign-off at Main Administrative Office'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          4. Biometric Turnstile Scanner
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          Present QR pass upon physical departure and gate re-entry
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#151218] border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    Late Return Protocol
                  </span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    If delayed due to transit or academic emergency, immediately alert Warden hotline (+91 7265 252 344) or message via the WhatsApp bot.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-pink-50 dark:bg-[#261E2E] border border-pink-200 dark:border-pink-800/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  No Active Gate Pass
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  You are presently logged as safe and inside Sakhi Girls Hostel. If you need to depart for weekend leave, college projects, or town errands, submit an application.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSlideOverOpen(true)}
                className="h-10 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(236,72,153,0.3)] transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Gate Pass</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PASS HISTORY */}
      {activeSubTab === 'history' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(['all', 'Approved', 'Pending', 'Rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setHistoryFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    historyFilter === filter
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Showing {filteredHistory.length} recorded passes
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-10 text-center text-xs text-zinc-500 dark:text-zinc-400 shadow-sm">
              No outpasses matching current filter.
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl divide-y divide-[#F3E8EF] dark:divide-[#2C2436] overflow-hidden shadow-sm">
              {filteredHistory.map((pass) => (
                <div
                  key={pass.id}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 text-xs hover:bg-pink-50/30 dark:hover:bg-[#261E2E]/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        {pass.leaveType}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                        • {pass.destination || 'Home Residence'}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        (#{pass.id.slice(-6).toUpperCase()})
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300">{pass.reason}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-2">
                      <span>{pass.fromDate} → {pass.toDate}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• Mess Rebate Eligible</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        pass.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                          : pass.status === 'Rejected'
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                      }`}
                    >
                      {pass.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenPrintModal(pass)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#120F14] hover:bg-pink-50 dark:hover:bg-zinc-800 border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      title="Print Official Pass"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Pass</span>
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
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Request Gate Outpass
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Digital permission permit with automated dining rebate calculation
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      Pass Application Dispatched!
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Notification forwarded to Chief Warden Desk. SMS confirmation transmitted to registered parent phone.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Pass Type */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Outpass Category
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                        className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                      >
                        <option value="Home Visit">Home Visit (Weekend / Festival)</option>
                        <option value="Local Outing">Local Outing (Shegaon Town)</option>
                        <option value="Academic Project">Academic Project / Library / Lab</option>
                        <option value="Medical Emergency">Medical Consultation</option>
                        <option value="Night Stay">Approved Night Stay</option>
                      </select>
                    </div>

                    {/* From & To Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
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
                          className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                          Expected Return Date
                        </label>
                        <input
                          type="date"
                          required
                          value={toDate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                            setDateError(null);
                          }}
                          className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
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
                        className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
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
                          <p className="text-[11px] opacity-90 mt-0.5">
                            {isFormRebateEligible
                              ? `Mess Rebate Active: ₹85 × ${formDurationDays} days = ₹${formRebateAmount} will be auto-credited to your account.`
                              : 'Rebate Info: Leaves lasting 3 or more consecutive days qualify for automatic ₹85/day dining deduction.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Destination */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Destination
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pune, Akola, Home Residence"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-pink-500"
                      />
                    </div>

                    {/* Parent Contact Number */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Parent / Guardian Emergency Phone
                      </label>
                      <input
                        type="tel"
                        value={parentContact}
                        onChange={(e) => setParentContact(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500 font-mono"
                      />
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Detailed Reason / Purpose
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="State reason for campus departure..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-pink-500 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.01]"
                      >
                        <span>Submit Gate Pass Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-4 border-t border-[#F3E8EF] dark:border-[#2C2436]">
                Automated SMS dispatch occurs instantly to the registered guardian contact upon approval.
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
