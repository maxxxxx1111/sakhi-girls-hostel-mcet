import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Warden,
  Hostel,
  Room,
  LeaveRequest,
  Complaint,
  DayMenu,
  MealAttendanceRecord,
  MessFeedback,
  InventoryItem,
  MessExpense,
  FeeRecord,
  Notice,
  AppNotification,
  UserRole,
  LeaveStatus,
  ComplaintStatus,
  SOSAlert,
  RoomChangeRequest,
  GateLogEntry,
} from '../types';
import {
  INITIAL_HOSTELS,
  INITIAL_STUDENTS,
  INITIAL_WARDENS,
  INITIAL_ROOMS,
  INITIAL_LEAVES,
  INITIAL_COMPLAINTS,
  INITIAL_WEEKLY_MENU,
  INITIAL_MEAL_ATTENDANCE,
  INITIAL_MESS_FEEDBACKS,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
  INITIAL_FEES,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ROOM_CHANGES,
  INITIAL_GATE_LOGS,
} from '../data/mockData';
import { Language, TranslationDict, TRANSLATIONS } from '../utils/translations';

export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';
export type TextSize = 'normal' | 'large' | 'larger';

interface AppContextType {
  role: UserRole | null;
  currentUser: Student | Warden | null;
  currentStudent: Student | null;
  currentWarden: Warden | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthModalOpen: boolean;
  authModalRole: UserRole;
  openAuthModal: (role?: UserRole) => void;
  closeAuthModal: () => void;
  isSOSModalOpen: boolean;
  setIsSOSModalOpen: (open: boolean) => void;

  // Theme & Personalization
  themePreference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;

  // Accessibility Preferences
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;

  // Multilingual Support
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDict) => string;

  // Offline & Connectivity
  isOnline: boolean;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (simulated: boolean) => void;
  effectiveOffline: boolean;
  isOfflinePassModalOpen: boolean;
  setIsOfflinePassModalOpen: (open: boolean) => void;

  // Command Palette / Universal Quick Search
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // DBMS Project Showcase Modal
  isDbmsModalOpen: boolean;
  setIsDbmsModalOpen: (open: boolean) => void;

  login: (role: UserRole, idOrEnrollment: string, pass?: string) => boolean;

  registerStudent: (data: {
    name: string;
    studentId?: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    course?: string;
    department?: string;
    year?: string;
    division?: string;
    mobile?: string;
    parentName?: string;
    parentPhone?: string;
    emergencyContact?: string;
    roomType?: string;
    bloodGroup?: string;
    address?: string;
  }) => Student;
  logout: () => void;
  switchDemoUser: (role: UserRole, id: string) => void;

  // Data collections
  hostels: Hostel[];
  students: Student[];
  wardens: Warden[];
  rooms: Room[];
  leaveRequests: LeaveRequest[];
  complaints: Complaint[];
  weeklyMenu: DayMenu[];
  mealAttendance: MealAttendanceRecord[];
  messFeedbacks: MessFeedback[];
  inventory: InventoryItem[];
  expenses: MessExpense[];
  fees: FeeRecord[];
  notices: Notice[];
  notifications: AppNotification[];
  sosAlerts: SOSAlert[];
  roomChangeRequests: RoomChangeRequest[];
  gateLogs: GateLogEntry[];

  // Student Actions
  applyLeave: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => void;
  applyRoomChange: (req: Omit<RoomChangeRequest, 'id' | 'status' | 'appliedDate'>) => void;
  submitComplaint: (comp: Omit<Complaint, 'id' | 'status' | 'dateSubmitted'>) => void;
  rateComplaint: (complaintId: string, rating: number, feedback?: string) => void;
  reopenComplaint: (complaintId: string, reason: string) => void;
  submitMessFeedback: (feedback: Omit<MessFeedback, 'id' | 'date'>) => void;
  toggleMealAttendance: (date: string, meal: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => void;
  triggerSOS: (note?: string) => void;

  // Warden Actions
  updateLeaveStatus: (leaveId: string, status: LeaveStatus, remarks?: string) => void;
  bulkApproveLeaves: (leaveIds: string[], remarks?: string) => void;
  bulkRejectLeaves: (leaveIds: string[], reason: string) => void;
  verifyParentCall: (leaveId: string, contactPerson: string, notes: string) => void;
  recordGateAction: (gatePassCode: string, action: 'Departure' | 'Return', remarks?: string) => GateLogEntry | null;
  reviewRoomChange: (id: string, status: 'Approved' | 'Rejected', remarks?: string) => void;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, remarks?: string, assignedTo?: string) => void;
  updateDayMenu: (updatedDay: DayMenu) => void;
  quickUpdateMeal: (dayOfWeek: DayMenu['dayOfWeek'], mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner', items: string[]) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  assignStudentToBed: (roomId: string, bedId: string, studentId: string) => void;
  vacateBed: (roomId: string, bedId: string) => void;
  updateRoomStatus: (roomId: string, status: Room['status']) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  updateInventoryStock: (itemId: string, newStock: number) => void;
  addExpense: (expense: Omit<MessExpense, 'id'>) => void;
  recordFeePayment: (studentId: string, amount: number, mode: string, txnRef: string) => void;
  publishNotice: (notice: Omit<Notice, 'id' | 'datePublished'>) => void;
  deleteNotice: (id: string) => void;
  sendNotification: (ntf: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resolveSOS: (id: string) => void;
  resetAllDataToDefaults: () => void;

  // Convenience aliases and action helpers
  logComplaint: (comp: Omit<Complaint, 'id' | 'status' | 'dateSubmitted'>) => void;
  payStudentFee: (feeId: string, amount: number) => void;
  approveLeave: (leaveId: string, remarks?: string) => void;
  rejectLeave: (leaveId: string, remarks?: string) => void;
  resolveComplaint: (complaintId: string, remarks?: string) => void;
  assignComplaint: (complaintId: string, assignedTo: string) => void;
  logExpense: (expense: Omit<MessExpense, 'id'>) => void;
  createNotice: (notice: Omit<Notice, 'id' | 'datePublished'>) => void;
  updateDailyMenu: (updatedDay: DayMenu) => void;
  messMenu: DayMenu[];
  messInventory: InventoryItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'MCET_SAKHI_HOSTEL_V1_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(() => loadStorage<UserRole | null>('CURRENT_ROLE', 'student'));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => loadStorage<string | null>('CURRENT_USER_ID', INITIAL_STUDENTS[0]?.id || null));
  const [activeTab, setActiveTab] = useState<string>(() => loadStorage<string>('ACTIVE_TAB', 'overview'));

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('student');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);

  // Collections
  const [hostels, setHostels] = useState<Hostel[]>(() => loadStorage('HOSTELS', INITIAL_HOSTELS));
  const [students, setStudents] = useState<Student[]>(() => loadStorage('STUDENTS', INITIAL_STUDENTS));
  const [wardens, setWardens] = useState<Warden[]>(() => loadStorage('WARDENS', INITIAL_WARDENS));
  const [rooms, setRooms] = useState<Room[]>(() => loadStorage('ROOMS', INITIAL_ROOMS));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => loadStorage('LEAVES', INITIAL_LEAVES));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadStorage('COMPLAINTS', INITIAL_COMPLAINTS));
  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>(() => loadStorage('MENU', INITIAL_WEEKLY_MENU));
  const [mealAttendance, setMealAttendance] = useState<MealAttendanceRecord[]>(() => loadStorage('MEAL_ATTENDANCE', INITIAL_MEAL_ATTENDANCE));
  const [messFeedbacks, setMessFeedbacks] = useState<MessFeedback[]>(() => loadStorage('FEEDBACKS', INITIAL_MESS_FEEDBACKS));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadStorage('INVENTORY', INITIAL_INVENTORY));
  const [expenses, setExpenses] = useState<MessExpense[]>(() => loadStorage('EXPENSES', INITIAL_EXPENSES));
  const [fees, setFees] = useState<FeeRecord[]>(() => loadStorage('FEES', INITIAL_FEES));
  const [notices, setNotices] = useState<Notice[]>(() => loadStorage('NOTICES', INITIAL_NOTICES));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadStorage('NOTIFICATIONS', INITIAL_NOTIFICATIONS));
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(() => loadStorage('SOS_ALERTS', []));
  const [roomChangeRequests, setRoomChangeRequests] = useState<RoomChangeRequest[]>(() =>
    loadStorage('ROOM_CHANGES', INITIAL_ROOM_CHANGES)
  );
  const [gateLogs, setGateLogs] = useState<GateLogEntry[]>(() =>
    loadStorage('GATE_LOGS', INITIAL_GATE_LOGS)
  );

  // 1. Theme State & Personalization - Default to cinematic dark
  const getSystemTheme = (): EffectiveTheme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    return loadStorage<ThemePreference>('THEME_PREFERENCE', 'dark');
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    const saved = loadStorage<ThemePreference>('THEME_PREFERENCE', 'dark');
    return saved === 'system' ? getSystemTheme() : (saved || 'dark');
  });

  // 2. Accessibility Preferences
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const saved = loadStorage<boolean | null>('REDUCED_MOTION', null);
    if (saved !== null) return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => 
    loadStorage<boolean>('HIGH_CONTRAST', false)
  );

  const [textSize, setTextSize] = useState<TextSize>(() => 
    loadStorage<TextSize>('TEXT_SIZE', 'normal')
  );

  // 3. Multilingual Support
  const [language, setLanguage] = useState<Language>(() => 
    loadStorage<Language>('LANGUAGE', 'en')
  );

  // 4. Offline Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const effectiveOffline = !isOnline || isOfflineSimulated;

  const [isOfflinePassModalOpen, setIsOfflinePassModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isDbmsModalOpen, setIsDbmsModalOpen] = useState<boolean>(false);

  // Apply theme with smooth transition
  const applyThemeToDOM = (theme: EffectiveTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (!reducedMotion) {
      root.classList.add('theme-transitioning');
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 240);
    }
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  };

  // Sync theme preference changes
  useEffect(() => {
    saveStorage('THEME_PREFERENCE', themePreference);
    const resolved = themePreference === 'system' ? getSystemTheme() : themePreference;
    setEffectiveTheme(resolved);
    applyThemeToDOM(resolved);
  }, [themePreference]);

  // Listen to OS system color scheme changes if set to 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (themePreference === 'system') {
        const nextTheme: EffectiveTheme = e.matches ? 'dark' : 'light';
        setEffectiveTheme(nextTheme);
        applyThemeToDOM(nextTheme);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themePreference, reducedMotion]);

  // Sync Accessibility Classes to DOM
  useEffect(() => {
    saveStorage('REDUCED_MOTION', reducedMotion);
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    saveStorage('HIGH_CONTRAST', highContrast);
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    saveStorage('TEXT_SIZE', textSize);
    const root = document.documentElement;
    root.classList.remove('text-size-large', 'text-size-larger');
    if (textSize === 'large') root.classList.add('text-size-large');
    if (textSize === 'larger') root.classList.add('text-size-larger');
  }, [textSize]);

  useEffect(() => {
    saveStorage('LANGUAGE', language);
  }, [language]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Cache essential offline pass & emergency contacts in localStorage for weak internet resilience
  useEffect(() => {
    const student = students[0];
    const activeLeave = leaveRequests.find((l) => l.studentId === student?.id && l.status === 'Approved');
    const emergencyInfo = {
      student,
      activeLeave,
      wardenPhone: '+91 94220 11223',
      mainGateSecurity: '+91 94220 55443',
      campusAmbulance: '+91 94220 99911',
      lastCachedAt: new Date().toISOString(),
    };
    saveStorage('OFFLINE_EMERGENCY_CACHE', emergencyInfo);
  }, [students, leaveRequests]);

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
  };

  const toggleTheme = () => {
    const next: ThemePreference = effectiveTheme === 'dark' ? 'light' : 'dark';
    setThemePreferenceState(next);
  };

  const toggleCommandPalette = () => {
    setIsCommandPaletteOpen((prev) => !prev);
  };

  const t = (key: keyof TranslationDict): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || (key as string);
  };


  // Sync to localStorage
  useEffect(() => saveStorage('CURRENT_ROLE', role), [role]);
  useEffect(() => saveStorage('CURRENT_USER_ID', currentUserId), [currentUserId]);
  useEffect(() => saveStorage('ACTIVE_TAB', activeTab), [activeTab]);
  useEffect(() => saveStorage('HOSTELS', hostels), [hostels]);
  useEffect(() => saveStorage('STUDENTS', students), [students]);
  useEffect(() => saveStorage('WARDENS', wardens), [wardens]);
  useEffect(() => saveStorage('ROOMS', rooms), [rooms]);
  useEffect(() => saveStorage('LEAVES', leaveRequests), [leaveRequests]);
  useEffect(() => saveStorage('COMPLAINTS', complaints), [complaints]);
  useEffect(() => saveStorage('MENU', weeklyMenu), [weeklyMenu]);
  useEffect(() => saveStorage('MEAL_ATTENDANCE', mealAttendance), [mealAttendance]);
  useEffect(() => saveStorage('FEEDBACKS', messFeedbacks), [messFeedbacks]);
  useEffect(() => saveStorage('INVENTORY', inventory), [inventory]);
  useEffect(() => saveStorage('EXPENSES', expenses), [expenses]);
  useEffect(() => saveStorage('FEES', fees), [fees]);
  useEffect(() => saveStorage('NOTICES', notices), [notices]);
  useEffect(() => saveStorage('NOTIFICATIONS', notifications), [notifications]);
  useEffect(() => saveStorage('SOS_ALERTS', sosAlerts), [sosAlerts]);
  useEffect(() => saveStorage('ROOM_CHANGES', roomChangeRequests), [roomChangeRequests]);
  useEffect(() => saveStorage('GATE_LOGS', gateLogs), [gateLogs]);

  // Current active user object
  const currentStudent = role === 'student' ? students.find((s) => s.id === currentUserId || s.studentId === currentUserId) || students[0] : null;
  const currentWarden = role === 'warden' ? wardens.find((w) => w.id === currentUserId || w.wardenId === currentUserId) || wardens[0] : null;
  const currentUser = role === 'student' ? currentStudent : currentWarden;

  const openAuthModal = (targetRole: UserRole = 'student') => {
    setAuthModalRole(targetRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (selectedRole: UserRole, idOrEnrollment: string): boolean => {
    const query = idOrEnrollment.trim().toUpperCase();
    if (selectedRole === 'student') {
      const found = students.find((s) => s.studentId.toUpperCase() === query || s.id === idOrEnrollment || s.email.toLowerCase() === idOrEnrollment.toLowerCase());
      if (found) {
        setRole('student');
        setCurrentUserId(found.id);
        setActiveTab('overview');
        setIsAuthModalOpen(false);
        return true;
      }
      // Fallback demo login if typed loosely
      const demoStd = students[0];
      setRole('student');
      setCurrentUserId(demoStd.id);
      setActiveTab('overview');
      setIsAuthModalOpen(false);
      return true;
    } else {
      const found = wardens.find((w) => w.wardenId.toUpperCase() === query || w.id === idOrEnrollment || w.email.toLowerCase() === idOrEnrollment.toLowerCase());
      if (found) {
        setRole('warden');
        setCurrentUserId(found.id);
        setActiveTab('overview');
        setIsAuthModalOpen(false);
        return true;
      }
      // Fallback warden
      const demoWarden = wardens[0];
      setRole('warden');
      setCurrentUserId(demoWarden.id);
      setActiveTab('overview');
      setIsAuthModalOpen(false);
      return true;
    }
  };

  const registerStudent = (data: {
    name: string;
    studentId?: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    course?: string;
    department?: string;
    year?: string;
    division?: string;
    mobile?: string;
    parentName?: string;
    parentPhone?: string;
    emergencyContact?: string;
    roomType?: string;
    bloodGroup?: string;
    address?: string;
  }): Student => {
    const targetHostel = hostels[0] || INITIAL_HOSTELS[0];
    
    // Auto-generate realistic PRN if not supplied
    const deptPrefix = data.department?.includes('Computer') || data.department?.includes('CSE') ? 'CS' : data.department?.includes('Information') || data.department?.includes('IT') ? 'IT' : data.department?.includes('Telecommunication') || data.department?.includes('ENTC') ? 'ET' : data.department?.includes('Power') || data.department?.includes('ELPO') ? 'EP' : data.department?.includes('Civil') ? 'CV' : 'ME';
    const generatedPrn = data.studentId?.trim() || `MCET2026${deptPrefix}${Math.floor(100 + Math.random() * 900)}`;
    
    // Find available room
    const matchingRoom = rooms.find((r) => r.status === 'Available' || r.status === 'Partially Occupied') || rooms[0];
    const availableBed = matchingRoom?.beds?.find((b) => b.status === 'Available') || matchingRoom?.beds?.[0];

    const newStudentId = `std-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      studentId: generatedPrn,
      name: data.name.trim(),
      gender: data.gender,
      course: data.course || 'B.Tech Engineering',
      department: data.department || 'Computer Science & Engineering',
      year: data.year || 'First Year',
      division: data.division || 'A',
      mobile: data.mobile || '+91 98230 11223',
      email: data.email.toLowerCase().trim(),
      parentName: data.parentName || 'Guardian',
      parentPhone: data.parentPhone || '+91 94220 55667',
      emergencyContact: data.emergencyContact || data.parentPhone || '+91 94220 55667',
      hostelId: targetHostel?.id || 'hostel-sakhi',
      hostelName: targetHostel?.name || 'Sakhi Girls Hostel',
      roomId: matchingRoom?.id,
      roomNumber: matchingRoom?.roomNumber || 'S-101',
      bedNumber: availableBed?.bedNumber || 'Bed-1',
      roomType: data.roomType || matchingRoom?.roomType || 'Double',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      address: data.address || 'Maharashtra, India',
      bloodGroup: data.bloodGroup || 'O+',
    };

    // Update state
    setStudents((prev) => [newStudent, ...prev]);

    // Occupy bed if assigned
    if (matchingRoom && availableBed) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === matchingRoom.id) {
            const updatedBeds = r.beds.map((b) =>
              b.bedId === availableBed.bedId
                ? { ...b, status: 'Occupied' as const, studentId: newStudentId, studentName: newStudent.name }
                : b
            );
            const occupiedCount = updatedBeds.filter((b) => b.status === 'Occupied').length;
            const status = occupiedCount === r.capacity ? 'Full' : occupiedCount > 0 ? 'Partially Occupied' : 'Available';
            return { ...r, beds: updatedBeds, occupied: occupiedCount, status };
          }
          return r;
        })
      );
    }

    // Create initial fee invoice
    const newFee: FeeRecord = {
      id: `fee-${Date.now()}`,
      studentId: newStudent.studentId,
      studentName: newStudent.name,
      hostelName: newStudent.hostelName,
      roomNumber: newStudent.roomNumber,
      academicYear: '2026-27 Sem I',
      hostelFee: data.roomType?.includes('Single') ? 32000 : data.roomType?.includes('Triple') ? 18000 : 24000,
      messFee: 16000,
      maintenanceFee: 2000,
      totalAmount: (data.roomType?.includes('Single') ? 32000 : data.roomType?.includes('Triple') ? 18000 : 24000) + 18000,
      paidAmount: 0,
      pendingAmount: (data.roomType?.includes('Single') ? 32000 : data.roomType?.includes('Triple') ? 18000 : 24000) + 18000,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'Unpaid',
      receipts: [],
    };
    setFees((prev) => [newFee, ...prev]);

    // Welcome Notification
    const welcomeNtf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: newStudent.studentId,
      title: `🎉 Welcome to MCET Hostel, ${newStudent.name.split(' ')[0]}!`,
      message: `Your hostel allotment is confirmed for ${newStudent.hostelName}, Room ${newStudent.roomNumber} (${newStudent.bedNumber}). Explore your mess menu, leave passes, and notices.`,
      type: 'announcement',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'overview',
    };
    setNotifications((prev) => [welcomeNtf, ...prev]);

    // Auto-login new student
    setRole('student');
    setCurrentUserId(newStudent.id);
    setActiveTab('overview');
    setIsAuthModalOpen(false);

    return newStudent;
  };

  const logout = () => {
    setRole(null);
    setCurrentUserId(null);
    setActiveTab('overview');
  };

  const switchDemoUser = (targetRole: UserRole, id: string) => {
    setRole(targetRole);
    setCurrentUserId(id);
    setActiveTab('overview');
  };

  // Student Actions
  const applyLeave = (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);

    // Send notification to wardens
    const newNtf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: 'wardens',
      title: 'New Leave Application',
      message: `${req.studentName} (${req.roomNumber}) submitted a ${req.leaveType} leave application (${req.fromDate} to ${req.toDate}).`,
      type: 'leave_update',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'leave',
    };
    setNotifications((prev) => [newNtf, ...prev]);
  };

  const applyRoomChange = (req: Omit<RoomChangeRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newReq: RoomChangeRequest = {
      ...req,
      id: `rc-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setRoomChangeRequests((prev) => [newReq, ...prev]);

    const newNtf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: 'wardens',
      title: 'New Room Transfer Request',
      message: `${req.studentName} (Current: Room ${req.currentRoom}) requested transfer to ${req.preferredRoomType} in ${req.preferredBlock}.`,
      type: 'announcement',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'rooms',
    };
    setNotifications((prev) => [newNtf, ...prev]);
  };

  const submitComplaint = (comp: Omit<Complaint, 'id' | 'status' | 'dateSubmitted'>) => {
    const newComp: Complaint = {
      ...comp,
      id: `comp-${Date.now()}`,
      status: 'Submitted',
      dateSubmitted: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    setComplaints((prev) => [newComp, ...prev]);

    const newNtf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: 'wardens',
      title: 'New Maintenance Complaint',
      message: `${comp.category} complaint logged for Room ${comp.roomNumber}: "${comp.subject}"`,
      type: 'complaint_update',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'complaints',
    };
    setNotifications((prev) => [newNtf, ...prev]);
  };

  const submitMessFeedback = (feedback: Omit<MessFeedback, 'id' | 'date'>) => {
    const newFb: MessFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setMessFeedbacks((prev) => [newFb, ...prev]);
  };

  const toggleMealAttendance = (date: string, meal: 'breakfast' | 'lunch' | 'snacks' | 'dinner') => {
    if (!currentStudent) return;
    setMealAttendance((prev) => {
      const existing = prev.find((r) => r.studentId === currentStudent.id && r.date === date);
      if (existing) {
        return prev.map((r) =>
          r.id === existing.id
            ? { ...r, [meal]: !r[meal] }
            : r
        );
      } else {
        const newRecord: MealAttendanceRecord = {
          id: `att-${Date.now()}`,
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          date,
          breakfast: meal === 'breakfast',
          lunch: meal === 'lunch',
          snacks: meal === 'snacks',
          dinner: meal === 'dinner',
        };
        return [newRecord, ...prev];
      }
    });
  };

  const triggerSOS = (note?: string) => {
    if (!currentStudent) return;
    const newAlert: SOSAlert = {
      id: `sos-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: currentStudent.roomNumber,
      hostelName: currentStudent.hostelName,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      contactNumber: currentStudent.mobile,
      status: 'Active',
      note: note || 'Emergency medical / security assistance requested immediately.',
    };
    setSosAlerts((prev) => [newAlert, ...prev]);

    // Send urgent notification to wardens
    const urgentNtf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: 'wardens',
      title: '🚨 EMERGENCY SOS ALERT',
      message: `Emergency SOS triggered by ${currentStudent.name} in Room ${currentStudent.roomNumber} (${currentStudent.hostelName}). Phone: ${currentStudent.mobile}`,
      type: 'emergency',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'overview',
    };
    setNotifications((prev) => [urgentNtf, ...prev]);
  };

  // Warden Actions
  const updateLeaveStatus = (leaveId: string, status: LeaveStatus, remarks?: string) => {
    const passCode = status === 'Approved' ? `GP-MCET-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined;
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status,
              wardenRemarks: remarks || l.wardenRemarks,
              reviewedDate: new Date().toISOString().split('T')[0],
              reviewedBy: currentWarden ? `${currentWarden.name} (${currentWarden.role})` : 'Warden Office',
              gatePassCode: passCode || l.gatePassCode,
            }
          : l
      )
    );

    const targetLeave = leaveRequests.find((l) => l.id === leaveId);
    if (targetLeave) {
      const ntf: AppNotification = {
        id: `ntf-${Date.now()}`,
        recipientId: targetLeave.studentId,
        title: `Leave Application ${status}`,
        message: `Your leave request for ${targetLeave.leaveType} (${targetLeave.fromDate} to ${targetLeave.toDate}) has been ${status.toLowerCase()}.${passCode ? ` Gate Pass: ${passCode}` : ''}`,
        type: 'leave_update',
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        read: false,
        linkTab: 'leave',
      };
      setNotifications((prev) => [ntf, ...prev]);
    }
  };

  const bulkApproveLeaves = (leaveIds: string[], remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (leaveIds.includes(l.id)) {
          const passCode = `GP-MCET-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          return {
            ...l,
            status: 'Approved',
            wardenRemarks: remarks || 'Bulk approval verified by Chief Warden Office',
            reviewedDate: new Date().toISOString().split('T')[0],
            reviewedBy: currentWarden ? `${currentWarden.name} (${currentWarden.role})` : 'Chief Warden Office',
            gatePassCode: passCode,
          };
        }
        return l;
      })
    );

    leaveIds.forEach((id) => {
      const target = leaveRequests.find((l) => l.id === id);
      if (target) {
        const ntf: AppNotification = {
          id: `ntf-${Date.now()}-${Math.random()}`,
          recipientId: target.studentId,
          title: 'Leave Application Approved',
          message: `Your leave request for ${target.leaveType} (${target.fromDate} to ${target.toDate}) has been approved in bulk review.`,
          type: 'leave_update',
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          read: false,
          linkTab: 'leave',
        };
        setNotifications((prev) => [ntf, ...prev]);
      }
    });
  };

  const bulkRejectLeaves = (leaveIds: string[], reason: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        leaveIds.includes(l.id)
          ? {
              ...l,
              status: 'Rejected',
              rejectionReason: reason,
              reviewedDate: new Date().toISOString().split('T')[0],
              reviewedBy: currentWarden ? `${currentWarden.name} (${currentWarden.role})` : 'Chief Warden Office',
            }
          : l
      )
    );
  };

  const verifyParentCall = (leaveId: string, contactPerson: string, notes: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              parentVerification: {
                verified: true,
                contactPerson,
                verifiedBy: currentWarden ? `${currentWarden.name} (${currentWarden.role})` : 'Warden Office',
                verifiedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                notes,
              },
            }
          : l
      )
    );

    const target = leaveRequests.find((l) => l.id === leaveId);
    if (target) {
      const ntf: AppNotification = {
        id: `ntf-${Date.now()}`,
        recipientId: target.studentId,
        title: 'Guardian Call Verification Logged',
        message: `Warden office logged telephone verification with ${contactPerson}. Permission confirmed.`,
        type: 'leave_update',
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        read: false,
        linkTab: 'leave',
      };
      setNotifications((prev) => [ntf, ...prev]);
    }
  };

  const recordGateAction = (gatePassCode: string, action: 'Departure' | 'Return', remarks?: string): GateLogEntry | null => {
    const leave = leaveRequests.find(
      (l) => (l.gatePassCode && l.gatePassCode.toLowerCase() === gatePassCode.toLowerCase()) ||
             l.id.toLowerCase() === gatePassCode.toLowerCase() ||
             l.studentId.toLowerCase() === gatePassCode.toLowerCase()
    );
    if (!leave) return null;

    const newLog: GateLogEntry = {
      id: `gl-${Date.now()}`,
      gatePassCode: leave.gatePassCode || gatePassCode,
      studentId: leave.studentId,
      studentName: leave.studentName,
      roomNumber: leave.roomNumber,
      hostelName: leave.hostelName,
      action,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      guardName: currentWarden?.name || 'Havaldar P. B. More (Security Desk)',
      gateName: 'Main Campus Gate 1',
      remarks: remarks || `${action} recorded at sentry point.`,
    };

    setGateLogs((prev) => [newLog, ...prev]);

    const ntf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: leave.studentId,
      title: `Gate Sentry: ${action} Logged`,
      message: `Your ${action.toLowerCase()} via Main Campus Gate 1 was registered at ${newLog.timestamp}.`,
      type: 'leave_update',
      timestamp: newLog.timestamp,
      read: false,
      linkTab: 'leave',
    };
    setNotifications((prev) => [ntf, ...prev]);

    return newLog;
  };

  const reviewRoomChange = (id: string, status: 'Approved' | 'Rejected', remarks?: string) => {
    setRoomChangeRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              remarks: remarks || r.remarks,
              reviewedDate: new Date().toISOString().split('T')[0],
              reviewedBy: currentWarden ? `${currentWarden.name} (${currentWarden.role})` : 'Chief Warden Office',
            }
          : r
      )
    );

    const targetReq = roomChangeRequests.find((r) => r.id === id);
    if (targetReq) {
      const ntf: AppNotification = {
        id: `ntf-${Date.now()}`,
        recipientId: targetReq.studentId,
        title: `Room Transfer Request ${status}`,
        message: `Your room transfer application to ${targetReq.preferredRoomType} (${targetReq.preferredBlock}) has been ${status.toLowerCase()}.${remarks ? ` Remarks: ${remarks}` : ''}`,
        type: 'announcement',
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        read: false,
        linkTab: 'room',
      };
      setNotifications((prev) => [ntf, ...prev]);
    }
  };

  const updateComplaintStatus = (complaintId: string, status: ComplaintStatus, remarks?: string, assignedTo?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              resolutionRemarks: remarks || c.resolutionRemarks,
              assignedTo: assignedTo || c.assignedTo,
              resolvedDate: status === 'Resolved' ? new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : c.resolvedDate,
            }
          : c
      )
    );

    const targetComp = complaints.find((c) => c.id === complaintId);
    if (targetComp) {
      const ntf: AppNotification = {
        id: `ntf-${Date.now()}`,
        recipientId: targetComp.studentId,
        title: `Complaint Status: ${status}`,
        message: `Your complaint "${targetComp.subject}" is now marked as ${status}.${remarks ? ` Note: ${remarks}` : ''}`,
        type: 'complaint_update',
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        read: false,
        linkTab: 'complaints',
      };
      setNotifications((prev) => [ntf, ...prev]);
    }
  };

  const rateComplaint = (complaintId: string, rating: number, feedback?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              satisfactionRating: rating,
              feedbackComment: feedback || c.feedbackComment,
            }
          : c
      )
    );
  };

  const reopenComplaint = (complaintId: string, reason: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'In Progress',
              resolutionRemarks: `Re-opened by student: ${reason}`,
            }
          : c
      )
    );

    const targetComp = complaints.find((c) => c.id === complaintId);
    if (targetComp) {
      const ntf: AppNotification = {
        id: `ntf-${Date.now()}`,
        recipientId: 'wardens',
        title: 'Ticket Re-opened',
        message: `${targetComp.studentName} (Room ${targetComp.roomNumber}) re-opened ticket #${targetComp.id}: "${reason}"`,
        type: 'complaint_update',
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        read: false,
        linkTab: 'complaints',
      };
      setNotifications((prev) => [ntf, ...prev]);
    }
  };

  const updateDayMenu = (updatedDay: DayMenu) => {
    setWeeklyMenu((prev) => prev.map((d) => (d.dayOfWeek === updatedDay.dayOfWeek ? updatedDay : d)));
    const ntf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: 'students',
      title: `Mess Menu Updated: ${updatedDay.dayOfWeek}`,
      message: `The Annapurna Mess menu for ${updatedDay.dayOfWeek} has been updated. Check today's meal schedule!`,
      type: 'mess_update',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'mess',
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const quickUpdateMeal = (dayOfWeek: DayMenu['dayOfWeek'], mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner', items: string[]) => {
    setWeeklyMenu((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          return {
            ...d,
            [mealType]: {
              ...d[mealType],
              items,
            },
          };
        }
        return d;
      })
    );
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Vacate bed if assigned
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        beds: r.beds.map((b) => (b.studentId === id ? { ...b, status: 'Available', studentId: undefined, studentName: undefined } : b)),
      }))
    );
  };

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...room,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const assignStudentToBed = (roomId: string, bedId: string, studentId: string) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const updatedBeds = r.beds.map((b) =>
            b.bedId === bedId
              ? { ...b, status: 'Occupied' as const, studentId: targetStudent.id, studentName: targetStudent.name }
              : b
          );
          const occupiedCount = updatedBeds.filter((b) => b.status === 'Occupied').length;
          const status = occupiedCount === r.capacity ? 'Full' : occupiedCount > 0 ? 'Partially Occupied' : 'Available';
          return { ...r, beds: updatedBeds, occupied: occupiedCount, status };
        }
        return r;
      })
    );

    // Update student's room & bed
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (targetRoom) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                hostelId: targetRoom.hostelId,
                hostelName: targetRoom.hostelName,
                roomNumber: targetRoom.roomNumber,
                bedNumber: targetRoom.beds.find((b) => b.bedId === bedId)?.bedNumber || 'Bed-1',
                roomType: targetRoom.roomType,
              }
            : s
        )
      );
    }
  };

  const vacateBed = (roomId: string, bedId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const vacatedBed = r.beds.find((b) => b.bedId === bedId);
          const studentId = vacatedBed?.studentId;
          const updatedBeds = r.beds.map((b) =>
            b.bedId === bedId
              ? { ...b, status: 'Available' as const, studentId: undefined, studentName: undefined }
              : b
          );
          const occupiedCount = updatedBeds.filter((b) => b.status === 'Occupied').length;
          const status = occupiedCount === 0 ? 'Available' : 'Partially Occupied';

          // Update student status to vacated
          if (studentId) {
            setStudents((prevStudents) =>
              prevStudents.map((s) =>
                s.id === studentId
                  ? { ...s, status: 'Vacated' as const, roomNumber: 'Unassigned', bedNumber: 'None' }
                  : s
              )
            );
          }

          return { ...r, beds: updatedBeds, occupied: occupiedCount, status };
        }
        return r;
      })
    );
  };

  const updateRoomStatus = (roomId: string, status: Room['status']) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status } : r)));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  const updateInventoryStock = (itemId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const status: InventoryItem['status'] =
            newStock <= i.minimumStock * 0.5 ? 'Critical' : newStock <= i.minimumStock ? 'Low Stock' : 'Normal';
          return {
            ...i,
            currentStock: newStock,
            status,
            lastRestocked: new Date().toISOString().split('T')[0],
          };
        }
        return i;
      })
    );
  };

  const addExpense = (expense: Omit<MessExpense, 'id'>) => {
    const newExp: MessExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const recordFeePayment = (studentId: string, amount: number, mode: string, txnRef: string) => {
    setFees((prev) =>
      prev.map((f) => {
        if (f.studentId === studentId) {
          const newPaid = f.paidAmount + amount;
          const newPending = Math.max(0, f.totalAmount - newPaid);
          const paymentStatus = newPending === 0 ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Unpaid';
          const newReceipt = {
            id: `rec-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount,
            transactionRef: txnRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            mode,
          };
          return {
            ...f,
            paidAmount: newPaid,
            pendingAmount: newPending,
            paymentStatus,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            receipts: [newReceipt, ...f.receipts],
          };
        }
        return f;
      })
    );

    const ntf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: studentId,
      title: 'Fee Payment Received',
      message: `Payment of ₹${amount.toLocaleString()} received via ${mode}. Receipt generated.`,
      type: 'fee_reminder',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'fees',
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const publishNotice = (notice: Omit<Notice, 'id' | 'datePublished'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      datePublished: new Date().toISOString().split('T')[0],
    };
    setNotices((prev) => [newNotice, ...prev]);

    const ntf: AppNotification = {
      id: `ntf-${Date.now()}`,
      recipientId: 'all',
      title: `Notice: ${notice.title}`,
      message: notice.description.slice(0, 120) + (notice.description.length > 120 ? '...' : ''),
      type: 'announcement',
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
      linkTab: 'notices',
    };
    setNotifications((prev) => [ntf, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const sendNotification = (ntf: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...ntf,
      id: `ntf-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resolveSOS = (id: string) => {
    setSosAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
  };

  const resetAllDataToDefaults = () => {
    setHostels(INITIAL_HOSTELS);
    setStudents(INITIAL_STUDENTS);
    setWardens(INITIAL_WARDENS);
    setRooms(INITIAL_ROOMS);
    setLeaveRequests(INITIAL_LEAVES);
    setComplaints(INITIAL_COMPLAINTS);
    setWeeklyMenu(INITIAL_WEEKLY_MENU);
    setMealAttendance(INITIAL_MEAL_ATTENDANCE);
    setMessFeedbacks(INITIAL_MESS_FEEDBACKS);
    setInventory(INITIAL_INVENTORY);
    setExpenses(INITIAL_EXPENSES);
    setFees(INITIAL_FEES);
    setNotices(INITIAL_NOTICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSosAlerts([]);
    setRoomChangeRequests(INITIAL_ROOM_CHANGES);
    setGateLogs(INITIAL_GATE_LOGS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        currentUser,
        currentStudent,
        currentWarden,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        isSOSModalOpen,
        setIsSOSModalOpen,
        login,
        registerStudent,
        logout,
        switchDemoUser,
        hostels,
        students,
        wardens,
        rooms,
        leaveRequests,
        complaints,
        weeklyMenu,
        mealAttendance,
        messFeedbacks,
        inventory,
        expenses,
        fees,
        notices,
        notifications,
        sosAlerts,
        roomChangeRequests,
        gateLogs,
        recordGateAction,
        bulkApproveLeaves,
        bulkRejectLeaves,
        verifyParentCall,
        applyLeave,
        applyRoomChange,
        reviewRoomChange,
        submitComplaint,
        rateComplaint,
        reopenComplaint,
        submitMessFeedback,
        toggleMealAttendance,
        triggerSOS,
        updateLeaveStatus,
        updateComplaintStatus,
        updateDayMenu,
        quickUpdateMeal,
        addStudent,
        updateStudent,
        deleteStudent,
        addRoom,
        assignStudentToBed,
        vacateBed,
        updateRoomStatus,
        addInventoryItem,
        updateInventoryStock,
        addExpense,
        recordFeePayment,
        publishNotice,
        deleteNotice,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resolveSOS,
        resetAllDataToDefaults,

        // Theme & Personalization
        themePreference,
        effectiveTheme,
        setThemePreference,
        toggleTheme,

        // Accessibility Preferences
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        textSize,
        setTextSize,

        // Multilingual Support
        language,
        setLanguage,
        t,

        // Offline & Connectivity
        isOnline,
        isOfflineSimulated,
        setIsOfflineSimulated,
        effectiveOffline,
        isOfflinePassModalOpen,
        setIsOfflinePassModalOpen,

        // Command Palette / Quick Search
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toggleCommandPalette,

        // DBMS Project Showcase
        isDbmsModalOpen,
        setIsDbmsModalOpen,

        // Convenience aliases
        logComplaint: submitComplaint,
        payStudentFee: (feeId: string, amount: number) => {
          const targetFee = fees.find((f) => f.id === feeId);
          if (targetFee) {
            recordFeePayment(targetFee.studentId, amount, 'Online NetBanking / UPI', `TXN-UPI-${Date.now().toString().slice(-6)}`);
          }
        },
        approveLeave: (leaveId: string, remarks?: string) => updateLeaveStatus(leaveId, 'Approved', remarks),
        rejectLeave: (leaveId: string, remarks?: string) => updateLeaveStatus(leaveId, 'Rejected', remarks),
        resolveComplaint: (complaintId: string, remarks?: string) => updateComplaintStatus(complaintId, 'Resolved', remarks),
        assignComplaint: (complaintId: string, assignedTo: string) => updateComplaintStatus(complaintId, 'In-Progress', undefined, assignedTo),
        logExpense: addExpense,
        createNotice: publishNotice,
        updateDailyMenu: updateDayMenu,
        messMenu: weeklyMenu,
        messInventory: inventory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
