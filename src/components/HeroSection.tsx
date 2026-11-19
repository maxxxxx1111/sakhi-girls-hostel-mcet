import React, { useRef } from 'react';
import { useVideoFadeLoop } from '../hooks/useVideoFadeLoop';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoFadeLoop(videoRef);
  const { openAuthModal, role, setActiveTab } = useApp();

  const handleGetStarted = () => {
    if (role) {
      setActiveTab('overview');
    } else {
      openAuthModal('student');
    }
  };

  return (
    <div id="hero-section" className="relative min-h-[90vh] w-full overflow-hidden bg-[#09090B] flex items-center justify-center">
      {/* Video background layer - fully vivid with optimal contrast */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-85"
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
      />

      {/* Cinematic dark scrim: ensures crystal-clear readability and contrast over any video frame */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#09090B]/80 via-black/45 to-[#09090B] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-black/30 pointer-events-none" />

      {/* Hero content */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 sm:pt-20 pb-20 max-w-5xl mx-auto">
        
        {/* Campus Identity Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111215]/85 backdrop-blur-xl border border-white/20 text-violet-300 text-xs font-semibold mb-6 shadow-[0_0_24px_rgba(139,92,246,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span style={{ color: '#DDD6FE' }}>Mauli College of Engineering &amp; Technology • Digital Living Suite</span>
        </div>

        {/* Display Heading with pristine contrast against visible background */}
        <h1
          className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.08] max-w-4xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-bottom-3 duration-400"
          style={{ color: '#FFFFFF' }}
        >
          Residential living, dining, &amp; administration{' '}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(139,92,246,0.5)]">
            made simple.
          </span>
        </h1>

        {/* Subtitle with high contrast and readable typography */}
        <p
          className="hero-description text-base sm:text-lg max-w-2xl mt-5 leading-relaxed font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ color: '#F4F4F5' }}
        >
          A centralized, intuitive campus ecosystem for MCET students and wardens. Seamless room allotments, daily Annapurna dining timetable, QR gate passes, and maintenance triage.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 animate-in fade-in slide-in-from-bottom-5 duration-600">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-[0_0_24px_rgba(139,92,246,0.45)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{ color: '#FFFFFF' }}
          >
            <span>{role ? 'Open Workspace Dashboard' : 'Student Portal Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!role && (
            <button
              onClick={() => openAuthModal('warden')}
              className="hero-btn-secondary w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#16181D]/90 hover:bg-[#1E2026] border border-white/25 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-xl hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]"
              style={{ color: '#FFFFFF' }}
            >
              <Building2 className="w-4 h-4 text-violet-400" />
              <span style={{ color: '#FFFFFF' }}>Warden Administration</span>
            </button>
          )}
        </div>

        {/* Glass Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-12 text-xs">
          <div className="hero-trust-badge flex items-center gap-2 bg-[#111215]/85 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/15 shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold" style={{ color: '#FFFFFF' }}>Digital QR Gate Passes</span>
          </div>
          <div className="hero-trust-badge flex items-center gap-2 bg-[#111215]/85 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/15 shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold" style={{ color: '#FFFFFF' }}>Daily 4-Meal Annapurna Timetable</span>
          </div>
          <div className="hero-trust-badge flex items-center gap-2 bg-[#111215]/85 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/15 shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold" style={{ color: '#FFFFFF' }}>Automated Maintenance Triage</span>
          </div>
        </div>
      </section>
    </div>
  );
}

