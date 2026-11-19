import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  QrCode,
  Wrench,
  Utensils,
  Megaphone,
  CreditCard,
  X,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppNotification } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    currentStudent,
    reducedMotion,
    t,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  // Filter notifications relevant to student or all
  const myNotifications = notifications.filter(
    (n) =>
      n.recipientId === 'all' ||
      n.recipientId === 'students' ||
      (currentStudent && n.recipientId === currentStudent.id)
  );

  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const displayList =
    filter === 'unread' ? myNotifications.filter((n) => !n.read) : myNotifications;

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-[#FF4D6D]" />;
      case 'leave_update':
        return <QrCode className="w-4 h-4 text-[#7B61FF]" />;
      case 'complaint_update':
        return <Wrench className="w-4 h-4 text-[#F6B657]" />;
      case 'mess_update':
        return <Utensils className="w-4 h-4 text-[#2DD4A8]" />;
      case 'fee_reminder':
        return <CreditCard className="w-4 h-4 text-[#F6B657]" />;
      case 'announcement':
      default:
        return <Megaphone className="w-4 h-4 text-[#7B61FF]" />;
    }
  };

  const getPriorityBadge = (type: AppNotification['type']) => {
    switch (type) {
      case 'emergency':
        return { label: 'High Priority', color: 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/20' };
      case 'leave_update':
        return { label: 'Gate Pass', color: 'bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/20' };
      case 'complaint_update':
        return { label: 'Maintenance', color: 'bg-[#F6B657]/10 text-[#F6B657] border-[#F6B657]/20' };
      case 'mess_update':
        return { label: 'Mess Alert', color: 'bg-[#2DD4A8]/10 text-[#2DD4A8] border-[#2DD4A8]/20' };
      case 'fee_reminder':
        return { label: 'Fee Reminder', color: 'bg-[#F6B657]/10 text-[#F6B657] border-[#F6B657]/20' };
      default:
        return { label: 'Notice', color: 'bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/20' };
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab as any);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        id="notification-center-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Campus Notification Center"
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] hover:border-[#7B61FF]/50 transition-colors cursor-pointer relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF4D6D] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#101119] dark:border-[#101119] light:border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] shadow-2xl z-50 overflow-hidden flex flex-col text-xs"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                    {t('notifications')}
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#7B61FF]/10 text-[#7B61FF] font-medium border border-[#7B61FF]/20">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#737684] dark:text-[#737684] light:text-[#7A8094]">
                  Useful updates only • Verified residence alerts
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] text-[#7B61FF] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Filter Sub-nav */}
            <div className="px-4 py-2 border-b border-[#282A37]/50 dark:border-[#282A37]/50 light:border-[#E2E4EB] flex items-center gap-2 bg-[#101119]/50 dark:bg-[#101119]/50 light:bg-[#F6F6F9]">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#7B61FF] text-white'
                    : 'text-[#737684] hover:text-[#F7F6F2] dark:hover:text-[#F7F6F2] light:hover:text-[#181920]'
                }`}
              >
                All ({myNotifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-[#7B61FF] text-white'
                    : 'text-[#737684] hover:text-[#F7F6F2] dark:hover:text-[#F7F6F2] light:hover:text-[#181920]'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-[#282A37]/40 dark:divide-[#282A37]/40 light:divide-[#E2E4EB]">
              {displayList.length === 0 ? (
                <div className="py-10 px-4 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#2DD4A8]/10 text-[#2DD4A8] flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-xs text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                    All caught up!
                  </p>
                  <p className="text-[11px] text-[#737684]">
                    No unread notices or pending gate pass actions.
                  </p>
                </div>
              ) : (
                displayList.map((item) => {
                  const badge = getPriorityBadge(item.type);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                        !item.read
                          ? 'bg-[#7B61FF]/5 hover:bg-[#7B61FF]/10'
                          : 'hover:bg-[#101119] dark:hover:bg-[#101119] light:hover:bg-[#F6F6F9]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F0F2F6] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-center shrink-0 mt-0.5">
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-[#737684] font-mono">
                            {item.timestamp}
                          </span>
                        </div>

                        <h4
                          className={`text-xs ${
                            !item.read
                              ? 'font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]'
                              : 'font-medium text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060]'
                          }`}
                        >
                          {item.title}
                        </h4>

                        <p className="text-[11px] text-[#737684] leading-relaxed">
                          {item.message}
                        </p>

                        {item.linkTab && (
                          <div className="text-[11px] text-[#7B61FF] font-medium flex items-center gap-1 pt-0.5">
                            <span>Open details</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {!item.read && (
                        <div
                          className="w-2 h-2 rounded-full bg-[#7B61FF] shrink-0 mt-2"
                          title="Unread"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 border-t border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] bg-[#101119]/50 dark:bg-[#101119]/50 light:bg-[#F6F6F9] text-center">
              <span className="text-[10px] text-[#737684]">
                Automated campus alerts • Wardens &amp; Security office
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
