import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  BedDouble,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import { Room, Bed as BedType, Student } from '../../types';
import { BedAllotmentModal } from './BedAllotmentModal';
import { VacateBedModal } from './VacateBedModal';

// Department styling & abbreviation helper
const DEPT_CONFIG: { [key: string]: { code: string; color: string; border: string; bg: string } } = {
  'Computer Science & Engineering': {
    code: 'CS',
    color: 'text-blue-300',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/15',
  },
  'Information Technology': {
    code: 'IT',
    color: 'text-cyan-300',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/15',
  },
  'Electronics & Telecommunication': {
    code: 'ENTC',
    color: 'text-purple-300',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/15',
  },
  'Electrical Power Systems (ELPO)': {
    code: 'ELPO',
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/15',
  },
  'Civil Engineering': {
    code: 'CIVIL',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/15',
  },
  'Mechanical Engineering': {
    code: 'MECHANICAL',
    color: 'text-rose-300',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/15',
  },
};

const getDeptBadge = (deptName: string = '') => {
  const lower = deptName.toLowerCase();
  if (lower.includes('telecommunication') || lower.includes('entc') || lower.includes('etc') || lower.includes('extc')) {
    return DEPT_CONFIG['Electronics & Telecommunication'];
  }
  if (lower.includes('power') || lower.includes('elpo') || lower.includes('electrical')) {
    return DEPT_CONFIG['Electrical Power Systems (ELPO)'];
  }
  if (lower.includes('computer') || lower.includes('cse') || lower === 'cs') {
    return DEPT_CONFIG['Computer Science & Engineering'];
  }
  if (lower.includes('information') || lower === 'it') {
    return DEPT_CONFIG['Information Technology'];
  }
  if (lower.includes('civil') || lower === 'cv') {
    return DEPT_CONFIG['Civil Engineering'];
  }
  if (lower.includes('mechanical') || lower.includes('mech') || lower === 'me') {
    return DEPT_CONFIG['Mechanical Engineering'];
  }
  return { code: deptName.slice(0, 4).toUpperCase(), color: 'text-zinc-300', border: 'border-zinc-500/30', bg: 'bg-zinc-500/15' };
};

const FLOOR_YEAR_MAP: { [key: number]: { label: string; yearName: string; short: string } } = {
  1: { label: 'Floor 1', yearName: '1st Year Engineering', short: 'FE' },
  2: { label: 'Floor 2', yearName: '2nd Year Engineering', short: 'SE' },
  3: { label: 'Floor 3', yearName: '3rd Year Engineering', short: 'TE' },
  4: { label: 'Floor 4', yearName: '4th Year Engineering', short: 'BE' },
};

export const WardenRoomsTab: React.FC = () => {
  const { hostels, rooms, students, updateRoomStatus, roomChangeRequests, reviewRoomChange } =
    useApp();

  const [subTab, setSubTab] = useState<'matrix' | 'transfers'>('matrix');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transferFilter, setTransferFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviewRemarks, setReviewRemarks] = useState<{ [id: string]: string }>({});

  // Bed allotment & vacancy modals
  const [allotModalOpen, setAllotModalOpen] = useState<boolean>(false);
  const [selectedRoomForBed, setSelectedRoomForBed] = useState<Room | null>(null);
  const [selectedBedForAction, setSelectedBedForAction] = useState<BedType | null>(null);

  const [vacateModalOpen, setVacateModalOpen] = useState<boolean>(false);
  const [selectedOccupantToVacate, setSelectedOccupantToVacate] = useState<Student | null>(null);

  const sakhiHostel = hostels[0] || {
    id: 'hostel-sakhi',
    name: 'Sakhi Girls Hostel',
    code: 'SGH',
    totalRooms: 16,
    totalCapacity: 36,
  };

  // Helper to accurately get occupants
  const getRoomOccupants = (room: Room) => {
    return students.filter(
      (s) =>
        (s.roomId && s.roomId === room.id) ||
        (s.roomNumber === room.roomNumber && s.hostelId === room.hostelId)
    );
  };

  const getRoomOccupiedCount = (room: Room) => {
    const occs = getRoomOccupants(room);
    if (occs.length > 0) return occs.length;
    if (typeof room.occupied === 'number') return room.occupied;
    if (room.beds && room.beds.length > 0) {
      return room.beds.filter((b) => b.status === 'Occupied').length;
    }
    return 0;
  };

  // Global calculations for Sakhi Girls Hostel
  const totalRooms = rooms.length;
  const totalBedsCapacity = rooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
  const totalOccupiedBeds = rooms.reduce((acc, r) => acc + getRoomOccupiedCount(r), 0);
  const totalMaintenanceBeds = rooms
    .filter((r) => r.status === 'Maintenance')
    .reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
  const totalAvailableBedsLeft = Math.max(0, totalBedsCapacity - totalOccupiedBeds - totalMaintenanceBeds);
  const occupancyPercentage = totalBedsCapacity > 0 ? Math.round((totalOccupiedBeds / totalBedsCapacity) * 100) : 0;

  // Department counts
  const deptCounts: { [key: string]: number } = {
    CS: 0,
    IT: 0,
    ENTC: 0,
    ELPO: 0,
    CIVIL: 0,
    MECHANICAL: 0,
  };

  students.forEach((s) => {
    const badge = getDeptBadge(s.department);
    if (deptCounts[badge.code] !== undefined) {
      deptCounts[badge.code]++;
    }
  });

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    // Floor filter
    if (selectedFloor !== 'all' && r.floor.toString() !== selectedFloor) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const occupants = getRoomOccupants(r);
      const matchesRoom = r.roomNumber.toLowerCase().includes(q);
      const matchesOccupant = occupants.some(
        (o) => o.name.toLowerCase().includes(q) || o.studentId.toLowerCase().includes(q) || o.department.toLowerCase().includes(q)
      );
      if (!matchesRoom && !matchesOccupant) return false;
    }

    // Department filter
    if (selectedDept !== 'all') {
      const occupants = getRoomOccupants(r);
      const hasDept = occupants.some((o) => getDeptBadge(o.department).code === selectedDept);
      if (!hasDept) return false;
    }

    return true;
  });

  const pendingTransfersCount = roomChangeRequests.filter((r) => r.status === 'Pending').length;

  const filteredTransfers = roomChangeRequests.filter((r) => {
    if (transferFilter === 'pending') return r.status === 'Pending';
    if (transferFilter === 'approved') return r.status === 'Approved';
    if (transferFilter === 'rejected') return r.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase">
              Exclusive Girls Residential Facility
            </span>
            <span className="text-xs text-zinc-500 font-mono">CODE: SGH-MCET</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Sakhi Girls Hostel — Allotment &amp; Vacancy Desk
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            4-Year Academic Mapping (1st, 2nd, 3rd, 4th Year) across all 6 Engineering Departments (CS, IT, ENTC, ELPO, CIVIL, MECHANICAL).
          </p>
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center gap-2 bg-[#16181D] p-1 rounded-2xl border border-white/[0.08] shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'matrix'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Room &amp; Bed Grid
          </button>
          <button
            type="button"
            onClick={() => setSubTab('transfers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'transfers'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Room Transfers</span>
            {pendingTransfersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-mono font-bold">
                {pendingTransfersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {subTab === 'transfers' ? (
        /* ROOM TRANSFERS MANAGEMENT VIEW */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTransferFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    transferFilter === filter
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-[#16181D] text-zinc-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  {filter} (
                  {filter === 'all'
                    ? roomChangeRequests.length
                    : roomChangeRequests.filter((r) => r.status.toLowerCase() === filter).length}
                  )
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-400 font-mono">
              Pending Decisions: {pendingTransfersCount}
            </span>
          </div>

          {filteredTransfers.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#111215]/90 border border-white/[0.08] text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-white">No Transfer Applications</p>
              <p className="text-xs text-zinc-400">
                There are no room change requests matching this filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTransfers.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] space-y-4 backdrop-blur-xl shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-600/15 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold font-mono">
                        {req.currentRoom}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{req.studentName}</h4>
                        <span className="text-[11px] font-mono text-zinc-400">
                          PRN: {req.studentId} • Current: Room {req.currentRoom}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : req.status === 'Rejected'
                          ? 'bg-red-500/15 text-red-300 border-red-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#16181D]/80 p-3.5 rounded-2xl border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase font-mono">
                        Target Suite &amp; Type
                      </span>
                      <span className="font-semibold text-white">
                        {req.preferredBlock} • {req.preferredRoomType}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase font-mono">
                        Reason Category
                      </span>
                      <span className="font-semibold text-pink-300">{req.reasonCategory}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                      Student Justification:
                    </span>
                    <p className="text-zinc-300 italic bg-[#16181D]/40 p-2.5 rounded-xl border border-white/[0.04]">
                      "{req.reason}"
                    </p>
                  </div>

                  {req.status === 'Pending' ? (
                    <div className="pt-3 border-t border-white/[0.08] space-y-3">
                      <input
                        type="text"
                        placeholder="Warden allotment remarks (e.g. Assigned to Floor 3 Room S-303)..."
                        value={reviewRemarks[req.id] || ''}
                        onChange={(e) =>
                          setReviewRemarks({ ...reviewRemarks, [req.id]: e.target.value })
                        }
                        className="w-full h-8 px-3 rounded-xl bg-[#16181D] border border-white/[0.12] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-pink-500"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            reviewRoomChange(
                              req.id,
                              'Approved',
                              reviewRemarks[req.id] || 'Transfer approved by Chief Rector Dr. Sunita Gaikwad'
                            );
                          }}
                          className="flex-1 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Transfer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            reviewRoomChange(
                              req.id,
                              'Rejected',
                              reviewRemarks[req.id] || 'Room currently unavailable'
                            );
                          }}
                          className="flex-1 h-8 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-white/[0.08] text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>Reviewed: {req.reviewedDate || req.appliedDate}</span>
                      {req.remarks && (
                        <span className="text-zinc-300 italic truncate max-w-[200px]">
                          "{req.remarks}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* BED ALLOTMENT MATRIX GRID VIEW */
        <>
          {/* 2. SAKHI GIRLS HOSTEL VACANCY COMMAND BANNER (5 Prominent Key Metrics) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E112A] via-[#14121A] to-[#111215] border border-pink-500/20 shadow-[0_8px_32px_rgba(236,72,153,0.12)] space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">
                  Single Central Residential Complex
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-0.5">
                  Sakhi Girls Hostel Live Capacity &amp; Vacancy Status
                </h3>
              </div>

              {/* Glowing Beds Available Pill */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold font-mono">
                    {totalAvailableBedsLeft} Beds Left / Available
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
                <span className="text-[11px] text-zinc-400 font-mono block">Total Residential Suites</span>
                <p className="text-2xl font-display font-bold text-white mt-1">
                  {totalRooms}{' '}
                  <span className="text-xs text-zinc-400 font-normal font-body">Rooms (4 Floors)</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
                <span className="text-[11px] text-zinc-400 font-mono block">Total Bed Capacity</span>
                <p className="text-2xl font-display font-bold text-white mt-1">
                  {totalBedsCapacity}{' '}
                  <span className="text-xs text-zinc-400 font-normal font-body">Beds</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
                <span className="text-[11px] text-zinc-400 font-mono block">Beds Currently Occupied</span>
                <p className="text-2xl font-display font-bold text-violet-300 mt-1">
                  {totalOccupiedBeds}{' '}
                  <span className="text-xs text-zinc-400 font-normal font-body">Residents ({occupancyPercentage}%)</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#16181D]/80 border border-emerald-500/20 bg-emerald-950/10">
                <span className="text-[11px] text-emerald-400 font-mono block font-semibold">Vacant Beds Available</span>
                <p className="text-2xl font-display font-bold text-emerald-400 mt-1">
                  {totalAvailableBedsLeft}{' '}
                  <span className="text-xs text-emerald-300/70 font-normal font-body">Ready to Allot</span>
                </p>
              </div>
            </div>

            {/* Occupancy Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>Allotment Rate: {occupancyPercentage}% Occupied</span>
                <span>{totalAvailableBedsLeft} Beds Unallotted • {totalMaintenanceBeds} Maintenance</span>
              </div>
              <div className="w-full bg-white/[0.08] rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-violet-500 to-pink-500 h-full transition-all"
                  style={{ width: `${occupancyPercentage}%` }}
                  title={`${totalOccupiedBeds} Occupied`}
                />
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${Math.round((totalAvailableBedsLeft / (totalBedsCapacity || 1)) * 100)}%` }}
                  title={`${totalAvailableBedsLeft} Beds Left`}
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${Math.round((totalMaintenanceBeds / (totalBedsCapacity || 1)) * 100)}%` }}
                  title={`${totalMaintenanceBeds} Maintenance`}
                />
              </div>
            </div>

            {/* 6 Engineering Departments Representation Bar */}
            <div className="pt-3 border-t border-white/[0.06]">
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-2">
                Residents Enrolled by Department (6 Branches):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {Object.entries(DEPT_CONFIG).map(([name, conf]) => {
                  const count = deptCounts[conf.code] || 0;
                  const isFiltered = selectedDept === conf.code;
                  return (
                    <button
                      key={conf.code}
                      type="button"
                      onClick={() => setSelectedDept(isFiltered ? 'all' : conf.code)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isFiltered
                          ? `${conf.bg} ${conf.border} ring-1 ring-white/20`
                          : 'bg-[#16181D]/60 border-white/[0.04] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold font-mono ${conf.color}`}>{conf.code}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white font-mono font-bold">
                          {count}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate block mt-0.5">
                        {conf.code === 'ELPO' ? 'Electrical (ELPO)' : name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. FILTERS: Floor / Academic Year & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Floor Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedFloor('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedFloor === 'all'
                    ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                    : 'bg-[#16181D] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                All 4 Floors (16 Suites)
              </button>

              {[1, 2, 3, 4].map((fl) => {
                const info = FLOOR_YEAR_MAP[fl];
                const flRooms = rooms.filter((r) => r.floor === fl);
                const flTotal = flRooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
                const flOcc = flRooms.reduce((acc, r) => acc + getRoomOccupiedCount(r), 0);
                const flLeft = Math.max(0, flTotal - flOcc);

                return (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setSelectedFloor(fl.toString())}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      selectedFloor === fl.toString()
                        ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                        : 'bg-[#16181D] text-zinc-400 hover:text-white border border-white/[0.08]'
                    }`}
                  >
                    <span>{info.label} ({info.short})</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      {flLeft} Left
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Reset Filter */}
            <div className="flex items-center gap-2">
              {selectedDept !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedDept('all')}
                  className="px-2.5 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Branch: {selectedDept}</span>
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search room, resident or PRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 pr-3 rounded-xl bg-[#16181D] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-pink-500 w-48 sm:w-60"
                />
              </div>
            </div>
          </div>

          {/* 4. ROOM CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              const roomOccupants = getRoomOccupants(room);
              const occupiedCount = getRoomOccupiedCount(room);
              const isUnderMaintenance = room.status === 'Maintenance';
              const isFull = occupiedCount >= room.capacity && !isUnderMaintenance;
              const vacantCount = isUnderMaintenance ? 0 : Math.max(0, room.capacity - occupiedCount);
              const floorMeta = FLOOR_YEAR_MAP[room.floor] || { label: `Floor ${room.floor}`, short: 'UG', yearName: 'Engineering' };

              return (
                <div
                  key={room.id}
                  className={`p-5 rounded-3xl bg-[#111215]/95 border transition-all shadow-md backdrop-blur-xl space-y-4 ${
                    isUnderMaintenance
                      ? 'border-amber-500/30 bg-amber-950/10'
                      : isFull
                      ? 'border-white/[0.08]'
                      : 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_16px_rgba(16,185,129,0.06)]'
                  }`}
                >
                  {/* Card Top: Room Number & Availability Badge */}
                  <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-pink-600/15 text-pink-400 border border-pink-500/20 flex items-center justify-center shrink-0 font-bold font-mono">
                        {room.roomNumber.replace('S-', '')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-display text-white font-bold">
                            Room {room.roomNumber}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                            {room.roomType || room.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-pink-300 font-medium">
                          {floorMeta.label} • {floorMeta.yearName} ({floorMeta.short})
                        </span>
                      </div>
                    </div>

                    {/* Vacancy Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono border ${
                        isUnderMaintenance
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : isFull
                          ? 'bg-zinc-800 text-zinc-400 border-white/10'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      {isUnderMaintenance
                        ? 'Maintenance'
                        : isFull
                        ? 'Full (0 Left)'
                        : `${vacantCount} Bed${vacantCount > 1 ? 's' : ''} Left`}
                    </span>
                  </div>

                  {/* Bed Occupants & Vacant Beds List */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-mono text-zinc-400">
                      <span>Bed Allocation ({occupiedCount}/{room.capacity})</span>
                      <span className="text-emerald-400 font-semibold">{vacantCount} Available</span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Render all beds in this room */}
                      {(room.beds && room.beds.length > 0
                        ? room.beds
                        : Array.from({ length: room.capacity }, (_, i) => ({
                            bedId: `${room.id}-bed-${i + 1}`,
                            bedNumber: `Bed-${i + 1}`,
                            status: i < occupiedCount ? 'Occupied' : 'Available',
                          }))
                      ).map((bed, bIdx) => {
                        const occupant = roomOccupants.find(
                          (o) => o.bedNumber === bed.bedNumber || o.id === bed.studentId
                        );
                        const isBedOccupied = !!occupant || bed.status === 'Occupied';
                        const deptBadge = occupant ? getDeptBadge(occupant.department) : null;

                        if (isBedOccupied && occupant) {
                          return (
                            <div
                              key={bed.bedId || bIdx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-[#16181D]/90 border border-white/[0.06] text-xs hover:border-white/15 transition-colors"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="font-mono text-[10px] text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20 shrink-0">
                                  {occupant.bedNumber || bed.bedNumber}
                                </span>
                                <div className="truncate">
                                  <p className="font-semibold text-white truncate">{occupant.name}</p>
                                  <p className="text-[10px] text-zinc-400 font-mono truncate">{occupant.studentId}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {deptBadge && (
                                  <span
                                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${deptBadge.bg} ${deptBadge.color} ${deptBadge.border}`}
                                    title={occupant.department}
                                  >
                                    {deptBadge.code}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRoomForBed(room);
                                    setSelectedBedForAction(bed);
                                    setSelectedOccupantToVacate(occupant);
                                    setVacateModalOpen(true);
                                  }}
                                  title={`Vacate ${bed.bedNumber} (${occupant.name})`}
                                  className="px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 border border-rose-500/20 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                                >
                                  Vacate
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // Available Bed
                        return (
                          <div
                            key={bed.bedId || bIdx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/10 border border-dashed border-emerald-500/30 text-xs text-emerald-300"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-mono text-[10px] font-bold text-emerald-400">
                                {bed.bedNumber}
                              </span>
                              <span className="text-[11px] font-medium text-emerald-300">
                                Available (Vacant)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRoomForBed(room);
                                setSelectedBedForAction(bed);
                                setAllotModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <span>+ Allot Bed</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amenities List */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {room.amenities.slice(0, 3).map((amenity, aIdx) => (
                        <span
                          key={aIdx}
                          className="text-[9px] px-2 py-0.5 rounded-md bg-[#16181D] text-zinc-400 border border-white/[0.04]"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Bottom: Status Selector */}
                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-400">Room Status:</span>
                    <select
                      value={room.status}
                      onChange={(e) => updateRoomStatus(room.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg bg-[#16181D] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="Partially Occupied">Partially Occupied</option>
                      <option value="Full">Full</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Official Bed Allotment Modal */}
      <BedAllotmentModal
        isOpen={allotModalOpen}
        onClose={() => {
          setAllotModalOpen(false);
          setSelectedRoomForBed(null);
          setSelectedBedForAction(null);
        }}
        room={selectedRoomForBed}
        bed={selectedBedForAction}
      />

      {/* Vacate Bed Confirmation Modal */}
      <VacateBedModal
        isOpen={vacateModalOpen}
        onClose={() => {
          setVacateModalOpen(false);
          setSelectedRoomForBed(null);
          setSelectedBedForAction(null);
          setSelectedOccupantToVacate(null);
        }}
        room={selectedRoomForBed}
        bed={selectedBedForAction}
        occupant={selectedOccupantToVacate}
      />
    </div>
  );
};
