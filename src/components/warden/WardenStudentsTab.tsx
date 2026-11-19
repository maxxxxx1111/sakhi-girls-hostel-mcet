import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Phone,
  Building2,
  CheckCircle,
  X,
  UserCheck,
  Download,
} from 'lucide-react';

export const WardenStudentsTab: React.FC = () => {
  const { students, hostels, rooms, addStudent, deleteStudent } = useApp();

  const [search, setSearch] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('Third Year');
  const [division, setDivision] = useState('A');
  const [hostelId, setHostelId] = useState(hostels[0]?.id || 'hostel-sakhi');
  const [roomId, setRoomId] = useState(rooms[0]?.id || 'room-s-101');
  const [bedNumber, setBedNumber] = useState('Bed-1');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [addSuccess, setAddSuccess] = useState(false);

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(search.toLowerCase()) ||
      std.studentId.toLowerCase().includes(search.toLowerCase()) ||
      std.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      std.department.toLowerCase().includes(search.toLowerCase());
    const matchesHostel = selectedHostel === 'all' || std.hostelId === selectedHostel;
    return matchesSearch && matchesHostel;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentId.trim()) return;

    const chosenHostel = hostels.find((h) => h.id === hostelId) || hostels[0];
    const chosenRoom = rooms.find((r) => r.id === roomId) || rooms[0];

    addStudent({
      name,
      studentId,
      email: email || `${studentId.toLowerCase()}@maulice.ac.in`,
      mobile,
      course: 'B.Tech',
      department,
      year,
      division,
      hostelId,
      hostelName: chosenHostel.name,
      roomId,
      roomNumber: chosenRoom.roomNumber,
      roomType: chosenRoom.roomType || chosenRoom.type,
      bedNumber,
      admissionDate: new Date().toISOString().split('T')[0],
      bloodGroup,
      status: 'Active',
      parentName: parentName || 'Guardian',
      parentPhone: parentPhone || mobile,
      emergencyContact: parentPhone || mobile,
      address: 'Shegaon, Maharashtra',
    });

    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setIsAddModalOpen(false);
      setName('');
      setStudentId('');
      setMobile('');
      setParentName('');
      setParentPhone('');
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = [
      'PRN',
      'Name',
      'Gender',
      'Department',
      'Year',
      'Division',
      'Mobile',
      'Email',
      'Hostel',
      'Room Number',
      'Bed',
      'Blood Group',
      'Parent Name',
      'Parent Phone',
      'Emergency Contact',
      'Admission Date',
      'Status',
    ];

    const rows = filteredStudents.map((std) => [
      std.studentId,
      `"${std.name}"`,
      std.gender || 'Not Specified',
      `"${std.department}"`,
      `"${std.year}"`,
      std.division || 'A',
      `"${std.mobile}"`,
      `"${std.email}"`,
      `"${std.hostelName}"`,
      std.roomNumber,
      std.bedNumber,
      std.bloodGroup || 'O+',
      `"${std.parentName || ''}"`,
      `"${std.parentPhone || ''}"`,
      `"${std.emergencyContact || ''}"`,
      std.admissionDate || '2024-08-01',
      std.status || 'Active',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mcet_hostel_students_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Hostel Residents Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage enrolled students, bed assignments, guardian speed dials, and department lists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-full bg-[#16181D] hover:bg-white/[0.08] border border-white/[0.12] text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            <span>Export CSV ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(139,92,246,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Admit New Resident</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, ID, room, or branch..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all">All Hostel Wings</option>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[#111215]/90 rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16181D] border-b border-white/[0.08] text-zinc-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Student Name &amp; ID</th>
                <th className="py-3.5 px-4 font-semibold">Department &amp; Year</th>
                <th className="py-3.5 px-4 font-semibold">Hostel &amp; Room</th>
                <th className="py-3.5 px-4 font-semibold">Contact &amp; Guardian</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-display text-sm font-bold shrink-0">
                          {std.avatar ? (
                            <img src={std.avatar} alt={std.name || 'Student'} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            std.name?.[0] || 'S'
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{std.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{std.studentId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-zinc-200 font-medium">{std.department}</p>
                      <p className="text-[10px] text-zinc-400">{std.year} (Div {std.division})</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-white font-mono font-semibold">Room {std.roomNumber}</p>
                      <p className="text-[10px] text-zinc-400">{std.bedNumber} • {std.hostelName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-white font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {std.mobile}
                      </p>
                      <p className="text-[10px] text-zinc-400">Parent: {std.parentPhone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                        {std.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteStudent(std.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#111215] rounded-3xl p-6 sm:p-8 border border-white/[0.12] shadow-2xl relative max-h-[90vh] overflow-y-auto text-zinc-100"
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-display text-white font-bold mb-1">Admit New Hostel Resident</h3>
            <p className="text-xs text-zinc-400 mb-6">Allocate bed and register official college resident credentials.</p>

            {addSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold">Resident Enrolled Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Yash S. Manwar"
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Enrollment ID</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. MCET2024CS088"
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Student Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">College Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yash.cs@maulice.ac.in"
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Engineering Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering (CS)</option>
                      <option value="Information Technology">Information Technology (IT)</option>
                      <option value="Electronics & Telecommunication">Electronics &amp; Telecommunication (ENTC)</option>
                      <option value="Electrical Power Systems (ELPO)">Electrical Power Systems (ELPO)</option>
                      <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                      <option value="Mechanical Engineering">Mechanical Engineering (MECHANICAL)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="1st Year">1st Year (FE)</option>
                      <option value="2nd Year">2nd Year (SE)</option>
                      <option value="3rd Year">3rd Year (TE)</option>
                      <option value="4th Year">4th Year (BE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Allotted Hostel Wing</label>
                    <select
                      value={hostelId}
                      onChange={(e) => setHostelId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {hostels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Room Selection</label>
                    <select
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer font-mono"
                    >
                      {rooms
                        .filter((r) => r.hostelId === hostelId)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            Room {r.roomNumber} ({r.roomType || r.type} - Floor {r.floor})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Bed Assigned</label>
                    <select
                      value={bedNumber}
                      onChange={(e) => setBedNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer font-mono"
                    >
                      <option value="Bed-1">Bed-1</option>
                      <option value="Bed-2">Bed-2</option>
                      <option value="Bed-3">Bed-3</option>
                      <option value="Bed-4">Bed-4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Parent / Guardian Contact</label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+91 94220 12345"
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 shadow cursor-pointer"
                  >
                    Admit Student
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
