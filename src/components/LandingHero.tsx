import React from 'react';
import {
  Building2,
  Utensils,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Wifi,
  Coffee,
  BookOpen,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSection } from './HeroSection';
import { HostelRoomsSection } from './HostelRoomsSection';

export const LandingHero: React.FC = () => {
  const { openAuthModal, switchDemoUser, students, wardens, notices, weeklyMenu, setIsSOSModalOpen } = useApp();

  const todayMenu = (weeklyMenu && weeklyMenu.length > 0 ? weeklyMenu[0] : null) || {
    dayOfWeek: 'Monday',
    breakfast: { time: '07:30 AM - 09:00 AM', items: ['Poha / Upma', 'Sprouted Moong', 'Tea / Milk'], isVeg: true },
    lunch: { time: '12:30 PM - 02:30 PM', items: ['Paneer Butter Masala', 'Dal Tadka', 'Jeera Rice', 'Chapati', 'Salad'], isVeg: true },
    snacks: { time: '05:00 PM - 06:00 PM', items: ['Veg Sandwich / Samosa', 'Coffee / Tea'], isVeg: true },
    dinner: { time: '07:30 PM - 09:30 PM', items: ['Mix Veg Handi', 'Kadhi Pakoda', 'Steamed Rice', 'Phulka', 'Gulab Jamun'], isVeg: true },
  };

  return (
    <div id="landing-container" className="relative w-full bg-[#09090B] text-zinc-100 overflow-hidden font-body">
      {/* 1. HeroSection */}
      <HeroSection />

      {/* 2. Portal Access Suites: Student & Warden Management Portals */}
      <section id="portal-suite" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3.5 py-1 rounded-full border border-violet-500/20 inline-block mb-3 font-mono">
            Integrated Campus Portals
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight mb-3">
            Choose Your Workspace
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Unified collegiate living and administrative operations for Sakhi Girls Hostel and Annapurna Dining Hall at MCET Shegaon.
          </p>
        </div>

        {/* Dual Access Cards with Rich Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Student Access Portal Card */}
          <div className="p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-violet-300 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 font-mono">
                  Student Resident
                </span>
              </div>
              <h3 className="font-display text-2xl text-white font-bold mb-2.5">
                Student Living Desk
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                Manage room allocations, check daily meal timetables, generate digital outstation gate passes, lodge maintenance tickets, and track hostel fee dues.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/[0.08]">
              <button
                onClick={() => openAuthModal('student')}
                className="w-full py-3.5 px-6 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-500 font-medium">Quick Demo:</span>
                <button
                  onClick={() => switchDemoUser('student', students[0]?.id || 'std-1')}
                  className="text-xs text-violet-400 hover:bg-violet-500/10 px-3 py-1 rounded-lg border border-white/[0.08] transition-colors cursor-pointer font-medium"
                >
                  Rahul (CS)
                </button>
                <button
                  onClick={() => switchDemoUser('student', students[1]?.id || 'std-2')}
                  className="text-xs text-violet-400 hover:bg-violet-500/10 px-3 py-1 rounded-lg border border-white/[0.08] transition-colors cursor-pointer font-medium"
                >
                  Priya (IT)
                </button>
              </div>
            </div>
          </div>

          {/* Warden & Administration Portal Card */}
          <div className="p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold text-amber-300 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-mono">
                  Hostel Administration
                </span>
              </div>
              <h3 className="font-display text-2xl text-white font-bold mb-2.5">
                Warden &amp; Staff Office
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                Review room occupancy, verify digital leave passes, assign maintenance staff to repair tickets, manage dining rations, and publish campus circulars.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/[0.08]">
              <button
                onClick={() => openAuthModal('warden')}
                className="w-full py-3.5 px-6 rounded-full bg-[#16181D] hover:bg-[#1E2026] text-white light:!text-zinc-900 light:!bg-zinc-100 light:hover:!bg-zinc-200 border border-white/[0.12] light:border-zinc-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:border-white/[0.24]"
              >
                <span>Enter Warden Desk</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-zinc-500 font-medium">Quick Demo:</span>
                <button
                  onClick={() => switchDemoUser('warden', wardens[0]?.id || 'warden-1')}
                  className="text-xs text-amber-400 hover:bg-amber-500/10 px-3 py-1 rounded-lg border border-white/[0.08] transition-colors cursor-pointer font-medium"
                >
                  Dr. Deshmukh (Chief)
                </button>
                <button
                  onClick={() => switchDemoUser('warden', wardens[1]?.id || 'warden-2')}
                  className="text-xs text-amber-400 hover:bg-amber-500/10 px-3 py-1 rounded-lg border border-white/[0.08] transition-colors cursor-pointer font-medium"
                >
                  Prof. Joshi (Boys)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Authentic Hostel Rooms & Living Spaces Section */}
      <HostelRoomsSection />

      {/* 4. Annapurna Mess & Amenities Section (#amenities-section) */}
      <section id="amenities-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3.5 py-1 rounded-full border border-violet-500/20 inline-block mb-3 font-mono">
              Culinary &amp; Campus Amenities
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Annapurna Dining &amp; Campus Facilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-3 md:mt-0 leading-relaxed">
            Hygienic 4-meal pure vegetarian dining planned by nutritionists, with high-speed fiber internet and round-the-clock power backup.
          </p>
        </div>

        {/* 6 Amenities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center mb-3 border border-violet-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">4-Meal Mess</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Unlimited Thali</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
              <Wifi className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">Gigabit WiFi</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Fiber Optic</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">24/7 Power</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Solar + DG Set</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">Study Hall</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Air Conditioned</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/20">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">Night Canteen</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Till 02:00 AM</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-3 border border-sky-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">Security Desk</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">CCTV Guarded</span>
          </div>
        </div>

        {/* Live Mess Timetable Explorer */}
        <div className="p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-violet-400 font-bold font-mono">
                Daily Meal Timetable
              </span>
              <h3 className="font-display text-2xl text-white font-bold mt-0.5">
                Annapurna Dining • Monday Special
              </h3>
            </div>
            <button
              onClick={() => openAuthModal('student')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
            >
              View Full Week Menu &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400 font-semibold block mb-1 font-mono">
                Breakfast • {todayMenu.breakfast.time}
              </span>
              <h4 className="text-xs font-bold text-white mb-2">Morning Fuel</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {todayMenu.breakfast.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400 font-semibold block mb-1 font-mono">
                Lunch • {todayMenu.lunch.time}
              </span>
              <h4 className="text-xs font-bold text-white mb-2">Main Thali</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {todayMenu.lunch.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400 font-semibold block mb-1 font-mono">
                Snacks • {todayMenu.snacks.time}
              </span>
              <h4 className="text-xs font-bold text-white mb-2">High Tea</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {todayMenu.snacks.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400 font-semibold block mb-1 font-mono">
                Dinner • {todayMenu.dinner.time}
              </span>
              <h4 className="text-xs font-bold text-white mb-2">Nutritious Feast</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {todayMenu.dinner.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Community Section (#community-section) */}
      <section id="community-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3.5 py-1 rounded-full border border-violet-500/20 inline-block mb-3 font-mono">
              Official Bulletin
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Community Notices &amp; Circulars
            </h2>
          </div>
          <button
            onClick={() => openAuthModal('student')}
            className="text-xs text-violet-400 font-semibold hover:underline cursor-pointer"
          >
            Open Notice Board &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.slice(0, 3).map((notice) => (
            <div
              key={notice.id}
              className="p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 font-bold uppercase tracking-wider border border-violet-500/30 font-mono">
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {notice.datePublished}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {notice.description || notice.content}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                <span>By: {notice.publishedBy || notice.postedBy}</span>
                <span className="text-zinc-300 font-semibold">{notice.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contact Us Section (#contact-section) */}
      <section id="contact-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#111215]/90 border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3.5 py-1 rounded-full border border-violet-500/20 inline-block font-mono">
              Direct Assistance &amp; Help Desk
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
              Connect With Hostel Administration
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Have questions regarding admissions, room change requests, dietary needs, or emergency support? Contact the Warden Office or activate the campus crisis helpline.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSOSModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(244,63,94,0.2)]"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Campus SOS Desk</span>
            </button>
            <button
              onClick={() => openAuthModal('student')}
              className="px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.35)]"
            >
              <span>Student Sign In</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
