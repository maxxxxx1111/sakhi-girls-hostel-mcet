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
    : 'S';

  const languages: { id: Language; label: string; sub: string }[] = [
    { id: 'en', label: 'English', sub: 'Campus Standard' },
    { id: 'hi', label: 'हिन्दी', sub: 'हिंदी' },
    { id: 'mr', label: 'मराठी', sub: 'मराठी' },
  ];

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-4xl mx-auto pb-12">
      {/* Header & Edit Control */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
            {t('profile')} &amp; Preferences
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
            Academic records, room allotment, emergency contacts, theme system, and accessibility settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOfflinePassModalOpen(true)}
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white hover:border-[#EC4899]/40 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
            <span>Offline Gate Pass</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              isEditing
                ? 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                : 'bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white shadow-[0_4px_14px_rgba(236,72,153,0.3)]'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Details'}</span>
          </button>
        </div>
      </section>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/30 text-[#15803D] dark:text-[#2DD4A8] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile changes updated and saved successfully!</span>
        </div>
      )}

      {/* Main Profile Info Header */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#EC4899] dark:text-[#F472B6] flex items-center justify-center text-xl font-bold font-mono overflow-hidden shrink-0 shadow-2xs">
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

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
                {currentStudent.name}
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                {currentStudent.department} • {currentStudent.year} Year
              </p>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#FCE7F3] dark:bg-[#2B2333] text-[#EC4899] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B] font-mono font-semibold self-center sm:self-auto">
              PRN: {currentStudent.studentId}
            </span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B7280] dark:text-[#A79CB0]">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
              <span className="font-semibold text-[#1F2937] dark:text-white">
                Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
              </span>
            </span>
            <span>•</span>
            <span>{currentStudent.hostelName}</span>
          </div>
        </div>
      </section>

      {/* Theme, Personalization & Accessibility Section */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6]" />
            <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">
              Theme System &amp; Accessibility Preferences
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FCE7F3] dark:bg-[#2B2333] text-[#EC4899] dark:text-[#F472B6] font-semibold border border-[#FBCFE8] dark:border-[#38283B]">
            Saved Locally
          </span>
        </div>

        {/* 1. Theme Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-[#6B7280] dark:text-[#A79CB0] uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
            <span>Theme Mode (Light / Dark / Device Setting)</span>
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
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FFF5F8] dark:bg-[#261E2E] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6] shadow-2xs'
                      : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:border-[#FBCFE8] dark:hover:border-[#EC4899]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-bold text-xs text-[#1F2937] dark:text-white">
                        {theme.label}
                      </span>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />}
                  </div>
                  <span className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">{theme.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-[#6B7280] dark:text-[#A79CB0] uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
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
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FFF5F8] dark:bg-[#261E2E] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6] shadow-2xs'
                      : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:border-[#FBCFE8] dark:hover:border-[#EC4899]/30'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#1F2937] dark:text-white block">
                      {lang.label}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">{lang.sub}</span>
                  </div>
                  {active && <Check className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Text Scaling & Display Accessibility */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#6B7280] dark:text-[#A79CB0] uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
            <span>Text Size &amp; Readability</span>
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
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FFF5F8] dark:bg-[#261E2E] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6] font-bold shadow-2xs'
                      : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                  }`}
                >
                  <span className="text-xs font-semibold block">{size.label}</span>
                  <span className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">{size.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Reduced Motion */}
            <div className="p-3.5 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[#1F2937] dark:text-white">
                  {t('reducedMotion')}
                </p>
                <p className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">
                  Instant transitions without animations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  reducedMotion ? 'bg-[#EC4899]' : 'bg-[#E5E7EB] dark:bg-[#332A3B]'
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
            <div className="p-3.5 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[#1F2937] dark:text-white">
                  {t('highContrast')}
                </p>
                <p className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">
                  Sharpened border contrast
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  highContrast ? 'bg-[#EC4899]' : 'bg-[#E5E7EB] dark:bg-[#332A3B]'
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

      {/* Main Student Form Information */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Academic Information (Read-only verified) */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-3">
            <h3 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D] dark:text-[#2DD4A8]" />
              <span>Verified Academic Records</span>
            </h3>
            <span className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Verified by College Registrar</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">Full Name</span>
              <span className="font-bold text-[#1F2937] dark:text-white mt-0.5 block">
                {currentStudent.name}
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">Enrollment / PRN</span>
              <span className="font-bold text-[#EC4899] dark:text-[#F472B6] font-mono mt-0.5 block">
                {currentStudent.studentId}
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">Department</span>
              <span className="font-bold text-[#1F2937] dark:text-white mt-0.5 block">
                {currentStudent.department}
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">Academic Year</span>
              <span className="font-bold text-[#1F2937] dark:text-white mt-0.5 block">
                {currentStudent.year} Year B.Tech
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Contact Details */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6]" />
            <span>Personal Contact Info</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">Student Mobile Number</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                />
              ) : (
                <span className="font-bold text-[#1F2937] dark:text-white font-mono mt-0.5 block">
                  {currentStudent.mobile}
                </span>
              )}
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">College Registered Email</span>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                />
              ) : (
                <span className="font-bold text-[#1F2937] dark:text-white mt-0.5 block">
                  {currentStudent.email}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Emergency Contacts */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#EF4444]" />
            <span>Emergency Contacts &amp; Parents</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">
                Parent / Guardian Primary Mobile
              </span>
              {isEditing ? (
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                />
              ) : (
                <span className="font-bold text-[#1F2937] dark:text-white font-mono mt-0.5 block">
                  {currentStudent.parentPhone}
                </span>
              )}
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">
                Local Guardian / Alternate Emergency
              </span>
              {isEditing ? (
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                />
              ) : (
                <span className="font-bold text-[#1F2937] dark:text-white font-mono mt-0.5 block">
                  {currentStudent.emergencyContact || '+91 94221 88990'}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Preferences */}
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6]" />
            <span>Living Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">Dietary Preference</span>
              {isEditing ? (
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full h-9 px-3 mt-1 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                >
                  <option value="Vegetarian">Strict Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Jain">Jain Diet (No Root Veg)</option>
                </select>
              ) : (
                <span className="font-bold text-[#1F2937] dark:text-white mt-0.5 block">
                  {dietaryPref}
                </span>
              )}
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] block">
                Curfew SMS Notifications
              </span>
              <span className="font-bold text-[#15803D] dark:text-[#2DD4A8] mt-0.5 block">
                Enabled for Parent
              </span>
            </div>
          </div>
        </section>

        {/* Save Button if Editing */}
        {isEditing && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)]"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
