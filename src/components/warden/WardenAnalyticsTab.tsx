import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Building2,
  Users,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const WardenAnalyticsTab: React.FC = () => {
  const { hostels, rooms, students, leaveRequests, complaints, fees, expenses } = useApp();

  // Occupancy per hostel data
  const hostelData = hostels.map((h) => {
    const hRooms = rooms.filter((r) => r.hostelId === h.id);
    const capacity = hRooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
    const occupied = hRooms.reduce((acc, r) => {
      const occs = students.filter(
        (s) => (s.roomId && s.roomId === r.id) || (s.roomNumber === r.roomNumber && s.hostelId === r.hostelId)
      );
      return acc + (occs.length > 0 ? occs.length : (typeof r.occupied === 'number' ? r.occupied : 0));
    }, 0);

    const displayName = h.code ? `${h.code} (${h.gender || 'Wing'})` : h.name.slice(0, 15);

    return {
      name: displayName,
      occupied: occupied || 0,
      vacant: Math.max(0, (capacity || 10) - occupied),
      capacity: capacity || 10,
    };
  });

  // Complaints by category
  const complaintCounts: { [cat: string]: number } = {};
  complaints.forEach((c) => {
    complaintCounts[c.category] = (complaintCounts[c.category] || 0) + 1;
  });
  const complaintData = Object.keys(complaintCounts).map((cat) => ({
    name: cat,
    count: complaintCounts[cat],
  }));

  // Leave types data
  const leaveCounts: { [type: string]: number } = {};
  leaveRequests.forEach((l) => {
    leaveCounts[l.leaveType] = (leaveCounts[l.leaveType] || 0) + 1;
  });
  const leaveData = Object.keys(leaveCounts).map((lt) => ({
    name: lt,
    value: leaveCounts[lt],
  }));

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

  const handleExportFeesCSV = () => {
    const headers = [
      'Fee ID',
      'Student PRN',
      'Student Name',
      'Hostel',
      'Room Number',
      'Academic Semester',
      'Hostel Fee (INR)',
      'Mess Fee (INR)',
      'Maintenance Fee (INR)',
      'Total Amount (INR)',
      'Paid Amount (INR)',
      'Pending Dues (INR)',
      'Due Date',
      'Status',
    ];

    const rows = fees.map((f) => [
      f.id,
      f.studentId,
      `"${f.studentName}"`,
      `"${f.hostelName}"`,
      f.roomNumber,
      `"${f.academicYear}"`,
      f.hostelFee,
      f.messFee,
      f.maintenanceFee,
      f.totalAmount,
      f.paidAmount,
      f.pendingAmount,
      f.dueDate,
      f.paymentStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mcet_hostel_fee_ledger_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Campus Operational Analytics &amp; Reports
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-body">
            Macro metrics on hostel occupancy distribution, maintenance volume, and student movement.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportFeesCSV}
          className="h-10 px-4 rounded-xl bg-[#16181D] hover:bg-white/[0.08] border border-white/[0.12] text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4 text-zinc-400" />
          <span>Export Dues Ledger CSV ({fees.length})</span>
        </button>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hostel Occupancy Bar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h3 className="text-base font-display text-white font-semibold">Hostel Wing Occupancy</h3>
            <span className="text-xs text-zinc-400">Occupied vs Vacant</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hostelData}>
                <XAxis dataKey="name" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#16181D',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="occupied" fill="#8B5CF6" name="Occupied Beds" radius={[6, 6, 0, 0]} />
                <Bar dataKey="vacant" fill="#27272A" name="Vacant Beds" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Category Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h3 className="text-base font-display text-white font-semibold">Maintenance Breakdown</h3>
            <span className="text-xs text-zinc-400">By Category</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintData} layout="vertical">
                <XAxis type="number" stroke="#71717A" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#71717A" fontSize={10} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#16181D',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" name="Tickets Logged" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Reason Distribution Pie Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h3 className="text-base font-display text-white font-semibold">Leave Pass Distribution</h3>
            <span className="text-xs text-zinc-400">By Category</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leaveData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#16181D',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#A1A1AA' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Overview summary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-display text-white font-semibold">Campus Health &amp; Compliance</h3>
            <p className="text-xs text-zinc-400">Summary of quality standards across all hostel blocks.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-zinc-400">Average Maintenance Resolution:</span>
              <span className="font-semibold text-emerald-400">4.2 Hours</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-zinc-400">Parent Leave Verification Rate:</span>
              <span className="font-semibold text-white">98.4%</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#16181D]/80 border border-white/[0.06]">
              <span className="text-zinc-400">Dining Hall Hygiene Audit Score:</span>
              <span className="font-semibold text-emerald-400">A+ (FSSAI Certified)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16181D]/60 border border-white/[0.06] text-[11px] text-zinc-400">
            🛡️ Mauli College of Engineering &amp; Technology • Annual Hostel Administration System
          </div>
        </div>
      </div>
    </div>
  );
};
