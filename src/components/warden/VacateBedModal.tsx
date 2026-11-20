import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Bed,
  UserX,
} from 'lucide-react';
import { Room, Bed as BedType, Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface VacateBedModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  bed: BedType | null;
  occupant: Student | null;
}

export const VacateBedModal: React.FC<VacateBedModalProps> = ({
  isOpen,
  onClose,
  room,
  bed,
  occupant,
}) => {
  const { vacateBed } = useApp();
  const [success, setSuccess] = useState(false);

  if (!isOpen || !room || !bed) return null;

  const handleVacate = () => {
    vacateBed(room.id, bed.bedId || `${room.id}-${bed.bedNumber}`);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#121318] border border-rose-500/30 p-6 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.8)] text-zinc-100 font-body">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-rose-400 tracking-wider">
                De-Allotment Action
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                Vacate Bed {bed.bedNumber}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#16181D] hover:bg-[#1E2026] text-zinc-400 hover:text-white flex items-center justify-center border border-white/[0.08] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resident details */}
        <div className="my-5 p-4 rounded-2xl bg-[#16181D]/90 border border-white/[0.06] space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Current Occupant:</span>
            <span className="font-bold text-white">{occupant?.name || bed.studentName || 'Assigned Resident'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">PRN / ID:</span>
            <span className="font-mono text-zinc-300">{occupant?.studentId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Room / Floor:</span>
            <span className="font-mono text-pink-400">Room {room.roomNumber} • Floor {room.floor}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 mb-5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Vacating this bed will mark it as <strong>Available (Vacant)</strong> and update room vacancy counters across MySQL views and the public portal.
          </p>
        </div>

        {success ? (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bed Successfully Vacated!</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#16181D] hover:bg-[#1E2026] text-zinc-300 border border-white/[0.12] font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVacate}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-[0_0_16px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Confirm &amp; Vacate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
