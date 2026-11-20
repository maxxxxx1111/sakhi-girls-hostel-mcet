import React, { useState } from 'react';
import {
  X,
  Bed,
  CheckCircle2,
  UserPlus,
  Users,
  ShieldCheck,
  Building2,
  Sparkles,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Room, Bed as BedType, Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface BedAllotmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  bed: BedType | null;
}

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Electrical Power Systems (ELPO)',
  'Civil Engineering',
  'Mechanical Engineering',
];

export const BedAllotmentModal: React.FC<BedAllotmentModalProps> = ({
  isOpen,
  onClose,
  room,
  bed,
}) => {
  const { students, assignStudentToBed, addStudent } = useApp();

  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  // New resident form fields
  const [name, setName] = useState<string>('');
  const [prn, setPrn] = useState<string>('');
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [mobile, setMobile] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen || !room || !bed) return null;

  // Floor to year mapping
  const floorYear =
    room.floor === 1
      ? '1st Year'
      : room.floor === 2
      ? '2nd Year'
      : room.floor === 3
      ? '3rd Year'
      : '4th Year';

  // List of eligible students (unassigned or from the matching year)
  const unassignedStudents = students.filter(
    (s) => s.roomNumber === 'Unassigned' || s.status === 'Vacated' || !s.roomId
  );

  const handleAllot = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'existing') {
      if (!selectedStudentId) {
        setErrorMsg('Please select a student from the registered list.');
        return;
      }
      const targetStudent = students.find((s) => s.id === selectedStudentId);
      assignStudentToBed(room.id, bed.bedId || `${room.id}-${bed.bedNumber}`, selectedStudentId);
      setSuccessMsg(`Bed ${bed.bedNumber} successfully allotted to ${targetStudent?.name || 'Resident'}!`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } else {
      // New Scholar Admission & Allotment
      if (!name.trim() || !prn.trim()) {
        setErrorMsg('Please provide both Scholar Full Name and College PRN.');
        return;
      }

      const newId = `std-adm-${Date.now()}`;
      const newStudent: Omit<Student, 'id'> = {
        name: name.trim(),
        gender: 'Female',
        studentId: prn.trim().toUpperCase(),
        email: `${prn.toLowerCase().trim()}@maulice.ac.in`,
        mobile: mobile.trim() || '9876543210',
        course: 'B.Tech',
        department,
        year: floorYear,
        division: 'A',
        hostelId: room.hostelId || 'hostel-sakhi',
        hostelName: room.hostelName || 'Sakhi Girls Hostel',
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType || 'Sharing',
        bedNumber: bed.bedNumber,
        admissionDate: new Date().toISOString().split('T')[0],
        bloodGroup: 'B+',
        status: 'Active',
        parentName: parentName.trim() || 'Guardian',
        parentPhone: parentPhone.trim() || '9876543211',
        emergencyContact: parentPhone.trim() || '9876543211',
        address: 'Shegaon, Maharashtra',
      };

      addStudent(newStudent);
      // Directly assign to bed
      setTimeout(() => {
        assignStudentToBed(room.id, bed.bedId || `${room.id}-${bed.bedNumber}`, newId);
      }, 100);

      setSuccessMsg(`Admitted & Allotted ${bed.bedNumber} to ${name}!`);
      setTimeout(() => {
        setSuccessMsg('');
        setName('');
        setPrn('');
        setMobile('');
        setParentPhone('');
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121318] border border-pink-500/30 p-6 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.8)] text-zinc-100 font-body">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-pink-400 tracking-wider">
                Official Room Allotment
              </span>
              <h3 className="text-lg font-display font-bold text-white">
                Allot Room {room.roomNumber} • {bed.bedNumber}
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

        {/* Room / Floor Target Banner */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#16181D]/90 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Target Floor:</span>
          <span className="text-pink-400 font-bold">Floor {room.floor} ({floorYear} - FE/SE/TE/BE)</span>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-2xl bg-[#16181D] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => { setMode('existing'); setErrorMsg(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'existing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Select Registered</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('new'); setErrorMsg(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'new'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit New Scholar</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleAllot} className="space-y-4 text-xs">
          {mode === 'existing' ? (
            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 font-medium mb-1.5 block">
                  Select Resident from Student Register:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-pink-500 cursor-pointer text-xs"
                >
                  <option value="">-- Choose Unassigned or Existing Student --</option>
                  {unassignedStudents.length > 0 && (
                    <optgroup label="Unassigned / Vacated Students">
                      {unassignedStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.studentId} • {s.department})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="All Registered Students (Transfer)">
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentId} • Current: {s.roomNumber})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Assigning an existing resident automatically reallocates their foreign keys (`room_id`, `bed_id`) and updates MySQL occupancy views.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              <div>
                <label className="text-zinc-400 font-medium mb-1 block">Full Name of Female Resident *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanushree S. Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#16181D] border border-white/[0.12] text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">College PRN / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCET26CS01"
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#16181D] border border-white/[0.12] text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Academic Year</label>
                  <input
                    type="text"
                    readOnly
                    value={`${floorYear} (Designated)`}
                    className="w-full h-9 px-3 rounded-xl bg-[#16181D]/60 border border-white/[0.08] text-pink-400 text-xs font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-medium mb-1 block">Engineering Department (6 Branches) *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-pink-500 text-xs cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Student Mobile</label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#16181D] border border-white/[0.12] text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Guardian Phone</label>
                  <input
                    type="text"
                    placeholder="9876543211"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#16181D] border border-white/[0.12] text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#16181D] hover:bg-[#1E2026] text-zinc-300 border border-white/[0.12] font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Bed Allotment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
