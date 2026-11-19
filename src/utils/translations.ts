export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDict {
  // Navigation & Tabs
  overview: string;
  myRoom: string;
  room: string;
  gatePasses: string;
  leave: string;
  maintenance: string;
  complaints: string;
  meals: string;
  mess: string;
  attendance: string;
  fees: string;
  notices: string;
  profile: string;
  settings: string;
  todayTimeline: string;

  // Curfew & Status
  curfewCountdown: string;
  curfewClosed: string;
  inResidence: string;
  onLeave: string;
  activePass: string;
  noActivePass: string;
  inspectedClean: string;

  // Actions
  searchPlaceholder: string;
  quickActions: string;
  showGatePass: string;
  applyOutpass: string;
  reportIssue: string;
  viewMenu: string;
  markAttendance: string;
  signOut: string;
  editDetails: string;
  saveChanges: string;

  // Offline & Notifications
  offlineModeActive: string;
  offlineNotice: string;
  viewOfflinePass: string;
  notifications: string;
  markAllRead: string;
  noNotifications: string;

  // Accessibility & Theme
  theme: string;
  light: string;
  dark: string;
  system: string;
  reducedMotion: string;
  highContrast: string;
  textSize: string;
  normalText: string;
  largeText: string;
  largerText: string;
  language: string;
  emergencySOS: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    overview: 'Overview',
    myRoom: 'My Room',
    room: 'My Room',
    gatePasses: 'Gate Passes',
    leave: 'Gate Passes',
    maintenance: 'Maintenance & Tickets',
    complaints: 'Maintenance & Tickets',
    meals: 'Mess & Dining',
    mess: 'Mess & Dining',
    attendance: 'Attendance',
    fees: 'Hostel Fees',
    notices: 'Notice Board',
    profile: 'Profile & Settings',
    settings: 'Settings',
    todayTimeline: "Today's Schedule & Timeline",

    curfewCountdown: 'Main gate curfew in',
    curfewClosed: 'Main gate closed for night curfew (reopens 06:00 AM)',
    inResidence: 'In Residence',
    onLeave: 'On Leave',
    activePass: 'Active Outpass',
    noActivePass: 'No Active Pass',
    inspectedClean: 'Inspected Today',

    searchPlaceholder: 'Type a command, notice, pass, room, or meal... (⌘K)',
    quickActions: 'Quick Actions',
    showGatePass: 'Show Digital Gate Pass',
    applyOutpass: 'Apply for Outpass',
    reportIssue: 'Report Maintenance Ticket',
    viewMenu: 'Check Mess Menu',
    markAttendance: 'Mark Meal Attendance',
    signOut: 'Sign Out',
    editDetails: 'Edit Details',
    saveChanges: 'Save Changes',

    offlineModeActive: 'Offline Mode Active',
    offlineNotice: 'Using cached pass & emergency contacts',
    viewOfflinePass: 'View Offline Gate Pass',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications at this time',

    theme: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'Use device setting',
    reducedMotion: 'Reduced Motion',
    highContrast: 'High Contrast',
    textSize: 'Text Size',
    normalText: 'Default',
    largeText: 'Large',
    largerText: 'Extra Large',
    language: 'Language',
    emergencySOS: 'Emergency SOS',
  },
  hi: {
    overview: 'मुख्य पृष्ठ',
    myRoom: 'मेरा कमरा',
    room: 'मेरा कमरा',
    gatePasses: 'गेट पास',
    leave: 'गेट पास',
    maintenance: 'रखरखाव व शिकायत',
    complaints: 'रखरखाव व शिकायत',
    meals: 'भोजनालय मेनू',
    mess: 'भोजनालय मेनू',
    attendance: 'भोजन उपस्थिति',
    fees: 'छात्रावास शुल्क',
    notices: 'सूचना पट्ट',
    profile: 'प्रोफ़ाइल व प्राथमिकताएं',
    settings: 'सेटिंग्स',
    todayTimeline: 'आज की समय-सारणी',

    curfewCountdown: 'मुख्य द्वार कर्फ्यू शेष समय:',
    curfewClosed: 'मुख्य द्वार रात के कर्फ्यू हेतु बंद है (सुबह 06:00 बजे खुलेगा)',
    inResidence: 'छात्रावास में उपस्थित',
    onLeave: 'अवकाश पर',
    activePass: 'सक्रिय गेट पास',
    noActivePass: 'कोई सक्रिय पास नहीं',
    inspectedClean: 'कमरा निरीक्षण पूर्ण',

    searchPlaceholder: 'खोजें: सूचना, पास, कमरा, मेनू या पेज... (⌘K)',
    quickActions: 'त्वरित क्रियाएं',
    showGatePass: 'डिजिटल गेट पास दिखाएं',
    applyOutpass: 'गेट पास का आवेदन करें',
    reportIssue: 'रखरखाव शिकायत दर्ज करें',
    viewMenu: 'मेस मेनू देखें',
    markAttendance: 'भोजन उपस्थिति दर्ज करें',
    signOut: 'लॉग आउट',
    editDetails: 'विवरण संपादित करें',
    saveChanges: 'परिवर्तन सहेजें',

    offlineModeActive: 'ऑफ़लाइन मोड सक्रिय',
    offlineNotice: 'कैश किया गया गेट पास व आपातकालीन संपर्क उपलब्ध',
    viewOfflinePass: 'ऑफ़लाइन गेट पास देखें',
    notifications: 'सूचनाएं',
    markAllRead: 'सभी पढ़े गए चिह्नित करें',
    noNotifications: 'इस समय कोई सूचना नहीं है',

    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    system: 'डिवाइस सेटिंग',
    reducedMotion: 'धीमी हलचल (Reduced Motion)',
    highContrast: 'उच्च कंट्रास्ट (High Contrast)',
    textSize: 'अक्षर आकार',
    normalText: 'सामान्य',
    largeText: 'बड़ा',
    largerText: 'अति बड़ा',
    language: 'भाषा',
    emergencySOS: 'आपातकालीन सहायता (SOS)',
  },
  mr: {
    overview: 'मुख्य दृश्य',
    myRoom: 'माझी खोली',
    room: 'माझी खोली',
    gatePasses: 'गेट पासेस',
    leave: 'गेट पासेस',
    maintenance: 'देखभाल तक्रार',
    complaints: 'देखभाल तक्रार',
    meals: 'मेस भोजन मेनू',
    mess: 'मेस भोजन मेनू',
    attendance: 'भोजन हजेरी',
    fees: 'वसतिगृह शुल्क',
    notices: 'सूचना फलक',
    profile: 'माझी प्रोफाइल व पसंती',
    settings: 'सेटिंग्ज',
    todayTimeline: 'आजचे वेळापत्रक',

    curfewCountdown: 'गेट कर्फ्यू शिल्लक वेळ:',
    curfewClosed: 'रात्रीच्या कर्फ्यूसाठी मुख्य गेट बंद आहे (सकाळी 06:00 वाजता उघडेल)',
    inResidence: 'वसतिगृहात उपस्थित',
    onLeave: 'रजेवर',
    activePass: 'सक्रिय गेट पास',
    noActivePass: 'सक्रिय पास नाही',
    inspectedClean: 'खोली तपासणी पूर्ण',

    searchPlaceholder: 'शोधा: परिपत्रक, पास, खोली, मेनू किंवा पेज... (⌘K)',
    quickActions: 'जलद कृती',
    showGatePass: 'डिजिटल गेट पास दाखवा',
    applyOutpass: 'गेट पाससाठी अर्ज करा',
    reportIssue: 'देखभाल तक्रार नोंदवा',
    viewMenu: 'मेस मेनू तपासा',
    markAttendance: 'भोजन उपस्थिती नोंदवा',
    signOut: 'बाहेर पडा (Sign Out)',
    editDetails: 'माहिती बदला',
    saveChanges: 'बदल जतन करा',

    offlineModeActive: 'ऑफलाइन मोड सक्रिय',
    offlineNotice: 'जतन केलेला गेट पास व आपत्कालीन संपर्क उपलब्ध',
    viewOfflinePass: 'ऑफलाइन गेट पास पहा',
    notifications: 'सूचना',
    markAllRead: 'सर्व वाचल्याचे चिन्हांकित करा',
    noNotifications: 'सध्या कोणत्याही नवीन सूचना नाहीत',

    theme: 'थीम रंगसंगती',
    light: 'लाईट (Light)',
    dark: 'डार्क (Dark)',
    system: 'डिव्हाइस प्रमाणे (System)',
    reducedMotion: 'कमी मोशन (Reduced Motion)',
    highContrast: 'हाय कॉन्ट्रास्ट (High Contrast)',
    textSize: 'फॉन्ट आकार',
    normalText: 'सामान्य',
    largeText: 'मोठा',
    largerText: 'अधिक मोठा',
    language: 'भाषा',
    emergencySOS: 'आपत्कालीन मदत (SOS)',
  },
};
