import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentTopBar } from './StudentTopBar';
import { StudentNavRail } from './StudentNavRail';
import { StudentBottomNav } from './StudentBottomNav';
import { StudentOverviewTab } from './StudentOverviewTab';
import { StudentRoomTab } from './StudentRoomTab';
import { StudentLeaveTab } from './StudentLeaveTab';
import { StudentComplaintsTab } from './StudentComplaintsTab';
import { StudentMessTab } from './StudentMessTab';
import { StudentMealAttendanceTab } from './StudentMealAttendanceTab';
import { StudentFeesTab } from './StudentFeesTab';
import { StudentNoticesTab } from './StudentNoticesTab';
import { StudentProfileTab } from './StudentProfileTab';
import { CommandPalette } from '../CommandPalette';
import { OfflinePassModal } from '../OfflinePassModal';
import { motion, AnimatePresence } from 'motion/react';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    activeTab,
    isOfflinePassModalOpen,
    setIsOfflinePassModalOpen,
    reducedMotion,
  } = useApp();
  const [isNavRailCollapsed, setIsNavRailCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    setIsScrolled(scrollTop > 12);
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)));
    } else {
      setScrollProgress(0);
    }
  }, []);

  // Reset scroll on tab change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }, [activeTab, reducedMotion]);

  if (!currentStudent) return null;

  return (
    <div
      id="student-portal-root"
      className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-body selection:bg-[#EC4899] selection:text-white transition-colors duration-200 relative overflow-x-hidden"
    >
      {/* 1. Slim Sticky Top Bar */}
      <StudentTopBar isScrolled={isScrolled} />

      {/* Hairline scroll progress indicator in primary pink */}
      <div className="sticky top-14 sm:top-15 z-30 h-[2px] w-full bg-transparent overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#F472B6] to-[#EC4899] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%`, opacity: isScrolled ? 1 : 0 }}
        />
      </div>

      {/* 2. Main Workspace: Compact Desktop Nav Rail + Content */}
      <div className="flex-1 flex overflow-hidden">
        <StudentNavRail
          isCollapsed={isNavRailCollapsed}
          onToggleCollapse={() => setIsNavRailCollapsed(!isNavRailCollapsed)}
        />

        {/* Fluid Main Content Area - Adaptive Canvas */}
        <main
          ref={mainRef}
          onScroll={handleScroll}
          id="student-main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mb-16 md:mb-0 focus:outline-hidden bg-[var(--bg-app)]"
          tabIndex={-1}
        >
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {activeTab === 'overview' && <StudentOverviewTab />}
                {activeTab === 'room' && <StudentRoomTab />}
                {activeTab === 'leave' && <StudentLeaveTab />}
                {activeTab === 'complaints' && <StudentComplaintsTab />}
                {activeTab === 'mess' && <StudentMessTab />}
                {activeTab === 'attendance' && <StudentMealAttendanceTab />}
                {activeTab === 'fees' && <StudentFeesTab />}
                {activeTab === 'notices' && <StudentNoticesTab />}
                {activeTab === 'profile' && <StudentProfileTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <StudentBottomNav />

      {/* 4. Universal Command Palette */}
      <CommandPalette />

      {/* 5. Offline Pass Modal */}
      <OfflinePassModal
        isOpen={isOfflinePassModalOpen}
        onClose={() => setIsOfflinePassModalOpen(false)}
      />
    </div>
  );
};
