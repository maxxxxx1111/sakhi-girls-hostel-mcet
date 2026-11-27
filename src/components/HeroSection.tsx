import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Utensils,
  QrCode,
  MessageSquare,
  Lock,
  Phone,
  CheckCircle2,
  MapPin,
  Clock,
  Heart,
  BookOpen,
  Award,
  ChevronRight,
  UserCheck,
  Wifi,
  Coffee,
  Sparkles,
} from 'lucide-react';

export function HeroSection() {
  const { openAuthModal, role, setActiveTab, switchDemoUser, wardens } = useApp();

  const handleGetStarted = () => {
    if (role) {
      setActiveTab('overview');
    } else {
      openAuthModal('student');
    }
  };

  return (
    <div id="hero-section" className="relative w-full bg-[#FAF8F5] dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* 1. Official College Affiliation & Accreditation Masthead */}
      <div className="w-full bg-[#1A2639] text-zinc-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/[0.1]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] font-medium tracking-wide">
            <span className="font-semibold text-amber-300">Shri Gajanan Shikshan Sanstha's</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span>Mauli College of Engineering &amp; Technology, Shegaon</span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:inline text-zinc-300">Approved by AICTE New Delhi | Affiliated to SGBAU Amravati (DTE: EN-1282)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-300 shrink-0">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Khamgaon Road, Shegaon - 444203</span>
            </span>
            <span className="hidden lg:flex items-center gap-1 font-mono">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Hostel Office: +91 94228 77412</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Campus Live Advisory / Important Circular Banner */}
      <div className="w-full bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 dark:from-rose-950/40 dark:via-purple-950/30 dark:to-amber-950/30 border-b border-rose-200/80 dark:border-rose-900/50 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
              Hostel Notice
            </span>
            <p className="text-zinc-800 dark:text-zinc-200 text-xs font-medium">
              <span className="font-bold">Circular #MCET/SGH/26:</span> Night gate curfew strictly at 10:00 PM. Parents can approve outstation outpasses directly via the WhatsApp Sentry Bot.
            </p>
          </div>
          <button
            onClick={() => {
              if (role) setActiveTab('notices');
              else openAuthModal('student');
            }}
            className="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-white flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <span>Read circulars</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Hero Presentation: Warm, Dignified, Academic & Human */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Editorial Presentation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Real Campus Identity Crest */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-rose-100/80 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>Sakhi Girls' Residential Wing &amp; Annapurna Dining Hall</span>
              <span className="text-rose-400">•</span>
              <span className="font-mono text-[11px] font-bold">Est. 2011</span>
            </div>

            {/* Humanized Academic Headline with Real Warmth */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F1E36] dark:text-white tracking-tight leading-[1.12]">
              A Safe, Caring &amp; Disciplined Home for Women in Engineering.
            </h1>

            {/* Genuine, Reassuring Collegiate Copy */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
              Welcome to Sakhi Girls' Hostel at Mauli College of Engineering &amp; Technology, Shegaon. 
              Built on campus to provide 350+ female engineering scholars with secure accommodation, 
              hygienic dining at Annapurna Mess, 24×7 faculty rector care, and a peaceful environment to excel in their academic careers.
            </p>

            {/* Pragmatic Action Gateways */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              {/* Primary: Student Resident Portal */}
              <button
                onClick={handleGetStarted}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 hover:from-rose-800 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-[0_4px_16px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{role ? 'Enter Resident Portal' : 'Student Resident Portal'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              {/* Secondary: Warden Administration */}
              {!role && (
                <button
                  onClick={() => openAuthModal('warden')}
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#151D2E] hover:bg-zinc-50 dark:hover:bg-[#1E293B] border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:scale-[1.01]"
                >
                  <Building2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span>Warden Administration</span>
                </button>
              )}

              {/* WhatsApp Gate Pass Cloud Bot */}
              <button
                onClick={() => {
                  if (role !== 'warden') {
                    switchDemoUser('warden', wardens[0]?.id || 'warden-1');
                  }
                  setActiveTab('whatsapp');
                }}
                className="px-5 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                title="Parent WhatsApp Outpass Sentry Bot"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Parent WhatsApp Bot</span>
              </button>
            </div>

            {/* Quick Human Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-[#0F1E36] dark:text-white font-display">
                  350+
                </span>
                <p className="text-[11px] text-zinc-500 font-medium">Resident Scholars</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-[#0F1E36] dark:text-white font-display">
                  4 Wings
                </span>
                <p className="text-[11px] text-zinc-500 font-medium">FE to BE Blocks</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-[#0F1E36] dark:text-white font-display">
                  4 Meals
                </span>
                <p className="text-[11px] text-zinc-500 font-medium">Annapurna Dining</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
                  100%
                </span>
                <p className="text-[11px] text-zinc-500 font-medium">Ragging-Free Campus</p>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Personal Note from Chief Rector & Student Voices */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Rector's Reassuring Letter Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#151D2E] border-2 border-rose-200/90 dark:border-rose-900/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 flex items-center justify-center text-rose-700 dark:text-rose-300 font-bold text-lg">
                    SG
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Dr. Sunita Gaikwad
                    </h3>
                    <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                      Chief Rector &amp; Associate Professor (CSE)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  On Campus
                </span>
              </div>

              <blockquote className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border-l-3 border-rose-500">
                "Sending your daughter away to college is a sacred trust. Our residential faculty team lives right on campus with the scholars. We ensure every student receives maternal care, medical attention at any hour, strict safety, and home-style nutrition so parents can rest completely assured."
              </blockquote>

              <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Direct: +91 94228 77412</span>
                </span>
                <span className="font-mono text-[11px]">Visiting: 4:00 PM – 7:00 PM</span>
              </div>
            </div>

            {/* Resident Voice Quote */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#151D2E]/80 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                PS
              </div>
              <div className="space-y-0.5">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  "The 10:00 PM curfew, silent study hours, and hygienic dining at Annapurna made my transition from Akola to MCET seamless."
                </p>
                <span className="text-[11px] font-semibold text-zinc-500 block">
                  — Pooja Sharma (FE Computer Science, Room S-101)
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* 4. Four Authentic Campus Facility Cards (Real Human Grounding) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 text-left">
          
          {/* Card 1: Wings */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151D2E] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-rose-400 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              Four Academic Wings
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Dedicated residential floors for First Year (FE), Second Year (SE), Third Year (TE), and Final Year (BE) with study desks and individual almirahs.
            </p>
          </div>

          {/* Card 2: Annapurna */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151D2E] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-amber-400 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              Annapurna Dining Hall
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              4 nutritious vegetarian meals daily planned by nutritionists, unlimited thalis, FSSAI A+ hygiene audits, and automated ₹85/day dining leave rebates.
            </p>
          </div>

          {/* Card 3: 24/7 Security */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151D2E] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-emerald-400 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              24×7 Lady Security &amp; Passes
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Round-the-clock female security sentries, biometric turnstile curfew logs at 10:00 PM, and automated WhatsApp parent confirmation for all outpasses.
            </p>
          </div>

          {/* Card 4: Healthcare & Living */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151D2E] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-purple-400 transition-all space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              Healthcare &amp; Wi-Fi Campus
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              On-campus health dispensary with visiting lady doctor, tie-up with Shegaon Civil Hospital, 1Gbps high-speed NKN fiber Wi-Fi, and solar hot water.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
