import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  User,
  AlertTriangle,
  Download,
  Check,
} from 'lucide-react';
import { GateLogEntry } from '../../types';

interface GateSentryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GateSentryModal: React.FC<GateSentryModalProps> = ({ isOpen, onClose }) => {
  const { leaveRequests, students, gateLogs, recordGateAction, currentWarden } = useApp();

  const [scanCode, setScanCode] = useState('GP-MCET-2026-0941');
  const [remarks, setRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find matched leave request
  const matchedLeave = leaveRequests.find(
    (l) =>
      (l.gatePassCode && l.gatePassCode.toLowerCase() === scanCode.trim().toLowerCase()) ||
      l.id.toLowerCase() === scanCode.trim().toLowerCase() ||
      l.studentId.toLowerCase() === scanCode.trim().toLowerCase()
  );

  const matchedStudent = matchedLeave
    ? students.find((s) => s.id === matchedLeave.studentId || s.studentId === matchedLeave.studentId)
    : null;

  const isApproved = matchedLeave?.status === 'Approved';

  // Curfew check (after 9:30 PM = 21:30)
  const now = new Date();
  const isPastCurfew = now.getHours() > 21 || (now.getHours() === 21 && now.getMinutes() >= 30);

  const handleAction = (direction: 'Departure' | 'Return') => {
    if (!matchedLeave) return;
    const finalRemarks = remarks.trim()
      ? remarks
      : isPastCurfew && direction === 'Return'
      ? 'Late Inward Return - Post 09:30 PM Curfew'
      : `${direction} verified at Main Gate 1`;

    recordGateAction(scanCode, direction, finalRemarks);
    setActionSuccess(`${direction} successfully registered for ${matchedLeave.studentName}`);
    setRemarks('');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const exportLogsToCSV = () => {
    const headers = ['Log ID', 'Gate Pass Code', 'Student ID', 'Student Name', 'Room', 'Hostel', 'Action', 'Timestamp', 'Guard Name', 'Gate', 'Remarks'];
    const rows = gateLogs.map((log) => [
      log.id,
      log.gatePassCode,
      log.studentId,
      `"${log.studentName}"`,
      log.roomNumber,
      `"${log.hostelName}"`,
      log.action,
      `"${log.timestamp}"`,
      `"${log.guardName}"`,
      `"${log.gateName}"`,
      `"${log.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mcet_gate_sentry_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-[#111215] border border-white/[0.12] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <span>Security Sentry Gate Pass Scanner</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  LIVE GATE-1
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Main Campus Security Post • Havaldar P. B. More on Duty
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scan / Search Bar */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">
            Scan QR Token or Enter Gate Pass Code / Student PRN:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <QrCode className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="e.g. GP-MCET-2026-0941 or std-1..."
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#16181D] border border-white/[0.15] text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setScanCode('GP-MCET-2026-0941')}
                className="px-3 h-11 rounded-xl bg-[#16181D] border border-white/[0.08] hover:border-white/20 text-[11px] font-mono text-zinc-300 hover:text-white cursor-pointer transition-colors"
                title="Quick load Rahul Sharma's Approved Pass"
              >
                Sample Pass 1
              </button>
              <button
                type="button"
                onClick={() => setScanCode('std-2')}
                className="px-3 h-11 rounded-xl bg-[#16181D] border border-white/[0.08] hover:border-white/20 text-[11px] font-mono text-zinc-300 hover:text-white cursor-pointer transition-colors"
                title="Quick load Priya Patil"
              >
                Sample Pass 2
              </button>
            </div>
          </div>
        </div>

        {/* Status Feedback Notification */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
        )}

        {/* Curfew Alert Banner */}
        {isPastCurfew && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold">Curfew Notice (09:30 PM):</span>
              <span className="ml-1 text-zinc-300">
                Current time exceeds the standard hostel evening curfew. Inward entries will be logged with a curfew-flagged security tag.
              </span>
            </div>
          </div>
        )}

        {/* Decoded Pass Details */}
        {matchedLeave ? (
          <div className="p-5 rounded-2xl bg-[#16181D] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                {matchedStudent?.avatar ? (
                  <img
                    src={matchedStudent.avatar}
                    alt={matchedLeave.studentName}
                    className="w-12 h-12 rounded-xl object-cover border border-white/[0.1]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-white">{matchedLeave.studentName}</h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    PRN: {matchedLeave.studentId} • Room {matchedLeave.roomNumber} ({matchedLeave.hostelName})
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  isApproved
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {matchedLeave.status === 'Approved' ? 'Gate Pass Approved' : matchedLeave.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Leave Type</span>
                <span className="font-semibold text-white">{matchedLeave.leaveType}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Valid Dates</span>
                <span className="font-semibold text-white font-mono">
                  {matchedLeave.fromDate} → {matchedLeave.toDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Destination</span>
                <span className="font-semibold text-white truncate block">
                  {matchedLeave.destination || 'Home'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Guardian Phone</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {matchedLeave.parentContact}
                </span>
              </div>
            </div>

            {/* Checkpost Remarks Input */}
            <div>
              <input
                type="text"
                placeholder="Optional sentry remarks (e.g. luggage inspected, companion name)..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#111215] border border-white/[0.1] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Guard Action Buttons */}
            {isApproved ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('Departure')}
                  className="w-full sm:flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Record Outward Departure (Exit)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('Return')}
                  className="w-full sm:flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Record Inward Return (Entry)</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                This leave application is currently <span className="font-bold">{matchedLeave.status}</span>.
                The gatekeeper may not permit outward departure until signed by the Chief Warden.
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#16181D] border border-white/[0.08] text-center space-y-1">
            <XCircle className="w-6 h-6 text-zinc-500 mx-auto" />
            <p className="text-xs text-zinc-400">
              No matching gate pass found for code <span className="font-mono text-white font-bold">{scanCode}</span>.
            </p>
          </div>
        )}

        {/* Live Security Log Stream */}
        <div className="space-y-3 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Recent Gate Movement Log ({gateLogs.length})
              </h4>
            </div>

            <button
              type="button"
              onClick={exportLogsToCSV}
              className="px-2.5 py-1 rounded-lg bg-[#16181D] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3 text-zinc-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-xl border border-white/[0.06] divide-y divide-white/[0.06]">
            {gateLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#16181D]/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      log.action === 'Departure'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {log.action}
                  </span>
                  <div>
                    <span className="font-semibold text-white">{log.studentName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono ml-2">
                      Room {log.roomNumber} • {log.remarks}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 block">{log.timestamp}</span>
                  <span className="text-[9px] text-zinc-500">{log.guardName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
