import React from 'react';
import {
  Building2,
  Mail,
  MapPin,
  Utensils,
  ShieldCheck,
  Clock,
  Phone,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { openAuthModal, setIsSOSModalOpen } = useApp();

  return (
    <footer id="main-footer" className="relative z-20 border-t border-white/[0.08] bg-[#09090B] text-zinc-300 py-14 px-4 sm:px-6 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Heritage */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-display font-bold text-sm text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                N
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Nestos <span className="text-violet-400 font-mono text-sm font-normal">MCET</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Residential living &amp; dining portal for Mauli College of Engineering and Technology, Shegaon. Approved by AICTE New Delhi &amp; Affiliated to SGBAU Amravati.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span>Khamgaon Road, Shegaon - 444203 (M.S.)</span>
            </div>
          </div>

          {/* Col 2: Hostel Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Building2 className="w-3.5 h-3.5 text-violet-400" />
              <span>Hostel Administration</span>
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p>
                <span className="text-zinc-200 font-medium">Chief Rector:</span> Dr. Sunita Gaikwad (<span className="font-mono text-zinc-300">+91 94228 77412</span>)
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Asst. Warden:</span> Mrs. Pratibha Deshmukh (<span className="font-mono text-zinc-300">+91 98230 44102</span>)
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Mess Supervisor:</span> Mrs. Mangala Chavan (<span className="font-mono text-zinc-300">+91 98224 99120</span>)
              </p>
              <p className="flex items-center gap-1.5 pt-1 text-violet-400 hover:text-violet-300 transition-colors">
                <Mail className="w-3 h-3 text-violet-400" />
                <a href="mailto:hostel.office@maulice.ac.in" className="hover:underline font-mono text-[11px]">
                  hostel.office@maulice.ac.in
                </a>
              </p>
            </div>
          </div>

          {/* Col 3: Annapurna Mess Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>Annapurna Dining Desk</span>
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p>
                <span className="text-zinc-200 font-medium">Supervisor:</span> Mr. Ramesh Chavan (<span className="font-mono text-zinc-300">+91 98224 99120</span>)
              </p>
              <p>
                <span className="text-zinc-200 font-medium">Dining Hall:</span> <span className="font-mono text-zinc-300">Ext. 208</span>
              </p>
              <p className="flex items-center gap-1.5 pt-0.5 text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span className="font-mono text-[11px]">Meals: 07:30 AM – 09:45 PM</span>
              </p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                FSSAI certified vegetarian catering with daily hygiene audits.
              </p>
            </div>
          </div>

          {/* Col 4: Emergency Response */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Emergency 24x7</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111215] border border-white/[0.08]">
                <span className="text-zinc-400">Security Desk:</span>
                <span className="font-mono font-semibold text-zinc-200">+91 98224 55319</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111215] border border-white/[0.08]">
                <span className="text-zinc-400">Ambulance:</span>
                <span className="font-mono font-semibold text-zinc-200">+91 98500 22341</span>
              </div>
              <button
                onClick={() => setIsSOSModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-medium text-xs border border-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_16px_rgba(244,63,94,0.2)]"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Trigger Emergency SOS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p className="text-center md:text-left">
            &copy; 2026 Nestos • Mauli College of Engineering and Technology (MCET Shegaon). All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <button
              onClick={() => openAuthModal('student')}
              className="text-zinc-400 hover:text-violet-300 hover:underline cursor-pointer transition-colors"
            >
              Student Portal
            </button>
            <button
              onClick={() => openAuthModal('warden')}
              className="text-zinc-400 hover:text-violet-300 hover:underline cursor-pointer transition-colors"
            >
              Warden Desk
            </button>
            <button
              onClick={() => setIsSOSModalOpen(true)}
              className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer transition-colors font-mono"
            >
              Emergency Helpline
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

