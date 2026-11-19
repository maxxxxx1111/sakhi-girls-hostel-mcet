import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Lightbulb, CheckCircle2, ShieldCheck, Sun, Moon } from 'lucide-react';

interface IsometricRoomVisualProps {
  roomNumber: string;
  bedNumber: string;
  hostelName?: string;
  roomType?: string;
  status?: string;
}

export const IsometricRoomVisual: React.FC<IsometricRoomVisualProps> = ({
  roomNumber,
  bedNumber,
  hostelName = 'Sakhi Girls Hostel',
  roomType = 'Classic Twin Suite',
  status = 'Cleaned & Ready',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isLampOn, setIsLampOn] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Determine if it's currently evening/night
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 19 || currentHour < 6;

  // IntersectionObserver to pause mouse tilt when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !isVisible || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      // Restrain tilt to a strict max 5 degrees
      setTilt({
        x: Math.round(-y * 8 * 10) / 10,
        y: Math.round(x * 8 * 10) / 10,
      });
    },
    [shouldReduceMotion, isVisible]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[270px] sm:h-[310px] rounded-2xl bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] p-4 flex flex-col justify-between overflow-hidden select-none transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] light:hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:border-[#7B61FF]/40"
      style={{ perspective: '1000px' }}
      aria-label={`Interactive isometric view of Room ${roomNumber}`}
    >
      {/* Subtle Ambient Room Glow */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
        style={{
          backgroundColor: isLampOn
            ? 'rgba(123, 97, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.02)',
        }}
      />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between text-xs text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2DD4A8] animate-pulse" />
          <span className="font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] font-mono">Room {roomNumber}</span>
          <span className="text-[#737684] dark:text-[#737684] light:text-[#A7A9B6]">•</span>
          <span className="text-[11px] font-mono">{bedNumber}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsLampOn(!isLampOn)}
            className="px-2.5 py-1 rounded-lg bg-[#101119] dark:bg-[#101119] light:bg-[#F0F2F6] hover:bg-[#282A37] dark:hover:bg-[#282A37] light:hover:bg-[#E2E4EB] text-[11px] text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060] hover:text-[#F7F6F2] dark:hover:text-[#F7F6F2] light:hover:text-[#181920] flex items-center gap-1.5 transition-colors cursor-pointer border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB]"
            title="Toggle desk lamp"
          >
            <Lightbulb
              className={`w-3 h-3 ${
                isLampOn ? 'text-[#F6B657] fill-[#F6B657]' : 'text-[#737684]'
              }`}
            />
            <span className="hidden sm:inline font-medium">{isLampOn ? 'Desk Lamp on' : 'Lamp off'}</span>
          </button>

          <span className="px-2 py-1 rounded-lg bg-[#101119] dark:bg-[#101119] light:bg-[#F0F2F6] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[10px] font-mono text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060] flex items-center gap-1">
            {isNight ? <Moon className="w-2.5 h-2.5 text-[#7B61FF]" /> : <Sun className="w-2.5 h-2.5 text-[#F6B657]" />}
            <span>{isNight ? 'Evening' : 'Daylight'}</span>
          </span>
        </div>
      </div>

      {/* 2.5D Isometric Render Container */}
      <div className="relative flex-1 flex items-center justify-center my-1">
        <motion.div
          animate={
            shouldReduceMotion
              ? { rotateX: 0, rotateY: 0 }
              : { rotateX: tilt.x, rotateY: tilt.y }
          }
          transition={{ type: 'spring', damping: 20, stiffness: 120, mass: 0.6 }}
          className="relative w-full max-w-[340px] h-[190px] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Layered SVG Room Scene */}
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Floor Gradient */}
              <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E202C" />
                <stop offset="100%" stopColor="#14151E" />
              </linearGradient>

              {/* Left Wall Gradient */}
              <linearGradient id="leftWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#252737" />
                <stop offset="100%" stopColor="#1B1C26" />
              </linearGradient>

              {/* Right Wall Gradient */}
              <linearGradient id="rightWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C1E2A" />
                <stop offset="100%" stopColor="#12131C" />
              </linearGradient>

              {/* Window Gradient */}
              <linearGradient id="windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isNight ? '#1E1B4B' : '#60A5FA'} />
                <stop offset="100%" stopColor={isNight ? '#0F172A' : '#93C5FD'} />
              </linearGradient>

              {/* Lamp Light Glow */}
              <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* BASE FLOOR (Isometric Diamond) */}
            <polygon
              points="200,80 360,165 200,235 40,165"
              fill="url(#floorGrad)"
              stroke="#2E3142"
              strokeWidth="1.5"
            />

            {/* Floor Isometric Tiles (Subtle Grid) */}
            <line x1="120" y1="122.5" x2="280" y2="200" stroke="#262837" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="280" y1="122.5" x2="120" y2="200" stroke="#262837" strokeWidth="1" strokeDasharray="3 3" />

            {/* BACK LEFT WALL */}
            <polygon
              points="40,165 40,65 200,10 200,80"
              fill="url(#leftWallGrad)"
              stroke="#2E3142"
              strokeWidth="1.5"
            />

            {/* BACK RIGHT WALL */}
            <polygon
              points="200,80 200,10 360,65 360,165"
              fill="url(#rightWallGrad)"
              stroke="#2E3142"
              strokeWidth="1.5"
            />

            {/* WINDOW ON RIGHT WALL */}
            <polygon
              points="240,60 310,85 310,120 240,95"
              fill="url(#windowGrad)"
              stroke="#383B4F"
              strokeWidth="1.5"
            />
            {/* Window frame cross */}
            <line x1="275" y1="72.5" x2="275" y2="107.5" stroke="#383B4F" strokeWidth="1.5" />
            <line x1="240" y1="77.5" x2="310" y2="102.5" stroke="#383B4F" strokeWidth="1.5" />

            {/* BED 1 (Left Side - Assigned Bed) */}
            <g id="isometric-bed-1">
              {/* Bed Frame Top Base */}
              <polygon
                points="75,145 145,110 185,130 115,165"
                fill="#2A2D3E"
                stroke="#373B50"
                strokeWidth="1"
              />
              {/* Bed Mattress */}
              <polygon
                points="80,142 140,112 178,131 118,161"
                fill="#3B3F56"
                stroke="#494E6B"
                strokeWidth="1"
              />
              {/* Quilt / Duvet */}
              <polygon
                points="95,150 140,127 178,131 118,161"
                fill="#7765F6"
                fillOpacity="0.85"
              />
              {/* Pillow */}
              <polygon
                points="88,136 112,124 125,130 101,142"
                fill="#E4E4E7"
                stroke="#CBD5E1"
                strokeWidth="0.8"
              />
              {/* Bed Headboard */}
              <polygon
                points="65,135 65,115 135,80 135,100"
                fill="#1E202D"
                stroke="#2F3346"
                strokeWidth="1"
              />
              {/* Small Tag on Bed */}
              <rect x="95" y="166" width="36" height="12" rx="4" fill="#151720" stroke="#7765F6" strokeWidth="0.8" />
              <text x="113" y="174.5" fill="#F6F4F1" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                {bedNumber}
              </text>
            </g>

            {/* STUDY DESK & LAMP (Center-Right) */}
            <g id="isometric-desk">
              {/* Desk Top */}
              <polygon
                points="210,140 270,110 295,122 235,152"
                fill="#272A3A"
                stroke="#393D53"
                strokeWidth="1"
              />
              {/* Desk Legs */}
              <line x1="210" y1="140" x2="210" y2="162" stroke="#1F212E" strokeWidth="2.5" />
              <line x1="235" y1="152" x2="235" y2="174" stroke="#1F212E" strokeWidth="2.5" />
              <line x1="295" y1="122" x2="295" y2="144" stroke="#1F212E" strokeWidth="2.5" />

              {/* Laptop on desk */}
              <polygon points="230,136 248,127 256,131 238,140" fill="#64748B" />
              <polygon points="248,127 248,118 256,122 256,131" fill="#7765F6" fillOpacity="0.7" />

              {/* Desk Lamp */}
              <circle cx="272" cy="115" r="2.5" fill="#F59E0B" />
              <line x1="272" y1="115" x2="268" y2="104" stroke="#D97706" strokeWidth="1.5" />
              <path d="M 265 104 Q 268 100 272 104 Z" fill="#FBBF24" />

              {/* Warm Lamp Glow Pool (if toggled on) */}
              {isLampOn && (
                <ellipse cx="250" cy="142" rx="28" ry="14" fill="url(#lampGlow)" />
              )}
            </g>

            {/* STUDY CHAIR */}
            <g id="isometric-chair">
              <polygon points="215,160 230,152 240,157 225,165" fill="#3A3E54" />
              <polygon points="215,160 215,148 230,140 230,152" fill="#2E3144" />
              <line x1="225" y1="165" x2="225" y2="182" stroke="#1E202B" strokeWidth="2" />
            </g>

            {/* ROOM DOOR CORRIDOR ARCH (Left Wall Edge) */}
            <polygon
              points="45,150 45,85 75,70 75,135"
              fill="#14151F"
              stroke="#2E3245"
              strokeWidth="1"
            />
            <line x1="72" y1="108" x2="72" y2="112" stroke="#7765F6" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[11px] pt-2.5 border-t border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4A8]" />
          <span className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">{status}</span>
        </div>
        <span className="font-mono text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#7A8094] text-[10px]">{roomType}</span>
      </div>
    </div>
  );
};
