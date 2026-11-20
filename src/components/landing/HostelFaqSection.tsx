import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Clock,
  Utensils,
  Receipt,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const HostelFaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'Curfew & Security',
      icon: Clock,
      question: 'What is the mandatory night curfew and gate entry protocol?',
      answer:
        'The mandatory biometric in-gate curfew at Sakhi Girls Hostel is 08:00 PM. All entry/exit gates are managed by female sentries (Havaldar Shobha Jadhav) and recorded digitally. Any outward departure after 06:30 PM requires an approved digital gate pass and guardian telephonic verification logged by the warden office.',
    },
    {
      id: 'faq-2',
      category: 'Annapurna Dining',
      icon: Utensils,
      question: 'How does the 4-meal Annapurna Dining timetable operate, and are Jain meals available?',
      answer:
        'Annapurna Dining Hall serves 4 daily meals planned by certified nutritionists: Breakfast (07:30 AM – 09:00 AM), Lunch (12:30 PM – 02:30 PM), High Tea & Snacks (05:00 PM – 06:00 PM), and Dinner (07:30 PM – 09:30 PM). Food is 100% pure vegetarian, prepared in separate steam boilers. Dedicated Jain-friendly root-vegetable-free meals are available daily.',
    },
    {
      id: 'faq-3',
      category: 'Automated Billing',
      icon: Receipt,
      question: 'How is the automated Mess Fee Rebate calculated for outstation leaves?',
      answer:
        'Under MCET collegiate hostel guidelines, when a resident takes an approved academic, sports, or festival leave of 3 or more consecutive days, the system automatically credits a dining rebate of ₹85 per day. The rebate is calculated dynamically via database trigger and deducted directly from the upcoming term dues.',
    },
    {
      id: 'faq-4',
      category: 'Safety & Campus Care',
      icon: ShieldCheck,
      question: 'What safety, medical emergency, and anti-ragging measures are active?',
      answer:
        'Sakhi Girls Hostel enforces a strict zero-tolerance anti-ragging policy under UGC & AICTE regulations. The campus has 24/7 CCTV coverage across corridors, biometric turnstiles, a full-time resident rector (Dr. Sunita Gaikwad), an on-call female medical officer, and a 1-click Campus SOS helpline with instant siren alert dispatch to the security post.',
    },
    {
      id: 'faq-5',
      category: 'Room Transfers',
      icon: HeartHandshake,
      question: 'Can residents request a room or roommate transfer during the academic term?',
      answer:
        'Yes. Students can submit a digital Room Transfer Request through their Student Portal dashboard, stating their target room, preferred floor, and academic reason. Chief Rector Dr. Sunita Gaikwad reviews applications within 48 hours based on bed availability on the respective year’s floor.',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section id="hostel-faq" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/[0.08]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3.5 py-1 rounded-full border border-violet-500/20 inline-block mb-3 font-mono">
            Resident &amp; Guardian Guide
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Frequently Asked Questions &amp; Rules
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-3 md:mt-0 leading-relaxed">
          Key guidelines on hostel admissions, curfew compliance, culinary hygiene, and emergency medical support at Sakhi Girls Hostel.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          const Icon = faq.icon;

          return (
            <div
              key={faq.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#15131C] border-violet-500/40 shadow-[0_8px_30px_rgba(139,92,246,0.12)]'
                  : 'bg-[#111215]/90 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isOpen
                      ? 'bg-violet-600/20 text-violet-400 border-violet-500/40'
                      : 'bg-[#16181D] text-zinc-400 border-white/[0.06]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400/90 font-bold block mb-1">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                  isOpen
                    ? 'rotate-180 bg-violet-600/20 border-violet-500/30 text-violet-300'
                    : 'bg-[#16181D] border-white/[0.08] text-zinc-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.04]">
                  <p className="pl-14">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
