import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Building2,
  CalendarDays,
  Wrench,
  Utensils,
  CreditCard,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Flame,
  Activity,
} from 'lucide-react';
import { motion } from 'motion/react';
import { GateSentryModal } from './GateSentryModal';

export const WardenOverviewTab: React.FC = () => {
  const {
    currentWarden,
    rooms,
    leaveRequests,
    complaints,
    fees,
    notices,
    setActiveTab,
    approveLeave,
    rejectLeave,
    resolveComplaint,
  } = useApp();

  const [isSentryModalOpen, setIsSentryModalOpen] = useState(false);

  if (!currentWarden) return null;

  // Key Stats calculation
  const totalCapacity = rooms.reduce((acc, r) => acc + (Number(r.capacity) || 0), 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + (Number(r.occupied) || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const activeComplaints = complaints.filter((c) => c.status !== 'Resolved');
  const emergencyComplaints = complaints.filter((c) => c.priority === 'Emergency' && c.status !== 'Resolved');

  const totalFeeCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
  const totalPendingDues = fees.reduce((acc, f) => acc + (Number(f.pendingAmount) || 0), 0);

  return (
    <div className="space-y-6 font-body text-zinc-100">
      
      {/* 1. Header & Actions */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30">
              {currentWarden.role}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {currentWarden.wardenId}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Sakhi Girls Hostel Operations Desk
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time room occupancy, floor-wise vacancy (1st-4th Year), 6-department resident monitoring (CS, IT, ENTC, ELPO, CIVIL, MECHANICAL), gate pass authorizations, and dining supervision.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSentryModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sentry Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-[0_0_16px_rgba(139,92,246,0.3)] cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Review Passes ({pendingLeaves.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('notices')}
            className="px-4 py-2.5 rounded-xl bg-[#16181D] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-zinc-400" />
            <span>Publish Notice</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert (Rendered strictly when active emergency tickets exist) */}
      {emergencyComplaints.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-semibold text-rose-300 font-mono uppercase text-[11px] tracking-wider">Emergency Maintenance Alert</p>
              <p className="text-rose-200 text-xs mt-0.5">
                {emergencyComplaints.length} urgent ticket requiring immediate staff dispatch: {emergencyComplaints[0]?.subject || 'Urgent repair'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('complaints')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shrink-0 cursor-pointer transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)]"
          >
            Dispatch Staff
          </button>
        </div>
      )}

      {/* 2. Key Operational Metrics (4 Compact, Aligned Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bed Occupancy */}
        <div
          onClick={() => setActiveTab('rooms')}
          className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] hover:border-white/[0.16] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400 font-mono">Bed Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-[#16181D] text-zinc-400 flex items-center justify-center group-hover:text-violet-400 border border-white/[0.06] transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-white tracking-tight">
              {occupiedBeds} / {totalCapacity}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              <span className="text-emerald-400 font-mono font-semibold">{totalCapacity - occupiedBeds} Beds Left / Available</span> ({occupancyRate}% Occupied)
            </p>
          </div>
        </div>

        {/* Pending Passes */}
        <div
          onClick={() => setActiveTab('leaves')}
          className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] hover:border-white/[0.16] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400 font-mono">Pending Gate Passes</span>
            <div className="w-8 h-8 rounded-xl bg-[#16181D] text-zinc-400 flex items-center justify-center group-hover:text-violet-400 border border-white/[0.06] transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-display font-bold text-white tracking-tight">{pendingLeaves.length}</p>
              {pendingLeaves.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {pendingLeaves.length === 1 ? '1 student waiting' : `${pendingLeaves.length} students waiting`}
            </p>
          </div>
        </div>

        {/* Active Maintenance */}
        <div
          onClick={() => setActiveTab('complaints')}
          className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] hover:border-white/[0.16] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400 font-mono">Maintenance Triage</span>
            <div className="w-8 h-8 rounded-xl bg-[#16181D] text-zinc-400 flex items-center justify-center group-hover:text-violet-400 border border-white/[0.06] transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-white tracking-tight">{activeComplaints.length}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {activeComplaints.length === 0
                ? 'All facilities operational'
                : `${activeComplaints.length} tickets in progress`}
            </p>
          </div>
        </div>

        {/* Fee Collection */}
        <div
          onClick={() => setActiveTab('expenses')}
          className="p-5 rounded-2xl bg-[#111215]/90 border border-white/[0.08] hover:border-white/[0.16] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400 font-mono">Hostel Fee Recovery</span>
            <div className="w-8 h-8 rounded-xl bg-[#16181D] text-zinc-400 flex items-center justify-center group-hover:text-violet-400 border border-white/[0.06] transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-emerald-400 tracking-tight">
              ₹{(totalFeeCollected / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              ₹{(totalPendingDues / 1000).toFixed(0)}k outstanding dues
            </p>
          </div>
        </div>
      </div>

      {/* 3. Operational Sections: Gate Pass Queue & Maintenance Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Pending Passes & Active Maintenance Tickets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Gate Pass Queue */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Gate Pass Approvals
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verify parental consent and review outstation requests
                </p>
              </div>
              <button
                onClick={() => setActiveTab('leaves')}
                className="text-xs font-medium text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
              >
                View all ({leaveRequests.length})
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400 space-y-1">
                <CheckCircle className="w-6 h-6 mx-auto text-emerald-400 mb-1" />
                <p className="font-semibold text-zinc-200">All gate passes reviewed</p>
                <p className="text-zinc-500">No pending leave applications at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.slice(0, 3).map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-xl bg-[#16181D]/80 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{leave.studentName}</span>
                        <span className="text-zinc-400 font-mono">Room {leave.roomNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {leave.leaveType}
                        </span>
                      </div>
                      <p className="text-zinc-300">
                        {leave.fromDate} → {leave.toDate} • {leave.destination || leave.reason}
                      </p>
                      <p className="text-zinc-500 text-[11px] font-mono">
                        Parent Contact: {leave.parentContact}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => approveLeave(leave.id, 'Approved by Warden')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-1 text-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectLeave(leave.id, 'Disapproved')}
                        className="px-3 py-1.5 rounded-xl bg-[#16181D] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.06] font-medium transition-all cursor-pointer flex items-center gap-1 text-xs"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Ticket Triage */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Maintenance Tickets
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Electrical, plumbing, and network repair tasks
                </p>
              </div>
              <button
                onClick={() => setActiveTab('complaints')}
                className="text-xs font-medium text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
              >
                View all ({complaints.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {complaints.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl bg-[#16181D]/80 border border-white/[0.06] hover:border-white/[0.12] transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        comp.priority === 'High' || comp.priority === 'Emergency'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : comp.priority === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300 border-white/[0.08]'
                      }`}>
                        {comp.priority}
                      </span>
                      <span className="font-semibold text-zinc-200 truncate">{comp.subject}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] truncate">
                      Room {comp.roomNumber} • {comp.category} • Submitted by {comp.studentName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      comp.status === 'Resolved'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-300 border border-white/[0.08]'
                    }`}>
                      {comp.status}
                    </span>
                    {comp.status !== 'Resolved' && (
                      <button
                        onClick={() => resolveComplaint(comp.id, 'Resolved by Maintenance Staff')}
                        className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-medium transition-colors cursor-pointer text-[11px] border border-violet-500/30"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Notice Bulletin & System Status */}
        <div className="space-y-6">
          
          {/* Quick Notice Board */}
          <div className="p-6 rounded-2xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Published Circulars
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline cursor-pointer font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setActiveTab('notices')}
                  className="p-3 rounded-xl bg-[#16181D]/80 hover:bg-[#16181D] border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Annapurna Kitchen Status */}
          <div className="p-6 rounded-2xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Dining Status
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('mess')}
                className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline cursor-pointer font-medium"
              >
                Ration Log
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-[#16181D]/80 border border-white/[0.06] space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service Hours</span>
                  <span className="font-mono text-zinc-200">07:30 AM - 09:45 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Daily Meals Served</span>
                  <span className="font-semibold text-white">4 (Pure Veg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Hygiene Score</span>
                  <span className="font-mono font-bold text-emerald-400">98 / 100</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sentry Gate Scanner Modal */}
      <GateSentryModal
        isOpen={isSentryModalOpen}
        onClose={() => setIsSentryModalOpen(false)}
      />
    </div>
  );
};
