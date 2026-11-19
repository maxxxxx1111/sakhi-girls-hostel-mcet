import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  BedDouble,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  FileText,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoomTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomTransferModal: React.FC<RoomTransferModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, roomChangeRequests, applyRoomChange, hostels } = useApp();

  const [preferredRoomType, setPreferredRoomType] = useState('Double');
  const [preferredBlock, setPreferredBlock] = useState(
    currentStudent?.hostelName || 'Sakhi Girls Hostel'
  );
  const [reasonCategory, setReasonCategory] = useState<'Academic' | 'Medical' | 'Mutual Swap' | 'Other'>('Academic');
  const [reason, setReason] = useState('');
  const [mutualStudentPRN, setMutualStudentPRN] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!isOpen || !currentStudent) return null;

  // Check if student already has a pending or active room change request
  const myRequests = roomChangeRequests.filter((r) => r.studentId === currentStudent.id);
  const activeRequest = myRequests.find((r) => r.status === 'Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    applyRoomChange({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      currentRoom: currentStudent.roomNumber,
      currentHostel: currentStudent.hostelName,
      preferredRoomType,
      preferredBlock,
      reasonCategory,
      reason,
      mutualStudentPRN: reasonCategory === 'Mutual Swap' ? mutualStudentPRN : undefined,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setReason('');
      setMutualStudentPRN('');
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl bg-white dark:bg-[#1B1720] text-[#1F2937] dark:text-[#FDF2F8] rounded-3xl shadow-2xl border border-[#F3E8EF] dark:border-[#332A3B] overflow-hidden my-auto p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8EF] dark:border-[#2C2436]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF5F8] dark:bg-[#261E2E] text-[#EC4899] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B] flex items-center justify-center shrink-0">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#1F2937] dark:text-white">
                  Room Transfer Application
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                  Apply for room swap, single upgrade, or wing transfer
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] hover:bg-[#FCE7F3] dark:hover:bg-[#261E2E] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Allotment Card */}
          <div className="p-4 rounded-2xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-xs space-y-2">
            <span className="text-[11px] font-semibold text-[#6B7280] dark:text-[#A79CB0]">
              Current Allotment Status
            </span>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-sm text-[#1F2937] dark:text-white">
                Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
              </span>
              <span className="text-xs text-[#EC4899] dark:text-[#F472B6] font-mono font-bold">
                {currentStudent.roomType || 'Triple'} Sharing
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
              {currentStudent.hostelName}
            </p>
          </div>

          {/* If there's an active request already pending */}
          {activeRequest ? (
            <div className="p-5 rounded-2xl bg-[#FEF3C7] dark:bg-[#F59E0B]/10 border border-[#FDE68A] dark:border-[#F59E0B]/20 text-xs space-y-3">
              <div className="flex items-center gap-2 text-[#B45309] dark:text-[#F59E0B] font-bold">
                <Clock className="w-4 h-4" />
                <span>Application #{activeRequest.id.toUpperCase()} In Review</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">
                You have an active request to transfer to a <strong>{activeRequest.preferredRoomType}</strong> room in <strong>{activeRequest.preferredBlock}</strong>.
              </p>
              <div className="pt-2 border-t border-[#FDE68A] dark:border-[#F59E0B]/20 flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                <span>Applied: {activeRequest.appliedDate}</span>
                <span className="font-semibold text-[#B45309] dark:text-[#F59E0B]">Status: Pending Warden Signature</span>
              </div>
            </div>
          ) : formSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#15803D] dark:text-[#2DD4A8] mx-auto" />
              <h4 className="text-sm font-bold text-[#15803D] dark:text-[#2DD4A8]">
                Application Submitted!
              </h4>
              <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                Your transfer request has been logged and sent to the Chief Warden.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Preferred Room Type */}
              <div className="space-y-1.5">
                <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                  Desired Room Sharing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Single', label: 'Single', sub: '₹32,000/yr' },
                    { id: 'Double', label: 'Twin / Double', sub: '₹24,000/yr' },
                    { id: 'Triple', label: 'Triple', sub: '₹18,000/yr' },
                  ].map((t) => {
                    const isSelected = preferredRoomType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPreferredRoomType(t.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFF5F8] dark:bg-[#261E2E] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6] font-bold shadow-2xs'
                            : 'bg-white dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                        }`}
                      >
                        <span className="block">{t.label}</span>
                        <span className="text-[10px] opacity-75">{t.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Hostel Block */}
              <div className="space-y-1.5">
                <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                  Preferred Hostel Wing
                </label>
                <select
                  value={preferredBlock}
                  onChange={(e) => setPreferredBlock(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                >
                  <option value="Sakhi Girls Hostel (Floor 1 - 1st Year Wing)">Sakhi Girls Hostel (Floor 1 - 1st Year Wing)</option>
                  <option value="Sakhi Girls Hostel (Floor 2 - 2nd Year Wing)">
                    Sakhi Girls Hostel (Floor 2 - 2nd Year Wing)
                  </option>
                  <option value="Sakhi Girls Hostel (Floor 3 - 3rd Year Wing)">
                    Sakhi Girls Hostel (Floor 3 - 3rd Year Wing)
                  </option>
                  <option value="Sakhi Girls Hostel (Floor 4 - 4th Year Senior Wing)">
                    Sakhi Girls Hostel (Floor 4 - 4th Year Senior Wing)
                  </option>
                </select>
              </div>

              {/* Reason Category */}
              <div className="space-y-1.5">
                <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                  Transfer Justification Category
                </label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                >
                  <option value="Academic">Academic (GATE, Placement prep, Study quietness)</option>
                  <option value="Medical">Medical / Health (Asthma, injury, ground floor need)</option>
                  <option value="Mutual Swap">Mutual Swap with Another Student</option>
                  <option value="Other">Other Personal Reasons</option>
                </select>
              </div>

              {/* If Mutual Swap, provide target student PRN */}
              {reasonCategory === 'Mutual Swap' && (
                <div className="space-y-1.5">
                  <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                    Swap Partner PRN / Student ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCET2024CS045"
                    value={mutualStudentPRN}
                    onChange={(e) => setMutualStudentPRN(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white font-mono placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899]"
                  />
                  <p className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">
                    Both students must consent before the warden signs off the swap.
                  </p>
                </div>
              )}

              {/* Detailed Reason */}
              <div className="space-y-1.5">
                <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                  Statement of Reason
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why you are requesting a room change..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Room Transfer Request</span>
                </button>
              </div>
            </form>
          )}

          {/* Past Request History */}
          {myRequests.length > 0 && (
            <div className="pt-3 border-t border-[#F3E8EF] dark:border-[#2C2436] space-y-2">
              <span className="text-[11px] font-bold text-[#6B7280] dark:text-[#A79CB0]">
                Application History
              </span>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#1F2937] dark:text-white">
                        {req.preferredRoomType} ({req.preferredBlock.split('(')[0]?.trim()})
                      </p>
                      <p className="text-[10px] text-[#6B7280] dark:text-[#A79CB0]">
                        {req.appliedDate} • {req.reasonCategory}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : req.status === 'Rejected'
                          ? 'bg-[#FEE2E2] text-[#B91C1C]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
