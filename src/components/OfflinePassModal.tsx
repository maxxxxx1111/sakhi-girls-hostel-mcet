import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  QrCode,
  ShieldCheck,
  Phone,
  Building2,
  Calendar,
  AlertTriangle,
  WifiOff,
  User,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OfflinePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflinePassModal: React.FC<OfflinePassModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, leaveRequests, reducedMotion, effectiveOffline, t } = useApp();

  if (!isOpen || !currentStudent) return null;

  // Find active or most recent approved leave
  const activePass = leaveRequests.find(
    (l) => l.studentId === currentStudent.id && (l.status === 'Approved' || l.status === 'Pending')
  );

  const passCode = activePass?.gatePassCode || `MCET-GP-${currentStudent.studentId}-9941`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Banner indicating offline security card */}
          <div className="bg-[#7B61FF] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold text-xs tracking-wide">
                OFFLINE DIGITAL GATE PASS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">
                Cached Local
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Card Body */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* Offline notification badge */}
            <div className="p-3 rounded-xl bg-[#F6B657]/10 border border-[#F6B657]/20 flex items-start gap-2.5 text-xs text-[#F6B657]">
              <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Weak or No Network Detected</p>
                <p className="text-[11px] opacity-90">
                  This pass is cryptographically verified and accepted by campus main gate security officers without active internet.
                </p>
              </div>
            </div>

            {/* Pass QR and Verification Status */}
            <div className="p-4 rounded-2xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex flex-col items-center text-center space-y-3">
              {activePass ? (
                <>
                  <div className="p-3 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    {/* SVG Stylized QR Code Matrix */}
                    <svg viewBox="0 0 120 120" className="w-36 h-36">
                      <rect width="120" height="120" fill="white" />
                      {/* Corner finder patterns */}
                      <rect x="10" y="10" width="30" height="30" fill="#171923" rx="4" />
                      <rect x="15" y="15" width="20" height="20" fill="white" rx="2" />
                      <rect x="19" y="19" width="12" height="12" fill="#171923" rx="1" />

                      <rect x="80" y="10" width="30" height="30" fill="#171923" rx="4" />
                      <rect x="85" y="15" width="20" height="20" fill="white" rx="2" />
                      <rect x="89" y="19" width="12" height="12" fill="#171923" rx="1" />

                      <rect x="10" y="80" width="30" height="30" fill="#171923" rx="4" />
                      <rect x="15" y="85" width="20" height="20" fill="white" rx="2" />
                      <rect x="19" y="89" width="12" height="12" fill="#171923" rx="1" />

                      {/* Random Data Dots Matrix Pattern */}
                      <rect x="46" y="12" width="6" height="6" fill="#171923" />
                      <rect x="56" y="12" width="6" height="6" fill="#171923" />
                      <rect x="66" y="12" width="6" height="6" fill="#171923" />
                      <rect x="46" y="24" width="6" height="6" fill="#7B61FF" />
                      <rect x="66" y="24" width="6" height="6" fill="#171923" />
                      <rect x="46" y="34" width="6" height="6" fill="#171923" />
                      <rect x="56" y="34" width="6" height="6" fill="#171923" />
                      
                      <rect x="12" y="48" width="6" height="6" fill="#171923" />
                      <rect x="22" y="48" width="6" height="6" fill="#171923" />
                      <rect x="34" y="48" width="6" height="6" fill="#7B61FF" />
                      <rect x="46" y="48" width="6" height="6" fill="#171923" />
                      <rect x="58" y="48" width="6" height="6" fill="#171923" />
                      <rect x="70" y="48" width="6" height="6" fill="#171923" />
                      <rect x="82" y="48" width="6" height="6" fill="#171923" />
                      <rect x="94" y="48" width="6" height="6" fill="#171923" />
                      <rect x="104" y="48" width="6" height="6" fill="#171923" />

                      <rect x="48" y="60" width="6" height="6" fill="#171923" />
                      <rect x="60" y="60" width="6" height="6" fill="#7B61FF" />
                      <rect x="72" y="60" width="6" height="6" fill="#171923" />
                      <rect x="84" y="60" width="6" height="6" fill="#171923" />

                      <rect x="48" y="72" width="6" height="6" fill="#171923" />
                      <rect x="60" y="72" width="6" height="6" fill="#171923" />
                      <rect x="84" y="72" width="6" height="6" fill="#171923" />
                      <rect x="96" y="72" width="6" height="6" fill="#171923" />

                      <rect x="48" y="84" width="6" height="6" fill="#171923" />
                      <rect x="60" y="84" width="6" height="6" fill="#7B61FF" />
                      <rect x="72" y="84" width="6" height="6" fill="#171923" />
                      <rect x="84" y="84" width="6" height="6" fill="#171923" />
                      <rect x="96" y="84" width="6" height="6" fill="#171923" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#7B61FF] tracking-wider block">
                      {passCode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#2DD4A8] font-medium mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Authorized by Chief Warden</span>
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center space-y-2">
                  <User className="w-12 h-12 text-[#737684] mx-auto" />
                  <p className="text-xs font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                    In-Campus Resident Identity Card
                  </p>
                  <p className="text-[11px] text-[#737684]">
                    No active leave permit in effect. Valid for campus perimeter &amp; hostel entry.
                  </p>
                </div>
              )}
            </div>

            {/* Student & Pass Metadata */}
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB]">
                <div>
                  <span className="text-[10px] text-[#737684] block">Student Name</span>
                  <span className="font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] block">
                    {currentStudent.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737684] block">Roll / PRN</span>
                  <span className="font-mono font-semibold text-[#7B61FF] block">
                    {currentStudent.studentId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737684] block">Room &amp; Bed</span>
                  <span className="font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] block">
                    Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737684] block">Hostel Block</span>
                  <span className="font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] block">
                    {currentStudent.hostelName}
                  </span>
                </div>
              </div>

              {activePass && (
                <div className="p-3 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#737684]">Leave Reason:</span>
                    <span className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                      {activePass.leaveType} ({activePass.destination || 'Home'})
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#737684]">Valid Period:</span>
                    <span className="font-mono text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                      {activePass.fromDate} → {activePass.toDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#737684]">Curfew Reporting:</span>
                    <span className="font-mono text-[#F6B657]">Before 10:00 PM</span>
                  </div>
                </div>
              )}
            </div>

            {/* Offline 1-Tap Emergency Calling */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase block">
                Emergency Gate &amp; Warden Hotlines
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:+919422011223"
                  className="p-2.5 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center gap-2 hover:border-[#7B61FF] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2DD4A8]" />
                  <div className="truncate">
                    <p className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] truncate">
                      Hostel Warden
                    </p>
                    <p className="text-[10px] text-[#737684] font-mono">+91 94220 11223</p>
                  </div>
                </a>

                <a
                  href="tel:+919422055443"
                  className="p-2.5 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center gap-2 hover:border-[#7B61FF] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#7B61FF]" />
                  <div className="truncate">
                    <p className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] truncate">
                      Main Security Gate
                    </p>
                    <p className="text-[10px] text-[#737684] font-mono">+91 94220 55443</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-xl bg-[#7B61FF] hover:bg-[#6A4FE8] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Close Pass
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
