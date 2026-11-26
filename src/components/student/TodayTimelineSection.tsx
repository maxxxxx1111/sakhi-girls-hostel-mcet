import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Utensils,
  ShieldCheck,
  QrCode,
  Wrench,
  GraduationCap,
  Coffee,
  Check,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useIntersectionReveal } from '../../hooks/useIntersectionReveal';

interface ScheduleItem {
  id: string;
  category: 'mess' | 'academic' | 'gate' | 'service';
  title: string;
  detail: string;
  location: string;
  startMinutes: number; // minutes from midnight
  endMinutes: number;
  timeRange: string;
  icon: React.FC<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export const TodayTimelineSection: React.FC = () => {
  const {
    currentStudent,
    leaveRequests,
    complaints,
    setActiveTab,
    setIsOfflinePassModalOpen,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [filter, setFilter] = useState<'all' | 'mess' | 'academic' | 'gate'>('all');
  const { ref, isRevealed } = useIntersectionReveal({ threshold: 0.05 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Curfew is 10:00 PM (1320 minutes)
  const curfewMinutes = 22 * 60;
  const isCurfewActive = nowMinutes >= curfewMinutes || nowMinutes < 6 * 60;
  const minutesToCurfew = curfewMinutes - nowMinutes;

  let curfewStatusText = '';
  if (isCurfewActive) {
    curfewStatusText = 'Night curfew in effect (Gates locked)';
  } else if (minutesToCurfew <= 60) {
    curfewStatusText = `Curfew in ${minutesToCurfew}m (10:00 PM)`;
  } else {
    const hrs = Math.floor(minutesToCurfew / 60);
    const mins = minutesToCurfew % 60;
    curfewStatusText = `Curfew in ${hrs}h ${mins}m (10:00 PM)`;
  }

  // Active student requests
  const activeLeave = leaveRequests.find(
    (l) => l.studentId === currentStudent?.id && (l.status === 'Approved' || l.status === 'Pending')
  );

  const pendingComplaint = complaints.find(
    (c) => c.studentId === currentStudent?.id && c.status !== 'Resolved'
  );

  const schedule: ScheduleItem[] = useMemo(() => {
    const items: ScheduleItem[] = [
      {
        id: 'sch-breakfast',
        category: 'mess',
        title: 'Morning Breakfast',
        detail: 'Poha, Boiled Eggs & Masala Chai',
        location: 'Annapurna Dining Hall',
        startMinutes: 7 * 60 + 30, // 07:30
        endMinutes: 9 * 60 + 15,   // 09:15
        timeRange: '07:30 AM – 09:15 AM',
        icon: Utensils,
        actionLabel: 'View menu',
        onAction: () => setActiveTab('mess'),
      },
      {
        id: 'sch-academics',
        category: 'academic',
        title: 'Academic Lectures & Labs',
        detail: 'Department of Computer Science & Engineering',
        location: 'Academic Complex Block C',
        startMinutes: 9 * 60 + 30, // 09:30
        endMinutes: 16 * 60 + 30,  // 16:30
        timeRange: '09:30 AM – 04:30 PM',
        icon: GraduationCap,
      },
    ];

    if (activeLeave) {
      items.push({
        id: 'sch-leave',
        category: 'gate',
        title: `${activeLeave.leaveType} Departure`,
        detail: `Pass #${activeLeave.gatePassCode || 'GP-492'} to ${activeLeave.destination || 'Home'}`,
        location: 'Main Security Turnstile',
        startMinutes: 14 * 60,
        endMinutes: 19 * 60,
        timeRange: 'Departure Window',
        icon: QrCode,
        actionLabel: 'Show pass',
        onAction: () => setIsOfflinePassModalOpen(true),
      });
    }

    if (pendingComplaint) {
      items.push({
        id: 'sch-repair',
        category: 'service',
        title: `Maintenance: ${pendingComplaint.category}`,
        detail: `${pendingComplaint.assignedTo || 'Technician'} visit to Room ${currentStudent?.roomNumber}`,
        location: `Room ${currentStudent?.roomNumber}`,
        startMinutes: 16 * 60,
        endMinutes: 18 * 60,
        timeRange: 'Slot Assigned',
        icon: Wrench,
        actionLabel: 'Track ticket',
        onAction: () => setActiveTab('complaints'),
      });
    }

    items.push(
      {
        id: 'sch-tea',
        category: 'mess',
        title: 'Evening Tea & Reading Hour',
        detail: 'Light snacks, tea & campus courtyard access',
        location: 'Annapurna Hall & Courtyard',
        startMinutes: 17 * 60,
        endMinutes: 18 * 60 + 15,
        timeRange: '05:00 PM – 06:15 PM',
        icon: Coffee,
      },
      {
        id: 'sch-dinner',
        category: 'mess',
        title: 'Dinner Service',
        detail: 'Paneer Butter Masala, Roti, Dal Tadka & Kheer',
        location: 'Annapurna Dining Hall',
        startMinutes: 19 * 60 + 45, // 19:45
        endMinutes: 21 * 60 + 45,   // 21:45
        timeRange: '07:45 PM – 09:45 PM',
        icon: Utensils,
        actionLabel: 'Mark attendance',
        onAction: () => setActiveTab('attendance'),
      },
      {
        id: 'sch-curfew',
        category: 'gate',
        title: 'Night Gate Curfew',
        detail: 'Security turnstiles lock. Biometric scan required for entry.',
        location: 'Main Security Checkpost',
        startMinutes: 22 * 60, // 22:00
        endMinutes: 24 * 60,
        timeRange: '10:00 PM Sharp',
        icon: ShieldCheck,
      }
    );

    // Sort chronologically by startMinutes
    return items.sort((a, b) => a.startMinutes - b.startMinutes);
  }, [activeLeave, pendingComplaint, currentStudent?.roomNumber, setActiveTab, setIsOfflinePassModalOpen]);

  // Identify current and next events
  const processedItems = useMemo(() => {
    let hasFoundCurrent = false;
    let hasFoundNext = false;

    return schedule.map((item) => {
      const isCompleted = nowMinutes > item.endMinutes;
      const isCurrent =
        !isCompleted &&
        nowMinutes >= item.startMinutes &&
        nowMinutes <= item.endMinutes;
      let isNext = false;

      if (isCurrent) {
        hasFoundCurrent = true;
      } else if (!isCompleted && !hasFoundCurrent && !hasFoundNext) {
        isNext = true;
        hasFoundNext = true;
      }

      return {
        ...item,
        status: isCompleted ? 'completed' : isCurrent ? 'current' : isNext ? 'next' : 'upcoming',
      };
    });
  }, [schedule, nowMinutes]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return processedItems;
    if (filter === 'mess') return processedItems.filter((i) => i.category === 'mess');
    if (filter === 'academic') return processedItems.filter((i) => i.category === 'academic');
    if (filter === 'gate') return processedItems.filter((i) => i.category === 'gate');
    return processedItems;
  }, [processedItems, filter]);

  return (
    <section
      ref={ref}
      aria-labelledby="today-timeline-heading"
      className={`transition-all duration-200 ease-out ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5 motion-reduce:opacity-100 motion-reduce:translate-y-0'
      }`}
    >
      <div className="bg-white dark:bg-[#18141F] border border-pink-100 dark:border-[#2C2436] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(236,72,153,0.05)]">
        {/* Header: Title, Curfew Status & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F3E8EF] dark:border-[#2C2436]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#EC4899] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="today-timeline-heading"
                className="text-base font-bold text-[#1F2937] dark:text-white"
              >
                Today's Schedule
              </h2>
              <span className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Curfew Indicator (Clear, restrained, pastel text pill) */}
          <div
            className={`text-xs font-medium px-3 py-1 rounded-full border inline-flex items-center gap-1.5 self-start sm:self-auto shadow-2xs ${
              isCurfewActive
                ? 'bg-[#FEE2E2] border-[#FECACA] text-[#B91C1C]'
                : minutesToCurfew <= 60
                ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
                : 'bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCurfewActive ? 'bg-[#EF4444]' : minutesToCurfew <= 60 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
              }`}
            />
            <span>{curfewStatusText}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'mess', label: 'Mess & Dining' },
            { id: 'academic', label: 'Academics' },
            { id: 'gate', label: 'Gates & Curfew' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === cat.id
                  ? 'bg-[#FCE7F3] dark:bg-[#341C2D] text-[#BE185D] dark:text-[#F472B6] font-semibold border border-[#FBCFE8] shadow-2xs'
                  : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white hover:bg-[#FFF5F8] dark:hover:bg-[#201A27]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grouped Chronological Schedule Rows */}
        <div className="divide-y divide-[#F3E8EF] dark:divide-[#2C2436] mt-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isNext = item.status === 'next';

            return (
              <div
                key={item.id}
                className={`py-3.5 px-3 sm:px-4 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#FFF5F8] dark:bg-[#251A28] border-l-4 border-l-[#EC4899] shadow-2xs'
                    : isNext
                    ? 'bg-[#FCF9FB] dark:bg-[#1D1724]'
                    : isCompleted
                    ? 'opacity-60 hover:opacity-85'
                    : 'hover:bg-[#FFF8FA] dark:hover:bg-[#201A27]'
                }`}
              >
                {/* Left: Icon & Event Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                      isCompleted
                        ? 'bg-[#F3F4F6] dark:bg-[#261E2E] text-[#9CA3AF]'
                        : isCurrent
                        ? 'bg-gradient-to-br from-[#F472B6] to-[#EC4899] text-white'
                        : isNext
                        ? 'bg-[#FCE7F3] dark:bg-[#341C2D] text-[#EC4899] dark:text-[#F472B6]'
                        : 'bg-[#FFF0F6] dark:bg-[#2B1B28] text-[#DB2777] dark:text-[#F472B6]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          isCompleted
                            ? 'text-[#9CA3AF] dark:text-[#827488] line-through decoration-[#9CA3AF]'
                            : 'text-[#1F2937] dark:text-white'
                        }`}
                      >
                        {item.title}
                      </span>

                      {/* Status tag */}
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EC4899] text-white shadow-2xs">
                          Current
                        </span>
                      )}
                      {isNext && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FCE7F3] dark:bg-[#341C2D] text-[#BE185D] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#3D253A]">
                          Next up
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6B7280] dark:text-[#A79CB0] truncate">
                      {item.detail}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#9CA3AF] dark:text-[#9A8E9E]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#EC4899]" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Time & Direct Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-11 sm:pl-0">
                  <span className="text-xs font-mono text-[#6B7280] dark:text-[#A79CB0]">
                    {item.timeRange}
                  </span>

                  {item.actionLabel && item.onAction && !isCompleted && (
                    <button
                      type="button"
                      onClick={item.onAction}
                      className="h-8 px-3 rounded-xl bg-white dark:bg-[#1E1926] hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] border border-[#FBCFE8] dark:border-[#38283B] text-xs font-semibold text-[#EC4899] dark:text-[#F472B6] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <span>{item.actionLabel}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
