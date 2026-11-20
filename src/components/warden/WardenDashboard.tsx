import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Wrench,
  Utensils,
  CreditCard,
  Bell,
  BarChart3,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Plus,
  Database,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WardenOverviewTab } from './WardenOverviewTab';
import { WardenStudentsTab } from './WardenStudentsTab';
import { WardenRoomsTab } from './WardenRoomsTab';
import { WardenLeavesTab } from './WardenLeavesTab';
import { WardenComplaintsTab } from './WardenComplaintsTab';
import { WardenMessTab } from './WardenMessTab';
import { WardenExpensesTab } from './WardenExpensesTab';
import { WardenNoticesTab } from './WardenNoticesTab';
import { WardenAnalyticsTab } from './WardenAnalyticsTab';

export const WardenDashboard: React.FC = () => {
  const { currentWarden, activeTab, setActiveTab, logout, setIsDbmsModalOpen } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!currentWarden) return null;

  const coreAdminItems = [
    { id: 'overview', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'rooms', label: 'Hostel & Bed Allotment', icon: Building2 },
    { id: 'leaves', label: 'Gate Passes & Leaves', icon: CalendarDays },
    { id: 'complaints', label: 'Maintenance & Tickets', icon: Wrench },
  ];

  const operationsItems = [
    { id: 'mess', label: 'Annapurna Dining & Ration', icon: Utensils },
    { id: 'expenses', label: 'Fees & Budget Ledger', icon: CreditCard },
    { id: 'notices', label: 'Circulars & Notices', icon: Bell },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <div id="warden-portal-root" className="min-h-[calc(100vh-60px)] bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col md:flex-row font-body transition-colors duration-200">
      {/* Mobile Top Sub-Header */}
      <div className="md:hidden flex items-center justify-between p-3.5 border-b border-white/[0.08] light:border-pink-200/80 bg-[#0E0F12] light:bg-white">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-xl bg-[#16181D] light:bg-pink-50 text-zinc-300 light:text-zinc-700 flex items-center gap-2 text-xs font-medium cursor-pointer border border-white/[0.08] light:border-pink-200"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Admin Navigation</span>
        </button>
        <button
          onClick={() => setIsDbmsModalOpen(true)}
          className="p-1.5 px-2.5 rounded-lg bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/30 light:border-emerald-300 text-emerald-400 light:text-emerald-700 text-xs flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>DBMS</span>
        </button>
        <div className="text-right">
          <p className="text-xs font-semibold text-white light:text-zinc-900">{currentWarden.name}</p>
          <p className="text-[10px] text-violet-400 light:text-violet-600 font-mono">{currentWarden.role}</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        id="warden-sidebar"
        className={`fixed md:sticky top-0 md:top-[57px] z-30 h-full md:h-[calc(100vh-57px)] w-64 shrink-0 border-r border-white/[0.08] light:border-pink-200/80 bg-[#0E0F12]/95 light:bg-white backdrop-blur-xl p-4 flex flex-col justify-between transition-transform duration-200 overflow-y-auto ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Warden Profile Card */}
          <div className="p-3.5 rounded-2xl bg-[#16181D]/80 light:bg-pink-50/50 border border-white/[0.08] light:border-pink-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center overflow-hidden shrink-0 font-bold text-xs shadow-[0_0_12px_rgba(139,92,246,0.3)]">
              {currentWarden.avatar ? (
                <img src={currentWarden.avatar} alt={currentWarden.name || 'Warden'} className="w-full h-full object-cover" />
              ) : (
                currentWarden.name?.[0] || 'W'
              )}
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="text-xs font-semibold text-white light:text-zinc-900 truncate">{currentWarden.name}</h4>
              <p className="text-[10px] text-zinc-500 font-mono truncate">{currentWarden.wardenId}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 light:text-emerald-700 font-mono font-medium mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 light:text-emerald-700" />
                <span>{currentWarden.role}</span>
              </span>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={() => {
              setActiveTab('notices');
              setIsMobileSidebarOpen(false);
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(139,92,246,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>

          {/* Navigation Groups */}
          <div className="space-y-4 pt-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2.5 pb-1.5 font-mono">
                Hostel Administration
              </p>
              <nav className="space-y-1">
                {coreAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-warden-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-violet-600/20 light:bg-violet-100 text-violet-300 light:text-violet-800 font-semibold border border-violet-500/30 light:border-violet-300'
                          : 'text-zinc-400 light:text-zinc-600 hover:bg-white/[0.04] light:hover:bg-pink-50 hover:text-white light:hover:text-zinc-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400 light:text-violet-700' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-400 light:text-violet-700 shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2.5 pb-1.5 font-mono">
                Operations &amp; Audit
              </p>
              <nav className="space-y-1">
                {operationsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-warden-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-violet-600/20 light:bg-violet-100 text-violet-300 light:text-violet-800 font-semibold border border-violet-500/30 light:border-violet-300'
                          : 'text-zinc-400 light:text-zinc-600 hover:bg-white/[0.04] light:hover:bg-pink-50 hover:text-white light:hover:text-zinc-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400 light:text-violet-700' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-400 light:text-violet-700 shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="pt-3 border-t border-white/[0.08] light:border-pink-200/70 space-y-2 mt-4">
          <button
            onClick={() => setIsDbmsModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl text-xs text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-50 hover:bg-emerald-500/20 light:hover:bg-emerald-100 flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold border border-emerald-500/30 light:border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] light:shadow-none"
            title="Open Academic DBMS Project ER Schema & Interactive SQL Sandbox"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-700" />
            <span>DBMS Schema &amp; SQL</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl text-xs text-zinc-400 light:text-zinc-600 hover:text-rose-400 light:hover:text-rose-600 hover:bg-rose-500/10 light:hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-medium border border-transparent hover:border-rose-500/20 light:hover:border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="warden-main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' && <WardenOverviewTab />}
            {activeTab === 'students' && <WardenStudentsTab />}
            {activeTab === 'rooms' && <WardenRoomsTab />}
            {activeTab === 'leaves' && <WardenLeavesTab />}
            {activeTab === 'complaints' && <WardenComplaintsTab />}
            {activeTab === 'mess' && <WardenMessTab />}
            {activeTab === 'expenses' && <WardenExpensesTab />}
            {activeTab === 'notices' && <WardenNoticesTab />}
            {activeTab === 'analytics' && <WardenAnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
