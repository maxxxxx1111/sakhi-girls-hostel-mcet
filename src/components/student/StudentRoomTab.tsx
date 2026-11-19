import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BedDouble,
  Building2,
  Users,
  ShieldCheck,
  Wifi,
  Phone,
  MessageCircle,
  Lamp,
  Armchair,
  Lock,
  Wind,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowLeftRight,
  Clock,
} from 'lucide-react';
import { RoomTransferModal } from './RoomTransferModal';

export const StudentRoomTab: React.FC = () => {
  const { currentStudent, rooms, students, hostels, setActiveTab, roomChangeRequests } = useApp();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  if (!currentStudent) return null;

  const currentRoom = rooms.find(
    (r) =>
      r.id === currentStudent.roomId ||
      (r.roomNumber === currentStudent.roomNumber && r.hostelId === currentStudent.hostelId)
  );
  const currentHostel = hostels.find((h) => h.id === currentStudent.hostelId);

  // Roommates in the same room
  const roommates = students.filter(
    (s) =>
      s.id !== currentStudent.id &&
      (s.roomId && currentRoom?.id
        ? s.roomId === currentRoom.id
        : s.roomNumber === currentStudent.roomNumber && s.hostelId === currentStudent.hostelId)
  );

  const capacity = currentRoom?.capacity || (currentStudent.roomType === 'Triple' ? 3 : 2);
  const occupiedCount = currentRoom?.occupied || roommates.length + 1;

  // Check if student has pending room transfer
  const pendingTransfer = roomChangeRequests.find(
    (r) => r.studentId === currentStudent.id && r.status === 'Pending'
  );

  // Beds list derived cleanly from room or synthetic
  const bedsToRender =
    currentRoom?.beds && currentRoom.beds.length > 0
      ? currentRoom.beds
      : Array.from({ length: capacity }, (_, i) => {
          const bedNum = `Bed-${i + 1}`;
          if (currentStudent.bedNumber === bedNum) {
            return {
              bedId: `bed-${i + 1}`,
              bedNumber: bedNum,
              studentId: currentStudent.id,
              studentName: currentStudent.name,
              status: 'Occupied' as const,
            };
          }
          const mate = roommates[i > 0 ? i - 1 : 0];
          if (mate) {
            return {
              bedId: `bed-${i + 1}`,
              bedNumber: bedNum,
              studentId: mate.id,
              studentName: mate.name,
              status: 'Occupied' as const,
            };
          }
          return {
            bedId: `bed-${i + 1}`,
            bedNumber: bedNum,
            status: 'Available' as const,
          };
        });

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
            My Room &amp; Accommodation
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
            {currentHostel?.name || currentStudent.hostelName || 'Sakhi Girls Hostel'} • Floor{' '}
            {currentRoom?.floor || 2}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsTransferModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.02] self-start sm:self-auto shrink-0"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Room Transfer / Swap</span>
        </button>
      </section>

      {/* Active Transfer Notice Banner if pending */}
      {pendingTransfer && (
        <div className="p-4 rounded-2xl bg-[#FEF3C7] dark:bg-[#F59E0B]/10 border border-[#FDE68A] dark:border-[#F59E0B]/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#B45309] dark:text-[#F59E0B] shrink-0" />
            <div>
              <span className="font-bold text-[#B45309] dark:text-[#F59E0B]">
                Room Change Application In Review (#{pendingTransfer.id.toUpperCase()})
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 text-[11px]">
                Target: {pendingTransfer.preferredRoomType} Sharing in {pendingTransfer.preferredBlock} • Status: Awaiting Warden Sign-off
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="text-xs font-semibold text-[#B45309] dark:text-[#F59E0B] hover:underline cursor-pointer shrink-0"
          >
            Track Status →
          </button>
        </div>
      )}

      {/* Main Room Layout & Bed Assignment */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bed Arrangement & Room Summary */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] font-medium">
                Allotted Space
              </span>
              <h2 className="text-3xl font-bold text-[#1F2937] dark:text-white mt-0.5">
                Room {currentStudent.roomNumber}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#FCE7F3] dark:bg-[#2B2333] text-[#EC4899] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B] text-xs font-mono font-semibold">
              {currentStudent.bedNumber} Assigned
            </span>
          </div>

          {/* Dynamic Bed Layout Visual */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] font-medium">
                Bed Arrangement ({capacity}-Bed Room)
              </span>
              <span className="text-[11px] font-mono text-[#15803D] dark:text-[#2DD4A8] bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 px-2 py-0.5 rounded-full border border-[#BBF7D0] dark:border-[#2DD4A8]/20">
                {occupiedCount} of {capacity} Occupied
              </span>
            </div>

            <div
              className={`grid gap-3 ${
                bedsToRender.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {bedsToRender.map((bed, index) => {
                const isCurrentStudent =
                  bed.studentId === currentStudent.id ||
                  bed.bedNumber === currentStudent.bedNumber ||
                  bed.studentName?.toLowerCase().includes(currentStudent.name.toLowerCase().split(' ')[0]);
                const isOccupied = bed.status === 'Occupied' || !!bed.studentName;
                const occupantName = isCurrentStudent
                  ? currentStudent.name
                  : bed.studentName || (roommates[index]?.name ?? 'Roommate');

                return (
                  <div
                    key={bed.bedId || `bed-${index}`}
                    className={`p-4 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden transition-all ${
                      isCurrentStudent
                        ? 'bg-[#FFF5F8] dark:bg-[#261E2E] border-2 border-[#EC4899] dark:border-[#F472B6] shadow-2xs'
                        : isOccupied
                        ? 'bg-white dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B]'
                        : 'bg-white dark:bg-[#120F14] border border-dashed border-[#E5E7EB] dark:border-[#332A3B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold ${
                          isCurrentStudent
                            ? 'text-[#EC4899] dark:text-[#F472B6]'
                            : isOccupied
                            ? 'text-[#6B7280] dark:text-[#A79CB0]'
                            : 'text-[#9CA3AF] dark:text-[#737684]'
                        }`}
                      >
                        {bed.bedNumber}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOccupied ? 'bg-[#22C55E]' : 'bg-[#9CA3AF] dark:bg-[#4B5060]'
                        }`}
                        title={isOccupied ? 'Occupied' : 'Available'}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#1F2937] dark:text-white truncate">
                        {isOccupied ? occupantName : 'Available Bed'}
                      </p>
                      <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
                        {isCurrentStudent ? 'You (Current)' : isOccupied ? 'Roommate' : 'Vacant'}
                      </p>
                    </div>

                    <div className="w-full bg-[#E5E7EB] dark:bg-[#282A37] h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full w-full ${
                          isCurrentStudent
                            ? 'bg-[#EC4899] dark:bg-[#F472B6]'
                            : isOccupied
                            ? 'bg-[#22C55E]'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Specs Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-xs border-t border-[#F3E8EF] dark:border-[#332A3B]">
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] text-[11px] block">Capacity</span>
              <span className="font-semibold text-[#1F2937] dark:text-white mt-0.5 block">
                {occupiedCount} of {capacity} Beds Occupied
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] text-[11px] block">Room Type</span>
              <span className="font-semibold text-[#1F2937] dark:text-white mt-0.5 block">
                {currentRoom?.roomType || currentStudent.roomType || 'Triple'}
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] dark:text-[#A79CB0] text-[11px] block">Sanitation</span>
              <span className="font-semibold text-[#15803D] dark:text-[#2DD4A8] mt-0.5 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Inspected Clean
              </span>
            </div>
          </div>
        </div>

        {/* Right: Roommate Directory */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">Roommates</h3>
              <span className="text-xs font-mono text-[#6B7280] dark:text-[#A79CB0]">
                {roommates.length} Connected
              </span>
            </div>

            {roommates.length === 0 ? (
              <p className="text-xs text-[#6B7280] dark:text-[#A79CB0] py-6 text-center">
                No other roommates currently allotted to this room.
              </p>
            ) : (
              <div className="space-y-3">
                {roommates.map((mate) => (
                  <div
                    key={mate.id}
                    className="p-4 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] dark:bg-[#201B26] text-[#EC4899] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                        {mate.avatar ? (
                          <img
                            src={mate.avatar}
                            alt={mate.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          mate.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1F2937] dark:text-white truncate">
                          {mate.name}
                        </p>
                        <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] truncate">
                          {mate.department} • {mate.bedNumber}
                        </p>
                      </div>
                    </div>

                    {/* Contact Options */}
                    <div className="flex items-center gap-2 pt-1 border-t border-[#F3E8EF] dark:border-[#2C2436]">
                      <a
                        href={`tel:${mate.mobile}`}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white dark:bg-[#1B1720] hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] text-[11px] font-medium text-[#1F2937] dark:text-white flex items-center justify-center gap-1.5 transition-colors border border-[#F3E8EF] dark:border-[#332A3B] shadow-2xs cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-[#15803D] dark:text-[#2DD4A8]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${mate.mobile.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white dark:bg-[#1B1720] hover:bg-[#FFF5F8] dark:hover:bg-[#261E2E] text-[11px] font-medium text-[#1F2937] dark:text-white flex items-center justify-center gap-1.5 transition-colors border border-[#F3E8EF] dark:border-[#332A3B] shadow-2xs cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3 text-[#EC4899] dark:text-[#F472B6]" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Room Transfer Box */}
          <div className="pt-3 border-t border-[#F3E8EF] dark:border-[#2C2436] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#1F2937] dark:text-white">
                Roommate or Wing Transfer?
              </p>
              <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
                Submit a digital room transfer application for review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(true)}
              className="h-8 px-3.5 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02] shrink-0"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Apply for Transfer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Verified Inventory & Housekeeping Log */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Room Inventory */}
        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D] dark:text-[#2DD4A8]" />
              <span>Room Inventory</span>
            </h3>
            <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#A79CB0] bg-[#F3F4F6] dark:bg-[#261E2E] px-2 py-0.5 rounded-md border border-[#E5E7EB] dark:border-[#332A3B]">
              Certified
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#F3E8EF] dark:border-[#2C2436]">
              <span className="text-[#6B7280] dark:text-[#A79CB0]">Study Desk &amp; Reading Lamp</span>
              <span className="font-semibold text-[#1F2937] dark:text-white">{capacity} Sets</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F3E8EF] dark:border-[#2C2436]">
              <span className="text-[#6B7280] dark:text-[#A79CB0]">Ergonomic Mesh Study Chairs</span>
              <span className="font-semibold text-[#1F2937] dark:text-white">{capacity} Units</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F3E8EF] dark:border-[#2C2436]">
              <span className="text-[#6B7280] dark:text-[#A79CB0]">Steel Wardrobe with Key Locker</span>
              <span className="font-semibold text-[#1F2937] dark:text-white">{capacity} Lockers</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F3E8EF] dark:border-[#2C2436]">
              <span className="text-[#6B7280] dark:text-[#A79CB0]">High-Speed Wi-Fi AP</span>
              <span className="font-semibold text-[#15803D] dark:text-[#2DD4A8] font-mono">1 Gbps Online</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#6B7280] dark:text-[#A79CB0]">Ceiling Fans &amp; Ambient Lighting</span>
              <span className="font-semibold text-[#1F2937] dark:text-white">Operational</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('complaints')}
              className="text-xs text-[#EC4899] dark:text-[#F472B6] hover:underline cursor-pointer font-medium"
            >
              Notice damage or fixture fault? Report a maintenance ticket →
            </button>
          </div>
        </div>

        {/* Quiet Safety Guidelines */}
        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
            <span>Living Guidelines</span>
          </h3>

          <ul className="space-y-3 text-xs text-[#6B7280] dark:text-[#A79CB0] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#EC4899] dark:text-[#F472B6] font-bold">•</span>
              <span>
                <strong className="text-[#1F2937] dark:text-white">Night Gate Curfew:</strong> Main hostel
                gate closes strictly at 10:00 PM. Digital outpasses must be pre-approved for late returns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EC4899] dark:text-[#F472B6] font-bold">•</span>
              <span>
                <strong className="text-[#1F2937] dark:text-white">Quiet Study Hours:</strong> Observed
                between 10:30 PM and 06:00 AM in all corridors and student rooms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EC4899] dark:text-[#F472B6] font-bold">•</span>
              <span>
                <strong className="text-[#1F2937] dark:text-white">Housekeeping Schedule:</strong> Room floor
                mopping and trash collection occurs daily from 10:00 AM to 12:00 PM.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Room Transfer Modal */}
      <RoomTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
    </div>
  );
};
