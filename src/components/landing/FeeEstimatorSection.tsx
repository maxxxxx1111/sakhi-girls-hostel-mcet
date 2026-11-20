import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building2,
  Utensils,
  Shirt,
  Wind,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeeEstimatorSection: React.FC = () => {
  const { openAuthModal } = useApp();

  const [selectedYear, setSelectedYear] = useState<'1st' | '2nd' | '3rd' | '4th'>('1st');
  const [roomType, setRoomType] = useState<'triple' | 'twin' | 'single'>('triple');
  const [messPlan, setMessPlan] = useState<'full' | 'saver'>('full');
  const [includeLaundry, setIncludeLaundry] = useState<boolean>(true);
  const [includeCooler, setIncludeCooler] = useState<boolean>(false);

  // Pricing constants (in INR)
  const roomRates = {
    triple: 24000,
    twin: 28000,
    single: 32000,
  };

  const messRates = {
    full: 18000, // 4 meals (Breakfast, Lunch, Snacks, Dinner)
    saver: 12000, // 2 meals (Lunch + Dinner)
  };

  const cautionDeposit = 5000; // One-time refundable
  const laundryFee = includeLaundry ? 1500 : 0;
  const coolerFee = includeCooler ? 2000 : 0;

  const currentRoomRate = roomRates[roomType];
  const currentMessRate = messRates[messPlan];
  const semesterTotal = currentRoomRate + currentMessRate + laundryFee + coolerFee;
  const annualTotal = semesterTotal * 2 + cautionDeposit;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="fee-estimator" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-3.5 py-1 rounded-full border border-pink-500/20 inline-block mb-3 font-mono">
            Transparent Pricing • Sakhi Girls Hostel
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Collegiate Fee &amp; Living Cost Estimator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-3 md:mt-0 leading-relaxed">
          Interactive semester and annual budget calculator for residential suites, Annapurna dining, and optional campus amenities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Selection Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Academic Year */}
          <div className="p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-lg space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              1. Resident Academic Year (Designated Floor)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { year: '1st', label: '1st Year (FE)', floor: 'Floor 1' },
                { year: '2nd', label: '2nd Year (SE)', floor: 'Floor 2' },
                { year: '3rd', label: '3rd Year (TE)', floor: 'Floor 3' },
                { year: '4th', label: '4th Year (BE)', floor: 'Floor 4' },
              ].map((y) => (
                <button
                  key={y.year}
                  type="button"
                  onClick={() => setSelectedYear(y.year as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedYear === y.year
                      ? 'bg-pink-600/20 border-pink-500/50 text-white shadow-[0_0_16px_rgba(236,72,153,0.25)]'
                      : 'bg-[#16181D]/80 border-white/[0.06] text-zinc-400 hover:border-white/15'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{y.label}</p>
                  <span className="text-[10px] text-pink-400/90 font-mono mt-0.5 block">{y.floor}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Room Sharing Tier */}
          <div className="p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-lg space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              2. Room Sharing Tier &amp; Accommodation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  type: 'triple' as const,
                  title: 'Triple Sharing',
                  price: '₹24,000 / sem',
                  desc: '3 Study Tables • Balcony • LAN',
                },
                {
                  type: 'twin' as const,
                  title: 'Twin Executive',
                  price: '₹28,000 / sem',
                  desc: '2 Study Pods • Quiet Corner',
                },
                {
                  type: 'single' as const,
                  title: 'Single Scholar Pod',
                  price: '₹32,000 / sem',
                  desc: 'Private Studio (Final Year BE)',
                },
              ].map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => setRoomType(r.type)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    roomType === r.type
                      ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]'
                      : 'bg-[#16181D]/80 border-white/[0.06] text-zinc-400 hover:border-white/15'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{r.title}</span>
                      <Building2 className={`w-3.5 h-3.5 ${roomType === r.type ? 'text-violet-400' : 'text-zinc-500'}`} />
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{r.desc}</p>
                  </div>
                  <span className="text-xs font-bold font-mono text-violet-300 mt-3 block">{r.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Dining & Add-ons */}
          <div className="p-6 rounded-3xl bg-[#111215]/90 border border-white/[0.08] shadow-lg space-y-4">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              3. Annapurna Mess Plan &amp; Optional Add-ons
            </label>

            {/* Mess plan selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMessPlan('full')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  messPlan === 'full'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                    : 'bg-[#16181D]/80 border-white/[0.06] text-zinc-400 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Full 4-Meal Plan</span>
                  <Utensils className={`w-3.5 h-3.5 ${messPlan === 'full' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                </div>
                <p className="text-[11px] text-zinc-400">Breakfast, Lunch, High Tea, Dinner (Unlimited Thali)</p>
                <span className="text-xs font-bold font-mono text-emerald-400 mt-2 block">₹18,000 / semester</span>
              </button>

              <button
                type="button"
                onClick={() => setMessPlan('saver')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  messPlan === 'saver'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                    : 'bg-[#16181D]/80 border-white/[0.06] text-zinc-400 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">2-Meal Saver Plan</span>
                  <Utensils className={`w-3.5 h-3.5 ${messPlan === 'saver' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                </div>
                <p className="text-[11px] text-zinc-400">Nutritious Lunch &amp; Dinner Thali</p>
                <span className="text-xs font-bold font-mono text-emerald-400 mt-2 block">₹12,000 / semester</span>
              </button>
            </div>

            {/* Checkbox Add-ons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label
                onClick={() => setIncludeLaundry(!includeLaundry)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  includeLaundry
                    ? 'bg-[#1E1A29] border-violet-500/40 text-white'
                    : 'bg-[#16181D]/60 border-white/[0.06] text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shirt className={`w-4 h-4 ${includeLaundry ? 'text-violet-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="text-xs font-semibold block text-zinc-200">Laundry Service</span>
                    <span className="text-[10px] text-zinc-500">Weekly machine wash</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-violet-300">+₹1,500</span>
              </label>

              <label
                onClick={() => setIncludeCooler(!includeCooler)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  includeCooler
                    ? 'bg-[#1E1A29] border-cyan-500/40 text-white'
                    : 'bg-[#16181D]/60 border-white/[0.06] text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wind className={`w-4 h-4 ${includeCooler ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="text-xs font-semibold block text-zinc-200">Desert Cooler Unit</span>
                    <span className="text-[10px] text-zinc-500">Summer season setup</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300">+₹2,000</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Cost Card (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1A1224] via-[#14121A] to-[#111215] border border-pink-500/30 shadow-[0_12px_40px_rgba(236,72,153,0.15)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-pink-400 tracking-wider">
                  Official MCET Quotation
                </span>
                <h3 className="text-xl font-display font-bold text-white mt-0.5">
                  Living Fee Breakdown
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                <Calculator className="w-5 h-5" />
              </div>
            </div>

            {/* Itemized lines */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span>Room Rent ({roomType === 'triple' ? 'Triple Sharing' : roomType === 'twin' ? 'Twin Executive' : 'Single Pod'})</span>
                <span className="font-mono font-bold text-white">₹{currentRoomRate.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>Annapurna Mess ({messPlan === 'full' ? 'Full 4-Meal' : '2-Meal Saver'})</span>
                <span className="font-mono font-bold text-white">₹{currentMessRate.toLocaleString('en-IN')}</span>
              </div>

              {includeLaundry && (
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Weekly Laundry Service</span>
                  <span className="font-mono font-bold text-white">₹1,500</span>
                </div>
              )}

              {includeCooler && (
                <div className="flex justify-between items-center text-zinc-300">
                  <span>In-Room Desert Cooler Appliance</span>
                  <span className="font-mono font-bold text-white">₹2,000</span>
                </div>
              )}

              <div className="flex justify-between items-center text-pink-300/80 pt-2 border-t border-white/[0.06]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  <span>Caution Deposit (Refundable at Checkout)</span>
                </span>
                <span className="font-mono font-bold text-pink-300">₹{cautionDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Big Totals Box */}
            <div className="p-5 rounded-2xl bg-[#16181D]/90 border border-white/[0.08] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-zinc-400 font-medium">Semester Total:</span>
                <span className="text-2xl font-display font-bold text-white font-mono">
                  ₹{semesterTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-xs text-zinc-400 font-medium">Annual Academic Total (with Deposit):</span>
                <span className="text-base font-bold text-pink-400 font-mono">
                  ₹{annualTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('student')}
                className="w-full py-3.5 px-6 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_24px_rgba(236,72,153,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>Apply for Bed Allotment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 px-4 rounded-full bg-[#16181D] hover:bg-[#1E2026] text-zinc-300 border border-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-400" />
                <span>Print / Save Estimate Breakdown</span>
              </button>
            </div>

            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              * Mess rebate of ₹85/day is automatically credited during approved outstation leaves $\ge$ 3 days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
