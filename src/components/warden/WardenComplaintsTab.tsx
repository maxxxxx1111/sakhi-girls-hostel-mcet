import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint } from '../../types';
import {
  Wrench,
  Search,
  CheckCircle,
  AlertTriangle,
  Zap,
  Droplets,
  Wifi,
  Brush,
  X,
  Clock,
  Download,
  Phone,
  UserCheck,
} from 'lucide-react';

const TECHNICIAN_PRESETS = [
  { name: 'Ganesh Shinde (Chief Electrician)', phone: '+91 98224 88710', role: 'Electrical' },
  { name: 'Suresh Patil (Campus Plumber)', phone: '+91 94231 66520', role: 'Plumbing' },
  { name: 'Sunil Rathod (Carpenter & Fixtures)', phone: '+91 97654 33210', role: 'Furniture' },
  { name: 'Pravin Deshmukh (LAN & Fiber Optics)', phone: '+91 98230 44190', role: 'Wi-Fi / LAN' },
  { name: 'Kavita Jadhav (Housekeeping & Cleaning)', phone: '+91 94220 18872', role: 'Cleaning' },
];

export const WardenComplaintsTab: React.FC = () => {
  const { complaints, resolveComplaint, assignComplaint } = useApp();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [assigningComplaint, setAssigningComplaint] = useState<Complaint | null>(null);
  const [techName, setTechName] = useState('Ganesh Shinde (Chief Electrician)');
  const [techPhone, setTechPhone] = useState('+91 98224 88710');

  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);
  const [remarks, setRemarks] = useState('Replaced damaged component and verified operational.');

  const getSLAInfo = (priority: string) => {
    switch (priority) {
      case 'Emergency':
        return { hours: 4, badge: '4h SLA (Urgent)', color: 'text-rose-300 bg-rose-500/20 border-rose-500/40' };
      case 'High':
        return { hours: 12, badge: '12h SLA', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
      case 'Medium':
        return { hours: 24, badge: '24h SLA', color: 'text-sky-300 bg-sky-500/20 border-sky-500/40' };
      default:
        return { hours: 48, badge: '48h SLA', color: 'text-zinc-400 bg-zinc-800 border-white/10' };
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningComplaint) return;
    assignComplaint(assigningComplaint.id, `${techName} (${techPhone})`);
    setAssigningComplaint(null);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaint) return;
    resolveComplaint(resolvingComplaint.id, remarks);
    setResolvingComplaint(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Room Number',
      'Student Name',
      'Hostel',
      'Category',
      'Subject',
      'Priority',
      'SLA Target',
      'Assigned Technician',
      'Status',
      'Date Submitted',
      'Resolved Date',
      'Resolution Remarks',
    ];

    const rows = filteredComplaints.map((c) => {
      const sla = getSLAInfo(c.priority);
      return [
        c.id,
        c.roomNumber,
        `"${c.studentName}"`,
        `"${c.hostelName}"`,
        c.category,
        `"${c.subject}"`,
        c.priority,
        `"${sla.badge}"`,
        `"${c.assignedTo || 'Unassigned'}"`,
        c.status,
        `"${c.dateSubmitted || c.createdAt || ''}"`,
        `"${c.resolvedDate || ''}"`,
        `"${c.resolutionRemarks || ''}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mcet_maintenance_tickets_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Electrical':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Plumbing':
      case 'Water Supply':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Wi-Fi / LAN':
        return <Wifi className="w-4 h-4 text-violet-400" />;
      case 'Cleaning':
        return <Brush className="w-4 h-4 text-emerald-400" />;
      default:
        return <Wrench className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Maintenance Triage &amp; Work Orders
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dispatch electricians, plumbers, internet technicians, and log resolved maintenance issues.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="h-10 px-4 rounded-xl bg-[#16181D] hover:bg-white/[0.08] border border-white/[0.12] text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4 text-zinc-400" />
          <span>Export Tickets CSV ({filteredComplaints.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by room, category, subject, student..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Emergency">Emergency Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints List / Table */}
      <div className="bg-[#111215]/90 rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16181D] border-b border-white/[0.08] text-zinc-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Ticket Details</th>
                <th className="py-3.5 px-4 font-semibold">Room &amp; Student</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Technician</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No maintenance tickets found.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                          {getCategoryIcon(ticket.category)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{ticket.subject}</p>
                          <p className="text-[10px] text-zinc-400">
                            {ticket.category} • Logged on {ticket.dateSubmitted || ticket.createdAt || 'Recent'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-white font-semibold font-mono">Room {ticket.roomNumber}</p>
                      <p className="text-[10px] text-zinc-400">{ticket.studentName} ({ticket.hostelName})</p>
                    </td>

                    <td className="py-3.5 px-4 space-y-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border inline-block ${
                          ticket.priority === 'Emergency'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : ticket.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300 border-white/10'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-mono">
                        <Clock className="w-2.5 h-2.5 text-zinc-400" />
                        <span className={`px-1.5 py-0.2 rounded border ${getSLAInfo(ticket.priority).color}`}>
                          {getSLAInfo(ticket.priority).badge}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {ticket.assignedTo ? (
                        <p className="text-zinc-200 font-medium">{ticket.assignedTo}</p>
                      ) : (
                        <span className="text-[10px] text-zinc-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : ticket.status === 'In Progress'
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {ticket.status !== 'Resolved' && (
                        <>
                          <button
                            onClick={() => setAssigningComplaint(ticket)}
                            className="px-2.5 py-1 rounded-xl bg-[#16181D] hover:bg-[#1E2026] border border-white/[0.12] text-zinc-200 text-[11px] font-medium cursor-pointer"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setResolvingComplaint(ticket)}
                            className="px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold cursor-pointer shadow-sm"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      {ticket.status === 'Resolved' && (
                        <span className="text-[11px] text-emerald-400 font-medium">✓ Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {assigningComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setAssigningComplaint(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <h3 className="text-xl font-display text-white font-bold">Assign Maintenance Work Order</h3>
            <p className="text-xs text-zinc-400">Dispatch campus crew for Room {assigningComplaint.roomNumber}.</p>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-400 font-mono uppercase block">Quick Select Campus Technician:</span>
              <div className="flex flex-wrap gap-1.5">
                {TECHNICIAN_PRESETS.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => {
                      setTechName(t.name);
                      setTechPhone(t.phone);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] border transition-colors cursor-pointer ${
                      techName === t.name
                        ? 'bg-violet-600/30 border-violet-500 text-violet-300 font-semibold'
                        : 'bg-[#16181D] border-white/[0.08] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t.name.split(' ')[0]} ({t.role})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Technician / Contractor Name</label>
                <input
                  type="text"
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Technician Mobile Contact</label>
                <input
                  type="text"
                  value={techPhone}
                  onChange={(e) => setTechPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningComplaint(null)}
                  className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 cursor-pointer shadow"
                >
                  Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolvingComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setResolvingComplaint(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <h3 className="text-xl font-display text-white font-bold">Close Maintenance Ticket</h3>
            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Resolution Summary &amp; Work Report</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingComplaint(null)}
                  className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-500 cursor-pointer shadow"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
