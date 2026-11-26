import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  Receipt,
  X,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles,
  Award,
  FileCheck2,
  Lock,
  Wallet,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeeReceiptModal } from './FeeReceiptModal';

export const StudentFeesTab: React.FC = () => {
  const { currentStudent, fees, payStudentFee } = useApp();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paySuccess, setPaySuccess] = useState(false);

  // Receipt modal state
  const [selectedInvoice, setSelectedInvoice] = useState<{
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
  } | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  if (!currentStudent) return null;

  const myFee = fees.find((f) => f.studentId === currentStudent.id);
  const pendingAmount = myFee?.pendingAmount || 0;
  const isPending = pendingAmount > 0;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myFee || pendingAmount <= 0) return;

    payStudentFee(myFee.id, pendingAmount);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setIsPayModalOpen(false);
    }, 1500);
  };

  const invoices = [
    {
      id: 'REC-2025-001',
      date: 'Aug 10, 2025',
      description: 'Hostel Accommodation & Security Deposit (Annual)',
      amount: 45000,
      status: 'Paid',
    },
    {
      id: 'REC-2025-002',
      date: 'Aug 10, 2025',
      description: 'Mess Dining Advance (Term 1)',
      amount: 20000,
      status: 'Paid',
    },
    ...(isPending
      ? [
          {
            id: 'INV-2025-003',
            date: 'Oct 01, 2025',
            description: 'Mess Dining Installment (Term 2)',
            amount: pendingAmount,
            status: 'Pending',
          },
        ]
      : []),
  ];

  const handleOpenReceipt = (inv: (typeof invoices)[0]) => {
    setSelectedInvoice(inv);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-16">
      {/* 1. Treasury Command Center Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-950/40 dark:via-purple-950/20 dark:to-zinc-950/60 border border-pink-200/60 dark:border-pink-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-pink-500/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-400/15 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-pink-200 dark:border-pink-800/60 text-xs font-semibold text-pink-700 dark:text-pink-300 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-pink-500" />
              <span>Bursar &amp; Student Financial Services</span>
              <span className="w-1 h-1 rounded-full bg-pink-400" />
              <span>AY 2025-26</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Hostel Fees &amp; Ledger
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Official institutional fee accounting, payment history receipts, automated mess leave deductions, and semester exam no-dues clearance verification.
            </p>

            {/* Financial Status Pill */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero-Dues Clearance Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium">
                <Receipt className="w-3.5 h-3.5 text-blue-600" />
                100% Tax Deductible (Sec 80D)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                ₹255 Dining Rebate Auto-Credited
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {isPending ? (
              <button
                type="button"
                onClick={() => setIsPayModalOpen(true)}
                className="h-11 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(236,72,153,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{pendingAmount.toLocaleString('en-IN')} Online</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Account Fully Cleared</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Outstanding Balance & Accounting Ledger Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Outstanding Balance</span>
            <Wallet className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
            ₹{pendingAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            No pending arrears for Term 1
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Total Fees Cleared</span>
            <Receipt className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            ₹65,000
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            ₹45,000 Room + ₹20,000 Dining advance
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Exam Clearance Status</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-white">
            Hall Ticket Issued
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Zero-dues certificate verified for End-Sem Exam
          </p>
        </div>
      </section>

      {/* 3. Official Receipts & Invoices Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Official Receipts &amp; Payment Ledger
          </h3>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            Cryptographically Signed
          </span>
        </div>

        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl divide-y divide-[#F3E8EF] dark:divide-[#2C2436] overflow-hidden shadow-xs">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 text-xs hover:bg-pink-50/30 dark:hover:bg-[#261E2E]/30 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white font-mono">
                    {inv.id}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">• {inv.date}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 font-medium">{inv.description}</p>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Transaction Gateway: HDFC / Razorpay 256-Bit
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-base font-extrabold text-zinc-900 dark:text-white font-mono">
                  ₹{inv.amount.toLocaleString('en-IN')}
                </span>

                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    inv.status === 'Paid'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  {inv.status}
                </span>

                {inv.status === 'Paid' && (
                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(inv)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#120F14] hover:bg-pink-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer border border-[#F3E8EF] dark:border-[#332A3B] flex items-center gap-1.5 shadow-2xs font-semibold text-xs"
                    title="View & Download Official Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Receipt</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsPayModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl p-6 sm:p-7 space-y-6 text-[#1F2937] dark:text-[#FDF2F8] shadow-2xl"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#F3E8EF] dark:border-[#2C2436]">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Secure Fee Payment
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Mauli College of Engineering &amp; Technology Hostel Account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {paySuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Payment Successfully Processed!
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Hostel treasury ledger updated. Official verified tax receipt generated.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePayment} className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-[#120F14] border border-pink-100 dark:border-[#332A3B] flex items-center justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400 font-semibold">
                      Total Due Amount:
                    </span>
                    <span className="text-lg font-extrabold font-mono text-zinc-900 dark:text-white">
                      ₹{pendingAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-zinc-700 dark:text-zinc-300 font-semibold">
                      Select Payment Gateway
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        UPI / QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`py-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        Debit / Credit
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`py-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                          paymentMethod === 'netbanking'
                            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        NetBanking
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#120F14] border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                    256-bit SSL encrypted institutional transaction. Instant SMS acknowledgment dispatched to registered mobile number.
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.01]"
                  >
                    <span>Complete ₹{pendingAmount.toLocaleString('en-IN')} Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Fee Clearance Receipt Modal */}
      <FeeReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        invoice={selectedInvoice}
        student={currentStudent}
      />
    </div>
  );
};
