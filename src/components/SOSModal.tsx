import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldAlert,
  PhoneCall,
  CheckCircle,
  Radio,
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const { isSOSModalOpen, setIsSOSModalOpen, triggerSOS, role, currentStudent } = useApp();
  const [sosSent, setSosSent] = useState(false);
  const [note, setNote] = useState('');

  if (!isSOSModalOpen) return null;

  const handleSendSOS = () => {
    triggerSOS(note || 'Emergency medical / security assistance requested immediately.');
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
      setNote('');
      setIsSOSModalOpen(false);
    }, 3500);
  };

  const emergencyContacts = [
    {
      title: 'Chief Warden Office',
      name: 'Dr. S. K. Deshmukh',
      phone: '+91 98225 11099',
      role: 'Overall Campus Incharge',
      color: 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]',
    },
    {
      title: 'Boys Hostel Warden',
      name: 'Prof. A. V. Joshi',
      phone: '+91 94231 88210',
      role: 'Block A Residential Warden',
      color: 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]',
    },
    {
      title: 'Girls Hostel Warden',
      name: 'Dr. Sunita M. Gaikwad',
      phone: '+91 94228 77412',
      role: 'Block B Residential Warden',
      color: 'bg-[#F3E8FD] text-[#6B21A8] border-[#E9D5FF]',
    },
    {
      title: 'Campus Health & Ambulance',
      name: 'Dr. V. M. Solanke (CMO)',
      phone: '+91 98500 22341',
      role: '24x7 Emergency First Aid & ICU Van',
      color: 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]',
    },
    {
      title: 'Hostel Security Desk',
      name: 'Security Supervisor (Control)',
      phone: '+91 98224 55319',
      role: '24x7 Guard & Gate Control',
      color: 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]',
    },
    {
      title: 'Shegaon Police Station',
      name: 'Police Sub-Inspector Control',
      phone: '112 / 07265-252033',
      role: 'Local Police Assistance',
      color: 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]',
    },
  ];

  return (
    <div
      id="sos-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={() => setIsSOSModalOpen(false)}
    >
      <div
        id="sos-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#DADCE0] shadow-2xl relative max-h-[90vh] overflow-y-auto font-body text-[#1F1F1F]"
      >
        {/* Close Button */}
        <button
          id="close-sos-modal"
          onClick={() => setIsSOSModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F1F3F4] text-[#5F6368] hover:text-[#1F1F1F] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FCE8E6] border border-[#FAD2CF] flex items-center justify-center text-[#D93025] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl text-[#1F1F1F] font-semibold">
                Emergency &amp; Crisis Helpline
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FCE8E6] text-[#C5221F] text-[10px] font-semibold uppercase tracking-wider">
                24/7 Active
              </span>
            </div>
            <p className="text-xs text-[#5F6368]">
              Mauli College of Engineering and Technology Hostel Crisis Desk
            </p>
          </div>
        </div>

        {/* Active Student Trigger Section */}
        {role === 'student' && currentStudent && (
          <div className="mb-6 p-5 rounded-2xl bg-[#FCE8E6] border border-[#FAD2CF] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#D93025] animate-ping" />
                  <h4 className="text-xs font-semibold text-[#8C1D18]">Broadcast Instant Emergency SOS</h4>
                </div>
                <span className="text-xs text-[#8C1D18] font-semibold">Room: {currentStudent.roomNumber}</span>
              </div>
              <p className="text-xs text-[#8C1D18]/90 mb-3">
                Pressing this button broadcasts your exact room location ({currentStudent.roomNumber} - {currentStudent.hostelName}) and phone number ({currentStudent.mobile}) to the Chief Warden, Hostel Warden, and Campus Security immediately.
              </p>

              <div className="mb-3">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional: Specify emergency (e.g. Severe health issue, electrical fault, injury)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FAD2CF] text-xs text-[#1F1F1F] placeholder:text-[#747775] focus:outline-none focus:ring-2 focus:ring-[#D93025]"
                />
              </div>

              {sosSent ? (
                <div className="p-3 rounded-xl bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0 text-[#188038]" />
                  <span>SOS Broadcast dispatched! Warden office and campus ambulance alerted. Help is on the way.</span>
                </div>
              ) : (
                <button
                  type="button"
                  id="trigger-sos-btn"
                  onClick={handleSendSOS}
                  className="w-full py-3 px-4 rounded-full bg-[#D93025] hover:bg-[#B3261E] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>TRIGGER INSTANT SOS ALARM</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Direct Speed-Dial List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#444746]">
              Direct Campus Helpline Numbers
            </h4>
            <span className="text-[11px] text-[#5F6368]">Tap any number to call</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F8FAFD] border border-[#DADCE0] hover:border-[#1A73E8] transition-all flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1 ${contact.color}`}>
                    {contact.title}
                  </span>
                  <p className="text-xs font-semibold text-[#1F1F1F]">{contact.name}</p>
                  <p className="text-[11px] text-[#5F6368]">{contact.role}</p>
                  <p className="text-xs font-semibold text-[#0B57D0] mt-1 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-[#188038]" />
                    {contact.phone}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-[#F1F3F4] text-[#444746] group-hover:bg-[#E8F0FE] group-hover:text-[#0B57D0] transition-colors shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#DADCE0] flex items-center justify-between text-xs text-[#5F6368]">
          <span>Campus Address: Khamgaon Road, Shegaon - 444203</span>
          <span className="font-semibold text-[#1F1F1F]">MCET Discipline &amp; Safety Cell</span>
        </div>
      </div>
    </div>
  );
};
