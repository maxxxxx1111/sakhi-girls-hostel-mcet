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
        <p className="px-3 pb-1 text-[10px] font-extrabold tracking-wider text-[#9D174D] dark:text-[#F472B6] uppercase">
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
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? 'bg-white dark:bg-[#201B26] text-[#9D174D] dark:text-[#F472B6] font-bold shadow-xs border border-[#FBCFE8] dark:border-[#38283B]'
                  : 'text-[#831843] dark:text-[#D1C5D8] hover:text-[#500724] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Solid pink active left bar indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#EC4899] dark:bg-[#F472B6] rounded-r-full" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#DB2777] dark:text-[#F472B6]'
                    : 'text-[#9D174D]/80 dark:text-[#F472B6]/70 group-hover:text-[#EC4899] dark:group-hover:text-[#F472B6]'
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
        className={`hidden md:flex flex-col justify-between bg-[#FCE7F3] dark:bg-[#18141F] shadow-[4px_0_24px_rgba(236,72,153,0.08)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)] border-r border-[#FBCFE8] dark:border-[#2C2436] py-5 px-3 transition-all duration-200 select-none z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top: Brand & Resident Room Context + Grouped Nav */}
        <div className="space-y-5">
          {/* Brand & Resident Context */}
          <div className="px-2 pb-3 border-b border-[#FBCFE8] dark:border-[#2C2436]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F472B6] to-[#EC4899] shadow-sm flex items-center justify-center text-white text-xs font-bold tracking-wider shrink-0">
                S
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold tracking-tight text-[#831843] dark:text-white">
                      Sakhi
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-[#201B26] text-[#BE185D] dark:text-[#F472B6] font-bold border border-[#FBCFE8] dark:border-[#38283B] shadow-2xs">
                      Portal
                    </span>
                  </div>
                  {currentStudent && (
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-[#201B26]/80 text-[#9D174D] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B] truncate shadow-2xs">
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
        <div className="pt-4 border-t border-[#FBCFE8] dark:border-[#2C2436] space-y-2.5">
          {/* Theme & Accessibility Row */}
          <div className={`flex items-center gap-1.5 ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
            <ThemeToggle showDropdown={false} />

            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsAccessModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-[#831843] dark:text-[#D1C5D8] hover:text-[#500724] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer transition-colors"
                title="Accessibility Preferences"
              >
                <Sliders className="w-3.5 h-3.5 text-[#9D174D] dark:text-[#F472B6]" />
                <span>Preferences</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAccessModalOpen(true)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#831843] dark:text-[#D1C5D8] hover:text-[#500724] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer transition-colors"
                title="Accessibility Preferences"
              >
                <Sliders className="w-3.5 h-3.5 text-[#9D174D] dark:text-[#F472B6]" />
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
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#831843] dark:text-[#D1C5D8] hover:text-[#500724] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#9D174D] dark:text-[#F472B6]" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-[#9D174D] dark:text-[#F472B6]" />
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
