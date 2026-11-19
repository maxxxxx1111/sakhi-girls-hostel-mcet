import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  User,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Phone,
  Building,
  KeyRound,
  Check,
  AlertCircle,
  HelpCircle,
  QrCode,
  Wifi,
  Utensils,
  ChevronRight,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalRole,
    login,
    registerStudent,
    students,
    wardens,
  } = useApp();

  // Auth Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>(authModalRole);
  
  // Sign In States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Forgot Password States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Sign Up / Registration States
  const [signUpData, setSignUpData] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female',
    studentId: '',
    department: 'Computer Science & Engineering',
    year: 'First Year',
    division: 'A',
    email: '',
    mobile: '',
    parentName: '',
    parentPhone: '',
    roomType: 'Classic Twin Suite',
    bloodGroup: 'O+',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    setSelectedRole(authModalRole);
    if (authModalRole === 'student') {
      setIdentifier(students[0]?.studentId || 'MCET2024CS042');
    } else {
      setIdentifier(wardens[0]?.wardenId || 'WARDEN-CHIEF-01');
    }
    setErrorMsg('');
    setIsForgotOpen(false);
    setForgotSuccess(false);
    setSignUpSuccess(false);
  }, [authModalRole, isAuthModalOpen, students, wardens]);

  if (!isAuthModalOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    setIsForgotOpen(false);
    if (role === 'student') {
      setIdentifier(students[0]?.studentId || 'MCET2024CS042');
    } else {
      setIdentifier(wardens[0]?.wardenId || 'WARDEN-CHIEF-01');
      if (authMode === 'signup') {
        setAuthMode('signin'); // Faculty/warden registration is admin-only
      }
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your Institutional ID or Email');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const success = login(selectedRole, identifier, password);
      setIsSubmitting(false);
      if (!success) {
        setErrorMsg('Invalid institutional credentials. Please check your Student ID / Staff ID.');
      }
    }, 400);
  };

  const handleSSOLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (selectedRole === 'student') {
        login('student', students[0]?.studentId || 'MCET2024CS042');
      } else {
        login('warden', wardens[0]?.wardenId || 'WARDEN-CHIEF-01');
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name.trim()) {
      setErrorMsg('Please enter your full legal name');
      return;
    }
    if (!signUpData.email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (signUpData.password && signUpData.password !== signUpData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!signUpData.agreeTerms) {
      setErrorMsg('Please accept the MCET Hostel Code of Conduct');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      registerStudent({
        name: signUpData.name,
        gender: signUpData.gender,
        studentId: signUpData.studentId.trim() || undefined,
        department: signUpData.department,
        year: signUpData.year,
        division: signUpData.division,
        email: signUpData.email,
        mobile: signUpData.mobile,
        parentName: signUpData.parentName,
        parentPhone: signUpData.parentPhone,
        roomType: signUpData.roomType,
        bloodGroup: signUpData.bloodGroup,
      });
      setIsSubmitting(false);
      setSignUpSuccess(true);
    }, 600);
  };

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Empty', score: 0, color: 'bg-zinc-700' };
    if (pass.length < 6) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (pass.length < 9) return { label: 'Moderate', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(signUpData.password);

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={closeAuthModal}
    >
      <motion.div
        id="auth-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#111215] rounded-3xl border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden font-body text-zinc-100 flex flex-col md:flex-row my-auto max-h-[92vh]"
      >
        {/* Close button */}
        <button
          id="close-auth-modal"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT SHOWCASE PANEL (Visible on md+) */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#16181D] via-[#111215] to-[#09090B] p-8 border-r border-white/[0.08] flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight text-white block">
                  NEST HOSTEL ERP
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400">
                  MCET Shegaon • Campus Portal
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Academic Year 2026–27 Open</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white leading-tight mb-2">
              {authMode === 'signin'
                ? 'Welcome Back, Scholar'
                : 'Hostel Allotment & Admission'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unified digital access to student living quarters, digital mess token passes, leave gate passes, and emergency warden support.
            </p>
          </div>

          {/* Feature Badges List */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">Automated QR Gate Passes</h5>
                <p className="text-[10px] text-zinc-400">Instant parental SMS sync &amp; warden approval</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">Annapurna Mess Nutrition</h5>
                <p className="text-[10px] text-zinc-400">4 daily meal menus with dietary skip-credits</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">24×7 Rapid SOS Response</h5>
                <p className="text-[10px] text-zinc-400">Direct biometric security &amp; ambulance hotline</p>
              </div>
            </div>
          </div>

          {/* Security & Verification Footer */}
          <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-violet-400" />
              <span>TLS 256-Bit Encrypted</span>
            </div>
            <span>v4.8 Institutional</span>
          </div>
        </div>

        {/* RIGHT INTERACTIVE FORM PANEL */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-none">
          <div>
            {/* Top Mode Navigation (Sign In vs New Admission) */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/[0.08] shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-violet-600 text-white shadow-[0_0_14px_rgba(139,92,246,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSelectedRole('student');
                    setErrorMsg('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-violet-600 text-white shadow-[0_0_14px_rgba(139,92,246,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  New Admission / Register
                </button>
              </div>

              {/* Role Toggle for Sign In */}
              {authMode === 'signin' && (
                <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'student'
                        ? 'bg-white/[0.1] text-violet-300 font-semibold border border-white/[0.1]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('warden')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'warden'
                        ? 'bg-white/[0.1] text-amber-300 font-semibold border border-white/[0.1]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Warden</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Alert Box */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 font-medium"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ------------------------------------------- */}
            {/* VIEW A: SIGN IN FORM */}
            {/* ------------------------------------------- */}
            {authMode === 'signin' && (
              <div className="space-y-5">
                {/* Institutional Google Single Sign-On (SSO) */}
                <button
                  type="button"
                  onClick={handleSSOLogin}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] text-xs font-medium text-white flex items-center justify-center gap-3 transition-all cursor-pointer hover:border-violet-500/40"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with MCET Google Workspace (@mcet.ac.in)</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">
                    Or Sign In with Credentials
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Institutional ID Field */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      {selectedRole === 'student'
                        ? 'Student PRN / Enrollment ID / Email'
                        : 'Warden Staff ID / Institutional Email'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        {selectedRole === 'student' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={
                          selectedRole === 'student'
                            ? 'e.g. MCET2024CS042 or rahul@mcet.ac.in'
                            : 'e.g. WARDEN-CHIEF-01'
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(!isForgotOpen)}
                        className="text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Forgot Password Dropdown */}
                  <AnimatePresence>
                    {isForgotOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs space-y-2 overflow-hidden"
                      >
                        {forgotSuccess ? (
                          <div className="text-emerald-400 flex items-center gap-2">
                            <Check className="w-4 h-4 shrink-0" />
                            <span>Password reset instructions sent to your registered institutional email!</span>
                          </div>
                        ) : (
                          <div>
                            <p className="text-zinc-300 text-[11px] mb-2">
                              Enter your registered PRN or Email to receive a 6-digit OTP:
                            </p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="MCET ID or Email"
                                className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white outline-none font-mono"
                              />
                              <button
                                type="button"
                                onClick={handleForgotSubmit}
                                className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
                              >
                                Send OTP
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-zinc-700 bg-black/40 text-violet-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Keep this session active for 30 days</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="auth-submit-btn"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2 font-mono">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign In to {selectedRole === 'student' ? 'Student Scholar' : 'Warden'} Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Quick Demo Profiles */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      1-Click Verified Demo Logins:
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Instant Auto-Fill</span>
                  </div>

                  {selectedRole === 'student' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier(students[0]?.studentId || 'MCET2024CS042');
                          login('student', students[0]?.studentId || 'MCET2024CS042');
                        }}
                        className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-violet-500/10 border border-white/[0.06] hover:border-violet-500/30 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={students[0]?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
                            alt="Rahul"
                            className="w-6 h-6 rounded-full object-cover border border-white/20"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-semibold text-xs text-zinc-200 group-hover:text-violet-300 truncate">
                            Rahul Sharma (CSE)
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">
                          MCET2024CS042 • Room 204
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier(students[1]?.studentId || 'MCET2024IT018');
                          login('student', students[1]?.studentId || 'MCET2024IT018');
                        }}
                        className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-pink-500/10 border border-white/[0.06] hover:border-pink-500/30 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={students[1]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt="Priya"
                            className="w-6 h-6 rounded-full object-cover border border-white/20"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-semibold text-xs text-zinc-200 group-hover:text-pink-300 truncate">
                            Priya Patil (IT)
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">
                          MCET2024IT018 • Room 108
                        </p>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('WARDEN-CHIEF-01');
                          login('warden', 'WARDEN-CHIEF-01');
                        }}
                        className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/30 text-left transition-all cursor-pointer group"
                      >
                        <span className="font-semibold text-xs text-zinc-200 group-hover:text-amber-300 block truncate">
                          Dr. S. K. Deshmukh
                        </span>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          Chief Warden • Admin Access
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('WARDEN-BOYS-01');
                          login('warden', 'WARDEN-BOYS-01');
                        }}
                        className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/[0.06] hover:border-indigo-500/30 text-left transition-all cursor-pointer group"
                      >
                        <span className="font-semibold text-xs text-zinc-200 group-hover:text-indigo-300 block truncate">
                          Prof. A. V. Joshi
                        </span>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          Boys Hostel Warden
                        </p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------- */}
            {/* VIEW B: REAL SIGN UP / NEW ADMISSION FORM */}
            {/* ------------------------------------------- */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* Step indicators */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      {signUpStep}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {signUpStep === 1 ? 'Academic & Personal Details' : 'Contact, Hostel & Security'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        signUpStep === 1 ? 'w-6 bg-violet-500' : 'w-2 bg-white/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setSignUpStep(2)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        signUpStep === 2 ? 'w-6 bg-violet-500' : 'w-2 bg-white/20'
                      }`}
                    />
                  </div>
                </div>

                {/* STEP 1 FIELDS */}
                {signUpStep === 1 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Full Student Name (As per College ID) *
                      </label>
                      <input
                        type="text"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        placeholder="e.g. Aditya Vijay Patil"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Gender & Hostel Wing Routing */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Gender (Wing Allotment) *
                        </label>
                        <select
                          value={signUpData.gender}
                          onChange={(e) =>
                            setSignUpData({
                              ...signUpData,
                              gender: e.target.value as 'Male' | 'Female',
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-2xl border border-white/[0.1] bg-[#16181D] text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="Female">Female (Sakhi Girls Hostel)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Engineering Branch *
                        </label>
                        <select
                          value={signUpData.department}
                          onChange={(e) => setSignUpData({ ...signUpData, department: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-2xl border border-white/[0.1] bg-[#16181D] text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="Computer Science & Engineering">CS (Computer Science)</option>
                          <option value="Information Technology">IT (Information Tech)</option>
                          <option value="Electronics & Telecommunication">ENTC (Electronics &amp; Telecom)</option>
                          <option value="Electrical Power Systems (ELPO)">ELPO (Electrical Power)</option>
                          <option value="Civil Engineering">CIVIL Engineering</option>
                          <option value="Mechanical Engineering">MECHANICAL Engineering</option>
                        </select>
                      </div>
                    </div>

                    {/* Year & Division */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Academic Year *
                        </label>
                        <select
                          value={signUpData.year}
                          onChange={(e) => setSignUpData({ ...signUpData, year: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-2xl border border-white/[0.1] bg-[#16181D] text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="1st Year">1st Year (FE - Floor 1)</option>
                          <option value="2nd Year">2nd Year (SE - Floor 2)</option>
                          <option value="3rd Year">3rd Year (TE - Floor 3)</option>
                          <option value="4th Year">4th Year (BE - Floor 4)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          College PRN / Enrollment (Optional)
                        </label>
                        <input
                          type="text"
                          value={signUpData.studentId}
                          onChange={(e) => setSignUpData({ ...signUpData, studentId: e.target.value })}
                          placeholder="e.g. MCET2026CS099"
                          className="w-full px-3.5 py-2.5 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!signUpData.name.trim()) {
                          setErrorMsg('Please enter your full name');
                          return;
                        }
                        setErrorMsg('');
                        setSignUpStep(2);
                      }}
                      className="w-full mt-3 py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Contact &amp; Room Selection</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2 FIELDS */}
                {signUpStep === 2 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Student Email & Phone */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Student Email *
                        </label>
                        <input
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                          placeholder="aditya@mcet.ac.in"
                          className="w-full px-3.5 py-2 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Student Mobile *
                        </label>
                        <input
                          type="tel"
                          value={signUpData.mobile}
                          onChange={(e) => setSignUpData({ ...signUpData, mobile: e.target.value })}
                          placeholder="+91 98230 44556"
                          className="w-full px-3.5 py-2 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Parent Name & Phone */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Parent / Guardian Name *
                        </label>
                        <input
                          type="text"
                          value={signUpData.parentName}
                          onChange={(e) => setSignUpData({ ...signUpData, parentName: e.target.value })}
                          placeholder="Vijay Patil"
                          className="w-full px-3.5 py-2 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Parent Emergency Phone *
                        </label>
                        <input
                          type="tel"
                          value={signUpData.parentPhone}
                          onChange={(e) => setSignUpData({ ...signUpData, parentPhone: e.target.value })}
                          placeholder="+91 94220 11223"
                          className="w-full px-3.5 py-2 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Room Layout Preference & Blood Group */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Room Choice *
                        </label>
                        <select
                          value={signUpData.roomType}
                          onChange={(e) => setSignUpData({ ...signUpData, roomType: e.target.value })}
                          className="w-full px-3 py-2 rounded-2xl border border-white/[0.1] bg-[#16181D] text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="Single Scholar Studio">Single Studio (₹32k/sem)</option>
                          <option value="Classic Twin Suite">Classic Twin (₹24k/sem)</option>
                          <option value="Standard Triple Pod">Triple Pod (₹18k/sem)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Blood Group *
                        </label>
                        <select
                          value={signUpData.bloodGroup}
                          onChange={(e) => setSignUpData({ ...signUpData, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 rounded-2xl border border-white/[0.1] bg-[#16181D] text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="O+">O Positive (O+)</option>
                          <option value="O-">O Negative (O-)</option>
                          <option value="A+">A Positive (A+)</option>
                          <option value="A-">A Negative (A-)</option>
                          <option value="B+">B Positive (B+)</option>
                          <option value="B-">B Negative (B-)</option>
                          <option value="AB+">AB Positive (AB+)</option>
                        </select>
                      </div>
                    </div>

                    {/* Password & Strength Meter */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Portal Password *
                      </label>
                      <input
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="Create a strong password"
                        className="w-full px-3.5 py-2 rounded-2xl border border-white/[0.1] bg-black/40 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500 outline-none"
                        required
                      />
                      {signUpData.password && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passStrength.color} transition-all duration-300`}
                              style={{ width: `${(passStrength.score / 3) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {passStrength.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Terms Agreement Checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400 pt-1">
                      <input
                        type="checkbox"
                        checked={signUpData.agreeTerms}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, agreeTerms: e.target.checked })
                        }
                        className="rounded border-zinc-700 bg-black/40 text-violet-600 mt-0.5"
                        required
                      />
                      <span className="leading-snug text-[11px]">
                        I agree to the <strong className="text-zinc-200">MCET Hostel Rules</strong>, mandatory 09:30 PM biometric curfew, and Anti-Ragging regulations.
                      </span>
                    </label>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setSignUpStep(1)}
                        className="py-2.5 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-2.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Allocating Room...</span>
                        ) : (
                          <>
                            <span>Complete Allotment</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Bottom Security Guarantee */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              MCET Campus Security Verified
            </span>
            <span>Support: +91 7265 252443</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
