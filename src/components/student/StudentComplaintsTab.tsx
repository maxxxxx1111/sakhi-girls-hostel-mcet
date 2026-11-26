import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, PriorityLevel } from '../../types';
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  Zap,
  Droplets,
  Wifi,
  Brush,
  Armchair,
  UploadCloud,
  Check,
  FileImage,
  Search,
  Star,
  RotateCcw,
  MessageSquare,
  ShieldCheck,
  Flame,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StudentComplaintsTab: React.FC = () => {
  const { currentStudent, complaints, logComplaint, rateComplaint, reopenComplaint } = useApp();

  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [filterState, setFilterState] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [reopenTicketId, setReopenTicketId] = useState<string | null>(null);
  const [reopenReason, setReopenReason] = useState('');

  // Form states
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!currentStudent) return null;

  const myComplaints = complaints.filter((c) => c.studentId === currentStudent.id);

  const filteredTickets = myComplaints.filter((c) => {
    // Status filter
    if (filterState === 'active' && c.status === 'Resolved') return false;
    if (filterState === 'resolved' && c.status !== 'Resolved') return false;

    // Category filter
    if (categoryFilter !== 'all' && c.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = c.subject.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTicket = c.id.toLowerCase().includes(q) || (c.ticketNumber && c.ticketNumber.toLowerCase().includes(q));
      if (!matchSubject && !matchDesc && !matchTicket) return false;
    }

    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    logComplaint({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: currentStudent.roomNumber,
      hostelName: currentStudent.hostelName,
      category,
      subject,
      description,
      priority,
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsSlideOverOpen(false);
      setSubject('');
      setDescription('');
    }, 1200);
  };

  const getCategoryIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'Electrical':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Plumbing':
      case 'Water Supply':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'Wi-Fi / LAN':
        return <Wifi className="w-4 h-4 text-pink-500" />;
      case 'Cleaning':
        return <Brush className="w-4 h-4 text-emerald-500" />;
      default:
        return <Armchair className="w-4 h-4 text-purple-500" />;
    }
  };

  const renderProgressSteps = (status: string) => {
    const steps = ['Logged', 'Assigned', 'In Progress', 'Resolved'];
    const currentIndex =
      status === 'Resolved'
        ? 3
        : status === 'In Progress'
        ? 2
        : status === 'Assigned'
        ? 1
        : 0;

    return (
      <div className="flex items-center gap-2 pt-2">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <React.Fragment key={step}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] hidden sm:inline ${
                    isCurrent
                      ? 'font-bold text-zinc-900 dark:text-white'
                      : isDone
                      ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full ${
                    idx < currentIndex
                      ? 'bg-emerald-500'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-16">
      {/* 1. Maintenance Command Center Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-950/40 dark:via-purple-950/20 dark:to-zinc-950/60 border border-pink-200/60 dark:border-pink-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-500/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-pink-800/60 text-xs font-semibold text-pink-700 dark:text-pink-300 shadow-xs">
              <Wrench className="w-3.5 h-3.5 text-pink-500" />
              <span>Campus Engineering &amp; Facilities Helpdesk</span>
              <span className="w-1 h-1 rounded-full bg-pink-400" />
              <span>4-Hour SLA Emergency Guarantee</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Room Maintenance &amp; Repairs
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Real-time work order dispatch for electrical fixtures, carpentry, plumbing, geyser heating, and Wi-Fi access points in Room {currentStudent.roomNumber}.
            </p>

            {/* SLA Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                98% Same-Day Resolution
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Avg Response: 4.2 Hours
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                4.9 / 5 Scholar Satisfaction
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSlideOverOpen(true)}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Log Maintenance Ticket</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterState('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterState === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            All Tickets ({myComplaints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterState('active')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterState === 'active'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            In Progress ({myComplaints.filter((c) => c.status !== 'Resolved').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterState('resolved')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterState === 'resolved'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Resolved ({myComplaints.filter((c) => c.status === 'Resolved').length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-2xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-pink-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 rounded-2xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-xs text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-pink-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Furniture">Furniture</option>
            <option value="Wi-Fi / LAN">Wi-Fi / LAN</option>
          </select>
        </div>
      </div>

      {/* 3. Tickets List */}
      <section className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                All Fixtures Operational
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                No outstanding maintenance tickets on file for Room {currentStudent.roomNumber}. If an electrical point or tap is malfunctioning, log an issue.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs hover:border-pink-300 dark:hover:border-pink-800 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-pink-50 dark:bg-[#151218] border border-pink-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
                      {getCategoryIcon(ticket.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                          {ticket.subject}
                        </h3>
                        <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
                          #{ticket.ticketNumber || ticket.id.replace(/[^0-9]/g, '') || '201'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {ticket.category} • Suite {ticket.roomNumber} • Priority: <span className="font-semibold text-amber-600 dark:text-amber-400">{ticket.priority}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                        : ticket.status === 'In Progress'
                        ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-800 dark:text-zinc-200 bg-pink-50/40 dark:bg-[#120F14] p-3.5 rounded-2xl border border-pink-100 dark:border-zinc-800 leading-relaxed">
                  {ticket.description}
                </p>

                {/* Progress Pipeline */}
                {renderProgressSteps(ticket.status)}

                {/* Resolution & Student Feedback (for Resolved tickets) */}
                {ticket.status === 'Resolved' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Repair Verified &amp; Signed Off
                        </span>
                        {ticket.resolutionRemarks && (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            Technician Note: {ticket.resolutionRemarks}
                          </p>
                        )}
                      </div>

                      {/* Satisfaction Rating */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                          {ticket.satisfactionRating ? 'Rating:' : 'Rate Workmanship:'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => rateComplaint(ticket.id, star)}
                              className="cursor-pointer transition-transform hover:scale-125"
                              title={`Rate ${star} star`}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= (ticket.satisfactionRating || 0)
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-zinc-300 dark:text-zinc-600 hover:text-amber-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Re-open Ticket Option */}
                    <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      {reopenTicketId === ticket.id ? (
                        <div className="w-full flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="State reason for re-opening..."
                            value={reopenReason}
                            onChange={(e) => setReopenReason(e.target.value)}
                            className="flex-1 h-8 px-3 rounded-xl bg-white dark:bg-[#1B1720] border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (reopenReason.trim()) {
                                reopenComplaint(ticket.id, reopenReason);
                                setReopenTicketId(null);
                                setReopenReason('');
                              }
                            }}
                            className="h-8 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                          >
                            Re-open Work Order
                          </button>
                          <button
                            type="button"
                            onClick={() => setReopenTicketId(null)}
                            className="text-xs text-zinc-500 hover:text-zinc-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Completed on {ticket.resolvedDate || 'Recent inspection'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReopenTicketId(ticket.id);
                              setReopenReason('');
                            }}
                            className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Issue unresolved? Reopen Ticket</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Logged on: {ticket.dateSubmitted || ticket.createdAt || 'Recent'}</span>
                  {ticket.assignedTo && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <UserCheck className="w-3.5 h-3.5" />
                      Assigned: {ticket.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOCUSED SLIDE-OVER REPORT FORM */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
            onClick={() => setIsSlideOverOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-[#1B1720] border-l border-[#F3E8EF] dark:border-[#332A3B] h-full flex flex-col justify-between p-6 sm:p-8 overflow-y-auto shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#F3E8EF] dark:border-[#2C2436]">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Log Maintenance Ticket
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Dispatched directly to the Sakhi Engineering &amp; Facilities Desk
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      Work Order Logged Successfully!
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Ticket forwarded to Chief Electrician / Plumber. Expected technician visit within 4 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Issue Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                        className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                      >
                        <option value="Electrical">Electrical (Lights, Sockets, Fan, Geyser)</option>
                        <option value="Plumbing">Plumbing (Taps, Drain, Flush, Geyser Leak)</option>
                        <option value="Wi-Fi / LAN">Wi-Fi / LAN Connection / Speed</option>
                        <option value="Cleaning">Sanitation / Mopping / Trash</option>
                        <option value="Furniture">Furniture / Study Desk / Locker Lock</option>
                      </select>
                    </div>

                    {/* Priority Level */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Urgency &amp; Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Low', 'Medium', 'High'] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              priority === p
                                ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                                : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Brief Headline / Subject
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Study desk reading lamp switch loose"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-pink-500"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                        Detailed Description &amp; Specific Location
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Explain exact symptoms, timing of failure, and berth location..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-pink-50/50 dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-pink-500 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.01]"
                      >
                        <span>Dispatch Maintenance Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-4 border-t border-[#F3E8EF] dark:border-[#2C2436]">
                Hostel staff will verify entry permissions with resident scholars prior to room entrance.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
