import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  LayoutDashboard,
  BedDouble,
  QrCode,
  Wrench,
  Utensils,
  ClipboardCheck,
  CreditCard,
  Megaphone,
  User,
  Sliders,
  Sun,
  Moon,
  WifiOff,
  Eye,
  ArrowRight,
  Sparkles,
  Command,
  FileText,
  Database,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaletteItem {
  id: string;
  category: 'Pages' | 'Actions' | 'Notices' | 'Meals';
  title: string;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  onSelect: () => void;
  badge?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    toggleTheme,
    effectiveTheme,
    setIsOfflinePassModalOpen,
    setIsOfflineSimulated,
    isOfflineSimulated,
    setHighContrast,
    highContrast,
    reducedMotion,
    notices,
    weeklyMenu,
    t,
    setIsDbmsModalOpen,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Build searchable items
  const allItems: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [
      // Navigation Pages
      {
        id: 'nav-overview',
        category: 'Pages',
        title: "Today's Schedule & Overview",
        subtitle: 'Calm timeline, curfew countdown, daily meals',
        icon: LayoutDashboard,
        onSelect: () => {
          setActiveTab('overview');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-room',
        category: 'Pages',
        title: 'My Room & Allocation',
        subtitle: 'Room assignment, bed number, amenities',
        icon: BedDouble,
        onSelect: () => {
          setActiveTab('room');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-leave',
        category: 'Pages',
        title: 'Digital Gate Passes',
        subtitle: 'Apply for leave, view active passes, curfew check',
        icon: QrCode,
        onSelect: () => {
          setActiveTab('leave');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-complaints',
        category: 'Pages',
        title: 'Maintenance & Complaints',
        subtitle: 'Report electrical, plumbing, or room issues',
        icon: Wrench,
        onSelect: () => {
          setActiveTab('complaints');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-mess',
        category: 'Pages',
        title: 'Mess Menu & Food Services',
        subtitle: 'Weekly dining menu, dietary options, timings',
        icon: Utensils,
        onSelect: () => {
          setActiveTab('mess');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-attendance',
        category: 'Pages',
        title: 'Meal Attendance Tracking',
        subtitle: 'Mark attendance for breakfast, lunch, and dinner',
        icon: ClipboardCheck,
        onSelect: () => {
          setActiveTab('attendance');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-fees',
        category: 'Pages',
        title: 'Hostel Fees & Invoices',
        subtitle: 'View term dues, outstanding amounts, fee receipts',
        icon: CreditCard,
        onSelect: () => {
          setActiveTab('fees');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-notices',
        category: 'Pages',
        title: 'Notice Board & Circulars',
        subtitle: 'Warden announcements, quiet hours, exam circulars',
        icon: Megaphone,
        onSelect: () => {
          setActiveTab('notices');
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'nav-profile',
        category: 'Pages',
        title: 'Student Profile & Preferences',
        subtitle: 'Emergency contacts, personal info, theme settings',
        icon: User,
        onSelect: () => {
          setActiveTab('profile');
          setIsCommandPaletteOpen(false);
        },
      },

      // Contextual Actions
      {
        id: 'action-dbms-sandbox',
        category: 'Actions',
        title: 'Open DBMS Project Schema & Live SQL Sandbox',
        subtitle: 'Interactive relational tables, ER diagram, SQL runner & schema.sql download',
        icon: Database,
        badge: 'Academic DBMS',
        onSelect: () => {
          setIsCommandPaletteOpen(false);
          setIsDbmsModalOpen(true);
        },
      },
      {
        id: 'action-offline-pass',
        category: 'Actions',
        title: 'Show Offline Digital Gate Pass',
        subtitle: 'Display pass with verification QR and emergency contacts',
        icon: QrCode,
        badge: 'Offline Ready',
        onSelect: () => {
          setIsCommandPaletteOpen(false);
          setIsOfflinePassModalOpen(true);
        },
      },
      {
        id: 'action-toggle-theme',
        category: 'Actions',
        title: `Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} Theme`,
        subtitle: 'Seamless light and dark mode with editorial styling',
        icon: effectiveTheme === 'dark' ? Sun : Moon,
        onSelect: () => {
          toggleTheme();
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'action-toggle-offline',
        category: 'Actions',
        title: isOfflineSimulated ? 'Disable Offline Simulation' : 'Simulate Offline Weak Internet Mode',
        subtitle: 'Tests cached pass resilience for campus security checkpoints',
        icon: WifiOff,
        badge: isOfflineSimulated ? 'Active' : undefined,
        onSelect: () => {
          setIsOfflineSimulated(!isOfflineSimulated);
          setIsCommandPaletteOpen(false);
        },
      },
      {
        id: 'action-toggle-contrast',
        category: 'Actions',
        title: highContrast ? 'Disable High Contrast Mode' : 'Enable High Contrast Mode',
        subtitle: 'Enhance border and text contrast for higher readability',
        icon: Eye,
        onSelect: () => {
          setHighContrast(!highContrast);
          setIsCommandPaletteOpen(false);
        },
      },
    ];

    // Add search hits from active Notices
    notices.forEach((n) => {
      list.push({
        id: `notice-${n.id}`,
        category: 'Notices',
        title: n.title,
        subtitle: `${n.category} • ${n.datePublished} • ${n.priority}`,
        icon: FileText,
        badge: n.priority,
        onSelect: () => {
          setActiveTab('notices');
          setIsCommandPaletteOpen(false);
        },
      });
    });

    // Add search hits from Mess Dishes
    weeklyMenu.forEach((day) => {
      ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((mealKey) => {
        const meal = (day as any)[mealKey];
        if (meal && meal.items) {
          list.push({
            id: `meal-${day.dayOfWeek}-${mealKey}`,
            category: 'Meals',
            title: `${day.dayOfWeek} ${mealKey.toUpperCase()}: ${meal.items.slice(0, 3).join(', ')}`,
            subtitle: `${meal.time} • ${meal.isVeg ? 'Pure Veg' : 'Non-Veg'}`,
            icon: Utensils,
            onSelect: () => {
              setActiveTab('mess');
              setIsCommandPaletteOpen(false);
            },
          });
        }
      });
    });

    return list;
  }, [
    effectiveTheme,
    isOfflineSimulated,
    highContrast,
    notices,
    weeklyMenu,
    setActiveTab,
    toggleTheme,
    setIsOfflinePassModalOpen,
    setIsOfflineSimulated,
    setHighContrast,
    setIsCommandPaletteOpen,
  ]);

  // Filtered by query
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [allItems, query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-black/75 backdrop-blur-sm"
        onClick={() => setIsCommandPaletteOpen(false)}
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl rounded-2xl bg-[#171923] dark:bg-[#171923] light:bg-[#FFFFFF] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="p-4 border-b border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center gap-3">
            <Search className="w-5 h-5 text-[#737684] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-sm text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920] placeholder-[#737684] focus:outline-none font-medium"
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#101119] dark:bg-[#101119] light:bg-[#F0F2F6] border border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] text-[10px] text-[#737684] font-mono shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="py-10 text-center space-y-1.5">
                <Search className="w-8 h-8 text-[#737684] mx-auto opacity-40" />
                <p className="text-xs font-medium text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]">
                  No matching results found for "{query}"
                </p>
                <p className="text-[11px] text-[#737684]">
                  Try searching for 'pass', 'room', 'curfew', 'dinner', or 'wifi'.
                </p>
              </div>
            ) : (
              filtered.map((item, index) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onSelect}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#7B61FF]/15 border border-[#7B61FF]/30'
                        : 'border border-transparent hover:bg-[#101119] dark:hover:bg-[#101119] light:hover:bg-[#F6F6F9]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#7B61FF] text-white'
                            : 'bg-[#101119] dark:bg-[#101119] light:bg-[#F0F2F6] text-[#737684]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium truncate ${
                              isSelected
                                ? 'text-[#7B61FF] font-semibold'
                                : 'text-[#F7F6F2] dark:text-[#F7F6F2] light:text-[#181920]'
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#7B61FF]/15 text-[#7B61FF] border border-[#7B61FF]/30 font-medium">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-[11px] text-[#737684] truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#737684] font-medium hidden sm:inline">
                        {item.category}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected
                            ? 'text-[#7B61FF] translate-x-0.5'
                            : 'text-transparent'
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Footer hints */}
          <div className="px-4 py-2.5 border-t border-[#282A37] dark:border-[#282A37] light:border-[#E2E4EB] flex items-center justify-between text-[10px] text-[#737684]">
            <div className="flex items-center gap-3">
              <span>Navigate <kbd className="font-mono">↑↓</kbd></span>
              <span>Select <kbd className="font-mono">↵</kbd></span>
              <span>Dismiss <kbd className="font-mono">ESC</kbd></span>
            </div>
            <span className="font-mono">Universal Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
