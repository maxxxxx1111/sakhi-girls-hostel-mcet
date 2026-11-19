import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Megaphone,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const StudentNoticesTab: React.FC = () => {
  const { notices } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  const categories = ['all', 'Hostel Living', 'Dining & Mess', 'Academic & Curfew', 'Maintenance'];

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'Hostel Living')
      return n.category?.toLowerCase().includes('hostel') || n.title.toLowerCase().includes('room');
    if (selectedCategory === 'Dining & Mess')
      return (
        n.category?.toLowerCase().includes('mess') || n.category?.toLowerCase().includes('dining')
      );
    if (selectedCategory === 'Academic & Curfew')
      return (
        n.category?.toLowerCase().includes('curfew') ||
        n.title.toLowerCase().includes('gate') ||
        n.title.toLowerCase().includes('leave')
      );
    return true;
  });

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
          Hostel Notices &amp; Circulars
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
          Official announcements from the Chief Warden, Housing Authority, and Campus Security.
        </p>
      </section>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#F472B6] to-[#EC4899] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Notices' : cat}
            </button>
          );
        })}
      </div>

      {/* Notices List */}
      <section className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-8 text-center text-xs text-[#6B7280] dark:text-[#A79CB0] shadow-sm">
            No announcements under this category.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotices.map((notice) => {
              const isUrgent = notice.priority === 'Urgent';
              const isExpanded = expandedNoticeId === notice.id;
              const noticeDate = (notice as any).date || notice.datePublished || 'Recent';
              const noticeContent = (notice as any).content || notice.description || '';
              const noticeAuthor = (notice as any).postedBy || notice.publishedBy || 'Chief Warden';

              return (
                <div
                  key={notice.id}
                  onClick={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                  className={`bg-white dark:bg-[#1B1720] border rounded-2xl p-5 sm:p-6 transition-all cursor-pointer shadow-sm ${
                    isExpanded
                      ? 'border-[#EC4899]/60 dark:border-[#F472B6]/60'
                      : 'border-[#F3E8EF] dark:border-[#332A3B] hover:border-[#FBCFE8] dark:hover:border-[#EC4899]/30'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#6B7280] dark:text-[#A79CB0]">
                          {noticeDate}
                        </span>
                        {notice.category && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFF5F8] dark:bg-[#120F14] text-[#EC4899] dark:text-[#F472B6] border border-[#FCE7F3] dark:border-[#38283B] font-semibold">
                            {notice.category}
                          </span>
                        )}
                        {isUrgent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444] border border-[#FECACA] dark:border-[#EF4444]/30 font-bold">
                            Important Notice
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#1F2937] dark:text-white pt-1">
                        {notice.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-[#EC4899] dark:text-[#F472B6]">
                      <span>{isExpanded ? 'Collapse' : 'Read details'}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Content snippet or full expanded body */}
                  <div className="pt-3 text-xs text-[#6B7280] dark:text-[#D1C5D8] leading-relaxed">
                    <p className={isExpanded ? '' : 'line-clamp-2'}>{noticeContent}</p>
                  </div>

                  {isExpanded && (
                    <div className="pt-4 mt-4 border-t border-[#F3E8EF] dark:border-[#2C2436] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
                      <span>Issued by: {noticeAuthor}</span>
                      <span className="font-mono">Circular Ref: MCET/HSTL/2026</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
