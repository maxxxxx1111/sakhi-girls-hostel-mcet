import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice } from '../../types';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  CheckCircle,
  User,
} from 'lucide-react';

export const WardenNoticesTab: React.FC = () => {
  const { notices, publishNotice, deleteNotice, currentWarden } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('Hostel');
  const [priority, setPriority] = useState<Notice['priority']>('Normal');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    publishNotice({
      title,
      content,
      description: content,
      category,
      priority,
      datePublished: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      publishedBy: currentWarden?.name || 'Chief Warden Office',
      postedBy: currentWarden?.name || 'Chief Warden Office',
      targetAudience: 'All',
      targetRole: 'all',
      isPinned: priority === 'Urgent',
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsCreateModalOpen(false);
      setTitle('');
      setContent('');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Official Notices &amp; Circulars
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Broadcast emergency alerts, curfew notices, mess advisories, and facility maintenance schedules.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(139,92,246,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Circular</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className={`p-6 rounded-3xl bg-[#111215]/90 border transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl ${
              n.priority === 'Urgent'
                ? 'border-rose-500/40 bg-rose-950/15'
                : 'border-white/[0.08] hover:border-violet-500/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    n.priority === 'Urgent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : n.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                  }`}
                >
                  {n.category}
                </span>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {n.datePublished || n.date || '2026-08-28'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                  <User className="w-3 h-3 text-violet-400" />
                  By {n.publishedBy || n.postedBy || 'Chief Warden'}
                </span>
                <button
                  onClick={() => deleteNotice(n.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Circular"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-display text-white font-bold mb-2">{n.title}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{n.content || n.description}</p>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#111215] rounded-3xl p-6 sm:p-8 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-zinc-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-display text-white font-bold mb-1">Publish Notice</h3>
            <p className="text-xs text-zinc-400">Broadcasts immediately across all student dashboards.</p>

            {successMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold">Notice Broadcasted Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="Hostel">Hostel Regulations</option>
                      <option value="Mess">Annapurna Mess Notice</option>
                      <option value="Maintenance">Maintenance &amp; Repairs</option>
                      <option value="Academic">Academic Schedule</option>
                      <option value="Emergency">Emergency Alert</option>
                      <option value="General">General Campus Circular</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Urgency Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent (Red Banner)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Notice Title / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Campus Maintenance & Water Tank Cleaning"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Notice Body Content</label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed notice information..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 shadow cursor-pointer"
                  >
                    Publish Circular
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
