import React from 'react';
import { Student } from '../../types';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Receipt,
  FileCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvoiceData {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  student: Student;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  invoice,
  student,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isDeposit = invoice.description.toLowerCase().includes('deposit');
  const isMess = invoice.description.toLowerCase().includes('mess');

  // Breakdown line items based on invoice type
  const lineItems = isMess
    ? [
        { desc: 'Centrally Catered Meal Plan (Breakfast, Lunch, Snacks, Dinner)', amount: invoice.amount * 0.8 },
        { desc: 'Kitchen Maintenance, Water Filter & Hygiene Levy', amount: invoice.amount * 0.2 },
      ]
    : [
        { desc: 'Room Accommodation & Furniture Usage Charges', amount: Math.round(invoice.amount * 0.65) },
        { desc: 'Refundable Security Caution Deposit (Held with Bursar)', amount: Math.round(invoice.amount * 0.22) },
        { desc: 'Wi-Fi 6 AP, Electricity & Common Area Housekeeping', amount: Math.round(invoice.amount * 0.13) },
      ];

  const totalCalculated = lineItems.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto"
        >
          {/* Top Control Bar (Non-printable) */}
          <div className="print:hidden bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Receipt className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Official Fee Clearance Receipt</h3>
                <p className="text-[11px] text-zinc-400">
                  College Bursar &amp; Accounts Directorate
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="h-8 px-3.5 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Official Receipt Body */}
          <div id="printable-fee-receipt" className="p-6 sm:p-8 space-y-6 text-zinc-900 font-body">
            {/* 1. College Official Letterhead */}
            <div className="text-center pb-4 border-b-2 border-zinc-900 space-y-1">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EC4899] text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                  M
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 uppercase">
                    Mauli College of Engineering &amp; Technology
                  </h1>
                  <p className="text-[11px] font-semibold tracking-wide text-zinc-600 uppercase">
                    Khamgaon Road, Shegaon – 444203, Maharashtra • NAAC 'A+' Accredited
                  </p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 mt-2 rounded-md bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs font-bold uppercase tracking-widest">
                Hostel Housing Board &amp; Accounts Section • Payment Voucher
              </div>
            </div>

            {/* 2. Receipt Details Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs">
              <div>
                <span className="text-zinc-500 text-[11px] block">Receipt Number</span>
                <span className="font-mono font-bold text-zinc-900 mt-0.5 block">{invoice.id}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[11px] block">Payment Date</span>
                <span className="font-mono font-bold text-zinc-900 mt-0.5 block">{invoice.date}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[11px] block">Payment Mode</span>
                <span className="font-semibold text-zinc-900 mt-0.5 block">NetBanking / UPI</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[11px] block">Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  PAID IN FULL
                </span>
              </div>
            </div>

            {/* 3. Resident Student Details */}
            <div className="border border-zinc-200 rounded-2xl p-4 text-xs bg-white space-y-2">
              <div className="font-bold text-zinc-900 border-b border-zinc-100 pb-2 flex items-center justify-between">
                <span>Payer Student Details</span>
                <span className="font-mono text-zinc-500 font-normal">PRN: {student.studentId}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-zinc-500 text-[11px] block">Resident Name</span>
                  <span className="font-bold text-zinc-900">{student.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Academic Branch</span>
                  <span className="font-semibold text-zinc-800">{student.department}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Hostel &amp; Allotment</span>
                  <span className="font-bold text-zinc-900">
                    Room {student.roomNumber} ({student.bedNumber})
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Itemized Breakdown Table */}
            <div className="border border-zinc-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Item Description</th>
                    <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {lineItems.map((item, index) => (
                    <tr key={index} className="hover:bg-zinc-50">
                      <td className="py-2.5 px-4 text-zinc-800">{item.desc}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-zinc-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-zinc-50 font-bold text-zinc-900 border-t-2 border-zinc-900">
                    <td className="py-3 px-4 text-sm">Total Paid Amount:</td>
                    <td className="py-3 px-4 text-right font-mono text-base text-[#DB2777]">
                      ₹{invoice.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Authorizations & Stamps */}
            <div className="pt-4 grid grid-cols-2 gap-6 items-center border-t border-zinc-200 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-500 text-emerald-600 flex flex-col items-center justify-center font-bold text-[9px] uppercase tracking-tighter rotate-[-12deg] shadow-2xs">
                    <span>ACCOUNTS</span>
                    <span className="text-[11px] font-black">CLEARED</span>
                    <span>MCET</span>
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Digitally Verified Voucher</p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Ref: TXN-RZP-{invoice.id.replace(/[^0-9]/g, '') || '918237'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="font-serif italic font-bold text-base text-zinc-900 block">
                  Prof. R. M. Deshpande
                </span>
                <p className="font-bold text-zinc-900">Finance &amp; Accounts Officer</p>
                <p className="text-[10px] text-zinc-500">Mauli College of Engineering &amp; Technology</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>Automated Billing System • Nestos Campus Hub</span>
              <span>This is a computer-generated official receipt</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
