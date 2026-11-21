import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { rbacApi, RoleInfo, UserAccountItem, SecurityAuditEntry } from '../../services/api/rbacApi';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  History,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Eye,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const WardenSecurityTab: React.FC = () => {
  const { authUser, hasPermission } = useApp();

  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [users, setUsers] = useState<UserAccountItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'audit'>('users');

  // Load initial RBAC data
  const loadRbacData = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const [rolesData, usersData, logsData] = await Promise.all([
        rbacApi.getRoles().catch(() => []),
        rbacApi.getUsers().catch(() => []),
        rbacApi.getAuditLogs(50).catch(() => []),
      ]);
      setRoles(rolesData);
      setUsers(usersData);
      setAuditLogs(logsData);
    } catch (err: any) {
      console.warn('Failed to load RBAC data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRbacData();
  }, []);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setStatusMsg(null);
    try {
      const res = await rbacApi.updateUserRole(userId, newRoleId);
      setStatusMsg({ text: res.message, type: 'success' });
      await loadRbacData();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Privilege escalation blocked by server', type: 'error' });
    }
  };

  const handleStatusChange = async (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED') => {
    setStatusMsg(null);
    try {
      const res = await rbacApi.updateUserStatus(userId, status);
      setStatusMsg({ text: res.message, type: 'success' });
      await loadRbacData();
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Status modification rejected', type: 'error' });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role_id === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredLogs = auditLogs.filter((l) => {
    return severityFilter === 'all' || l.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-purple-900/30 via-indigo-900/20 to-pink-900/20 border border-purple-500/20 light:bg-white light:border-zinc-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 light:bg-purple-100 light:text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white light:text-zinc-900">
                Enterprise RBAC &amp; Security Authority Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                3NF Relational RBAC Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 light:text-zinc-600 max-w-2xl leading-relaxed">
              Real server-side Role-Based &amp; Permission-Based Access Control (PBAC). Configurable 7-tier authority hierarchy,
              cryptographic session tracking, brute-force lockout defenses, and immutable security audit logs in MySQL Workbench.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadRbacData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] light:bg-zinc-100 light:hover:bg-zinc-200 border border-white/10 light:border-zinc-300 text-xs font-semibold text-zinc-200 light:text-zinc-700 flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Registry</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 p-3 rounded-2xl text-xs flex items-center gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 light:text-emerald-800 light:bg-emerald-50'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300 light:text-rose-800 light:bg-rose-50'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 light:border-zinc-200 pb-3">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white light:text-zinc-600 light:hover:text-zinc-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Accounts &amp; Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'roles'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white light:text-zinc-600 light:hover:text-zinc-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Authority Hierarchy &amp; Permissions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'audit'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white light:text-zinc-600 light:hover:text-zinc-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: USER ACCOUNTS & REAL ROLES */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, PRN..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] light:bg-white border border-white/10 light:border-zinc-300 text-xs text-white light:text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/[0.04] light:bg-white border border-white/10 light:border-zinc-300 text-xs text-zinc-300 light:text-zinc-800 outline-none"
              >
                <option value="all">All Authority Roles</option>
                <option value="super_admin">Super Administrator</option>
                <option value="administrator">Administrator</option>
                <option value="authority_officer">Authority Officer</option>
                <option value="department_manager">Department Manager</option>
                <option value="moderator">Moderator</option>
                <option value="regular_user">Regular User</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-3xl border border-white/10 light:border-zinc-200 overflow-hidden bg-white/[0.02] light:bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] light:bg-zinc-50 border-b border-white/10 light:border-zinc-200 text-zinc-400 light:text-zinc-600 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User Identity</th>
                    <th className="py-3 px-4">Assigned Role (Server RBAC)</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Failed Logins</th>
                    <th className="py-3 px-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 light:divide-zinc-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500">
                        No accounts match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isLocked = u.locked_until && new Date(u.locked_until) > new Date();

                      return (
                        <tr key={u.user_id} className="hover:bg-white/[0.02] light:hover:bg-zinc-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white light:text-zinc-900">{u.full_name}</div>
                            <div className="text-[11px] font-mono text-zinc-400 light:text-zinc-500">
                              {u.username} • {u.email}
                            </div>
                            {u.student_prn && (
                              <div className="text-[10px] text-pink-400 light:text-pink-600">
                                Scholar PRN: {u.student_prn} {u.room_number ? `(Room ${u.room_number})` : ''}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={u.role_id}
                                onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] light:bg-zinc-100 border border-white/10 light:border-zinc-300 text-zinc-200 light:text-zinc-800 outline-none cursor-pointer"
                              >
                                <option value="super_admin">Super Administrator (Rank 100)</option>
                                <option value="administrator">Administrator (Rank 80)</option>
                                <option value="authority_officer">Authority Officer (Rank 60)</option>
                                <option value="department_manager">Department Manager (Rank 50)</option>
                                <option value="moderator">Moderator (Rank 40)</option>
                                <option value="regular_user">Regular User (Rank 20)</option>
                              </select>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {u.account_status === 'ACTIVE' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" />
                                  ACTIVE
                                </span>
                              )}
                              {u.account_status === 'SUSPENDED' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                  <XCircle className="w-3 h-3" />
                                  SUSPENDED
                                </span>
                              )}
                              {isLocked && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  <Lock className="w-3 h-3" />
                                  TEMPORARILY LOCKED
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-zinc-400 light:text-zinc-600">
                            {u.failed_login_attempts || 0} / 5
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.account_status === 'ACTIVE' ? (
                                <button
                                  onClick={() => handleStatusChange(u.user_id, 'SUSPENDED')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 light:text-rose-700 text-[11px] font-semibold border border-rose-500/20 transition-all cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(u.user_id, 'ACTIVE')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 light:text-emerald-700 text-[11px] font-semibold border border-emerald-500/20 transition-all cursor-pointer"
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AUTHORITY HIERARCHY & PERMISSIONS */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => (
              <div
                key={r.role_id}
                className="p-5 rounded-3xl bg-white/[0.03] light:bg-white border border-white/10 light:border-zinc-200 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white light:text-zinc-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    {r.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 light:bg-purple-100 light:text-purple-700 border border-purple-500/30">
                    Rank {r.hierarchy_level}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed">{r.description}</p>
                <div className="pt-2 border-t border-white/10 light:border-zinc-200">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2 font-semibold">
                    Granted Granular Rights ({r.permissions.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {r.permissions.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.05] light:bg-zinc-100 text-zinc-300 light:text-zinc-700 border border-white/10 light:border-zinc-300"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SECURITY AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-zinc-400 light:text-zinc-600">
              Showing last {filteredLogs.length} events logged in `security_audit_logs` table
            </span>
            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] light:bg-white border border-white/10 light:border-zinc-300 text-xs text-zinc-300 light:text-zinc-800 outline-none"
              >
                <option value="all">All Severities</option>
                <option value="INFO">INFO Only</option>
                <option value="WARNING">WARNING Only</option>
                <option value="CRITICAL">CRITICAL Only</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 light:border-zinc-200 overflow-hidden bg-white/[0.02] light:bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.04] light:bg-zinc-50 border-b border-white/10 light:border-zinc-200 text-zinc-400 light:text-zinc-600 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Target / User</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 light:divide-zinc-200 text-[11px]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-zinc-500 font-sans">
                        No security audit logs recorded matching severity filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.log_id} className="hover:bg-white/[0.02] light:hover:bg-zinc-50">
                        <td className="py-2.5 px-4 text-zinc-400 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-white light:text-zinc-900">
                          {log.event_type}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.severity === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : log.severity === 'WARNING'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-300 light:text-zinc-700">
                          {log.user_id || 'System / Anonymous'}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400 light:text-zinc-600 max-w-xs truncate">
                          {log.details ? JSON.stringify(log.details) : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
