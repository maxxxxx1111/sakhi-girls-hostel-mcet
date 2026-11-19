import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  TrendingUp,
  Plus,
  Search,
  CheckCircle,
  X,
  FileText,
} from 'lucide-react';

export const WardenExpensesTab: React.FC = () => {
  const { fees, expenses, logExpense, students } = useApp();

  const [activeSubView, setActiveSubView] = useState<'fees' | 'expenses'>('fees');
  const [feeSearch, setFeeSearch] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Expense form state
  const [expCategory, setExpCategory] = useState<'Maintenance' | 'Electricity & Water' | 'Mess Ration' | 'Sanitation' | 'Security & Staff' | 'Misc'>('Maintenance');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expVendor, setExpVendor] = useState('');
  const [expReceipt, setExpReceipt] = useState('');

  // Fee Collection stats
  const totalBilled = fees.reduce((acc, f) => acc + (Number(f.totalAmount) || 0), 0);
  const totalCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
  const totalPending = fees.reduce((acc, f) => acc + (Number(f.pendingAmount) || 0), 0);

  // Total Expenditure stats
  const totalExpenditure = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const filteredFees = fees.filter((f) => {
    const student = students.find((s) => s.id === f.studentId);
    const room = f.roomNumber || student?.roomNumber || '';
    return (
      f.studentName.toLowerCase().includes(feeSearch.toLowerCase()) ||
      room.toLowerCase().includes(feeSearch.toLowerCase()) ||
      (f.paymentStatus || '').toLowerCase().includes(feeSearch.toLowerCase())
    );
  });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expAmount);
    if (!amount || !expDesc.trim()) return;

    logExpense({
      title: expDesc,
      item: expDesc,
      category: expCategory,
      amount,
      date: new Date().toISOString().split('T')[0],
      purchaseDate: new Date().toISOString().split('T')[0],
      paidTo: expVendor || 'Campus Maintenance Vendor',
      vendor: expVendor || 'Campus Maintenance Vendor',
      receiptNumber: expReceipt || `EXP-MCET-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: expReceipt || `EXP-MCET-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setIsExpenseModalOpen(false);
    setExpAmount('');
    setExpDesc('');
    setExpVendor('');
  };

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-300 font-body text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display text-white font-bold tracking-tight">
            Financial Ledger &amp; Operational Costs
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track student fee collection status, pending dues recovery, and operational campus maintenance expenditure.
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(139,92,246,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <span className="text-[10px] text-zinc-400 uppercase font-semibold font-mono">Total Fee Revenue</span>
          <p className="text-2xl font-display text-white font-bold mt-1">₹ {(totalBilled / 100000).toFixed(1)}L</p>
          <p className="text-[11px] text-zinc-400 font-mono mt-1">Hostel + Mess Package</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold font-mono">Total Collected</span>
          <p className="text-2xl font-display text-emerald-400 font-bold mt-1">₹ {(totalCollected / 100000).toFixed(1)}L</p>
          <p className="text-[11px] text-emerald-400/80 font-mono mt-1">
            {Math.round((totalCollected / (totalBilled || 1)) * 100)}% Realized
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <span className="text-[10px] text-amber-400 uppercase font-semibold font-mono">Outstanding Dues</span>
          <p className="text-2xl font-display text-amber-400 font-bold mt-1">₹ {(totalPending / 1000).toFixed(0)}k</p>
          <p className="text-[11px] text-zinc-400 font-mono mt-1">Pending student recovery</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <span className="text-[10px] text-rose-400 uppercase font-semibold font-mono">Hostel Expenses</span>
          <p className="text-2xl font-display text-rose-400 font-bold mt-1">₹ {(totalExpenditure / 1000).toFixed(0)}k</p>
          <p className="text-[11px] text-zinc-400 font-mono mt-1">Vouchers Recorded</p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
        <button
          onClick={() => setActiveSubView('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubView === 'fees'
              ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
              : 'text-zinc-400 hover:text-white bg-[#16181D] border border-white/[0.08]'
          }`}
        >
          Student Fee Collection ({fees.length})
        </button>
        <button
          onClick={() => setActiveSubView('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubView === 'expenses'
              ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
              : 'text-zinc-400 hover:text-white bg-[#16181D] border border-white/[0.08]'
          }`}
        >
          Hostel Operating Expenses ({expenses.length})
        </button>
      </div>

      {/* Sub View Content */}
      {activeSubView === 'fees' ? (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={feeSearch}
              onChange={(e) => setFeeSearch(e.target.value)}
              placeholder="Search student fees by name or room..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#16181D] border border-white/[0.12] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="bg-[#111215]/90 rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#16181D] border-b border-white/[0.08] text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student &amp; Room</th>
                    <th className="py-3 px-4 font-semibold">Total Package</th>
                    <th className="py-3 px-4 font-semibold">Paid Amount</th>
                    <th className="py-3 px-4 font-semibold">Pending Dues</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredFees.map((f) => {
                    const student = students.find((s) => s.id === f.studentId);
                    const roomNo = f.roomNumber || student?.roomNumber || 'A-204';

                    return (
                      <tr key={f.id} className="hover:bg-white/[0.03]">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{f.studentName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">Room {roomNo}</p>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-200 font-medium">₹ {(f.totalAmount ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-medium">₹ {(f.paidAmount ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono text-amber-400 font-medium">₹ {(f.pendingAmount ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              (f.paymentStatus || 'Paid') === 'Paid'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : (f.paymentStatus || '') === 'Partial' || (f.paymentStatus || '') === 'Partially Paid'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {f.paymentStatus || 'Paid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#111215]/90 rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16181D] border-b border-white/[0.08] text-zinc-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Voucher / Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Vendor / Beneficiary</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {expenses.map((e) => {
                  const title = e.title || e.item || 'Hostel Operating Expense';
                  const receipt = e.receiptNumber || e.invoiceNumber || 'EXP-MCET-2026';
                  const vendor = e.paidTo || e.vendor || 'Campus Vendor';
                  const date = e.date || e.purchaseDate || '2026-08-28';

                  return (
                    <tr key={e.id} className="hover:bg-white/[0.03]">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{title}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{receipt}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-[10px]">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-200">{vendor}</td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{date}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                        ₹ {(e.amount ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsExpenseModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111215] rounded-3xl p-6 border border-white/[0.12] shadow-2xl relative space-y-4 text-zinc-100"
          >
            <h3 className="text-xl font-display text-white font-bold">Record Hostel Expenditure</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Expense Description / Voucher</label>
                <input
                  type="text"
                  placeholder="e.g. Submersible pump motor capacitor repair"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Electricity & Water">Electricity &amp; Water</option>
                    <option value="Mess Ration">Mess Ration</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Security & Staff">Security &amp; Staff</option>
                    <option value="Misc">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="2500"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Vendor / Beneficiary</label>
                <input
                  type="text"
                  placeholder="e.g. Patil Electrical Services, Shegaon"
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#16181D] border border-white/[0.12] text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/[0.12] text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-500 cursor-pointer shadow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
