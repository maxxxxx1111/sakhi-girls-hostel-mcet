import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DayOfWeek } from '../../types';
import {
  Utensils,
  Clock,
  CheckCircle2,
  Check,
  Star,
  Sparkles,
  Calendar,
  ChevronRight,
  ThumbsUp,
  XCircle,
  Filter,
} from 'lucide-react';
import { WeeklyMenuModal } from './WeeklyMenuModal';

export const StudentMessTab: React.FC = () => {
  const { currentStudent, weeklyMenu, submitMessFeedback, mealAttendance, toggleMealAttendance } =
    useApp();

  const days: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const todayDay = days[(new Date().getDay() + 6) % 7];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'high-protein' | 'jain'>('all');

  const isHighProtein = (item: string) => {
    const keywords = ['paneer', 'dal', 'sprouts', 'moong', 'chana', 'milk', 'curd', 'rajma', 'soya', 'egg', 'buttermilk'];
    return keywords.some((k) => item.toLowerCase().includes(k));
  };

  const isJainFriendly = (item: string) => {
    const rootWords = ['onion', 'garlic', 'potato', 'aloo', 'ginger', 'carrot', 'radish'];
    return !rootWords.some((w) => item.toLowerCase().includes(w));
  };

  // Meal Attendance state for today
  const todayIso = new Date().toISOString().split('T')[0];
  const todayAtt = mealAttendance.find(
    (a) => a.studentId === currentStudent?.id && a.date === todayIso
  );

  // Feedback State
  const [rating, setRating] = useState(5);
  const [mealCategory, setMealCategory] = useState<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'>(
    'Dinner'
  );
  const [comments, setComments] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (!currentStudent) return null;

  const currentMenu = weeklyMenu.find((m) => m.dayOfWeek === selectedDay) || weeklyMenu[0];

  const currentHour = new Date().getHours();
  let nextMealKey: 'breakfast' | 'lunch' | 'snacks' | 'dinner' = 'dinner';
  if (currentHour < 10) nextMealKey = 'breakfast';
  else if (currentHour < 15) nextMealKey = 'lunch';
  else if (currentHour < 18) nextMealKey = 'snacks';

  const mealSlots = [
    {
      key: 'breakfast' as const,
      name: 'Breakfast',
      time: currentMenu.breakfast?.time || '07:30 AM – 09:15 AM',
      items: currentMenu.breakfast?.items || ['Poha with Chutney', 'Sprouts Moong', 'Hot Tea / Milk'],
      isAttending: todayAtt?.breakfast ?? true,
    },
    {
      key: 'lunch' as const,
      name: 'Lunch',
      time: currentMenu.lunch?.time || '12:30 PM – 02:30 PM',
      items: currentMenu.lunch?.items || [
        'Paneer Butter Masala',
        'Dal Tadka',
        'Jeera Rice',
        'Chapati',
        'Salad',
      ],
      isAttending: todayAtt?.lunch ?? true,
    },
    {
      key: 'snacks' as const,
      name: 'Evening Snacks',
      time: currentMenu.snacks?.time || '05:00 PM – 06:15 PM',
      items: currentMenu.snacks?.items || ['Veg Samosa / Sandwich', 'Filter Coffee / Tea'],
      isAttending: todayAtt?.snacks ?? true,
    },
    {
      key: 'dinner' as const,
      name: 'Dinner',
      time: currentMenu.dinner?.time || '07:45 PM – 09:45 PM',
      items: currentMenu.dinner?.items || [
        'Mix Vegetable Handi',
        'Dal Fry',
        'Steamed Rice',
        'Phulka',
        'Gulab Jamun',
      ],
      isAttending: todayAtt?.dinner ?? true,
    },
  ];

  const nextMealSlot = mealSlots.find((s) => s.key === nextMealKey) || mealSlots[3];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;

    submitMessFeedback({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: currentStudent.roomNumber,
      date: todayIso,
      meal: mealCategory,
      rating,
      categories: {
        taste: rating,
        hygiene: 5,
        service: 4,
        quantity: 5,
      },
      comments,
    });

    setFeedbackSuccess(true);
    setComments('');
    setTimeout(() => setFeedbackSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
          Annapurna Dining Hall &amp; Menu
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
          Daily nutritious chef-curated meals, service times, and student dining attendance.
        </p>
      </section>

      {/* Next Meal Highlight Card */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#EC4899] dark:text-[#F472B6]">
            <Utensils className="w-3.5 h-3.5" />
            <span>Upcoming Meal Service • {nextMealSlot.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-white">
            {nextMealSlot.items.slice(0, 3).join(', ')}
          </h2>
          <div className="flex items-center gap-3 text-xs text-[#6B7280] dark:text-[#A79CB0]">
            <Clock className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
            <span className="font-mono text-[#1F2937] dark:text-white">{nextMealSlot.time}</span>
            <span>•</span>
            <span>Central Mess Wing</span>
          </div>
        </div>

        {/* Quick RSVP toggle */}
        <div className="bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] p-4 rounded-xl space-y-2 shrink-0">
          <span className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] block font-medium">
            Dining RSVP for {nextMealSlot.name}
          </span>
          <button
            type="button"
            onClick={() => toggleMealAttendance(currentStudent.id, todayIso, nextMealSlot.key)}
            className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer w-full ${
              nextMealSlot.isAttending
                ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/15 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/30 shadow-2xs'
                : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            {nextMealSlot.isAttending ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] dark:text-[#2DD4A8]" />
                <span>Attending Service</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Skipping Meal</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Weekly Menu Day Switcher */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">Weekly Schedule</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">Select a day to inspect meal courses and timings</p>
          </div>

          <button
            type="button"
            onClick={() => setIsWeeklyModalOpen(true)}
            className="h-8 px-3.5 rounded-xl bg-[#FFF5F8] dark:bg-[#1E1924] hover:bg-[#FCE7F3] dark:hover:bg-[#2B2333] border border-[#F3E8EF] dark:border-[#332A3B] text-xs font-semibold text-[#EC4899] dark:text-[#F472B6] flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Full Week Timetable &amp; Print</span>
          </button>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#F472B6] to-[#EC4899] text-white shadow-xs'
                    : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
                }`}
              >
                {day}
                {day === todayDay && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FCE7F3] dark:bg-[#2B2333] text-[#EC4899] dark:text-[#F472B6]'
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dietary Focus Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#A79CB0] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#EC4899]" />
            Dietary Filter:
          </span>
          <button
            type="button"
            onClick={() => setDietaryFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              dietaryFilter === 'all'
                ? 'bg-[#FCE7F3] dark:bg-[#2B2333] text-[#EC4899] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B] font-semibold'
                : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => setDietaryFilter('high-protein')}
            className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
              dietaryFilter === 'high-protein'
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-semibold'
                : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            <span>💪</span>
            <span>High Protein</span>
          </button>
          <button
            type="button"
            onClick={() => setDietaryFilter('jain')}
            className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
              dietaryFilter === 'jain'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold'
                : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            <span>🌱</span>
            <span>Jain Friendly</span>
          </button>
        </div>

        {/* 4 Daily Meal Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealSlots.map((slot) => (
            <div
              key={slot.key}
              className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1F2937] dark:text-white">
                    {slot.name}
                  </span>
                  {selectedDay === todayDay && (
                    <button
                      type="button"
                      onClick={() => toggleMealAttendance(currentStudent.id, todayIso, slot.key)}
                      className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        slot.isAttending
                          ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/20 font-semibold'
                          : 'bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                      }`}
                      title="Click to toggle RSVP"
                    >
                      {slot.isAttending ? 'RSVP Yes' : 'Skipped'}
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#A79CB0] block">
                  {slot.time}
                </span>
              </div>

              <ul className="space-y-2 text-xs text-[#6B7280] dark:text-[#A79CB0]">
                {slot.items.map((item, i) => {
                  const highProtein = isHighProtein(item);
                  const jainSafe = isJainFriendly(item);

                  const isMatchFilter =
                    dietaryFilter === 'all' ||
                    (dietaryFilter === 'high-protein' && highProtein) ||
                    (dietaryFilter === 'jain' && jainSafe);

                  return (
                    <li
                      key={i}
                      className={`flex flex-col gap-0.5 p-1 rounded-lg transition-colors ${
                        !isMatchFilter && dietaryFilter !== 'all' ? 'opacity-40' : ''
                      } ${
                        dietaryFilter === 'high-protein' && highProtein
                          ? 'bg-blue-50/50 dark:bg-blue-950/20'
                          : dietaryFilter === 'jain' && jainSafe
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <span className="text-[#EC4899] dark:text-[#F472B6] font-bold">•</span>
                        <span className="text-[#1F2937] dark:text-white font-medium">{item}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-3">
                        {highProtein && (
                          <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/30 px-1.5 py-0.2 rounded">
                            High Protein
                          </span>
                        )}
                        {jainSafe ? (
                          <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/30 px-1.5 py-0.2 rounded">
                            Jain Safe
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#9CA3AF] dark:text-[#6B7280] font-mono">
                            Root Veg
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Dining Feedback Note */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">
            Dining Quality Feedback
          </h3>
          <span className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
            Direct to Mess Committee
          </span>
        </div>

        {feedbackSuccess ? (
          <div className="p-4 rounded-xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/30 text-[#15803D] dark:text-[#2DD4A8] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Your feedback has been recorded for the chief mess supervisor.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <span className="text-[#6B7280] dark:text-[#A79CB0] block text-[11px] font-medium">
                  Meal
                </span>
                <select
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as any)}
                  className="h-9 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Evening Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] dark:text-[#A79CB0] block text-[11px] font-medium">
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating
                            ? 'text-[#F59E0B] fill-[#F59E0B]'
                            : 'text-[#E5E7EB] dark:text-[#332A3B]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <textarea
                required
                rows={2}
                placeholder="Share any comments on taste, temperature, hygiene, or quantity..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6] resize-none"
              />
            </div>

            <button
              type="submit"
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white font-semibold cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.25)]"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </section>
      {/* Weekly Menu Modal */}
      <WeeklyMenuModal
        isOpen={isWeeklyModalOpen}
        onClose={() => setIsWeeklyModalOpen(false)}
        weeklyMenu={weeklyMenu}
      />
    </div>
  );
};
