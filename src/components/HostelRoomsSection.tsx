import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bed,
  Wifi,
  Zap,
  Sun,
  Shield,
  BookOpen,
  CheckCircle2,
  Users,
  Eye,
  ArrowRight,
  Maximize2,
  Sparkles,
  Lock,
  Layers,
  X,
  Info,
  Calendar,
  Building,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface HostelRoomType {
  id: string;
  name: string;
  category: 'single' | 'twin' | 'triple' | 'quad';
  wing: 'both' | 'boys' | 'girls';
  priceSemester: number;
  securityDeposit: number;
  occupancyLabel: string;
  spotsLeft: number;
  totalRooms: number;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  dimensions: string;
  eligibility: string;
  features: string[];
  inventory: {
    furniture: string[];
    electricals: string[];
    utilities: string[];
  };
}

const HOSTEL_ROOMS: HostelRoomType[] = [
  {
    id: 'single-scholar',
    name: 'Single Scholar Studio',
    category: 'single',
    wing: 'both',
    priceSemester: 32000,
    securityDeposit: 5000,
    occupancyLabel: '1 Student / Private Pod',
    spotsLeft: 4,
    totalRooms: 40,
    tagline: 'Dedicated study sanctuary for final year BE / M.Tech scholars and researchers.',
    description: 'Designed for deep academic concentration with an acoustic partition, solid teak study desk, high-speed CAT6 gigabit LAN port, and an individual steel wardrobe with lock.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
    ],
    dimensions: '140 sq.ft • 9.5 ft Ceiling • Balcony Window',
    eligibility: 'Final Year (BE 4th Year / Postgraduates & Researchers)',
    features: [
      'Dedicated Solid-Wood Study Desk & Softboard',
      'Heavy-Gauge Steel Almirah with Locker',
      'Dedicated 1 Gbps Gigabit LAN Port',
      'Rooftop 24/7 Solar Hot Water Supply',
    ],
    inventory: {
      furniture: [
        'Single Bed with Hydraulic Storage (75" × 36")',
        '5-inch High-Density Orthopedic Mattress',
        'Study Table (4ft × 2.5ft) with Multi-shelf Bookrack',
        'Ergonomic Mesh High-Back Study Chair',
        '3-Door Heavy Steel Wardrobe with Dual Locking',
      ],
      electricals: [
        'Dual 6A+16A Power Sockets at Study Table',
        'Dedicated CAT6 Gigabit LAN RJ45 Port',
        'BLDC Energy-Saving Ceiling Fan with Remote',
        'Anti-Glare 18W LED Task Batten + Night Lamp',
        'Individual MCB Sub-Circuit Breaker',
      ],
      utilities: [
        '24×7 Central Solar Water Geyser Line',
        'Weekly Machine Laundry Service (Included)',
        'Daily Room Cleaning & Trash Collection',
        'Dual Mesh Window for Cross-Ventilation',
      ],
    },
  },
  {
    id: 'twin-sharing',
    name: 'Classic Twin Study Suite',
    category: 'twin',
    wing: 'both',
    priceSemester: 24000,
    securityDeposit: 4000,
    occupancyLabel: '2 Students / Room',
    spotsLeft: 8,
    totalRooms: 120,
    tagline: 'Balanced collaborative living for 2nd & 3rd year engineering scholars.',
    description: 'Equipped with mirrored dual study workstations, independent steel wardrobes, and wide balcony access overlooking the campus gardens.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
    ],
    dimensions: '210 sq.ft • Wide Garden Balcony',
    eligibility: '2nd & 3rd Year B.Tech Students (All Branches)',
    features: [
      'Dual Independent Study Desks & Pinboards',
      'Individual Steel Lockers & Book Racks',
      'Wi-Fi 6 Mesh + Dual LAN Ports',
      'Solar Heated Bathrooms & RO Water',
    ],
    inventory: {
      furniture: [
        '2× Engineered Solid Pine Single Beds',
        '2× Orthopedic Cotton-Felt Mattresses',
        '2× Study Tables (3.5ft × 2ft) with Felt Pinboards',
        '2× High-Back Stacking Study Chairs',
        '2× Individual Heavy-Duty Steel Almirahs',
      ],
      electricals: [
        '4× Dedicated Laptop/Mobile Power Outlets',
        'Dual LAN Ports + 1200 Mbps Wi-Fi 6 Access Point',
        'High-Speed Silent Sweep Ceiling Fan',
        'Individual Bedside Reading Spotlights',
      ],
      utilities: [
        'Attached Washroom with Solar Hot Water Line',
        'Daily Housekeeping & Floor Mopping',
        'RO Drinking Water Station on Every Wing Floor',
        'Balcony Clothes Drying Rack',
      ],
    },
  },
  {
    id: 'triple-undergrad',
    name: 'Standard Triple Pod Room',
    category: 'triple',
    wing: 'both',
    priceSemester: 18000,
    securityDeposit: 3000,
    occupancyLabel: '3 Students / Room',
    spotsLeft: 14,
    totalRooms: 90,
    tagline: 'Vibrant peer-learning environment ideal for first-year engineering undergraduates.',
    description: 'Spacious triple suite featuring three distinct study cubicles, dedicated lockable closets, high-speed campus Wi-Fi, and 24x7 solar water.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80',
    ],
    dimensions: '280 sq.ft • Triple Study Zone',
    eligibility: '1st & 2nd Year B.Tech Undergraduates',
    features: [
      '3× Ergonomic Study Pods with Book Shelves',
      '3× Personal Full-Size Steel Closets',
      '24/7 Security CCTV & Smart Card Access',
      'Daily Linen & Room Cleaning Service',
    ],
    inventory: {
      furniture: [
        '3× Solid Metal Single Beds with Underbed Drawers',
        '3× Form-Fit Comfort Mattresses with Waterproof Covers',
        '3× Independent Study Tables with Cork Notice Boards',
        '3× Sturdy Metal Frame Study Chairs',
        '3× Full-Length Steel Storage Lockers',
      ],
      electricals: [
        '6× Power Points (2 per student desk)',
        '3× Individual LED Study Lights',
        'Dual Ceiling Fans for complete airflow',
        'High-Speed Wi-Fi 6 Router Coverage',
      ],
      utilities: [
        '24/7 Hot Water via 5000L Solar Array',
        'Access to Floor Common Rooms & TV Lounge',
        'Weekly Bed-sheet & Pillowcase Exchange',
        'Emergency Fire Alarm & Smoke Detector',
      ],
    },
  },
];

export const HostelRoomsSection: React.FC = () => {
  const { openAuthModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'single' | 'twin' | 'triple'>('all');
  const [selectedWing, setSelectedWing] = useState<'both' | 'boys' | 'girls'>('both');
  const [activeModalRoom, setActiveModalRoom] = useState<HostelRoomType | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  const filteredRooms = HOSTEL_ROOMS.filter((room) => {
    if (selectedCategory !== 'all' && room.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section
      id="rooms-section"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-white/[0.08] font-body"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider font-mono mb-3.5">
            <Building className="w-3.5 h-3.5 text-pink-400" />
            <span>Sakhi Girls Hostel Accommodation</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold tracking-tight">
            Sakhi Girls Hostel Living Suites
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mt-3 leading-relaxed">
            Four residential floors dedicated to 1st, 2nd, 3rd, and 4th year female engineering scholars across CS, IT, ENTC, ELPO, CIVIL, and MECHANICAL branches at MCET Shegaon.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
          <div className="flex items-center p-1 rounded-2xl bg-[#111215] border border-white/[0.08] shadow-inner">
            {(['all', 'single', 'twin', 'triple'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-[0_0_14px_rgba(139,92,246,0.4)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat === 'all' ? 'All Layouts' : `${cat} Sharing`}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center p-1 rounded-2xl bg-[#111215] border border-pink-500/20">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-600/20 text-pink-300 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sakhi Girls Hostel (Floors 1-4)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Room Cards Grid */}
      <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredRooms.map((room, idx) => (
            <motion.div
              key={room.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              onMouseEnter={() => setHoveredRoomId(room.id)}
              onMouseLeave={() => setHoveredRoomId(null)}
              className="group relative rounded-3xl bg-[#111215] border border-white/[0.08] hover:border-violet-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)]"
            >
              {/* Image & Overlay Badges */}
              <div className="relative h-64 w-full bg-[#16181D] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111215] via-[#111215]/20 to-black/40 pointer-events-none" />

                {/* Price Pill */}
                <div className="absolute top-4 right-4 bg-[#111215]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.15] shadow-lg flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-sm text-white tracking-tight">
                    ₹{(room.priceSemester ?? 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">/ sem</span>
                </div>

                {/* Occupancy Badge */}
                <div className="absolute top-4 left-4 bg-violet-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold border border-violet-400/40 shadow-md flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{room.occupancyLabel}</span>
                </div>

                {/* Availability status bar */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-emerald-400 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{room.spotsLeft} Beds Available</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveModalRoom(room);
                      setActiveGalleryIndex(0);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-violet-300" />
                    <span>View Specs</span>
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  {/* Title & Tagline */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                      {room.name}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {room.description}
                  </p>

                  {/* Dimension & Eligibility Info */}
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px] text-zinc-400 space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{room.dimensions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-zinc-300 font-medium truncate">{room.eligibility}</span>
                    </div>
                  </div>

                  {/* Student Hostel Highlights */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold block">
                      Furnished Hostel Amenities:
                    </span>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs text-zinc-300">
                      {room.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveModalRoom(room);
                        setActiveGalleryIndex(0);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.1] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-violet-400" />
                      <span>Inventory Details</span>
                    </button>

                    <button
                      onClick={() => openAuthModal('student')}
                      className="w-full py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-[0_0_18px_rgba(139,92,246,0.35)] flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Apply Allotment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-zinc-500 font-mono">
                    Security Deposit: ₹{(room.securityDeposit ?? 0).toLocaleString('en-IN')} (Refundable)
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Campus Hostel Quality Standards Strip */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#111215] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-0.5">Gigabit LAN &amp; Wi-Fi 6</h4>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Every study desk has a dedicated RJ45 CAT6 port connected to campus fiber.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-0.5">Solar Hot Water Array</h4>
            <p className="text-[11px] text-zinc-400 leading-snug">
              5000L rooftop solar collectors providing thermostatic hot water 24×7.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-0.5">Biometric &amp; RFID Gates</h4>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Guarded 24×7 with automated curfew logging and QR gate pass verification.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-0.5">Dual UPS Generator</h4>
            <p className="text-[11px] text-zinc-400 leading-snug">
              100% uninterrupted study desk power backup during exam preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Room Inventory & Specifications Modal */}
      <AnimatePresence>
        {activeModalRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#111215] border border-white/[0.15] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-[#16181D]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                      Hostel Allotment Spec Sheet
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {activeModalRoom.occupancyLabel}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {activeModalRoom.name}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModalRoom(null)}
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Photo Gallery with Thumbnail switcher */}
                <div className="space-y-3">
                  <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-black relative border border-white/[0.1]">
                    <img
                      src={activeModalRoom.gallery[activeGalleryIndex] || activeModalRoom.image}
                      alt="Room Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white font-mono border border-white/10">
                      Photo {activeGalleryIndex + 1} of {activeModalRoom.gallery.length}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {activeModalRoom.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeGalleryIndex === idx
                            ? 'border-violet-500 scale-105 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                      Room Dimensions
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {activeModalRoom.dimensions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                      Semester Fee
                    </span>
                    <span className="text-xs font-semibold text-violet-400 font-mono">
                      ₹{(activeModalRoom.priceSemester ?? 0).toLocaleString('en-IN')} / semester
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                      Eligibility
                    </span>
                    <span className="text-xs font-semibold text-zinc-200">
                      {activeModalRoom.eligibility}
                    </span>
                  </div>
                </div>

                {/* Detailed Inventory Checklist */}
                <div className="space-y-4">
                  <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-400" />
                    <span>Standard Allotment Inventory Checklist</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Furniture */}
                    <div className="p-4 rounded-2xl bg-[#16181D] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-bold text-violet-300 block">
                        🪑 Furniture &amp; Bedding
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        {activeModalRoom.inventory.furniture.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Electricals */}
                    <div className="p-4 rounded-2xl bg-[#16181D] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-bold text-amber-300 block">
                        ⚡ Power &amp; Networking
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        {activeModalRoom.inventory.electricals.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Utilities */}
                    <div className="p-4 rounded-2xl bg-[#16181D] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-bold text-cyan-300 block">
                        🚿 Water &amp; Services
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        {activeModalRoom.inventory.utilities.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Campus Rules Notice */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-semibold">Hostel Code of Conduct:</strong> Night curfew is 09:30 PM. Silence hours are observed between 10:00 PM – 06:00 AM. Electric heaters/stoves are strictly prohibited.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/[0.08] bg-[#16181D] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-zinc-400 block">Ready to register for this room?</span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    {activeModalRoom.spotsLeft} Allotment Slots Open for Next Semester
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveModalRoom(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setActiveModalRoom(null);
                      openAuthModal('student');
                    }}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Student Allotment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
