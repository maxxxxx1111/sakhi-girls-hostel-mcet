import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, PhoneCall, HeartPulse, X, AlertTriangle } from 'lucide-react';

interface StudentSOSControlProps {
  variant?: 'topbar' | 'compact' | 'bottomnav' | 'icon' | 'full';
}

export const StudentSOSControl: React.FC<StudentSOSControlProps> = ({ variant = 'compact' }) => {
  const { setIsSOSModalOpen, currentStudent } = useApp();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      {variant === 'icon' && (
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full h-9 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-[#E11D48] flex items-center justify-center transition-colors cursor-pointer select-none shadow-2xs"
          title="Campus Emergency Assistance"
          aria-label="Emergency Assistance"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      )}

      {variant === 'compact' && (
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs text-[#E11D48] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer select-none shadow-2xs"
          title="Emergency Assistance"
        >
          <ShieldAlert className="w-4 h-4 text-[#E11D48] shrink-0" />
          <span>Emergency Assistance</span>
        </button>
      )}

      {variant === 'full' && (
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#FFF0F6] dark:bg-[#2B1724] hover:bg-[#FCE7F3] dark:hover:bg-[#3D1E32] border border-[#FCE7F3] dark:border-[#4E223F] text-xs text-[#E11D48] dark:text-[#FB7185] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer select-none shadow-2xs"
          title="Emergency Assistance"
        >
          <ShieldAlert className="w-4 h-4 text-[#E11D48] dark:text-[#FB7185] shrink-0" />
          <span>Campus Emergency Assistance</span>
        </button>
      )}

      {variant === 'bottomnav' && (
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="flex flex-col items-center justify-center text-[#E11D48] p-1 select-none cursor-pointer"
          title="Emergency Assistance"
          aria-label="Emergency Assistance"
        >
          <div className="w-8 h-8 rounded-full bg-[#FFF0F6] border border-[#FCE7F3] flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-[#E11D48]" />
          </div>
          <span className="text-[10px] font-semibold mt-1">SOS</span>
        </button>
      )}

      {variant === 'topbar' && (
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="h-9 px-3 rounded-xl bg-[#FFF0F6] hover:bg-[#FCE7F3] border border-[#FCE7F3] text-xs text-[#E11D48] font-semibold flex items-center gap-2 transition-all cursor-pointer select-none shadow-2xs"
          title="Campus Emergency SOS"
          aria-label="Campus Emergency Assistance"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
          <span>Emergency</span>
        </button>
      )}

      {/* Calm Confirmation Dialog */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1E1926] rounded-2xl border border-[#F3E8EF] dark:border-[#38283B] p-6 shadow-[0_16px_40px_rgba(236,72,153,0.12)] space-y-5 text-[#1F2937] dark:text-[#FDF2F8] font-body"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F6] dark:bg-[#341C2D] border border-[#FCE7F3] dark:border-[#4E223F] flex items-center justify-center text-[#E11D48] dark:text-[#FB7185]">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] dark:text-white">Emergency Assistance</h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">24/7 Campus Security &amp; Medical Desk</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#FFF8FA] dark:bg-[#261E2E] hover:bg-[#FCE7F3] text-[#6B7280] hover:text-[#1F2937] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF8FA] dark:bg-[#261E2E] border border-[#FCE7F3] dark:border-[#38283B] text-xs text-[#6B7280] dark:text-[#C5B7CE] leading-relaxed">
                Resident <strong className="text-[#1F2937] dark:text-white">{currentStudent?.name}</strong> • Room{' '}
                <strong className="text-[#1F2937] dark:text-white">{currentStudent?.roomNumber}</strong> ({currentStudent?.hostelName})
                <br />
                Security receives immediate telemetry of your residence assignment.
              </div>

              <div className="space-y-2.5">
                <a
                  href="tel:+917265252443"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Main Gate Security (+91 7265 252443)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmOpen(false);
                    setIsSOSModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#261E2E] hover:bg-[#FFF5F8] dark:hover:bg-[#341C2D] border border-[#F3E8EF] dark:border-[#38283B] text-xs text-[#1F2937] dark:text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <span>Open Full SOS Panic Broadcast</span>
                </button>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF8FA] transition-colors cursor-pointer font-medium"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
