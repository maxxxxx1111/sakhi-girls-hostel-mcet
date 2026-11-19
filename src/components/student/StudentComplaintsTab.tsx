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
  const [photoName, setPhotoName] = useState<string | null>(null);
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
      setPhotoName(null);
    }, 1200);
  };

  const getCategoryIcon = (cat: ComplaintCategory) => {
    switch (cat) {
      case 'Electrical':
        return <Zap className="w-4 h-4 text-[#F59E0B]" />;
      case 'Plumbing':
      case 'Water Supply':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'Wi-Fi / LAN':
        return <Wifi className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6]" />;
      case 'Cleaning':
        return <Brush className="w-4 h-4 text-[#15803D] dark:text-[#2DD4A8]" />;
      default:
        return <Armchair className="w-4 h-4 text-[#EC4899] dark:text-[#F472B6]" />;
    }
  };

  const renderProgressSteps = (status: string) => {
    const steps = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
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
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isDone
                      ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/20 text-[#15803D] dark:text-[#2DD4A8]'
                      : 'bg-[#F3F4F6] dark:bg-[#120F14] text-[#9CA3AF] dark:text-[#6B7280]'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] hidden sm:inline ${
                    isCurrent
                      ? 'font-bold text-[#1F2937] dark:text-white'
                      : isDone
                      ? 'text-[#15803D] dark:text-[#2DD4A8]'
                      : 'text-[#9CA3AF] dark:text-[#6B7280]'
                  }`}
                >
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full ${
                    idx < currentIndex
                      ? 'bg-[#22C55E]'
                      : 'bg-[#E5E7EB] dark:bg-[#282A37]'
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
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header with single primary action */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
            Room Maintenance &amp; Repairs
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
            Log repair requests for electrician, carpentry, plumbing, and network dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSlideOverOpen(true)}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report an issue</span>
        </button>
      </section>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterState === 'all'
                ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border border-[#FBCFE8] dark:border-[#38283B] text-[#EC4899] dark:text-[#F472B6]'
                : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            All ({myComplaints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterState('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterState === 'active'
                ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border border-[#FBCFE8] dark:border-[#38283B] text-[#EC4899] dark:text-[#F472B6]'
                : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            In Progress ({myComplaints.filter((c) => c.status !== 'Resolved').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterState('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterState === 'resolved'
                ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border border-[#FBCFE8] dark:border-[#38283B] text-[#EC4899] dark:text-[#F472B6]'
                : 'text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            Resolved ({myComplaints.filter((c) => c.status === 'Resolved').length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-xs text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 px-2.5 rounded-xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-xs text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899] cursor-pointer"
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

      {/* Tickets List */}
      <section className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-10 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] dark:bg-[#2DD4A8]/10 dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                All Fixtures Operational
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                There are no open repair tickets for Room {currentStudent.roomNumber}.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] flex items-center justify-center shrink-0">
                      {getCategoryIcon(ticket.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">
                          {ticket.subject}
                        </h3>
                        <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#A79CB0]">
                          #{ticket.ticketNumber || ticket.id.replace(/[^0-9]/g, '') || '201'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                        {ticket.category} • Room {ticket.roomNumber}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                      ticket.status === 'Resolved'
                        ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/20'
                        : ticket.status === 'In Progress'
                        ? 'bg-[#FCE7F3] dark:bg-[#2B2333] text-[#EC4899] dark:text-[#F472B6] border border-[#FBCFE8] dark:border-[#38283B]'
                        : 'bg-[#FEF3C7] dark:bg-[#F6B657]/10 text-[#B45309] dark:text-[#F6B657] border border-[#FDE68A] dark:border-[#F6B657]/20'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-xs text-[#1F2937] dark:text-[#D1C5D8] bg-[#FFF5F8] dark:bg-[#120F14] p-3 rounded-xl border border-[#F3E8EF] dark:border-[#332A3B]">
                  {ticket.description}
                </p>

                {/* Progress Pipeline */}
                {renderProgressSteps(ticket.status)}

                {/* Resolution & Student Feedback (for Resolved tickets) */}
                {ticket.status === 'Resolved' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Work Order Completed
                        </span>
                        {ticket.resolutionRemarks && (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            Technician Note: {ticket.resolutionRemarks}
                          </p>
                        )}
                      </div>

                      {/* Satisfaction Rating */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                          {ticket.satisfactionRating ? 'Rating:' : 'Rate Service:'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => rateComplaint(ticket.id, star)}
                              className="cursor-pointer transition-transform hover:scale-110"
                              title={`Rate ${star} star`}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
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
                            placeholder="Reason for re-opening (e.g. still leaking)..."
                            value={reopenReason}
                            onChange={(e) => setReopenReason(e.target.value)}
                            className="flex-1 h-7 px-2.5 rounded-lg bg-white dark:bg-[#1B1720] border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-emerald-500"
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
                            className="h-7 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold cursor-pointer shrink-0 transition-colors"
                          >
                            Confirm Re-open
                          </button>
                          <button
                            type="button"
                            onClick={() => setReopenTicketId(null)}
                            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Closed on {ticket.resolvedDate || 'Recent inspection'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReopenTicketId(ticket.id);
                              setReopenReason('');
                            }}
                            className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Issue persisting? Re-open</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#A79CB0] pt-1">
                  <span>Logged: {ticket.dateSubmitted || ticket.createdAt || 'Recent'}</span>
                  {ticket.assignedTo && <span>Technician: {ticket.assignedTo}</span>}
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
                    <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
                      Report Maintenance Issue
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                      Technician dispatch for Room {currentStudent.roomNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="w-8 h-8 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] hover:bg-[#FCE7F3] dark:hover:bg-[#261E2E] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#15803D] dark:text-[#2DD4A8] mx-auto" />
                    <h4 className="text-sm font-bold text-[#15803D] dark:text-[#2DD4A8]">
                      Ticket Dispatched!
                    </h4>
                    <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                      A maintenance technician has been assigned to inspect your room.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Issue Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                      >
                        <option value="Electrical">Electrical (Fan, Light, Socket)</option>
                        <option value="Plumbing">Plumbing (Tap, Drainage, Flush)</option>
                        <option value="Wi-Fi / LAN">Wi-Fi / Internet Access</option>
                        <option value="Cleaning">Cleaning &amp; Housekeeping</option>
                        <option value="Furniture">Furniture &amp; Carpentry</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Brief Subject
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Desk reading lamp bulb flickering"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6]"
                      />
                    </div>

                    {/* Detailed Description */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Description &amp; Exact Location
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Explain the fault or damage..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#1F2937] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#EC4899] dark:focus:border-[#F472B6] resize-none"
                      />
                    </div>

                    {/* Priority */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Low', 'Medium', 'High'] as PriorityLevel[]).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setPriority(lvl)}
                            className={`py-2 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                              priority === lvl
                                ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6]'
                                : 'bg-[#FFF5F8] dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Optional Photo Attachment */}
                    <div className="space-y-1.5">
                      <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                        Photo of Issue (Optional)
                      </label>
                      <div className="border border-dashed border-[#F3E8EF] dark:border-[#332A3B] hover:border-[#EC4899]/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-[#FFF5F8] dark:bg-[#120F14]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setPhotoName(e.target.files[0].name);
                            }
                          }}
                          className="hidden"
                          id="maintenance-photo-input"
                        />
                        <label
                          htmlFor="maintenance-photo-input"
                          className="cursor-pointer flex flex-col items-center gap-1.5"
                        >
                          {photoName ? (
                            <div className="flex items-center gap-1.5 text-[#15803D] dark:text-[#2DD4A8]">
                              <FileImage className="w-4 h-4" />
                              <span className="font-semibold truncate max-w-[200px]">{photoName}</span>
                            </div>
                          ) : (
                            <>
                              <UploadCloud className="w-5 h-5 text-[#9CA3AF] dark:text-[#6B7280]" />
                              <span className="text-[#6B7280] dark:text-[#A79CB0]">
                                Click or drag photo to attach
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full h-10 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)]"
                      >
                        <span>Dispatch Maintenance Request</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <p className="text-[11px] text-[#6B7280] dark:text-[#A79CB0] pt-4 border-t border-[#F3E8EF] dark:border-[#2C2436]">
                Technicians attend standard maintenance tickets between 09:00 AM and 05:30 PM.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
