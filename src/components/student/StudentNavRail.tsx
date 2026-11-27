import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BedDouble,
  QrCode,
  Wrench,
  Utensils,
  ClipboardCheck,
  CreditCard,
  Megaphone,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { StudentSOSControl } from './StudentSOSControl';
import { ThemeToggle } from '../ThemeToggle';
import { AccessibilityModal } from '../AccessibilityModal';

interface StudentNavRailProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

export const StudentNavRail: React.FC<StudentNavRailProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const { activeTab, setActiveTab, currentStudent } = useApp();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Strictly sentence-case navigation items matching user specifications
  const livingGroup: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'room', label: 'Room', icon: BedDouble },
    { id: 'leave', label: 'Leave', icon: QrCode },
    { id: 'complaints', label: 'Complaints', icon: Wrench },
  ];

  const campusGroup: NavItem[] = [
    { id: 'mess', label: 'Mess', icon: Utensils },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'notices', label: 'Notices', icon: Megaphone },
  ];

  const accountGroup: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      {!isCollapsed && (
        <p className="px-3 pb-1 text-[10px] font-bold tracking-wider text-pink-900/60 dark:text-pink-400/80 uppercase">
          {title}
        </p>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-student-${item.id}`}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? 'bg-white dark:bg-[#201B26] text-pink-700 dark:text-pink-300 font-bold shadow-xs border border-pink-200/90 dark:border-[#38283B]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Solid pink active left bar indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-pink-500 to-rose-600 rounded-r-full shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-pink-600 dark:text-pink-400'
                    : 'text-zinc-400 dark:text-zinc-500 group-hover:text-pink-600 dark:group-hover:text-pink-400'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:flex flex-col justify-between bg-[#FFF8FA] dark:bg-[#18141F] shadow-[4px_0_24px_rgba(236,72,153,0.04)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)] border-r border-pink-200/60 dark:border-[#2C2436] py-5 px-3 transition-all duration-200 select-none z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top: Brand & Resident Room Context + Grouped Nav */}
        <div className="space-y-5">
          {/* Brand & Resident Context */}
          <div className="px-2 pb-3 border-b border-pink-200/60 dark:border-[#2C2436]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 shadow-sm flex items-center justify-center text-white text-xs font-bold tracking-wider shrink-0 shadow-[0_2px_10px_rgba(236,72,153,0.3)]">
                S
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
                      Sakhi
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100/70 dark:bg-[#201B26] text-pink-700 dark:text-pink-300 font-bold border border-pink-200 dark:border-[#38283B]">
                      Portal
                    </span>
                  </div>
                  {currentStudent && (
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#201B26]/80 text-pink-700 dark:text-pink-300 border border-pink-200/80 dark:border-[#38283B] truncate shadow-2xs">
                        Room {currentStudent.roomNumber} • {currentStudent.bedNumber}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Grouped Navigation */}
          <div className="space-y-5">
            {renderNavGroup('Living', livingGroup)}
            {renderNavGroup('Campus', campusGroup)}
            {renderNavGroup('Account', accountGroup)}
          </div>
        </div>

        {/* Bottom Utilities: Theme, Preferences, Emergency, Collapse */}
        <div className="pt-4 border-t border-pink-200/60 dark:border-[#2C2436] space-y-2.5">
          {/* Theme & Accessibility Row */}
          <div className={`flex items-center gap-1.5 ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
            <ThemeToggle showDropdown={false} />

            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsAccessModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5 cursor-pointer transition-colors"
                title="Accessibility Preferences"
              >
                <Sliders className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Preferences</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAccessModalOpen(true)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5 cursor-pointer transition-colors"
                title="Accessibility Preferences"
              >
                <Sliders className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              </button>
            )}
          </div>

          {/* Emergency SOS Control in boutique rose styling */}
          <div className="w-full">
            <StudentSOSControl variant={isCollapsed ? 'icon' : 'compact'} />
          </div>

          {/* Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/5 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>Collapse menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Accessibility Modal */}
      <AccessibilityModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />
    </>
  );
};
