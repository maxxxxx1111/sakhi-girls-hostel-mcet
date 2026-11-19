import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeToggleProps {
  showDropdown?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showDropdown = true,
  className = '',
}) => {
  const { themePreference, effectiveTheme, setThemePreference, toggleTheme, reducedMotion, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const options: { id: 'light' | 'dark' | 'system'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'light', label: t('light'), icon: Sun },
    { id: 'dark', label: t('dark'), icon: Moon },
    { id: 'system', label: t('system'), icon: Laptop },
  ];

  const handleSelect = (mode: 'light' | 'dark' | 'system') => {
    setThemePreference(mode);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        id="theme-toggle-btn"
        type="button"
        onClick={() => {
          if (showDropdown) {
            setIsOpen(!isOpen);
          } else {
            toggleTheme();
          }
        }}
        aria-label={`Theme switch (Current: ${themePreference})`}
        title={`Theme: ${themePreference === 'system' ? 'Device Setting' : themePreference} (${effectiveTheme} active)`}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] hover:border-[#7B61FF]/50 transition-colors cursor-pointer select-none relative overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {effectiveTheme === 'dark' ? (
            <motion.div
              key="moon"
              initial={reducedMotion ? false : { rotate: -45, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { rotate: 45, scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-[#F6B657]"
            >
              <Moon className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={reducedMotion ? false : { rotate: 45, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { rotate: -45, scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-[#D97706]"
            >
              <Sun className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && isOpen && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-48 py-1.5 rounded-2xl bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] shadow-xl z-50 text-xs font-medium backdrop-blur-md"
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase">
            {t('theme')}
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = themePreference === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-[#7B61FF] bg-[#7B61FF]/10 font-semibold'
                    : 'text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060] hover:text-[#F7F6F2] dark:hover:text-[#F7F6F2] light:hover:text-[#181920] hover:bg-[#101119] dark:hover:bg-[#101119] light:hover:bg-[#F0F2F6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#7B61FF]' : 'text-[#737684]'}`} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#7B61FF]" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
