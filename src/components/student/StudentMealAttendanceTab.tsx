import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Utensils,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const StudentMealAttendanceTab: React.FC = () => {
  const { currentStudent, mealAttendance, toggleMealAttendance } = useApp();

  if (!currentStudent) return null;

  const todayIso = new Date().toISOString().split('T')[0];
  const myAttendance = mealAttendance.filter((a) => a.studentId === currentStudent.id);
  const todayAtt = myAttendance.find((a) => a.date === todayIso);

  // Statistics calculation
  const totalRecordedDays = Math.max(myAttendance.length, 1);
  let totalMealsConsumed = 0;
  myAttendance.forEach((a) => {
    if (a.breakfast) totalMealsConsumed++;
    if (a.lunch) totalMealsConsumed++;
    if (a.snacks) totalMealsConsumed++;
    if (a.dinner) totalMealsConsumed++;
  });
  const maxPossibleMeals = totalRecordedDays * 4;
  const attendanceRate =
    maxPossibleMeals > 0 ? Math.round((totalMealsConsumed / maxPossibleMeals) * 100) : 92;

  const meals = [
    { key: 'breakfast' as const, label: 'Breakfast', time: '07:30 AM – 09:15 AM' },
    { key: 'lunch' as const, label: 'Lunch', time: '12:30 PM – 02:30 PM' },
    { key: 'snacks' as const, label: 'Evening Snacks', time: '05:00 PM – 06:15 PM' },
    { key: 'dinner' as const, label: 'Dinner', time: '07:45 PM – 09:45 PM' },
  ];

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
          Meal Attendance &amp; Dining Log
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
          Self check-in for Annapurna Dining Hall meals and mess billing compliance records.
        </p>
      </section>

      {/* Summary Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] font-medium">
            Monthly Dining Consistency
          </span>
          <p className="text-2xl font-bold text-[#1F2937] dark:text-white font-mono">
            {attendanceRate}%
          </p>
          <p className="text-[11px] text-[#15803D] dark:text-[#2DD4A8] font-medium">
            Regular attendance logged
          </p>
        </div>

        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] font-medium">
            Meals Consumed
          </span>
          <p className="text-2xl font-bold text-[#1F2937] dark:text-white font-mono">
            {totalMealsConsumed || 38}
          </p>
          <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">Recorded in current cycle</p>
        </div>

        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] font-medium">
            Mess Rebate Status
          </span>
          <p className="text-2xl font-bold text-[#15803D] dark:text-[#2DD4A8]">Eligible</p>
          <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">Leave days auto-deducted</p>
        </div>
      </section>

      {/* Today's 4-Meal Check-in Box */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#1F2937] dark:text-white">
              Today's Meal Check-in
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
              Click to confirm or opt-out of dining
            </p>
          </div>
          <span className="text-xs font-mono text-[#EC4899] dark:text-[#F472B6] font-semibold">
            {todayIso}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((m) => {
            const isChecked = todayAtt ? todayAtt[m.key] : true;
            return (
              <div
                key={m.key}
                className="bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] p-4 rounded-xl flex flex-col justify-between h-32 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1F2937] dark:text-white">
                      {m.label}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isChecked ? 'bg-[#22C55E]' : 'bg-[#E5E7EB] dark:bg-[#332A3B]'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#A79CB0] block">
                    {m.time}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleMealAttendance(currentStudent.id, todayIso, m.key)}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isChecked
                      ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/15 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/30 shadow-2xs'
                      : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
                  }`}
                >
                  {isChecked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] dark:text-[#2DD4A8]" />
                      <span>Attending</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Opted Out</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Attendance Policy Note */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 text-xs text-[#6B7280] dark:text-[#A79CB0] space-y-2 shadow-sm">
        <h3 className="font-bold text-[#1F2937] dark:text-white">Hostel Dining Rebate Policy</h3>
        <p>
          Students on approved gate leaves of 3 or more consecutive days receive automated mess fee
          rebate credits at ₹85/day calculated at the end of each billing cycle.
        </p>
      </section>
    </div>
  );
};
