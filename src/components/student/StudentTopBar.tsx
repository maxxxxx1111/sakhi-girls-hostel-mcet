import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, User, Building2, ChevronDown, Search, WifiOff, Menu, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '../ThemeToggle';
import { NotificationCenter } from '../NotificationCenter';

interface StudentTopBarProps {
  onMenuClick?: () => void;
  isScrolled?: boolean;
}

export const StudentTopBar: React.FC<StudentTopBarProps> = ({ onMenuClick, isScrolled = false }) => {
  const {
    currentStudent,
    logout,
    setActiveTab,
    setIsCommandPaletteOpen,
    setIsOfflinePassModalOpen,
    effectiveOffline,
    setIsDbmsModalOpen,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentStudent) return null;

  const initials = currentStudent.name
    ? currentStudent.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'S';

  return (
    <header
      className={`sticky top-0 z-30 h-15 px-4 sm:px-6 lg:px-8 flex items-center justify-between font-body transition-colors duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#1B1720]/95 backdrop-blur-md border-b border-[#F3E8EF] dark:border-[#332A3B] shadow-[0_4px_20px_rgba(236,72,153,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'bg-white dark:bg-[#1B1720] backdrop-blur-xs border-b border-[#F3E8EF] dark:border-[#332A3B]'
      }`}
    >
      {/* Left: Mobile Toggle + Campus Context */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] transition-colors cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {/* On mobile show mark */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F472B6] to-[#EC4899] shadow-sm flex md:hidden items-center justify-center text-white text-xs font-bold tracking-wider shrink-0">
            N
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-[#1F2937] dark:text-white">
              {currentStudent.hostelName?.split('(')[0]?.trim() || 'Resident Portal'}
            </span>
            <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] hidden sm:inline">
              • Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
            </span>
          </div>
        </div>

        {/* Offline indicator if active */}
        {effectiveOffline && (
          <button
            type="button"
            onClick={() => setIsOfflinePassModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 border border-[#FDE68A] dark:border-[#92400E] text-xs text-[#B45309] dark:text-[#FCD34D] font-medium cursor-pointer"
          >
            <WifiOff className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Offline (Pass Cached)</span>
          </button>
        )}
      </div>

      {/* Right Controls: Single Global Search, Theme, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Single Global Search Shortcut */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 h-9 px-3 rounded-xl bg-white dark:bg-[#120F14] hover:bg-[#FFF5F8] dark:hover:bg-[#201B26] border border-[#F3E8EF] dark:border-[#332A3B] hover:border-[#FBCFE8] dark:hover:border-[#EC4899]/40 text-xs text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white cursor-pointer transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EC4899]/30 shadow-2xs"
          title="Search actions, passes, rooms (⌘K)"
          aria-label="Global Search"
        >
          <Search className="w-3.5 h-3.5 text-[#EC4899] dark:text-[#F472B6]" />
          <span className="hidden sm:inline text-[#6B7280] dark:text-[#A79CB0]">Search portal...</span>
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-[#FFF5F8] dark:bg-[#261E2E] border border-[#F3E8EF] dark:border-[#38283B] text-[#9CA3AF] dark:text-[#A79CB0] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle showDropdown={false} />

        {/* Notifications */}
        <NotificationCenter />

        {/* DBMS Project Showcase Trigger */}
        <button
          type="button"
          onClick={() => setIsDbmsModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-all shadow-2xs hover:scale-[1.02]"
          title="Academic DBMS Project Architecture, ER Schema & Interactive SQL Sandbox"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>DBMS Schema</span>
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white dark:bg-[#120F14] hover:bg-[#FFF5F8] dark:hover:bg-[#201B26] border border-[#F3E8EF] dark:border-[#332A3B] hover:border-[#FBCFE8] dark:hover:border-[#EC4899]/40 transition-colors cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EC4899]/30 shadow-2xs"
            aria-label="User profile menu"
            aria-expanded={isProfileMenuOpen}
          >
            <div className="w-6.5 h-6.5 rounded-full bg-[#FCE7F3] text-[#EC4899] border border-white dark:border-[#38283B] flex items-center justify-center text-[11px] font-bold overflow-hidden shadow-2xs">
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
            <span className="text-xs font-semibold text-[#1F2937] dark:text-white hidden sm:inline max-w-[100px] truncate">
              {currentStudent.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1E1926] rounded-2xl border border-[#F3E8EF] dark:border-[#38283B] shadow-[0_12px_36px_rgba(236,72,153,0.1)] p-2.5 z-50 text-xs text-[#1F2937] dark:text-[#FDF2F8]"
              >
                <div className="p-2.5 bg-[#FFF8FA] dark:bg-[#261E2E] rounded-xl border border-[#FCE7F3] dark:border-[#38283B] mb-2">
                  <p className="font-semibold text-xs text-[#1F2937] dark:text-white truncate">
                    {currentStudent.name}
                  </p>
                  <p className="text-[11px] font-mono text-[#DB2777] dark:text-[#F472B6] truncate mt-0.5">
                    PRN: {currentStudent.studentId}
                  </p>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] truncate mt-0.5">
                    {currentStudent.department} • {currentStudent.year}
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#1F2937] dark:text-white hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <User className="w-4 h-4 text-[#EC4899]" />
                    <span>Resident Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('room');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#1F2937] dark:text-white hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-[#EC4899]" />
                    <span>Room {currentStudent.roomNumber} ({currentStudent.bedNumber})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsDbmsModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 cursor-pointer transition-colors font-medium"
                  >
                    <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>DBMS Architecture & SQL</span>
                  </button>
                </div>

                <div className="pt-1.5 mt-1.5 border-t border-[#F3E8EF] dark:border-[#38283B]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-2.5 cursor-pointer transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
