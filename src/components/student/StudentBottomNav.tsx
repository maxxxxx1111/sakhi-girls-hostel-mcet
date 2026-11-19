import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BedDouble,
  QrCode,
  Utensils,
  User,
  MoreHorizontal,
  ClipboardCheck,
  Wrench,
  CreditCard,
  Megaphone,
  X,
} from 'lucide-react';
import { StudentSOSControl } from './StudentSOSControl';
import { motion, AnimatePresence } from 'motion/react';

export const StudentBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Strictly sentence-case navigation items matching requirements
  const mainItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'room', label: 'Room', icon: BedDouble },
    { id: 'leave', label: 'Leave', icon: QrCode },
    { id: 'mess', label: 'Mess', icon: Utensils },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const secondaryItems = [
    { id: 'complaints', label: 'Complaints', icon: Wrench },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'notices', label: 'Notices', icon: Megaphone },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#18141F]/95 backdrop-blur-md border-t border-[#F3E8EF] dark:border-[#2C2436] shadow-[0_-4px_20px_rgba(236,72,153,0.04)] px-1 py-1 flex items-center justify-around font-body select-none">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#EC4899] dark:text-[#F472B6] font-semibold'
                  : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More Options */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl transition-colors cursor-pointer ${
            isMoreOpen || secondaryItems.some((i) => i.id === activeTab)
              ? 'text-[#EC4899] dark:text-[#F472B6] font-semibold'
              : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937]'
          }`}
          title="More navigation options"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="text-[11px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Drawer for secondary tabs and emergency contact */}
      <AnimatePresence>
        {isMoreOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end"
            onClick={() => setIsMoreOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1E1926] border-t border-[#F3E8EF] dark:border-[#38283B] rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-[0_-12px_36px_rgba(236,72,153,0.12)]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F3E8EF] dark:border-[#38283B]">
                <h4 className="text-sm font-bold text-[#1F2937] dark:text-white">
                  More sections
                </h4>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#FFF8FA] dark:bg-[#261E2E] hover:bg-[#FCE7F3] text-[#6B7280] hover:text-[#1F2937] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMoreOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#FFF0F6] dark:bg-[#341C2D] border-[#FBCFE8] dark:border-[#4E223F] text-[#BE185D] dark:text-[#F472B6] shadow-2xs'
                          : 'bg-[#FFF8FA] dark:bg-[#261E2E] border-[#F3E8EF] dark:border-[#38283B] text-[#6B7280] dark:text-[#C5B7CE] hover:text-[#1F2937]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#EC4899]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Emergency SOS Control in drawer */}
              <div className="pt-2 border-t border-[#F3E8EF] dark:border-[#38283B]">
                <StudentSOSControl variant="full" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
