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
  ShieldCheck,
  Award,
  Flame,
  Leaf,
  Layers,
  HeartHandshake,
  DollarSign,
  Info,
} from 'lucide-react';
import { WeeklyMenuModal } from './WeeklyMenuModal';

export const StudentMessTab: React.FC = () => {
  const { currentStudent, weeklyMenu, submitMessFeedback, mealAttendance, toggleMealAttendance, leaveRequests } =
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
  const [hygieneRating, setHygieneRating] = useState(5);
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
      name: 'Morning Breakfast',
      time: currentMenu.breakfast?.time || '07:30 AM – 09:15 AM',
      items: currentMenu.breakfast?.items || ['Poha with Roasted Peanuts', 'Sprouts Moong Usal', 'Hot Masala Chai / Milk'],
      isAttending: todayAtt?.breakfast ?? true,
      calories: '340 kcal',
      chefNote: 'Steamed fresh daily',
    },
    {
      key: 'lunch' as const,
      name: 'Maharaja Lunch',
      time: currentMenu.lunch?.time || '12:30 PM – 02:30 PM',
      items: currentMenu.lunch?.items || [
        'Paneer Butter Masala',
        'Dal Tadka with Ghee',
        'Jeera Basmati Rice',
        'Fresh Phulka Roti',
        'Cucumber Carrot Salad',
      ],
      isAttending: todayAtt?.lunch ?? true,
      calories: '680 kcal',
      chefNote: 'Chef Special Gravy',
    },
    {
      key: 'snacks' as const,
      name: 'Evening High Tea',
      time: currentMenu.snacks?.time || '05:00 PM – 06:15 PM',
      items: currentMenu.snacks?.items || ['Crispy Samosa / Grilled Sandwich', 'Special Kadak Ginger Chai'],
      isAttending: todayAtt?.snacks ?? true,
      calories: '260 kcal',
      chefNote: 'Courtyard Seating',
    },
    {
      key: 'dinner' as const,
      name: 'Wholesome Dinner',
      time: currentMenu.dinner?.time || '07:45 PM – 09:45 PM',
      items: currentMenu.dinner?.items || [
        'Mix Vegetable Handi',
        'Moong Dal Fry',
        'Steamed Jeera Rice',
        'Ghee Phulka',
        'Hot Gulab Jamun (1 pc)',
      ],
      isAttending: todayAtt?.dinner ?? true,
      calories: '620 kcal',
      chefNote: 'Sweet Course Included',
    },
  ];

  const nextMealSlot = mealSlots.find((s) => s.key === nextMealKey) || mealSlots[3];

  // Calculate Mess Rebate stats from leaves
  const myLeaves = leaveRequests.filter((l) => l.studentId === currentStudent.id && l.status === 'Approved');
  const eligibleRebateDays = myLeaves.reduce((acc, curr) => {
    const diff = new Date(curr.toDate).getTime() - new Date(curr.fromDate).getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
    return days >= 3 ? acc + days : acc;
  }, 0);
  const totalRebateAmount = eligibleRebateDays * 85;

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
        hygiene: hygieneRating,
        service: 4,
        quantity: 5,
      },
      comments,
    });

    setFeedbackSuccess(true);
    setComments('');
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-16">
      {/* 1. Dining Suite Glassmorphic Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-950/40 dark:via-purple-950/20 dark:to-zinc-950/60 border border-pink-200/60 dark:border-pink-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-500/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-pink-800/60 text-xs font-semibold text-pink-700 dark:text-pink-300 shadow-xs">
              <Utensils className="w-3.5 h-3.5 text-pink-500" />
              <span>Annapurna Central Dining Hall</span>
              <span className="w-1 h-1 rounded-full bg-pink-400" />
              <span>Pure Vegetarian &amp; Jain Friendly</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Dining Hall &amp; Daily Nutrition
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Four wholesome daily meals planned by certified institutional dieticians. Includes automated attendance logging, dietary filters, and leave rebate accounting.
            </p>

            {/* Quality Certifications */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                FSSAI A+ Certified (99/100)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                RO Purified Mineral Water
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                100% Satvik Clean Kitchen
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsWeeklyModalOpen(true)}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Full Revolving Timetable</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Meal Highlight Card */}
      <section className="bg-white dark:bg-[#1B1720] border-2 border-pink-200/80 dark:border-pink-900/50 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-pink-600 dark:text-pink-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="uppercase tracking-wider">UPCOMING SERVICE • {nextMealSlot.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            {nextMealSlot.items.slice(0, 3).join(', ')}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-semibold">
              <Clock className="w-3.5 h-3.5 text-pink-500" />
              {nextMealSlot.time}
            </span>
            <span>•</span>
            <span>Ground Floor Main Hall</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{nextMealSlot.calories}</span>
          </div>
        </div>

        {/* Quick RSVP toggle */}
        <div className="bg-pink-50/60 dark:bg-[#120F14] border border-pink-100 dark:border-[#332A3B] p-4 rounded-2xl space-y-2 shrink-0 sm:min-w-[220px]">
          <span className="text-xs text-zinc-600 dark:text-zinc-300 block font-semibold">
            Attendance for {nextMealSlot.name}
          </span>
          <button
            type="button"
            onClick={() => toggleMealAttendance(currentStudent.id, todayIso, nextMealSlot.key)}
            className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer w-full ${
              nextMealSlot.isAttending
                ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {nextMealSlot.isAttending ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Attending Service</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Skipping Meal</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 3. Weekly Day Switcher & Dietary Filter */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Daily Menu Matrix</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Select any day of the week to inspect scheduled courses and nutritional tags</p>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {day}
                {day === todayDay && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300'
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
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-pink-500" />
            Dietary Filters:
          </span>
          <button
            type="button"
            onClick={() => setDietaryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all ${
              dietaryFilter === 'all'
                ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            All Courses
          </button>
          <button
            type="button"
            onClick={() => setDietaryFilter('high-protein')}
            className={`px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
              dietaryFilter === 'high-protein'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>💪</span>
            <span>High Protein (Paneer / Dal / Sprouts)</span>
          </button>
          <button
            type="button"
            onClick={() => setDietaryFilter('jain')}
            className={`px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
              dietaryFilter === 'jain'
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>🌱</span>
            <span>Jain Friendly (No Root Veggies)</span>
          </button>
        </div>

        {/* 4 Daily Meal Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mealSlots.map((slot) => (
            <div
              key={slot.key}
              className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-pink-300 dark:hover:border-pink-800 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {slot.name}
                  </span>
                  {selectedDay === todayDay && (
                    <button
                      type="button"
                      onClick={() => toggleMealAttendance(currentStudent.id, todayIso, slot.key)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        slot.isAttending
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                      title="Click to toggle RSVP"
                    >
                      {slot.isAttending ? 'RSVP: Yes' : 'Skipped'}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  <span>{slot.time}</span>
                  <span className="text-pink-600 dark:text-pink-400 font-medium">{slot.calories}</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 flex-1">
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
                      className={`flex flex-col gap-0.5 p-1.5 rounded-xl transition-all ${
                        !isMatchFilter && dietaryFilter !== 'all' ? 'opacity-30' : ''
                      } ${
                        dietaryFilter === 'high-protein' && highProtein
                          ? 'bg-blue-50 dark:bg-blue-950/40'
                          : dietaryFilter === 'jain' && jainSafe
                          ? 'bg-emerald-50 dark:bg-emerald-950/40'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <span className="text-pink-500 font-bold">•</span>
                        <span className="text-zinc-900 dark:text-white font-medium">{item}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-3">
                        {highProtein && (
                          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/30 px-1.5 py-0.2 rounded">
                            Protein
                          </span>
                        )}
                        {jainSafe ? (
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/30 px-1.5 py-0.2 rounded">
                            Jain
                          </span>
                        ) : (
                          <span className="text-[9px] text-zinc-400 font-mono">
                            Root Veg
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                <span>{slot.chefNote}</span>
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Automated Mess Rebate Ledger Card */}
      <section className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/30 dark:to-zinc-900 border border-emerald-200 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Automated Dining Leave Rebate Accounting
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              ₹85/Day Auto-Credit for Approved Institutional Leaves
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Per college hostel regulations, any resident on approved leave for 3 or more consecutive days receives a direct mess credit of ₹85 per day deducted from the semester fees ledger.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800/60 text-center sm:min-w-[180px] shrink-0">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Your Accrued Rebate</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
              ₹{totalRebateAmount > 0 ? totalRebateAmount : 255}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold">
              {eligibleRebateDays > 0 ? `${eligibleRebateDays} Days Credited` : '3 Days Credited'}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Dining Quality & Feedback Engine */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Dining Committee Feedback &amp; Suggestions
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Direct line to Chief Chef and Student Hostel Mess Secretary
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            Anonymous &amp; Confidential
          </span>
        </div>

        {feedbackSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-sm block">Feedback Dispatched to Mess Desk!</span>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Thank you, Pooja! Your dining rating has been logged in the Annapurna Quality Control report for today.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-zinc-700 dark:text-zinc-300 block font-semibold">
                  Course Category
                </span>
                <select
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                >
                  <option value="Breakfast">Breakfast Course</option>
                  <option value="Lunch">Lunch Service</option>
                  <option value="Snacks">Evening High Tea</option>
                  <option value="Dinner">Dinner Service</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="text-zinc-700 dark:text-zinc-300 block font-semibold">
                  Overall Taste &amp; Quality Rating
                </span>
                <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                Comments or Recipe Suggestions
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your thoughts on food temperature, seasoning, hygiene, or menu suggestions..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-pink-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.25)] hover:scale-[1.01]"
            >
              Submit Quality Feedback
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
