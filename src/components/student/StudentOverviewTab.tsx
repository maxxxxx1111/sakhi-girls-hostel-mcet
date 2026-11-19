import React from 'react';
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
} from 'lucide-react';
import { TodayTimelineSection } from './TodayTimelineSection';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';

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
  } = useApp();

  const { ref: attentionRef, isRevealed: isAttentionRevealed } = useIntersectionReveal({ threshold: 0.05 });
  const { ref: modulesRef, isRevealed: isModulesRevealed } = useIntersectionReveal({ threshold: 0.05, delayMs: 40 });

  if (!currentStudent) return null;

  const currentHostel = hostels.find((h) => h.id === currentStudent.hostelId);

  // Time & Greeting calculation
  const now = new Date();
  const currentHour = now.getHours();

  let greeting = 'Good evening';
  if (currentHour < 12) greeting = 'Good morning';
  else if (currentHour < 17) greeting = 'Good afternoon';

  const formattedDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // 1. Identify genuine "Needs your attention" item (strictly show ONLY when genuinely pending)
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

  // Single highest-priority attention item
  let attentionItem: {
    statusBadge: string;
    badgeStyle: string;
    title: string;
    latestUpdate: string;
    timestamp: string;
    actionLabel: string;
    onAction: () => void;
  } | null = null;

  if (pendingComplaint) {
    const ticketId = pendingComplaint.ticketNumber
      ? `#${pendingComplaint.ticketNumber}`
      : `#WO-${pendingComplaint.id.replace(/[^0-9]/g, '') || '201'}`;
    attentionItem = {
      statusBadge: 'Work order in progress',
      badgeStyle: 'bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#F59E0B]',
      title: `${ticketId} • ${pendingComplaint.subject}`,
      latestUpdate: pendingComplaint.resolutionRemarks
        ? pendingComplaint.resolutionRemarks
        : `Assigned to ${pendingComplaint.assignedTo || 'Campus Maintenance Team'}. Awaiting part inspection.`,
      timestamp: pendingComplaint.dateSubmitted || 'Updated today',
      actionLabel: 'Track work order',
      onAction: () => setActiveTab('complaints'),
    };
  } else if (pendingLeave) {
    attentionItem = {
      statusBadge: 'Leave approval pending',
      badgeStyle: 'bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#F59E0B]',
      title: `${pendingLeave.leaveType} to ${pendingLeave.destination || 'Home'}`,
      latestUpdate: `Application submitted on ${pendingLeave.appliedDate}. Awaiting verification by ${pendingLeave.hostelName?.split('(')[0] || 'Warden'}.`,
      timestamp: `Applied ${pendingLeave.appliedDate}`,
      actionLabel: 'Review leave request',
      onAction: () => setActiveTab('leave'),
    };
  } else if (approvedLeave) {
    attentionItem = {
      statusBadge: 'Outpass ready for gate checkout',
      badgeStyle: 'bg-[#10B981]/10 border-[#10B981]/25 text-[#34D399]',
      title: `Authorized Outpass: ${approvedLeave.leaveType}`,
      latestUpdate: `Approved through ${approvedLeave.toDate}. Present digital QR pass at security post upon exit.`,
      timestamp: `Code: ${approvedLeave.gatePassCode || 'GP-492'}`,
      actionLabel: 'Show digital gate pass',
      onAction: () => setIsOfflinePassModalOpen(true),
    };
  } else if (isFeePending) {
    attentionItem = {
      statusBadge: 'Hostel dues pending',
      badgeStyle: 'bg-[#EF4444]/10 border-[#EF4444]/25 text-[#F87171]',
      title: `Outstanding Term Dues: ₹${pendingFeeAmount.toLocaleString('en-IN')}`,
      latestUpdate: `Due by ${myFee?.dueDate || 'end of this term'}. Pay online to download automated fee clearance receipt.`,
      timestamp: `Due ${myFee?.dueDate || 'Soon'}`,
      actionLabel: 'Pay term balance',
      onAction: () => setActiveTab('fees'),
    };
  }

  // 2. Next meal determination
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
    nextMealMenu = 'Rajma Masala, Jeera Rice, Chapati, Boondi Raita & Salad';
  } else if (currentHour < 18) {
    nextMealName = 'Evening Snacks';
    nextMealTime = '05:00 PM – 06:15 PM';
    nextMealMenu = 'Vegetable Cutlet, Mint Chutney & Hot Tea';
  }

  // Recent official notices (limit to 3)
  const recentNotices = notices.slice(0, 3);

  // Believable recent history
  const recentHistory = [
    {
      id: 'h-1',
      title: 'Biometric Gate Check-in',
      desc: 'North Security Gate turnstile entry recorded',
      time: 'Yesterday, 09:18 PM',
      icon: Shield,
    },
    {
      id: 'h-2',
      title: 'Maintenance Ticket Submitted',
      desc: 'Electrical socket spark reported for Desk 1',
      time: 'Aug 28, 09:30 AM',
      icon: Wrench,
    },
    {
      id: 'h-3',
      title: 'Mess Attendance Recorded',
      desc: 'Dinner verified at Annapurna Dining Hall',
      time: 'Aug 27, 08:20 PM',
      icon: Utensils,
    },
    {
      id: 'h-4',
      title: 'Term Fee Clearance Receipt',
      desc: 'Receipt #RC-2026-918 generated via NetBanking',
      time: 'Aug 05, 11:30 AM',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6 font-body text-[#1F2937] dark:text-[#FDF2F8]">
      {/* 1. Large Warm Resident Greeting Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3E8EF] dark:border-[#2C2436]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
              {greeting}, {currentStudent.name.split(' ')[0]}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              In residence
            </span>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#A79CB0]">
            Room {currentStudent.roomNumber} ({currentStudent.bedNumber}) • {currentHostel?.name || currentStudent.hostelName} • {formattedDate}
          </p>
        </div>

        {/* Primary Resident Actions: Solid Pink + Outlined */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsOfflinePassModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(236,72,153,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Gate Pass</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leave')}
            className="h-10 px-4 rounded-xl bg-white dark:bg-[#1E1926] border border-[#FBCFE8] dark:border-[#38283B] hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] text-[#EC4899] dark:text-[#F472B6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {approvedLeave ? 'View Outpass' : 'Apply Outpass'}
          </button>
        </div>
      </section>

      {/* 2. ONE "Needs your attention" panel ONLY when genuinely pending */}
      {attentionItem && (
        <section
          ref={attentionRef}
          className={`transition-all duration-200 ease-out ${
            isAttentionRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5 motion-reduce:opacity-100 motion-reduce:translate-y-0'
          }`}
          aria-labelledby="attention-panel-heading"
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18141F] border border-[#F3E8EF] dark:border-[#2C2436] border-l-4 border-l-[#F59E0B] shadow-[0_4px_20px_rgba(236,72,153,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  id="attention-panel-heading"
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                >
                  {attentionItem.statusBadge}
                </span>
                <span className="text-xs text-[#9CA3AF] dark:text-[#9A8E9E]">
                  • {attentionItem.timestamp}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#1F2937] dark:text-white">
                {attentionItem.title}
              </h2>

              <p className="text-xs text-[#6B7280] dark:text-[#A79CB0] max-w-2xl leading-relaxed">
                {attentionItem.latestUpdate}
              </p>
            </div>

            <button
              type="button"
              onClick={attentionItem.onAction}
              className="h-9 px-4 rounded-xl border border-[#F3E8EF] dark:border-[#38283B] hover:border-[#FBCFE8] bg-white dark:bg-[#1E1926] hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] text-[#1F2937] dark:text-white hover:text-[#EC4899] dark:hover:text-[#F472B6] text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer shadow-2xs transition-all"
            >
              <span>{attentionItem.actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#EC4899]" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Main Timeline: Chronological Today Schedule */}
      <TodayTimelineSection />

      {/* 4. Balanced Supporting Modules: Room at a glance, Next meal, Notices, and Activity */}
      <section
        ref={modulesRef}
        className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-200 ease-out ${
          isModulesRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        {/* Left Column: Room at a glance + Next Meal */}
        <div className="lg:col-span-7 space-y-6">
          {/* Room at a glance */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18141F] border border-[#F3E8EF] dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                  Room at a glance
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A79CB0] mt-0.5">
                  Room {currentStudent.roomNumber} • {currentStudent.roomType || 'Double Occupancy'}
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFF0F6] dark:bg-[#2B1B28] text-[#DB2777] dark:text-[#F472B6] border border-[#FCE7F3] dark:border-[#3D253A]">
                {currentStudent.bedNumber}
              </span>
            </div>

            {/* Roommate Status */}
            <div className="p-3.5 rounded-xl bg-[#FFF8FA] dark:bg-[#201A27] border border-[#FCE7F3] dark:border-[#38283B] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FCE7F3] dark:bg-[#341C2D] text-[#EC4899] dark:text-[#F472B6] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#1F2937] dark:text-white">
                    Aditya V. Deshmukh
                  </span>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
                    Bed 2 • Study station assigned
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#7C3AED] px-2.5 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE]">
                Library session
              </span>
            </div>

            {/* Diagnostics row */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-xs border-t border-[#F3E8EF] dark:border-[#2C2436]">
              <div>
                <span className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] block font-medium">
                  Wi-Fi Point
                </span>
                <span className="font-semibold text-[#15803D] dark:text-[#34D399] flex items-center gap-1 mt-1 font-mono text-[11px]">
                  <Wifi className="w-3 h-3" />
                  <span>AP-A2-04</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] block font-medium">
                  Inspection
                </span>
                <span className="font-semibold text-[#15803D] dark:text-[#34D399] flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Clean</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] block font-medium">
                  Hot Water
                </span>
                <span className="font-semibold text-[#1F2937] dark:text-white mt-1 block">
                  Solar (06:00 – 10:00)
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('room')}
                className="text-xs text-[#EC4899] hover:text-[#DB2777] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View full room &amp; inventory details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Next Meal Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18141F] border border-[#F3E8EF] dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                  Next Meal • {nextMealName}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#6B7280] dark:text-[#A79CB0]">
                {nextMealTime}
              </span>
            </div>

            <div className="bg-[#FFF8FA] dark:bg-[#201A27] p-3.5 rounded-xl border border-[#FCE7F3] dark:border-[#38283B] text-xs leading-relaxed text-[#1F2937] dark:text-[#FDF2F8]">
              <span className="text-[#BE185D] dark:text-[#F472B6] block text-[11px] mb-1 font-semibold">
                Serving in Annapurna Hall:
              </span>
              {nextMealMenu}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Attendance marked: Attending</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveTab('mess')}
                className="text-xs text-[#EC4899] hover:text-[#DB2777] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full weekly menu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Notices & Activity Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Notices Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18141F] border border-[#F3E8EF] dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                  Recent Notices
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('notices')}
                className="text-xs text-[#EC4899] hover:text-[#DB2777] font-semibold cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-[#F3E8EF] dark:divide-[#2C2436]">
              {recentNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notices')}
                  className="py-3 first:pt-0 last:pb-0 hover:bg-[#FFF8FA] dark:hover:bg-[#201A27] -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
                    <span className="font-semibold text-[#DB2777] px-2 py-0.5 rounded-full bg-[#FFF0F6] border border-[#FCE7F3]">
                      {n.category}
                    </span>
                    <span className="font-mono">{n.datePublished}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#1F2937] dark:text-white group-hover:text-[#EC4899] transition-colors mt-1.5 line-clamp-2">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] truncate mt-0.5">
                    {n.publishedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Activity History Log */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#18141F] border border-[#F3E8EF] dark:border-[#2C2436] shadow-[0_4px_20px_rgba(236,72,153,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFF0F6] text-[#EC4899] flex items-center justify-center shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                  Recent Activity
                </h3>
              </div>
              <span className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] font-medium">
                Verified logs
              </span>
            </div>

            <div className="space-y-3">
              {recentHistory.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 text-xs p-1.5 rounded-xl hover:bg-[#FFF8FA] dark:hover:bg-[#201A27] transition-colors">
                    <div className="w-7 h-7 rounded-xl bg-[#FFF0F6] dark:bg-[#2B1B28] text-[#EC4899] dark:text-[#F472B6] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-semibold text-[#1F2937] dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] dark:text-[#A79CB0] font-mono shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
