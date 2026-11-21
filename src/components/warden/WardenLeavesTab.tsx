import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest } from '../../types';
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  QrCode,
  X,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  PhoneCall,
  Check,
} from 'lucide-react';
import { GateSentryModal } from './GateSentryModal';

export const WardenLeavesTab: React.FC = () => {
  const {
    leaveRequests,
    approveLeave,
    rejectLeave,
    bulkApproveLeaves,
    bulkRejectLeaves,
    verifyParentCall,
    currentWarden,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPass, setSelectedPass] = useState<LeaveRequest | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSentryModalOpen, setIsSentryModalOpen] = useState(false);

  // Parent verification modal state
  const [verifyingLeave, setVerifyingLeave] = useState<LeaveRequest | null>(null);
  const [parentContactPerson, setParentContactPerson] = useState('Father');
  const [verificationNotes, setVerificationNotes] = useState(
    'Parent confirmed outstation leave; permission approved.'
  );

  // Reject modal state
  const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState(
    'Parent confirmation could not be verified.'
  );

  const filteredLeaves = leaveRequests.filter((l) => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(search.toLowerCase()) ||
      l.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      (l.gatePassCode && l.gatePassCode.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingLeaves = filteredLeaves.filter((l) => l.status === 'Pending');
  const isAllPendingSelected =
    pendingLeaves.length > 0 && pendingLeaves.every((l) => selectedIds.includes(l.id));

  const toggleSelectAll = () => {
    if (isAllPendingSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingLeaves.map((l) => l.id));
    }
  };

  const toggleSelectLeave = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApprove = (id: string) => {
    approveLeave(id, currentWarden?.name || 'Chief Warden Office');
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    bulkApproveLeaves(selectedIds, currentWarden?.name || 'Chief Warden Office');
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    bulkRejectLeaves(selectedIds, 'Declined during bulk warden review.');
    setSelectedIds([]);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingLeaveId) return;
    rejectLeave(rejectingLeaveId, rejectionReason);
    setRejectingLeaveId(null);
  };

  const handleParentVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingLeave) return;
    verifyParentCall(verifyingLeave.id, parentContactPerson, verificationNotes);
    setVerifyingLeave(null);
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Leave Approvals &amp; Gate Pass Desk
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Verify student outstation applications, validate parent contact numbers, and generate security slips.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSentryModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all self-start sm:self-auto shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sentry Gate Scanner</span>
        </button>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-violet-950/70 border border-violet-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs text-violet-200">
            <CheckSquare className="w-4 h-4 text-violet-400" />
            <span className="font-semibold">{selectedIds.length} application(s) selected for bulk review</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkApprove}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve All Selected ({selectedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={handleBulkReject}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Selected</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-zinc-400 hover:text-white px-2 cursor-pointer transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, room, gate code, reason..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                  : 'bg-[#16181D] text-zinc-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {status === 'all' ? 'All Applications' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Leaves Table */}
      <div className="bg-[#111215]/90 rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16181D] border-b border-white/[0.08] text-zinc-400">
              <tr>
                <th className="py-3.5 px-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    title="Select all pending"
                    className="cursor-pointer text-zinc-400 hover:text-white"
                  >
                    {isAllPendingSelected ? (
                      <CheckSquare className="w-4 h-4 text-violet-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 font-semibold">Student &amp; Room</th>
                <th className="py-3.5 px-4 font-semibold">Leave Type &amp; Dates</th>
                <th className="py-3.5 px-4 font-semibold">Reason &amp; Destination</th>
                <th className="py-3.5 px-4 font-semibold">Guardian Verification</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => {
                  const isSelected = selectedIds.includes(leave.id);
                  const isPending = leave.status === 'Pending';

                  return (
                    <tr
                      key={leave.id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isSelected ? 'bg-violet-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => toggleSelectLeave(leave.id)}
                            className="cursor-pointer text-zinc-400 hover:text-white"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-violet-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <span className="text-zinc-600">•</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{leave.studentName}</p>
                          {leave.source === 'WhatsApp' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold font-mono shadow-xs">
                              💬 WhatsApp Bot
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-[9px] font-mono">
                              Web Portal
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          Room {leave.roomNumber} • {leave.hostelName}
                          {leave.whatsappPhone && (
                            <span className="text-emerald-400 ml-1.5">({leave.whatsappPhone})</span>
                          )}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-[10px] font-semibold border border-violet-500/30">
                          {leave.leaveType}
                        </span>
                        <p className="text-[10px] text-zinc-400 font-mono mt-1">
                          {leave.fromDate} → {leave.toDate}
                        </p>
                        {(leave.departureTime || leave.expectedReturnTime) && (
                          <p className="text-[10px] text-teal-300 font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{leave.departureTime || '--'} → {leave.expectedReturnTime || '--'}</span>
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-zinc-200 line-clamp-1">{leave.reason}</p>
                        <p className="text-[10px] text-zinc-400">
                          To: {leave.destination || 'Home Residence'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${leave.parentContact}`}
                            className="text-emerald-400 font-mono font-semibold hover:underline flex items-center gap-1 text-xs"
                          >
                            <Phone className="w-3 h-3" />
                            {leave.parentContact}
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setVerifyingLeave(leave);
                              setParentContactPerson(
                                leave.parentName ? `Father (${leave.parentName})` : 'Father'
                              );
                              setVerificationNotes(
                                'Parent confirmed outstation leave; permission approved.'
                              );
                            }}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Log telephone confirmation with parent"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-400" />
                            <span>Log Call</span>
                          </button>
                        </div>

                        {leave.parentVerification?.verified ? (
                          <div className="text-[10px] text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 max-w-fit">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Verified with {leave.parentVerification.contactPerson}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-500 italic block">
                            Call pending verification
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            leave.status === 'Approved'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : leave.status === 'Rejected'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {leave.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setRejectingLeaveId(leave.id)}
                              className="px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 font-medium text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="px-3 py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-medium text-[11px] shadow-sm cursor-pointer"
                            >
                              Approve
                            </button>
                          </div>
                        ) : leave.status === 'Approved' ? (
                          <button
                            onClick={() => setSelectedPass(leave)}
                            className="px-2.5 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>QR Pass</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-500 italic">Declined</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Verification Modal */}
      {verifyingLeave && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setVerifyingLeave(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-lg font-display text-white font-bold flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Log Guardian Phone Verification</span>
              </h3>
              <button
                type="button"
                onClick={() => setVerifyingLeave(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs bg-[#16181D] p-3 rounded-xl border border-white/[0.06] space-y-1">
              <p className="font-semibold text-white">{verifyingLeave.studentName}</p>
              <p className="text-zinc-400">
                Outstation Leave: {verifyingLeave.fromDate} → {verifyingLeave.toDate} ({verifyingLeave.destination || 'Home'})
              </p>
              <p className="text-emerald-400 font-mono font-semibold">
                Guardian Dial: {verifyingLeave.parentContact}
              </p>
            </div>

            <form onSubmit={handleParentVerifySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-zinc-300 font-medium">Contact Person Confirmed</label>
                <input
                  type="text"
                  value={parentContactPerson}
                  onChange={(e) => setParentContactPerson(e.target.value)}
                  placeholder="e.g. Father (Rajendra Sharma) / Mother"
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-300 font-medium">Verification Summary / Notes</label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingLeave(null)}
                  className="px-4 py-2 rounded-xl border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 cursor-pointer shadow-sm"
                >
                  Confirm &amp; Stamp Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingLeaveId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setRejectingLeaveId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <h3 className="text-xl font-display text-white font-bold">Decline Leave Request</h3>
            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Reason for Rejection</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingLeaveId(null)}
                  className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-500 cursor-pointer shadow-sm"
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Pass View Modal */}
      {selectedPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedPass(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl text-center space-y-4 relative text-zinc-100"
          >
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                Official Campus Gate Pass
              </span>
              <h4 className="text-xl font-display font-bold text-white">{selectedPass.studentName}</h4>
              <p className="text-xs text-zinc-400 font-mono">Room {selectedPass.roomNumber} • {selectedPass.hostelName}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-28 h-28 text-black" />
              <span className="text-[10px] font-mono text-black font-bold">
                {selectedPass.gatePassCode || `AUTH-${selectedPass.id.slice(-6).toUpperCase()}`}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-left bg-[#16181D] p-3.5 rounded-xl border border-white/[0.08]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Channel / Source:</span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {selectedPass.source === 'WhatsApp' ? '💬 WhatsApp Bot' : 'Web Portal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Type:</span>
                <span className="font-semibold text-white">{selectedPass.leaveType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Duration:</span>
                <span className="font-mono text-white font-semibold">{selectedPass.fromDate} → {selectedPass.toDate}</span>
              </div>
              {(selectedPass.departureTime || selectedPass.expectedReturnTime) && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Timing:</span>
                  <span className="font-mono text-teal-300">
                    {selectedPass.departureTime || '--'} → {selectedPass.expectedReturnTime || '--'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Destination:</span>
                <span className="text-zinc-200 font-medium">{selectedPass.destination || 'Home Residence'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Approved By:</span>
                <span className="text-emerald-400 font-semibold">{selectedPass.approvedBy || 'Chief Warden'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sentry Gate Scanner Modal */}
      <GateSentryModal
        isOpen={isSentryModalOpen}
        onClose={() => setIsSentryModalOpen(false)}
      />
    </div>
  );
};
