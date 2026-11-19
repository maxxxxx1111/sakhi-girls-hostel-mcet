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
    <div className="space-y-8 font-body text-[#1F2937] dark:text-[#FDF2F8] max-w-5xl mx-auto pb-12">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2937] dark:text-white">
          Hostel &amp; Dining Fees
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
          Official academic year billing schedule, installment dues, and payment receipts.
        </p>
      </section>

      {/* Primary Hero: Amount & Due Date FIRST */}
      <section className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs text-[#6B7280] dark:text-[#A79CB0] font-semibold">
            {isPending ? 'Outstanding Payment Due' : 'Account Financial Status'}
          </span>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] dark:text-white font-mono">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </h2>
            {isPending && (
              <span className="text-xs text-[#B45309] dark:text-[#F59E0B] font-semibold bg-[#FEF3C7] dark:bg-[#F59E0B]/10 px-2.5 py-0.5 rounded-full border border-[#FDE68A] dark:border-[#F59E0B]/20">
                Due October 15, 2025
              </span>
            )}
          </div>

          <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
            {isPending
              ? 'Term 2 Mess & Hostel Maintenance installment due before mid-semester examinations.'
              : 'All fees for Academic Year 2025-26 Term 1 are cleared in full.'}
          </p>
        </div>

        {isPending ? (
          <button
            type="button"
            onClick={() => setIsPayModalOpen(true)}
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay ₹{pendingAmount.toLocaleString('en-IN')} Online</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/20 text-[#15803D] dark:text-[#2DD4A8] text-xs font-semibold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>All Dues Cleared</span>
          </div>
        )}
      </section>

      {/* Secondary Details: Invoices & Receipts History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1F2937] dark:text-white">
            Invoices &amp; Official Receipts
          </h3>
          <span className="text-xs text-[#6B7280] dark:text-[#A79CB0]">PDF Verified</span>
        </div>

        <div className="bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl divide-y divide-[#F3E8EF] dark:divide-[#2C2436] overflow-hidden shadow-sm">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-5 flex flex-wrap items-center justify-between gap-4 text-xs hover:bg-[#FFF5F8]/40 dark:hover:bg-[#261E2E]/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1F2937] dark:text-white font-mono">
                    {inv.id}
                  </span>
                  <span className="text-[#6B7280] dark:text-[#A79CB0]">• {inv.date}</span>
                </div>
                <p className="text-[#6B7280] dark:text-[#D1C5D8]">{inv.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#1F2937] dark:text-white font-mono">
                  ₹{inv.amount.toLocaleString('en-IN')}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold ${
                    inv.status === 'Paid'
                      ? 'bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 text-[#15803D] dark:text-[#2DD4A8] border border-[#BBF7D0] dark:border-[#2DD4A8]/20'
                      : 'bg-[#FEF3C7] dark:bg-[#F6B657]/10 text-[#B45309] dark:text-[#F6B657] border border-[#FDE68A] dark:border-[#F6B657]/20'
                  }`}
                >
                  {inv.status}
                </span>

                {inv.status === 'Paid' && (
                  <button
                    type="button"
                    onClick={() => handleOpenReceipt(inv)}
                    className="p-2 rounded-xl bg-white dark:bg-[#120F14] hover:bg-[#FFF5F8] dark:hover:bg-[#201B26] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#EC4899] dark:hover:text-[#F472B6] transition-colors cursor-pointer border border-[#F3E8EF] dark:border-[#332A3B] flex items-center gap-1.5 shadow-2xs"
                    title="View & Download Official Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px] font-semibold">Receipt</span>
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
              className="w-full max-w-md bg-white dark:bg-[#1B1720] border border-[#F3E8EF] dark:border-[#332A3B] rounded-2xl p-6 sm:p-7 space-y-6 text-[#1F2937] dark:text-[#FDF2F8] shadow-2xl"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#F3E8EF] dark:border-[#2C2436]">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">
                    Secure Fee Payment
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                    Mauli College Hostel Account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] hover:bg-[#FCE7F3] dark:hover:bg-[#261E2E] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {paySuccess ? (
                <div className="p-6 rounded-2xl bg-[#DCFCE7] dark:bg-[#2DD4A8]/10 border border-[#BBF7D0] dark:border-[#2DD4A8]/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#15803D] dark:text-[#2DD4A8] mx-auto" />
                  <h4 className="text-sm font-bold text-[#15803D] dark:text-[#2DD4A8]">
                    Payment Successful!
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#A79CB0]">
                    Ledger updated. Verified receipt has been added to your account.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePayment} className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] flex items-center justify-between">
                    <span className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                      Total Due Amount:
                    </span>
                    <span className="text-base font-bold font-mono text-[#1F2937] dark:text-white">
                      ₹{pendingAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-[#6B7280] dark:text-[#A79CB0] font-semibold">
                      Select Payment Gateway
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`py-2 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6]'
                            : 'bg-[#FFF5F8] dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                        }`}
                      >
                        UPI / QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`py-2 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6]'
                            : 'bg-[#FFF5F8] dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                        }`}
                      >
                        Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`py-2 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                          paymentMethod === 'netbanking'
                            ? 'bg-[#FCE7F3] dark:bg-[#2B2333] border-[#EC4899] dark:border-[#F472B6] text-[#EC4899] dark:text-[#F472B6]'
                            : 'bg-[#FFF5F8] dark:bg-[#120F14] border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0]'
                        }`}
                      >
                        NetBanking
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFF5F8] dark:bg-[#120F14] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] text-[11px] leading-relaxed">
                    Transaction secured by Razorpay 256-bit college banking gateway. Instant e-receipt generated.
                  </div>

                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)]"
                  >
                    <span>Complete ₹{pendingAmount.toLocaleString('en-IN')} Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
