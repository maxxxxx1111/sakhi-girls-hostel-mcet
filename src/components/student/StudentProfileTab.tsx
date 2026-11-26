import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Building2,
  Phone,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  Save,
  Mail,
  Heart,
  Settings,
  Lock,
  Sun,
  Moon,
  Laptop,
  Globe,
  Type,
  Eye,
  Activity,
  QrCode,
  Check,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Language } from '../../utils/translations';

export const StudentProfileTab: React.FC = () => {
  const {
    currentStudent,
    updateStudent,
    themePreference,
    setThemePreference,
    language,
    setLanguage,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    setIsOfflinePassModalOpen,
    t,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentStudent?.mobile || '');
  const [email, setEmail] = useState(currentStudent?.email || '');
  const [parentPhone, setParentPhone] = useState(currentStudent?.parentPhone || '');
  const [emergencyContact, setEmergencyContact] = useState(currentStudent?.emergencyContact || '');
  const [dietaryPref, setDietaryPref] = useState('Vegetarian');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentStudent) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      ...currentStudent,
      mobile: phone,
      email,
      parentPhone,
      emergencyContact,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const initials = currentStudent.name
    ? currentStudent.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PS';

  const languages: { id: Language; label: string; sub: string }[] = [
    { id: 'en', label: 'English', sub: 'Campus Standard' },
    { id: 'hi', label: 'हिन्दी', sub: 'हिंदी' },
    { id: 'mr', label: 'मराठी', sub: 'मराठी' },
  ];

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-16">
      {/* 1. Hero Command Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-950/40 dark:via-purple-950/20 dark:to-zinc-950/60 border border-pink-200/60 dark:border-pink-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-500/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-pink-800/60 text-xs font-semibold text-pink-700 dark:text-pink-300 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
              <span>Institutional Identity &amp; Digital Credential</span>
              <span className="w-1 h-1 rounded-full bg-pink-400" />
              <span>MCET Shegaon</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Resident Scholar Profile
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Official academic enrollment, smart biometric turnstile pass, guardian directory, and system accessibility preferences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsOfflinePassModalOpen(true)}
              className="h-10 px-4 rounded-xl text-xs font-bold bg-white dark:bg-zinc-800 border border-pink-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-pink-50 dark:hover:bg-zinc-700 flex items-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <QrCode className="w-4 h-4 text-pink-500" />
              <span>Offline Gate Pass</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`h-10 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                isEditing
                  ? 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                  : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.02]'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Contact Info'}</span>
            </button>
          </div>
        </div>
      </section>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Resident scholar profile changes updated and saved securely!</span>
        </div>
      )}

      {/* 2. Holographic Digital Student Residence Smart Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-0.5 shadow-xl shadow-pink-500/10">
        <div className="rounded-[22px] bg-white dark:bg-[#18131E] p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle watermark background */}
          <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none">
            <Building2 className="w-64 h-64 text-zinc-900 dark:text-white" />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            {/* Left: Avatar & Key Badges */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 p-1 shadow-md shadow-pink-500/20 shrink-0">
                <div className="w-full h-full rounded-[20px] bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center font-extrabold text-2xl text-pink-600 dark:text-pink-400 font-mono">
                  {currentStudent.avatar ? (
                    <img
                      src={currentStudent.avatar}
                      alt={currentStudent.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[11px] font-bold border border-pink-200 dark:border-pink-800">
                    Hostel Scholar
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                    Sentry Active
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {currentStudent.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  {currentStudent.department} • {currentStudent.year.includes('Year') ? currentStudent.year : `${currentStudent.year} Year`} B.Tech
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono">
                  <span className="text-pink-600 dark:text-pink-400 font-bold bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-lg border border-pink-200 dark:border-pink-800/40">
                    PRN: {currentStudent.studentId}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Security Hologram QR */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-pink-50/60 dark:bg-[#120F14] border border-pink-100 dark:border-zinc-800 shrink-0 space-y-2">
              <div className="w-20 h-20 bg-white p-1.5 rounded-xl border-2 border-pink-300 shadow-sm flex items-center justify-center">
                <QrCode className="w-16 h-16 text-black" />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
                TURNSTILE RFID PASS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Student Form Information */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Academic Information (Read-only verified) */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Academic Enrollment</span>
            </h3>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono">
              <Lock className="w-3 h-3 text-pink-500" />
              <span>Registrar Office Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Full Name</span>
              <span className="font-bold text-zinc-900 dark:text-white mt-0.5 block">
                {currentStudent.name}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Enrollment / PRN</span>
              <span className="font-bold text-pink-600 dark:text-pink-400 font-mono mt-0.5 block">
                {currentStudent.studentId}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Department</span>
              <span className="font-bold text-zinc-900 dark:text-white mt-0.5 block">
                {currentStudent.department}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Academic Year</span>
              <span className="font-bold text-zinc-900 dark:text-white mt-0.5 block">
                {currentStudent.year.includes('Year') ? currentStudent.year : `${currentStudent.year} Year`} B.Tech
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Contact Details */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-pink-500" />
            <span>Personal Scholar Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">Student Mobile Number</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 mt-1.5 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500 font-mono"
                />
              ) : (
                <span className="font-bold text-zinc-900 dark:text-white font-mono mt-1 block">
                  {currentStudent.mobile}
                </span>
              )}
            </div>
            <div>
              <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">College Registered Email</span>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 mt-1.5 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                />
              ) : (
                <span className="font-bold text-zinc-900 dark:text-white mt-1 block">
                  {currentStudent.email}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Emergency Contacts & Guardian Hotline */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-500" />
            <span>Guardian Directory &amp; Emergency Escalation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800 space-y-2">
              <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">
                Parent / Primary Guardian Mobile
              </span>
              {isEditing ? (
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500 font-mono"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-white font-mono text-sm">
                    {currentStudent.parentPhone}
                  </span>
                  <a
                    href={`https://wa.me/91${currentStudent.parentPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              )}
              <span className="text-[11px] text-zinc-400 block">
                Receives gate outpass SMS confirmations and night curfew alerts.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800 space-y-2">
              <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">
                Local Guardian / Alternate Emergency
              </span>
              {isEditing ? (
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500 font-mono"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-white font-mono text-sm">
                    {currentStudent.emergencyContact || '+91 94221 88990'}
                  </span>
                  <a
                    href={`tel:${currentStudent.emergencyContact || '9422188990'}`}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              )}
              <span className="text-[11px] text-zinc-400 block">
                Designated contact for medical consultation or hostel leave pick-up.
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Dietary & Living Preferences */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Residential Living Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">Dietary Preference</span>
              {isEditing ? (
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full h-10 px-3 mt-1.5 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                >
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Jain">Satvik / Jain Diet</option>
                </select>
              ) : (
                <span className="font-bold text-zinc-900 dark:text-white mt-1 block">
                  {dietaryPref} (Annapurna Registered)
                </span>
              )}
            </div>
            <div>
              <span className="text-zinc-600 dark:text-zinc-400 block font-semibold">
                Curfew SMS Notifications
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                Automated Gateway Enabled
              </span>
            </div>
          </div>
        </section>

        {/* Save Button if Editing */}
        {isEditing && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-11 px-7 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        )}
      </form>

      {/* 4. Theme System & Accessibility Preferences */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-pink-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              System Theme &amp; Accessibility Preferences
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            Stored Locally
          </span>
        </div>

        {/* 1. Theme Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-pink-500" />
            <span>Theme Mode (Light / Dark / System)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light', label: t('light'), icon: Sun, desc: 'Boutique pink & crisp ivory' },
              { id: 'dark', label: t('dark'), icon: Moon, desc: 'Velvet midnight & soft glow' },
              { id: 'system', label: t('system'), icon: Laptop, desc: 'Follows operating system' },
            ].map((theme) => {
              const Icon = theme.icon;
              const active = themePreference === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemePreference(theme.id as any)}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-pink-50/70 dark:bg-[#261E2E] border-pink-500 text-pink-600 dark:text-pink-400 shadow-xs'
                      : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-bold text-xs text-zinc-900 dark:text-white">
                        {theme.label}
                      </span>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 text-pink-500" />}
                  </div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{theme.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-pink-500" />
            <span>Preferred Interface Language</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map((lang) => {
              const active = language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? 'bg-pink-50/70 dark:bg-[#261E2E] border-pink-500 text-pink-600 dark:text-pink-400 shadow-xs'
                      : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400 hover:border-pink-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-white block">
                      {lang.label}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{lang.sub}</span>
                  </div>
                  {active && <Check className="w-4 h-4 text-pink-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Text Scaling & Display Accessibility */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-pink-500" />
            <span>Text Scaling &amp; Contrast</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'normal', label: t('normalText'), desc: 'Standard 100%' },
              { id: 'large', label: t('largeText'), desc: 'Comfortable 112%' },
              { id: 'larger', label: t('largerText'), desc: 'Spacious 125%' },
            ].map((size) => {
              const active = textSize === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setTextSize(size.id as any)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-pink-50/70 dark:bg-[#261E2E] border-pink-500 text-pink-600 dark:text-pink-400 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="text-xs font-bold block">{size.label}</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{size.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Reduced Motion */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-zinc-900 dark:text-white">
                  {t('reducedMotion')}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Instant transitions without animations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  reducedMotion ? 'bg-pink-500' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* High Contrast */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-zinc-900 dark:text-white">
                  {t('highContrast')}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Sharpened border contrast
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  highContrast ? 'bg-pink-500' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
