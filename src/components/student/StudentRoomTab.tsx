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
  Sparkles,
  Layers,
  Box,
  Compass,
  SunMedium,
  Award,
  Zap,
  Check,
  ExternalLink,
} from 'lucide-react';
import { RoomTransferModal } from './RoomTransferModal';
import { IsometricRoomVisual } from './IsometricRoomVisual';

export const StudentRoomTab: React.FC = () => {
  const { currentStudent, rooms, students, hostels, setActiveTab, roomChangeRequests } = useApp();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'plan'>('3d');

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
              lockerNumber: `L-101${String.fromCharCode(65 + i)}`,
              alcoveType: i === 0 ? 'Window Garden Bay' : i === 1 ? 'Study Alcove Bay' : 'Corridor Bay',
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
              lockerNumber: `L-101${String.fromCharCode(65 + i)}`,
              alcoveType: i === 0 ? 'Window Garden Bay' : i === 1 ? 'Study Alcove Bay' : 'Corridor Bay',
            };
          }
          return {
            bedId: `bed-${i + 1}`,
            bedNumber: bedNum,
            status: 'Available' as const,
            lockerNumber: `L-101${String.fromCharCode(65 + i)}`,
            alcoveType: 'Reserved Bay',
          };
        });

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-16">
      {/* 1. Ultra-Premium Glassmorphic Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-950/40 dark:via-purple-950/20 dark:to-zinc-950/60 border border-pink-200/60 dark:border-pink-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-500/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-400/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-pink-800/60 text-xs font-semibold text-pink-700 dark:text-pink-300 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-pink-500" />
              <span>{currentHostel?.name || 'Sakhi Girls Hostel'}</span>
              <span className="w-1 h-1 rounded-full bg-pink-400" />
              <span>Floor {currentRoom?.floor || 2} • West Wing</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Sanctuary Suite {currentStudent.roomNumber}
              </h1>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-mono text-xs font-bold shadow-xs">
                {currentStudent.bedNumber} Allotted
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Air-conditioned residential suite with dedicated study nooks, ergonomic seating, high-speed Wi-Fi 6 mesh, and certified daily sanitation.
            </p>

            {/* Quick Diagnostic Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Sanitized &amp; Inspected
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium">
                <Wifi className="w-3.5 h-3.5 text-blue-600" />
                Sakhi-Secure-5G • 1 Gbps
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                {occupiedCount} of {capacity} Occupied
              </span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(true)}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Room Swap / Transfer</span>
            </button>

            {/* View Mode Toggle Pill */}
            <div className="inline-flex p-1 rounded-2xl bg-white/70 dark:bg-zinc-900/80 border border-pink-200/80 dark:border-zinc-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Visualizer</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('plan')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'plan'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bed Blueprint</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Transfer Notice Banner if pending */}
      {pendingTransfer && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 block text-sm">
                Room Swap Application In Review (#{pendingTransfer.id.toUpperCase()})
              </span>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-0.5">
                Target: {pendingTransfer.preferredRoomType} Sharing in {pendingTransfer.preferredBlock} • Awaiting Warden Office Final Authorization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700/60 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100/50 cursor-pointer shrink-0 transition-colors"
          >
            Track Status →
          </button>
        </div>
      )}

      {/* 2. Interactive View: 3D Room Visualizer OR Detailed Layout */}
      {viewMode === '3d' && (
        <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                  Interactive 3D Architectural Model
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Move your cursor to dynamically tilt the room perspective and inspect ambient lighting.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800/40">
              WebGL Accelerated
            </span>
          </div>

          <IsometricRoomVisual
            roomNumber={currentStudent.roomNumber}
            bedNumber={currentStudent.bedNumber}
            hostelName={currentHostel?.name || currentStudent.hostelName || 'Sakhi Girls Hostel'}
            roomType={currentRoom?.roomType || currentStudent.roomType || 'Triple Sharing Deluxe'}
            status="Sanitized & Clean"
          />
        </section>
      )}

      {/* 3. Bed Arrangement & Allotment Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-pink-500" />
              <span>Berth Allotments &amp; Resident Spaces</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Each resident berth includes an orthopedic mattress, reading lamp, 3-pin power point, and Godrej steel wardrobe.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            {occupiedCount} / {capacity} Occupied
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bedsToRender.map((bed, index) => {
            const isCurrentStudent =
              bed.studentId === currentStudent.id ||
              bed.bedNumber === currentStudent.bedNumber ||
              bed.studentName?.toLowerCase().includes(currentStudent.name.toLowerCase().split(' ')[0]);
            const isOccupied = bed.status === 'Occupied' || !!bed.studentName;
            const occupantName = isCurrentStudent
              ? currentStudent.name
              : bed.studentName || (roommates[index]?.name ?? 'Roommate');
            const lockerId = (bed as any).lockerNumber || `L-101${String.fromCharCode(65 + index)}`;
            const alcoveName = (bed as any).alcoveType || (index === 0 ? 'Window Garden Bay' : index === 1 ? 'Study Alcove Bay' : 'Corridor Bay');

            return (
              <div
                key={bed.bedId || `bed-${index}`}
                className={`relative rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 ${
                  isCurrentStudent
                    ? 'bg-gradient-to-b from-pink-50/90 via-white to-pink-50/40 dark:from-[#261E2E] dark:via-[#1B1720] dark:to-[#261E2E] border-2 border-pink-400 dark:border-pink-500 shadow-md shadow-pink-500/10'
                    : isOccupied
                    ? 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs hover:border-pink-200 dark:hover:border-pink-900/40'
                    : 'bg-zinc-50/70 dark:bg-[#151218] border border-dashed border-zinc-300 dark:border-zinc-700/60'
                }`}
              >
                {/* Top Badge: Bed ID and Berth Type */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-extrabold font-mono ${
                          isCurrentStudent
                            ? 'text-pink-600 dark:text-pink-400'
                            : isOccupied
                            ? 'text-zinc-800 dark:text-zinc-200'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {bed.bedNumber}
                      </span>
                      {isCurrentStudent && (
                        <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      {alcoveName}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isOccupied
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOccupied ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                      }`}
                    />
                    {isOccupied ? 'Occupied' : 'Vacant'}
                  </span>
                </div>

                {/* Middle: Occupant Profile Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs ${
                        isCurrentStudent
                          ? 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-200 border border-pink-300 dark:border-pink-700'
                          : isOccupied
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isOccupied ? (
                        occupantName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                      ) : (
                        <BedDouble className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                        {isOccupied ? occupantName : 'Unallocated Berth'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {isCurrentStudent
                          ? `${currentStudent.department || 'Computer Science'} • PRN #${currentStudent.prn || '2024CS109'}`
                          : isOccupied
                          ? 'Information Technology • 3rd Year'
                          : 'Available for Room Swap'}
                      </p>
                    </div>
                  </div>

                  {/* Amenities Row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <Lock className="w-3.5 h-3.5 text-pink-500" />
                      <span>{lockerId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>230V Hub</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Status / Action */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  {isCurrentStudent ? (
                    <div className="flex items-center justify-between text-[11px] text-pink-600 dark:text-pink-400 font-semibold">
                      <span>Assigned to your profile</span>
                      <CheckCircle2 className="w-4 h-4 text-pink-500" />
                    </div>
                  ) : isOccupied ? (
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>Roommate Verified</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsTransferModalOpen(true)}
                      className="w-full py-1.5 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 font-semibold text-center cursor-pointer hover:underline"
                    >
                      Request this bed via transfer →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Roommates Directory & Comms Suite */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Roommates List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Roommate Directory ({roommates.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Sakhi Residential Network
            </span>
          </div>

          {roommates.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Users className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No other roommates currently allotted. Additional allocations may arrive during the term.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {roommates.map((mate) => (
                <div
                  key={mate.id}
                  className="p-4 rounded-2xl bg-pink-50/40 dark:bg-[#151218] border border-pink-100 dark:border-[#2C2436] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-pink-300 dark:hover:border-pink-800"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white font-bold text-sm flex items-center justify-center shadow-xs overflow-hidden shrink-0">
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
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {mate.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {mate.department} • {mate.bedNumber}
                      </p>
                      <span className="inline-block mt-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                        Resident Scholar
                      </span>
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${mate.mobile}`}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/91${mate.mobile.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-200 dark:border-emerald-800/40 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Room Chore & Harmony Guidelines */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200 dark:border-zinc-800/80 space-y-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              Room Harmony &amp; Chore Schedule
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div>
                <span className="text-zinc-400 block text-[11px]">Trash Disposal</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Daily by 09:30 AM</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Deep Cleaning</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Every Saturday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Certified Room Inventory */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3E8EF] dark:border-[#2C2436] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Room Fixtures &amp; Inventory
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                Audited 2026
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Lamp className="w-3.5 h-3.5 text-pink-500" />
                  Study Desk &amp; LED Reading Lamp
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">{capacity} Workstations</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Armchair className="w-3.5 h-3.5 text-pink-500" />
                  Ergonomic Mesh Study Chairs
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">{capacity} Units</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-pink-500" />
                  Steel Wardrobe with Dual Keys
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">{capacity} Full Lockers</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-blue-500" />
                  Wi-Fi 6 Enterprise Access Point
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">1 Gbps Online</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-cyan-500" />
                  Dual Ceiling Fans &amp; Ventilation
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">Active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F3E8EF] dark:border-[#2C2436] space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('complaints')}
              className="w-full py-2.5 px-4 rounded-xl bg-pink-50 dark:bg-pink-950/30 hover:bg-pink-100 dark:hover:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-pink-200 dark:border-pink-800/50 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-pink-600" />
              <span>Report Fixture / Maintenance Issue</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Living Guidelines & Quiet Hours */}
      <section className="bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-purple-500/5 dark:from-pink-950/20 dark:to-zinc-900 border border-pink-200/60 dark:border-pink-900/40 rounded-3xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>Sakhi Residential Living Charter</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
            <span className="font-bold text-zinc-900 dark:text-white block">10:00 PM Night Curfew</span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Biometric turnstiles lock strictly at 10:00 PM. Digital outpasses required for late college projects.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
            <span className="font-bold text-zinc-900 dark:text-white block">Quiet Study Hours</span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              10:30 PM to 06:00 AM observed across all wings. Corridor calls and loud audio prohibited.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
            <span className="font-bold text-zinc-900 dark:text-white block">Daily Housekeeping</span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Floor sanitization daily between 10:00 AM and 12:00 PM by authorized hostel staff.
            </p>
          </div>
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
