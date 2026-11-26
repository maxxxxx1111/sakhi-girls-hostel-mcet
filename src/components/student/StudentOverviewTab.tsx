import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Wrench,
  Utensils,
  Megaphone,
  CheckCircle2,
  Users,
  Wifi,
  ChevronRight,
  ArrowRight,
  Clock,
  History,
  AlertCircle,
  FileText,
  Shield,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  Sun,
  Moon,
  Coffee,
  GraduationCap,
  Flame,
  BedDouble,
  AlertTriangle,
  ExternalLink,
  Activity,
  HeartPulse,
  Eye,
  Check,
  Calendar,
  Lock,
} from 'lucide-react';
import { TodayTimelineSection } from './TodayTimelineSection';
import { IsometricRoomVisual } from './IsometricRoomVisual';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';
import { motion, AnimatePresence } from 'motion/react';

export const StudentOverviewTab: React.FC = () => {
  const {
    currentStudent,
    rooms,
    hostels,
    leaveRequests,
    complaints,
    weeklyMenu,
    fees,
    notices,
    setActiveTab,
    setIsOfflinePassModalOpen,
    setIsSOSModalOpen,
  } = useApp();

  const [is3DVisualOpen, setIs3DVisualOpen] = useState(false);
  const [mealAttendanceStatus, setMealAttendanceStatus] = useState<'attending' | 'skipping'>('attending');

  const { ref: attentionRef, isRevealed: isAttentionRevealed } = useIntersectionReveal({ threshold: 0.05 });
  const { ref: metricsRef, isRevealed: isMetricsRevealed } = useIntersectionReveal({ threshold: 0.05, delayMs: 30 });
  const { ref: modulesRef, isRevealed: isModulesRevealed } = useIntersectionReveal({ threshold: 0.05, delayMs: 60 });

  if (!currentStudent) return null;

  const currentHostel = hostels.find((h) => h.id === currentStudent.hostelId);

  // Time & Greeting calculation
  const now = new Date();
  const currentHour = now.getHours();

  let greeting = 'Good evening';
  let GreetingIcon = Moon;
  if (currentHour < 12) {
    greeting = 'Good morning';
    GreetingIcon = Sun;
  } else if (currentHour < 17) {
    greeting = 'Good afternoon';
    GreetingIcon = Coffee;
  }

  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Curfew Calculation
  const curfewHour = 22; // 10:00 PM
  const curfewMinutes = curfewHour * 60;
  const currentTotalMinutes = currentHour * 60 + now.getMinutes();
  const minutesToCurfew = curfewMinutes - currentTotalMinutes;
  
  let curfewLabel = '10:00 PM Tonight';
  let curfewRemainingText = '';
  if (minutesToCurfew > 0) {
    const hrs = Math.floor(minutesToCurfew / 60);
    const mins = minutesToCurfew % 60;
    curfewRemainingText = `${hrs}h ${mins}m remaining`;
  } else {
    curfewRemainingText = 'Night curfew active (Gates locked)';
  }

  // Active student requests
  const pendingComplaint = complaints.find(
    (c) => c.studentId === currentStudent.id && c.status !== 'Resolved'
  );

  const pendingLeave = leaveRequests.find(
    (l) => l.studentId === currentStudent.id && l.status === 'Pending'
  );

  const approvedLeave = leaveRequests.find(
    (l) => l.studentId === currentStudent.id && l.status === 'Approved'
  );

  const myFee = fees.find((f) => f.studentId === currentStudent.id);
  const pendingFeeAmount = myFee?.pendingAmount ?? 0;
  const isFeePending = pendingFeeAmount > 0;

  // Meal determination
  let nextMealName = 'Dinner';
  let nextMealTime = '07:45 PM – 09:45 PM';
  let nextMealMenu = 'Paneer Butter Masala, Tawa Roti, Dal Tadka, Steamed Rice & Kheer';

  if (currentHour < 10) {
    nextMealName = 'Breakfast';
    nextMealTime = '07:30 AM – 09:15 AM';
    nextMealMenu = 'Poha, Boiled Eggs / Sprouted Moong, Banana & Masala Chai';
  } else if (currentHour < 15) {
    nextMealName = 'Lunch';
    nextMealTime = '12:30 PM – 02:30 PM';
    nextMealMenu = 'Rajma Masala, Jeera Rice, Chapati, Boondi Raita & Fresh Salad';
  } else if (currentHour < 18) {
    nextMealName = 'Evening Snacks';
    nextMealTime = '05:00 PM – 06:15 PM';
    nextMealMenu = 'Vegetable Cutlet, Mint Chutney & Hot Masala Tea';
  }

  const recentNotices = notices.slice(0, 3);

  const recentHistory = [
    {
      id: 'h-1',
      title: 'Biometric Gate Check-in',
      desc: 'North Security Turnstile verified entry recorded',
      time: 'Yesterday, 09:18 PM',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'h-2',
      title: 'WhatsApp Gate Pass Sync',
      desc: 'Session logged via Cloud Bot (GP-WA-2026-5203)',
      time: 'Today, 10:15 AM',
      icon: QrCode,
      color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
    },
    {
      id: 'h-3',
      title: 'Annapurna Dining Hall Swipe',
      desc: 'Breakfast attendance confirmed automatically',
      time: 'Today, 08:30 AM',
      icon: Utensils,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    },
    {
      id: 'h-4',
      title: 'Semester Fee Clearance',
      desc: 'Receipt #RC-2026-918 verified with zero dues',
      time: 'Aug 05, 11:30 AM',
      icon: FileText,
      color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
    },
  ];

  return (
    <div className="space-y-6 font-body text-[#1F2937] dark:text-[#FDF2F8] transition-colors duration-200">
      
      {/* =========================================================================
          1. ULTRA-PREMIUM RESIDENT HERO BANNER
      ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#FFF9FB] to-[#FFF1F6] dark:from-[#18141F] dark:via-[#1E1727] dark:to-[#16121C] border border-pink-200/80 dark:border-pink-900/40 shadow-[0_12px_40px_rgba(236,72,153,0.08)]">
        {/* Ambient Decorative Glow Circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/15 via-rose-400/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Scholar Profile & Badges */}
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* In Residence Status Pill with Live Pulse */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                In Residence • Sentry Verified
              </span>

              {/* Department Tag */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-xs font-semibold font-mono shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-pink-500" />
                {currentStudent.department} • {currentStudent.year || '1st Year FE'}
              </span>

              {/* PRN Badge */}
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-black/30 border border-pink-100 dark:border-pink-900 text-zinc-500 dark:text-zinc-400">
                PRN: {currentStudent.prn || '2026-CS-041'}
              </span>
            </div>

            {/* Display Heading */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <GreetingIcon className="w-6 h-6 text-pink-500 animate-pulse" />
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {greeting}, {currentStudent.name.split(' ')[0]}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-pink-600 dark:text-pink-400">
                  Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
                </span>
                <span>•</span>
                <span>{currentHostel?.name || currentStudent.hostelName}</span>
                <span>•</span>
                <span className="text-zinc-400 dark:text-zinc-500">{formattedDate}</span>
              </p>
            </div>

            {/* Campus Security & Weather Telemetry strip */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>MCET Shegaon Campus</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Biometric Turnstiles Armed</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Curfew: {curfewRemainingText}</span>
              </span>
            </div>
          </div>

          {/* Right: Premium Action Button Cluster */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* Primary Action: Digital Gate Pass */}
            <button
              type="button"
              onClick={() => setIsOfflinePassModalOpen(true)}
              className="group relative h-12 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer shadow-[0_8px_24px_rgba(236,72,153,0.35)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-left">
                <span className="block font-bold leading-tight">Digital QR Pass</span>
                <span className="block text-[10px] text-pink-100 font-normal">Gate Checkout &amp; Entry</span>
              </div>
            </button>

            {/* Secondary Action: Apply / View Outpass */}
            <button
              type="button"
              onClick={() => setActiveTab('leave')}
              className="h-12 px-4 rounded-2xl bg-white dark:bg-[#1E1926] border border-pink-200 dark:border-pink-900/60 hover:bg-pink-50/60 dark:hover:bg-[#2A2033] text-pink-600 dark:text-pink-300 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{approvedLeave ? 'View Outpass' : 'Apply Outpass'}</span>
              <ArrowRight className="w-4 h-4 text-pink-500" />
            </button>

            {/* Emergency SOS Quick Button */}
            <button
              type="button"
              onClick={() => setIsSOSModalOpen(true)}
              className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 flex items-center justify-center cursor-pointer shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
              title="Campus Emergency SOS Desk"
            >
              <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-pulse" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EXECUTIVE 4-CARD STATS & METRICS MATRIX RIBBON
      ========================================================================= */}
      <section
        ref={metricsRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${
          isMetricsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {/* Metric 1: Sanctuary Suite */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-pink-300 dark:hover:border-pink-800 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => setIs3DVisualOpen(true)}
              className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>3D Room</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Sanctuary Suite
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
              Room {currentStudent.roomNumber} • {currentStudent.bedNumber}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              Floor 1 • {currentStudent.roomType || 'Triple Sharing Suite'} • Roommate: Neha R.
            </p>
          </div>
        </div>

        {/* Metric 2: Curfew & Security Sentry */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
              Curfew 10:00 PM
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Gate Curfew Window
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
              {curfewRemainingText}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              Havaldar Shobha Jadhav • Turnstile 1
            </p>
          </div>
        </div>

        {/* Metric 3: Annapurna Mess & Nutrition */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
              Next: {nextMealName}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Annapurna Dining
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
              {nextMealTime.split('–')[0].trim()}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              {nextMealMenu.split(',')[0]} &amp; more
            </p>
          </div>
        </div>

        {/* Metric 4: Campus Account & Financials */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-violet-300 dark:hover:border-violet-800 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              No Dues Pending
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Living Clearance
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
              100% Cleared
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
              Rebate Credit Eligible (Leaves ≥ 3d)
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HIGH-PRIORITY ACTION & ATTENTION HUB (MULTI-STEPPER GATE PASS)
      ========================================================================= */}
      {pendingLeave && (
        <section
          ref={attentionRef}
          className={`transition-all duration-300 ${
            isAttentionRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/[0.07] via-amber-500/[0.04] to-transparent bg-white dark:bg-[#18141F] border-2 border-amber-400/80 dark:border-amber-500/60 shadow-[0_8px_30px_rgba(245,158,11,0.12)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    Leave Approval In Progress
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Code: {pendingLeave.gatePassCode || 'GP-WA-2026-5203'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  {pendingLeave.leaveType} to {pendingLeave.destination || 'Shegaon Town'}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Application submitted on {pendingLeave.appliedDate}. Scheduled departure: {pendingLeave.departureTime || 'Today'} • Expected return: {pendingLeave.expectedReturnTime || '10:00 PM'}.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('leave')}
                  className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <span>Review Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual 4-Step Gate Pass Pipeline Stepper */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-3 uppercase tracking-wider">
                Multi-Stage Security &amp; Approval Pipeline:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {/* Step 1: Applied */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-800 dark:text-emerald-200 block">1. Applied</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Via WhatsApp Bot</span>
                  </div>
                </div>

                {/* Step 2: Parent Verification */}
                <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs animate-pulse">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">2. Parent Check</span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">Telephonic verification</span>
                  </div>
                </div>

                {/* Step 3: Rector Approval */}
                <div className="p-3 rounded-xl bg-white/60 dark:bg-[#1D1726] border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5 opacity-75">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">3. Rector Desk</span>
                    <span className="text-[10px] text-zinc-500">Dr. Sunita Gaikwad</span>
                  </div>
                </div>

                {/* Step 4: Digital Pass */}
                <div className="p-3 rounded-xl bg-white/60 dark:bg-[#1D1726] border border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5 opacity-75">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 flex items-center justify-center shrink-0 text-xs">
                    4
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">4. QR Outpass</span>
                    <span className="text-[10px] text-zinc-500">Ready for sentry exit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* When Leave is Approved */}
      {approvedLeave && (
        <section className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/[0.08] via-emerald-500/[0.04] to-transparent bg-white dark:bg-[#18141F] border-2 border-emerald-400/80 dark:border-emerald-500/60 shadow-[0_8px_30px_rgba(16,185,129,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-300">
                ✓ Authorized Outpass Ready
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Code: {approvedLeave.gatePassCode || 'GP-492'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {approvedLeave.leaveType} to {approvedLeave.destination}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Approved through {approvedLeave.toDate}. Present digital QR pass at security post upon exit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOfflinePassModalOpen(true)}
            className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Show QR Outpass</span>
          </button>
        </section>
      )}

      {/* =========================================================================
          4. INTERACTIVE 3D ISOMETRIC ROOM PREVIEW MODAL / DRAWER
      ========================================================================= */}
      <AnimatePresence>
        {is3DVisualOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-3xl bg-white dark:bg-[#18141F] border border-pink-200 dark:border-[#2C2436] shadow-[0_8px_32px_rgba(236,72,153,0.08)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <span>3D Interactive Room Sanctuary • Room {currentStudent.roomNumber}</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Tilt mouse or tap lights to toggle room ambient study lighting
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIs3DVisualOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-pink-200 dark:border-pink-900 text-xs font-semibold text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/40 cursor-pointer"
                >
                  Close 3D View
                </button>
              </div>

              <div className="max-w-md mx-auto">
                <IsometricRoomVisual
                  roomNumber={currentStudent.roomNumber}
                  bedNumber={currentStudent.bedNumber}
                  roomType={currentStudent.roomType || 'Classic Twin Suite'}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          5. MAIN TIMELINE: CHRONOLOGICAL TODAY SCHEDULE
      ========================================================================= */}
      <TodayTimelineSection />

      {/* =========================================================================
          6. POWER SUPPORTING MODULES (SPLIT 2-COLUMN LUXURY GRID)
      ========================================================================= */}
      <section
        ref={modulesRef}
        className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300 ${
          isModulesRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
      >
        {/* Left Column: Room Sanctuary & Annapurna Mess Live Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Module A: Room Sanctuary & Diagnostics */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_24px_rgba(236,72,153,0.05)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-pink-500" />
                  <span>Room Sanctuary at a Glance</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Room {currentStudent.roomNumber} • {currentStudent.roomType || 'Double Occupancy Suite'}
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                Bed {currentStudent.bedNumber} Assigned
              </span>
            </div>

            {/* Roommate Status Card */}
            <div className="p-4 rounded-2xl bg-[#FFF8FA] dark:bg-[#201A27] border border-pink-100 dark:border-pink-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  NK
                </div>
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm block">
                    Neha R. Kulkarni
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Bed 2 • Study Desk B • IT 2nd Year
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800">
                Library Session
              </span>
            </div>

            {/* Diagnostics Row */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 block font-medium">Wi-Fi Hotspot</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>AP-A2-04 (5G)</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 block font-medium">Sanitization</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Clean</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 block font-medium">Solar Hot Water</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>06:00 – 10:00 AM</span>
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('room')}
                className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Manage room inventory &amp; swap preferences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIs3DVisualOpen(!is3DVisualOpen)}
                className="text-xs text-zinc-500 hover:text-zinc-700 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{is3DVisualOpen ? 'Hide 3D View' : 'Toggle 3D View'}</span>
              </button>
            </div>
          </div>

          {/* Module B: Annapurna Dining Live Platter Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_24px_rgba(236,72,153,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Next Meal • {nextMealName}
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Annapurna Central Dining Hall
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {nextMealTime}
              </span>
            </div>

            {/* Menu Highlight Box */}
            <div className="bg-gradient-to-r from-amber-500/[0.06] to-pink-500/[0.04] p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Today's Chef Specialty:
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  100% Pure Veg
                </span>
              </div>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                {nextMealMenu}
              </p>
            </div>

            {/* Attendance Toggle & Weekly Menu Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMealAttendanceStatus(mealAttendanceStatus === 'attending' ? 'skipping' : 'attending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    mealAttendanceStatus === 'attending'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{mealAttendanceStatus === 'attending' ? 'Meal Attendance: Attending' : 'Marked: Skipping Meal'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('mess')}
                className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Weekly meal calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Campus Bulletins, Verified History, and Warden Help */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Module C: Campus Notices & Circulars */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_24px_rgba(236,72,153,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Campus Circulars
                  </h3>
                  <span className="text-[11px] text-zinc-400">Rector &amp; College Bulletins</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('notices')}
                className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold cursor-pointer"
              >
                View all ({notices.length})
              </button>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notices')}
                  className="py-3 first:pt-0 last:pb-0 hover:bg-[#FFF8FA] dark:hover:bg-[#201A27] -mx-2 px-2.5 rounded-2xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400">
                    <span className="font-semibold text-pink-600 dark:text-pink-400 px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200/60 dark:border-pink-900/60 text-[10px]">
                      {n.category}
                    </span>
                    <span className="font-mono">{n.datePublished}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-pink-600 transition-colors mt-1.5 line-clamp-2">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {n.publishedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Module D: Verified Security & Living Ledger */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] shadow-[0_4px_24px_rgba(236,72,153,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Verified Security Activity
                  </h3>
                  <span className="text-[11px] text-zinc-400">Biometric &amp; Access Log</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Audit Safe
              </span>
            </div>

            <div className="space-y-3">
              {recentHistory.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 text-xs p-2 rounded-2xl hover:bg-[#FFF8FA] dark:hover:bg-[#201A27] transition-colors border border-transparent hover:border-pink-100">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${item.color}`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-semibold text-zinc-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module E: Rector & Emergency Quick Assist */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-transparent border border-pink-200/80 dark:border-pink-900/40 space-y-3">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-pink-500" />
              <span>Campus Rector &amp; Security Hotline</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1926] border border-pink-100 dark:border-pink-950">
                <span className="text-[10px] text-zinc-400 block">Chief Rector</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs block">Dr. Sunita Gaikwad</span>
                <span className="text-[11px] font-mono text-pink-600 block mt-0.5">+91 94228 77412</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E1926] border border-pink-100 dark:border-pink-950">
                <span className="text-[10px] text-zinc-400 block">Security Sentry</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs block">Havaldar S. Jadhav</span>
                <span className="text-[11px] font-mono text-emerald-600 block mt-0.5">+91 98500 33412</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
