import React, { useState } from 'react';
import {
  Building2,
  Bed,
  CheckCircle2,
  Users,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HostelFloorRadarSection: React.FC = () => {
  const { rooms, students, openAuthModal } = useApp();
  const [activeFloor, setActiveFloor] = useState<number>(1);

  const floorMeta: { [key: number]: { label: string; yearName: string; short: string; desc: string } } = {
    1: { label: 'Floor 1', yearName: '1st Year Engineering (FE)', short: 'FE', desc: 'Dedicated quiet study wing for first-year scholars with resident counselor.' },
    2: { label: 'Floor 2', yearName: '2nd Year Engineering (SE)', short: 'SE', desc: 'Core branch integration wing for sophomore engineering scholars.' },
    3: { label: 'Floor 3', yearName: '3rd Year Engineering (TE)', short: 'TE', desc: 'Junior year technical labs and capstone preparation floor.' },
    4: { label: 'Floor 4', yearName: '4th Year Engineering (BE)', short: 'BE', desc: 'Single & twin executive suites for final-year placement scholars.' },
  };

  const departments = [
    { code: 'CS', name: 'Computer Science', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 light:bg-emerald-50 light:text-emerald-800 light:border-emerald-300' },
    { code: 'IT', name: 'Information Tech', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 light:bg-cyan-50 light:text-cyan-800 light:border-cyan-300' },
    { code: 'ENTC', name: 'Electronics & TC', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30 light:bg-blue-50 light:text-blue-800 light:border-blue-300' },
    { code: 'ELPO', name: 'Electrical Power', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30 light:bg-amber-50 light:text-amber-800 light:border-amber-300' },
    { code: 'CIVIL', name: 'Civil Engineering', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30 light:bg-orange-50 light:text-orange-800 light:border-orange-300' },
    { code: 'MECH', name: 'Mechanical Engg', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30 light:bg-rose-50 light:text-rose-800 light:border-rose-300' },
  ];

  // Filter rooms on active floor
  const floorRooms = rooms.filter((r) => r.floor === activeFloor);

  // Overall metrics
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + (r.beds?.filter((b) => b.status === 'Occupied').length || r.occupied || 0), 0);
  const vacantBeds = rooms.reduce((acc, r) => acc + (r.beds?.filter((b) => b.status === 'Available').length || Math.max(0, r.capacity - r.occupied)), 0);

  return (
    <section id="floor-radar" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08] light:border-pink-200/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-500/20 light:border-emerald-300 inline-block mb-3 font-mono">
            Live Residential Matrix • Sakhi Girls Hostel
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white light:text-zinc-900 font-bold tracking-tight">
            Interactive Floor &amp; Vacancy Radar
          </h2>
        </div>

        {/* Vacancy indicator pill */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 light:bg-emerald-50 border border-emerald-500/30 light:border-emerald-300 text-emerald-300 light:text-emerald-800 flex items-center gap-2 shadow-[0_0_16px_rgba(16,185,129,0.25)] light:shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 light:bg-emerald-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold font-mono">
              {vacantBeds} Beds Left Across 16 Rooms
            </span>
          </div>
        </div>
      </div>

      {/* 6 Engineering Departments Representation Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111215]/90 light:bg-white border border-white/[0.08] light:border-pink-200/70 light:shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-mono text-zinc-400 light:text-zinc-600 uppercase tracking-wider font-semibold">
            6 Department Representation Across Sakhi Girls Hostel:
          </span>
          <span className="text-zinc-500 light:text-zinc-400 text-[11px] font-mono">MCET Campus</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {departments.map((d) => (
            <div
              key={d.code}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono font-bold ${d.color}`}
            >
              <span>{d.code}</span>
              <span className="text-[10px] font-normal opacity-85 truncate ml-1">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Floor Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[1, 2, 3, 4].map((fl) => {
          const flRooms = rooms.filter((r) => r.floor === fl);
          const flVacant = flRooms.reduce((acc, r) => acc + (r.beds?.filter((b) => b.status === 'Available').length || Math.max(0, r.capacity - r.occupied)), 0);
          const meta = floorMeta[fl];
          const isSelected = activeFloor === fl;

          return (
            <button
              key={fl}
              type="button"
              onClick={() => setActiveFloor(fl)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#1E122A] to-[#121318] light:from-pink-50 light:to-white border-pink-500/50 light:border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.2)] light:shadow-[0_4px_16px_rgba(236,72,153,0.12)]'
                  : 'bg-[#111215]/80 light:bg-white border-white/[0.06] light:border-pink-100 hover:border-white/20 light:hover:border-pink-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isSelected ? 'text-white light:text-pink-900' : 'text-zinc-300 light:text-zinc-700'}`}>
                  {meta.label}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  flVacant > 0
                    ? 'bg-emerald-500/15 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 border border-emerald-500/30 light:border-emerald-300'
                    : 'bg-zinc-800 light:bg-zinc-100 text-zinc-400 light:text-zinc-600'
                }`}>
                  {flVacant} Left
                </span>
              </div>
              <p className="text-[11px] font-medium text-pink-400 light:text-pink-600 font-mono truncate">{meta.short} • {meta.yearName}</p>
            </button>
          );
        })}
      </div>

      {/* Active Floor Description Banner */}
      <div className="p-4 rounded-2xl bg-[#16181D]/80 light:bg-pink-50/60 border border-white/[0.06] light:border-pink-200/70 mb-6 flex items-center justify-between text-xs text-zinc-300 light:text-zinc-700">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-pink-400 light:text-pink-600 shrink-0" />
          <span>{floorMeta[activeFloor].desc}</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 light:text-zinc-500 hidden sm:inline-block">
          All rooms pre-fitted with gigabit LAN &amp; solar geyser
        </span>
      </div>

      {/* Rooms on this Floor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {floorRooms.map((room) => {
          const roomOccupants = students.filter(
            (s) => (s.roomId && s.roomId === room.id) || (s.roomNumber === room.roomNumber && s.hostelId === room.hostelId)
          );
          const occupiedCount = room.beds?.filter((b) => b.status === 'Occupied').length ?? roomOccupants.length;
          const vacantCount = room.beds?.filter((b) => b.status === 'Available').length ?? Math.max(0, room.capacity - occupiedCount);

          return (
            <div
              key={room.id}
              className="p-5 rounded-3xl bg-[#111215]/90 light:bg-white border border-white/[0.08] light:border-pink-200/70 shadow-lg light:shadow-md hover:border-white/20 light:hover:border-pink-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/15 light:bg-pink-50 text-pink-400 light:text-pink-600 flex items-center justify-center border border-pink-500/25 light:border-pink-200">
                      <Bed className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white light:text-zinc-900 font-mono">{room.roomNumber}</h4>
                      <span className="text-[10px] text-zinc-400 light:text-zinc-500">{room.roomType || 'Sharing'} Room</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    room.status === 'Maintenance'
                      ? 'bg-amber-500/15 light:bg-amber-50 text-amber-400 light:text-amber-700 border-amber-500/30 light:border-amber-300'
                      : vacantCount > 0
                      ? 'bg-emerald-500/15 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 border-emerald-500/30 light:border-emerald-300'
                      : 'bg-zinc-800 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 border-white/[0.08] light:border-zinc-200'
                  }`}>
                    {room.status === 'Maintenance' ? 'Maintenance' : vacantCount > 0 ? `${vacantCount} Available` : 'Full'}
                  </span>
                </div>

                {/* Bed allocation preview */}
                <div className="space-y-1.5 my-3">
                  {(room.beds && room.beds.length > 0
                    ? room.beds
                    : Array.from({ length: room.capacity }, (_, i) => ({
                        bedId: `${room.id}-bed-${i + 1}`,
                        bedNumber: `Bed-${i + 1}`,
                        status: i < occupiedCount ? 'Occupied' : 'Available',
                      }))
                  ).map((bed, bIdx) => {
                    const occupant = roomOccupants.find((o) => o.bedNumber === bed.bedNumber || o.id === bed.studentId);
                    const isOccupied = bed.status === 'Occupied' || !!occupant;

                    if (isOccupied && occupant) {
                      return (
                        <div
                          key={bed.bedId || bIdx}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#16181D] light:bg-zinc-50 text-[11px] border border-white/[0.04] light:border-zinc-200"
                        >
                          <span className="font-mono text-zinc-400 light:text-zinc-500">{bed.bedNumber}</span>
                          <span className="font-medium text-white light:text-zinc-900 truncate max-w-[110px]">{occupant.name.split(' ')[0]}</span>
                          <span className="text-[9px] font-mono font-bold text-pink-400 light:text-pink-700 bg-pink-500/10 light:bg-pink-100 px-1.5 py-0.5 rounded">
                            {occupant.department.slice(0, 4).toUpperCase()}
                          </span>
                        </div>
                      );
                    }

                    if (bed.status === 'Maintenance') {
                      return (
                        <div
                          key={bed.bedId || bIdx}
                          className="flex items-center justify-between p-2 rounded-xl bg-amber-500/5 light:bg-amber-50 text-[11px] border border-amber-500/20 light:border-amber-200 text-amber-300 light:text-amber-800"
                        >
                          <span className="font-mono">{bed.bedNumber}</span>
                          <span>Under Maintenance</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={bed.bedId || bIdx}
                        className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 light:bg-emerald-50 text-[11px] border border-dashed border-emerald-500/30 light:border-emerald-300 text-emerald-300 light:text-emerald-800 font-medium"
                      >
                        <span className="font-mono">{bed.bedNumber}</span>
                        <span>Available • Ready</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => openAuthModal('student')}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-[#16181D] light:bg-pink-50 hover:bg-pink-600 light:hover:bg-pink-600 text-zinc-300 light:text-pink-700 hover:text-white light:hover:text-white border border-white/[0.08] light:border-pink-200 hover:border-pink-500 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Inquire Room {room.roomNumber}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
