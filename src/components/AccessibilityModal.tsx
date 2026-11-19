import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sliders,
  Type,
  Eye,
  Activity,
  Globe,
  Sun,
  Moon,
  Laptop,
  Wifi,
  WifiOff,
  Command,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../utils/translations';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const {
    themePreference,
    setThemePreference,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    textSize,
    setTextSize,
    language,
    setLanguage,
    isOnline,
    isOfflineSimulated,
    setIsOfflineSimulated,
    effectiveOffline,
    t,
  } = useApp();

  if (!isOpen) return null;

  const languages: { id: Language; label: string; sub: string }[] = [
    { id: 'en', label: 'English', sub: 'Campus Standard' },
    { id: 'hi', label: 'हिन्दी', sub: 'हिंदी संस्करण' },
    { id: 'mr', label: 'मराठी', sub: 'महाराष्ट्र स्थानिक' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg rounded-2xl bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#7B61FF]/10 text-[#7B61FF] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                  {t('settings')} &amp; Accessibility
                </h2>
                <p className="text-[11px] text-[#737684] dark:text-[#737684] light:text-[#7A8094]">
                  Personalize theme, display scale, languages, and offline resilience
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737684] hover:text-[#F7F6F2] dark:hover:text-[#F7F6F2] light:hover:text-[#181920] hover:bg-[#282A37]/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto text-xs">
            {/* 1. Theme Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span>{t('theme')}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: t('light'), icon: Sun },
                  { id: 'dark', label: t('dark'), icon: Moon },
                  { id: 'system', label: t('system'), icon: Laptop },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = themePreference === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setThemePreference(item.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#7B61FF]/10 border-[#7B61FF] text-[#7B61FF] font-semibold'
                          : 'bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060] hover:border-[#7B61FF]/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Text Scaling */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span>{t('textSize')}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: t('normalText'), sizeText: '100%' },
                  { id: 'large', label: t('largeText'), sizeText: '112%' },
                  { id: 'larger', label: t('largerText'), sizeText: '125%' },
                ].map((item) => {
                  const active = textSize === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTextSize(item.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#7B61FF]/10 border-[#7B61FF] text-[#7B61FF] font-semibold'
                          : 'bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060] hover:border-[#7B61FF]/40'
                      }`}
                    >
                      <span className="font-medium text-xs">{item.label}</span>
                      <span className="text-[10px] text-[#737684]">{item.sizeText}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Accessibility Toggles */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span>Accessibility Preferences</span>
              </label>
              <div className="space-y-2">
                {/* Reduced Motion */}
                <div className="p-3 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                      {t('reducedMotion')}
                    </p>
                    <p className="text-[11px] text-[#737684] dark:text-[#737684] light:text-[#7A8094]">
                      Minimizes animations and switches themes instantly without transitions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReducedMotion(!reducedMotion)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      reducedMotion ? 'bg-[#7B61FF]' : 'bg-[#282A37]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        reducedMotion ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* High Contrast */}
                <div className="p-3 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                      {t('highContrast')}
                    </p>
                    <p className="text-[11px] text-[#737684] dark:text-[#737684] light:text-[#7A8094]">
                      Increases contrast ratio of borders, text, and active indicators
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      highContrast ? 'bg-[#7B61FF]' : 'bg-[#282A37]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        highContrast ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Language Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span>{t('language')}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {languages.map((lang) => {
                  const active = language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#7B61FF]/10 border-[#7B61FF] text-[#7B61FF]'
                          : 'bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[#A7A9B6] dark:text-[#A7A9B6] light:text-[#4B5060] hover:border-[#7B61FF]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                          {lang.label}
                        </span>
                        {active && <Check className="w-3.5 h-3.5 text-[#7B61FF]" />}
                      </div>
                      <span className="text-[10px] text-[#737684] mt-1">{lang.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Offline Simulator */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#737684] dark:text-[#737684] light:text-[#7A8094] tracking-wider uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span>Offline Resilience Testing</span>
              </label>
              <div className="p-3 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                      Simulate Weak / No Cellular Reception
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
                        effectiveOffline
                          ? 'bg-[#F6B657]/10 text-[#F6B657] border border-[#F6B657]/20'
                          : 'bg-[#2DD4A8]/10 text-[#2DD4A8] border border-[#2DD4A8]/20'
                      }`}
                    >
                      {effectiveOffline ? 'Offline' : 'Online'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737684] dark:text-[#737684] light:text-[#7A8094]">
                    Tests automatic fallback to cached offline gate pass and emergency contacts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isOfflineSimulated ? 'bg-[#F6B657]' : 'bg-[#282A37]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isOfflineSimulated ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 6. Keyboard Shortcuts Quick Reference */}
            <div className="p-3.5 rounded-xl bg-[#101119] dark:bg-[#101119] light:bg-[#F6F6F9] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                <Command className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span>Keyboard Shortcuts</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between text-[#737684]">
                  <span>Universal Search</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[10px] text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] font-mono">
                    ⌘K / Ctrl+K
                  </kbd>
                </div>
                <div className="flex items-center justify-between text-[#737684]">
                  <span>Close Overlay</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[10px] text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] font-mono">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-xl bg-[#7B61FF] hover:bg-[#6A4FE8] text-white text-xs font-medium cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
