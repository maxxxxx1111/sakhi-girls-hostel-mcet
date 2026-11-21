import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import {
  ShieldAlert,
  Bell,
  LogOut,
  User,
  Building2,
  ChevronDown,
  CheckCircle,
  Menu,
  X,
  BedDouble,
  Utensils,
  FileText,
  CalendarDays,
  Wrench,
  Database,
  MessageSquare,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Hostel Wings', sectionId: 'rooms-section' },
  { label: 'Annapurna Mess', sectionId: 'amenities-section' },
  { label: 'Circulars', sectionId: 'community-section' },
];

export const Navbar: React.FC = () => {
  const {
    role,
    currentUser,
    logout,
    openAuthModal,
    setIsSOSModalOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    switchDemoUser,
    students,
    wardens,
    setActiveTab,
    setIsDbmsModalOpen,
  } = useApp();

  const [activeItem, setActiveItem] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (demoMenuRef.current && !demoMenuRef.current.contains(event.target as Node)) {
        setIsDemoMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => {
    if (role === 'student' && currentUser) {
      return !n.read && (n.recipientId === currentUser.id || n.recipientId === 'all' || n.recipientId === 'students');
    }
    if (role === 'warden') {
      return !n.read && (n.recipientId === 'wardens' || n.recipientId === 'all');
    }
    return !n.read;
  });

  const handleNavClick = (label: string, sectionId: string) => {
    setActiveItem(label);
    if (role) {
      if (label === 'Hostel Wings') setActiveTab(role === 'student' ? 'room' : 'rooms');
      else if (label === 'Annapurna Mess') setActiveTab('mess');
      else if (label === 'Circulars') setActiveTab('notices');
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/85 dark:bg-[#09090B]/85 light:bg-white/90 backdrop-blur-xl border-b border-white/[0.08] light:border-[#F3E8EF] px-4 sm:px-6 lg:px-8 py-3 transition-all font-body light:shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            if (role) {
              setActiveTab('overview');
            } else {
              const el = document.getElementById('hero-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-pink-600/90 text-white flex items-center justify-center shadow-[0_0_16px_rgba(236,72,153,0.35)] group-hover:scale-105 transition-transform duration-200">
            <Building2 className="w-4 h-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-zinc-100 light:text-zinc-900 tracking-tight">
                Sakhi
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/[0.06] light:bg-pink-500/10 text-zinc-400 light:text-pink-600 border border-white/[0.08] light:border-pink-200">
                MCET
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 light:text-zinc-500 hidden sm:inline -mt-0.5">
              Sakhi Girls Hostel &amp; Dining
            </span>
          </div>
        </div>

        {/* Center: Clean visitor navigation */}
        {!role && (
          <nav className="hidden md:flex items-center gap-1 bg-[#121316]/60 light:bg-pink-50/70 p-1 rounded-full border border-white/[0.06] light:border-pink-200/60">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label, item.sectionId)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeItem === item.label
                    ? 'bg-white/[0.1] light:bg-pink-600 text-white font-semibold light:shadow-sm'
                    : 'text-zinc-400 light:text-zinc-600 hover:text-zinc-200 light:hover:text-pink-700 hover:bg-white/[0.04] light:hover:bg-pink-100/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right: Controls & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Switcher Pill */}
          <div className="relative" ref={demoMenuRef}>
            <button
              onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-300 light:text-zinc-700 bg-[#121316] light:bg-white hover:bg-[#18191E] light:hover:bg-pink-50/70 rounded-full border border-white/[0.08] light:border-pink-200 hover:border-white/[0.16] transition-all cursor-pointer font-medium light:shadow-2xs"
              title="Switch demo account"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span className="hidden sm:inline text-zinc-400 light:text-zinc-500 text-[11px]">Demo:</span>
              <span className="font-semibold text-zinc-100 light:text-zinc-900">
                {role === 'student' ? 'Student' : role === 'warden' ? 'Warden' : 'Switch'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {isDemoMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#111215]/95 light:bg-white backdrop-blur-2xl rounded-2xl p-2.5 z-50 border border-white/[0.12] light:border-pink-200 shadow-[0_12px_40px_rgba(0,0,0,0.8)] light:shadow-xl text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-2 border-b border-white/[0.08] light:border-pink-100 flex items-center justify-between text-[11px] font-semibold text-zinc-400 light:text-zinc-500 uppercase tracking-wider">
                  <span>Demo Profiles</span>
                  <span className="text-pink-400 light:text-pink-600 font-mono text-[10px]">1-Click Instant</span>
                </div>

                <div className="pt-2 space-y-1">
                  <p className="text-[10px] font-semibold text-zinc-500 light:text-zinc-400 px-2.5 uppercase tracking-wider">
                    Student Residents
                  </p>
                  {students.slice(0, 2).map((std) => (
                    <button
                      key={std.id}
                      onClick={() => {
                        switchDemoUser('student', std.id);
                        setIsDemoMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                        role === 'student' && currentUser?.id === std.id
                          ? 'bg-pink-600/15 light:bg-pink-50 border border-pink-500/30 light:border-pink-300 text-pink-300 light:text-pink-700 font-medium'
                          : 'text-zinc-300 light:text-zinc-700 hover:bg-white/[0.04] light:hover:bg-pink-50/50'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-zinc-200 light:text-zinc-900">{std.name}</p>
                        <p className="text-[11px] text-zinc-500 light:text-zinc-500 font-mono">
                          {std.studentId} • Room {std.roomNumber}
                        </p>
                      </div>
                      {role === 'student' && currentUser?.id === std.id && (
                        <CheckCircle className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      )}
                    </button>
                  ))}

                  <div className="border-t border-white/[0.08] light:border-pink-100 my-1.5"></div>
                  <p className="text-[10px] font-semibold text-zinc-500 light:text-zinc-400 px-2.5 uppercase tracking-wider">
                    Hostel Administration
                  </p>
                  {wardens.slice(0, 2).map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        switchDemoUser('warden', w.id);
                        setIsDemoMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                        role === 'warden' && currentUser?.id === w.id
                          ? 'bg-amber-500/15 light:bg-amber-50 border border-amber-500/30 light:border-amber-300 text-amber-300 light:text-amber-800 font-medium'
                          : 'text-zinc-300 light:text-zinc-700 hover:bg-white/[0.04] light:hover:bg-pink-50/50'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-zinc-200 light:text-zinc-900">{w.name}</p>
                        <p className="text-[11px] text-zinc-500 light:text-zinc-500">
                          {w.role}
                        </p>
                      </div>
                      {role === 'warden' && currentUser?.id === w.id && (
                        <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DBMS Project Showcase Trigger */}
          <button
            onClick={() => setIsDbmsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]"
            title="Academic DBMS Project Architecture, ER Schema & Interactive SQL Sandbox"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-semibold">DBMS</span>
          </button>

          {/* WhatsApp Gate Pass Cloud Bot 1-Click Showcase */}
          <button
            onClick={() => {
              if (role !== 'warden') {
                switchDemoUser('warden', wardens[0]?.id || 'warden-1');
              }
              setActiveTab('whatsapp');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/40 text-xs font-medium transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)] group"
            title="Interactive WhatsApp Cloud Gate Pass Chatbot & Live MySQL Logs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-semibold">WhatsApp Bot</span>
          </button>

          {/* Emergency SOS Trigger with subtle pulse animation */}
          <button
            onClick={() => setIsSOSModalOpen(true)}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.15)]"
            title="Campus Emergency SOS Desk"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline font-semibold">SOS</span>
          </button>

          {/* Theme Mode Switcher */}
          <ThemeToggle showDropdown={true} />

          {/* Authenticated user menu vs Sign In */}
          {role ? (
            <div className="flex items-center gap-2">
              {/* Notification Center */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-full text-zinc-400 light:text-zinc-600 hover:text-zinc-200 light:hover:text-zinc-900 hover:bg-white/[0.06] light:hover:bg-pink-100/50 transition-colors cursor-pointer border border-white/[0.06] light:border-pink-200"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-[#09090B] light:ring-white animate-pulse" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111215]/95 light:bg-white backdrop-blur-2xl rounded-2xl p-3 z-50 border border-white/[0.12] light:border-pink-200 shadow-[0_16px_48px_rgba(0,0,0,0.8)] light:shadow-2xl max-h-[420px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] light:border-pink-100 px-1">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100 light:text-zinc-900">Notifications</h4>
                        <p className="text-[11px] text-zinc-500 light:text-zinc-500">{unreadNotifications.length} unread updates</p>
                      </div>
                      {unreadNotifications.length > 0 && (
                        <button
                          onClick={() => markAllNotificationsAsRead()}
                          className="text-[11px] font-medium text-pink-400 light:text-pink-600 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-white/[0.06] light:divide-pink-100 mt-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-zinc-500">No notifications.</p>
                      ) : (
                        notifications.slice(0, 5).map((ntf) => (
                          <div
                            key={ntf.id}
                            onClick={() => {
                              markNotificationAsRead(ntf.id);
                              if (ntf.linkTab) {
                                setActiveTab(ntf.linkTab);
                                setIsNotifOpen(false);
                              }
                            }}
                            className={`py-2.5 px-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                              !ntf.read
                                ? 'bg-pink-600/10 light:bg-pink-50 border border-pink-500/20 light:border-pink-200'
                                : 'hover:bg-white/[0.04] light:hover:bg-pink-50/50'
                            }`}
                          >
                            <p className="font-medium text-zinc-200 light:text-zinc-900">{ntf.title}</p>
                            <p className="text-[11px] text-zinc-400 light:text-zinc-600 mt-0.5 line-clamp-2">{ntf.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Account Menu (Pill container: Avatar + Name + Chevron) */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#121316] light:bg-white hover:bg-[#18191E] light:hover:bg-pink-50/70 border border-white/[0.08] light:border-pink-200 transition-all cursor-pointer light:shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center font-medium text-xs shadow-xs">
                    {currentUser?.name ? currentUser.name[0] : <User className="w-3 h-3" />}
                  </div>
                  <span className="text-xs font-medium text-zinc-200 light:text-zinc-800 hidden md:inline max-w-[120px] truncate">
                    {currentUser?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden md:inline" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#111215]/95 light:bg-white backdrop-blur-2xl rounded-2xl p-3 z-50 border border-white/[0.12] light:border-pink-200 shadow-[0_16px_48px_rgba(0,0,0,0.8)] light:shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="pb-2.5 border-b border-white/[0.08] light:border-pink-100 px-1">
                      <p className="text-xs font-semibold text-zinc-100 light:text-zinc-900 truncate">{currentUser?.name}</p>
                      <p className="text-[11px] text-zinc-400 light:text-zinc-500 font-mono truncate">{currentUser?.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] light:bg-pink-50 text-zinc-300 light:text-pink-700 border border-white/[0.08] light:border-pink-200">
                        {role === 'student' ? `Room ${(currentUser as any).roomNumber}` : `${(currentUser as any).role || 'Warden Staff'}`}
                      </span>
                    </div>

                    <div className="pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-zinc-300 light:text-zinc-700 hover:text-white light:hover:text-zinc-900 hover:bg-white/[0.05] light:hover:bg-pink-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-zinc-400 light:text-zinc-500" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-rose-400 light:text-rose-600 hover:bg-rose-500/10 light:hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400 light:text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('student')}
              className="px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all shadow-[0_0_16px_rgba(139,92,246,0.35)] cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mt-2 pt-2 border-t border-white/[0.08] md:hidden animate-in fade-in duration-100">
          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label, item.sectionId)}
                className={`text-left py-2 px-3 rounded-lg text-xs font-medium cursor-pointer ${
                  activeItem === item.label ? 'bg-white/[0.08] text-white font-semibold' : 'text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsDbmsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>DBMS Architecture & SQL</span>
            </button>
            <button
              onClick={() => {
                if (role !== 'warden') {
                  switchDemoUser('warden', wardens[0]?.id || 'warden-1');
                }
                setActiveTab('whatsapp');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Cloud Bot Demo</span>
            </button>
            <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between px-3 py-1">
              <span className="text-xs text-zinc-400">Theme</span>
              <ThemeToggle showDropdown={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
