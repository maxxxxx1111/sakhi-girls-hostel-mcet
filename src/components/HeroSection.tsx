import React, { useRef } from 'react';
import { useVideoFadeLoop } from '../hooks/useVideoFadeLoop';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Utensils,
  QrCode,
  MessageSquare,
  Lock,
  Sparkles,
  Phone,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoFadeLoop(videoRef);
  const { openAuthModal, role, setActiveTab, switchDemoUser, wardens } = useApp();

  const handleGetStarted = () => {
    if (role) {
      setActiveTab('overview');
    } else {
      openAuthModal('student');
    }
  };

  return (
    <div
      id="hero-section"
      className="relative min-h-[92vh] w-full overflow-hidden bg-[#0A070D] flex items-center justify-center selection:bg-rose-500 selection:text-white"
    >
      {/* Background cinematic video with rich atmospheric color grading */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-40 mix-blend-luminosity filter brightness-90 contrast-110"
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
      />

      {/* Atmospheric lighting gradients - Deep Obsidian, Rose Gold & Royal Mulberry */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0A070D]/90 via-[#0A070D]/70 to-[#0A070D] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-pink-500/15 via-rose-600/10 to-purple-800/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[400px] h-[300px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle fine architectural grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Main Hero Container */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20 max-w-5xl mx-auto">
        
        {/* Institutional Eyebrow Crest */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl text-rose-200 text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-7 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>Mauli College of Engineering &amp; Technology</span>
          <span className="text-white/30">•</span>
          <span className="text-white/80 font-normal">Sakhi Girls Residential Wing</span>
        </div>

        {/* Sophisticated Editorial Headline (No generic AI slogans) */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.08] max-w-4xl text-white">
          A Sanctuary of Safety,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300">
            Sisterhood
          </span>{' '}
          &amp; Academic Excellence.
        </h1>

        {/* Authoritative Collegiate Subtitle */}
        <p className="text-base sm:text-lg text-zinc-300/90 max-w-2xl mt-6 leading-relaxed font-normal">
          The premier residential facility for women in engineering at MCET Shegaon. Designed for comfort, dignity, and round-the-clock peace of mind with biometric security and Annapurna dining.
        </p>

        {/* Balanced, Cohesive Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mt-9 w-full sm:w-auto">
          {/* Primary Action */}
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-sm transition-all shadow-[0_4px_24px_rgba(236,72,153,0.4)] hover:shadow-[0_8px_32px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{role ? 'Open Resident Dashboard' : 'Student Resident Portal'}</span>
            <ArrowRight className="w-4 h-4 text-white/90" />
          </button>

          {/* Secondary Action */}
          {!role && (
            <button
              onClick={() => openAuthModal('warden')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.15] hover:border-white/[0.3] text-zinc-100 font-semibold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4 text-rose-300" />
              <span>Warden Administration</span>
            </button>
          )}

          {/* WhatsApp Bot Integration Action */}
          <button
            onClick={() => {
              if (role !== 'warden') {
                switchDemoUser('warden', wardens[0]?.id || 'warden-1');
              }
              setActiveTab('whatsapp');
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#0F291E]/80 hover:bg-[#14382A] border border-emerald-500/40 hover:border-emerald-500/60 text-emerald-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Sentry Bot</span>
          </button>
        </div>

        {/* 3 Bespoke Institutional Pillars (Replaces generic checkbox pills) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full text-left">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md hover:border-rose-500/30 transition-all space-y-1.5 group">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                Biometric Sentry
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1" style={{ color: '#FFFFFF' }}>
              Biometric Outpasses &amp; QR Clearance
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated parent SMS dispatches, warden sign-off, and cryptographic entry verification at the main campus gates.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md hover:border-rose-500/30 transition-all space-y-1.5 group">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                Annapurna Dining
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1" style={{ color: '#FFFFFF' }}>
              FSSAI A+ Pure Satvik Kitchen
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Four daily dietician-curated vegetarian meals, real-time RSVP attendance, and automated ₹85/day dining leave rebates.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md hover:border-rose-500/30 transition-all space-y-1.5 group">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                Full Spectrum Safety
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1" style={{ color: '#FFFFFF' }}>
              24/7 Rector Care &amp; Rapid SOS
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Resident lady wardens, biometric gate curfew at 10:00 PM, on-campus health clinic, and dedicated security dispatch.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
