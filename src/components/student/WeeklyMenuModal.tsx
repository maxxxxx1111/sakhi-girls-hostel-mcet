import React from 'react';
import { DayMenu } from '../../types';
import {
  X,
  Printer,
  Utensils,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface WeeklyMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyMenu: DayMenu[];
}

export const WeeklyMenuModal: React.FC<WeeklyMenuModalProps> = ({
  isOpen,
  onClose,
  weeklyMenu,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const daysOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const sortedMenu = [...weeklyMenu].sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
      {/* Printable styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #weekly-menu-print-area, #weekly-menu-print-area * {
            visibility: visible;
          }
          #weekly-menu-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 16px;
            background: white !important;
            color: #111827 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="weekly-menu-print-area"
        className="w-full max-w-5xl bg-white dark:bg-[#151219] border border-[#F3E8EF] dark:border-[#332A3B] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-[#1F2937] dark:text-[#FDF2F8]"
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-[#F3E8EF] dark:border-[#332A3B]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#EC4899] dark:text-[#F472B6]">
            <Utensils className="w-4 h-4" />
            <span>Weekly Dining Master Schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#F472B6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#DB2777] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#FFF5F8] dark:bg-[#201A26] border border-[#F3E8EF] dark:border-[#332A3B] text-[#6B7280] dark:text-[#A79CB0] hover:text-[#1F2937] dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official College Dining Header */}
        <div className="text-center space-y-1.5 pb-4 border-b border-[#F3E8EF] dark:border-[#332A3B]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F3] dark:bg-[#2D1B2D] text-[#EC4899] dark:text-[#F472B6] text-[11px] font-bold font-mono tracking-wider">
            <Sparkles className="w-3 h-3" />
            MAULI COLLEGE OF ENGINEERING &amp; TECHNOLOGY, SHEGAON
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1F2937] dark:text-white">
            Annapurna Central Dining Hall
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A79CB0] max-w-xl mx-auto">
            Official 7-Day Balanced Diet Timetable • FSSAI Food Safety Certified • Vegetarian Campus
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#EC4899]" />
              BF: 07:30–09:15 | Lunch: 12:30–14:30 | Snacks: 17:00–18:15 | Dinner: 19:45–21:45
            </span>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F3E8EF] dark:border-[#332A3B] bg-[#FFF5F8] dark:bg-[#1E1924]">
                <th className="p-3 font-bold text-[#1F2937] dark:text-white w-28">Day</th>
                <th className="p-3 font-bold text-[#1F2937] dark:text-white">Breakfast</th>
                <th className="p-3 font-bold text-[#1F2937] dark:text-white">Lunch</th>
                <th className="p-3 font-bold text-[#1F2937] dark:text-white">Evening Snacks</th>
                <th className="p-3 font-bold text-[#1F2937] dark:text-white">Dinner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3E8EF] dark:divide-[#332A3B]">
              {sortedMenu.map((day) => (
                <tr
                  key={day.dayOfWeek}
                  className="hover:bg-[#FFF5F8]/50 dark:hover:bg-[#1E1924]/50 transition-colors"
                >
                  <td className="p-3 font-bold text-[#EC4899] dark:text-[#F472B6] align-top whitespace-nowrap">
                    {day.dayOfWeek}
                  </td>
                  <td className="p-3 align-top space-y-1">
                    <div className="font-medium text-[#1F2937] dark:text-zinc-200">
                      {day.breakfast?.items.join(', ') || 'Poha, Sprouts, Hot Tea / Milk'}
                    </div>
                    {day.breakfast?.specialDish && (
                      <span className="inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        Special: {day.breakfast.specialDish}
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top space-y-1">
                    <div className="font-medium text-[#1F2937] dark:text-zinc-200">
                      {day.lunch?.items.join(', ') || 'Dal, Rice, Chapati, Paneer, Salad'}
                    </div>
                    {day.lunch?.dessert && (
                      <span className="inline-block text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                        Dessert: {day.lunch.dessert}
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    <div className="font-medium text-[#1F2937] dark:text-zinc-200">
                      {day.snacks?.items.join(', ') || 'Samosa / Toast, Filter Coffee / Tea'}
                    </div>
                  </td>
                  <td className="p-3 align-top space-y-1">
                    <div className="font-medium text-[#1F2937] dark:text-zinc-200">
                      {day.dinner?.items.join(', ') || 'Mix Veg, Dal Tadka, Jeera Rice, Phulka'}
                    </div>
                    {day.dinner?.dessert && (
                      <span className="inline-block text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-1.5 py-0.5 rounded">
                        Sweet: {day.dinner.dessert}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dietary Legend & Mess Advisory */}
        <div className="pt-4 border-t border-[#F3E8EF] dark:border-[#332A3B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-[#6B7280] dark:text-[#A79CB0]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>100% Pure Vegetarian Kitchen</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>High-Protein Options Available Every Meal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Jain Meals Prepared on Prior Request (Counter 3)</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-right">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>FSSAI License: 11521034000482</span>
          </div>
        </div>
      </div>
    </div>
  );
};
