export type SystemRole =
  | 'super_admin'
  | 'administrator'
  | 'authority_officer'
  | 'department_manager'
  | 'moderator'
  | 'regular_user'
  | 'guest';

export type UserRole = 'student' | 'warden' | 'guest' | SystemRole;

export interface Student {
  id: string;
  studentId: string; // e.g. "MCET2024CS042"
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  course: string; // "B.Tech"
  department: string; // "Computer Science & Engineering"
  year: 'First Year' | 'Second Year' | 'Third Year' | 'Final Year' | string;
  division: string; // "A"
  mobile: string;
  email: string;
  parentName: string;
  parentPhone: string;
  emergencyContact: string;
  hostelId: string;
  hostelName: string;
  roomId?: string;
  roomNumber: string;
  bedNumber: string;
  roomType?: 'Single' | 'Double' | 'Triple' | 'Four Sharing' | string;
  admissionDate: string;
  status: 'Active' | 'On Leave' | 'Vacated' | string;
  avatar?: string;
  address?: string;
  bloodGroup?: string;
}

export interface Warden {
  id: string;
  wardenId: string; // e.g. "WARDEN-BOYS-01"
  name: string;
  role: 'Chief Warden' | 'Hostel Warden' | 'Mess Supervisor' | 'Assistant Warden' | string;
  email: string;
  phone: string;
  hostelAssigned: string;
  department?: string;
  avatar?: string;
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  gender?: 'Boys' | 'Girls' | 'Co-ed';
  type?: string;
  totalFloors: number;
  totalRooms: number;
  totalCapacity: number;
  wardenName: string;
  wardenPhone: string;
  description: string;
  caretakerContact: string;
}

export interface Bed {
  bedId: string;
  bedNumber: string;
  studentId?: string;
  studentName?: string;
  status: 'Available' | 'Occupied' | 'Reserved';
}

export interface Room {
  id: string;
  hostelId: string;
  hostelName: string;
  floor: number;
  roomNumber: string;
  capacity: number;
  occupied?: number;
  type?: 'Single' | 'Double' | 'Triple' | 'Four Sharing' | string;
  roomType?: 'Single' | 'Double' | 'Triple' | 'Four Sharing' | string;
  status: 'Available' | 'Partially Occupied' | 'Full' | 'Maintenance' | string;
  beds?: Bed[];
  amenities?: string[];
  pricePerYear?: number;
}

export type LeaveType = 'Home Visit' | 'Emergency' | 'Medical' | 'Academic / Internship' | 'Personal' | string;
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | string;

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone?: string;
  roomNumber: string;
  hostelName: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  destination?: string;
  parentName?: string;
  parentContact: string;
  emergencyContact?: string;
  supportingDocName?: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedDate?: string;
  approvedBy?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  wardenRemarks?: string;
  gatePassCode?: string;
  source?: 'Web Portal' | 'WhatsApp' | string;
  whatsappPhone?: string;
  departureTime?: string;
  expectedReturnTime?: string;
  whatsappNotified?: boolean;
  parentVerification?: {
    verified: boolean;
    contactPerson: string;
    verifiedBy: string;
    verifiedAt: string;
    notes?: string;
  };
}

export type ComplaintCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Cleaning'
  | 'Furniture'
  | 'Wi-Fi'
  | 'Wi-Fi / LAN'
  | 'Water'
  | 'Water Supply'
  | 'Room maintenance'
  | 'Mess / Food'
  | 'Other'
  | string;

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Emergency' | string;
export type PriorityLevel = ComplaintPriority;
export type ComplaintStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Rejected' | string;

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  hostelName: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt?: string;
  dateSubmitted?: string;
  assignedTo?: string;
  resolutionRemarks?: string;
  resolvedDate?: string;
  imageAttachment?: string;
  satisfactionRating?: number;
  feedbackComment?: string;
  slaTargetHours?: number;
  assignedTime?: string;
}

export interface GateLogEntry {
  id: string;
  gatePassCode: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  hostelName: string;
  action: 'Departure' | 'Return';
  timestamp: string;
  guardName: string;
  gateName: string;
  remarks?: string;
}

export interface MealItem {
  time: string;
  items: string[];
  isVeg: boolean;
  specialNote?: string;
  specialDish?: string;
  dessert?: string;
  calories?: number | string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DayMenu {
  dayOfWeek: DayOfWeek;
  breakfast: MealItem;
  lunch: MealItem;
  snacks: MealItem;
  dinner: MealItem;
}

export type MessMenuItem = DayMenu;

export interface MealAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  breakfast: boolean;
  lunch: boolean;
  snacks: boolean;
  dinner: boolean;
}

export interface MessFeedback {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber?: string;
  date: string;
  meal?: string;
  mealType?: 'Breakfast' | 'Lunch' | 'Evening Snacks' | 'Dinner' | 'General' | string;
  rating?: number; // 1-5
  ratings?: {
    foodQuality?: number;
    taste?: number;
    cleanliness?: number;
    quantity?: number;
    service?: number;
    overall?: number;
  };
  categories?: {
    taste: number;
    hygiene: number;
    service: number;
    quantity: number;
  };
  comments: string;
}

export interface MessComplaint {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  category: 'Food quality' | 'Food quantity' | 'Hygiene' | 'Menu' | 'Timing' | 'Staff behavior' | 'Other' | string;
  description: string;
  status: 'Submitted' | 'Under Review' | 'Resolved' | string;
  resolution?: string;
}

export interface InventoryItem {
  id: string;
  itemName?: string;
  name?: string;
  category: 'Grains' | 'Vegetables' | 'Dairy' | 'Oils & Spices' | 'Pulses' | 'Fruits' | 'Cleaning & Misc' | string;
  quantity?: number;
  currentStock?: number;
  unit: 'kg' | 'liters' | 'units' | 'bags' | 'cans' | 'packets' | string;
  threshold?: number;
  minimumStock?: number;
  costPerUnit?: number;
  vendor?: string;
  lastRestocked: string;
  status: 'Optimal' | 'Low' | 'Normal' | 'Low Stock' | 'Critical' | string;
}

export type MessInventoryItem = InventoryItem;

export interface MessExpense {
  id: string;
  title?: string;
  item?: string;
  category: 'Maintenance' | 'Electricity & Water' | 'Mess Ration' | 'Sanitation' | 'Security & Staff' | 'Misc' | string;
  quantity?: string;
  vendor?: string;
  paidTo?: string;
  amount: number;
  date?: string;
  purchaseDate?: string;
  receiptNumber?: string;
  invoiceNumber?: string;
  paymentMethod?: string;
}

export type HostelExpense = MessExpense;

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  hostelName?: string;
  roomNumber?: string;
  academicYear?: string;
  hostelFee: number;
  messFee: number;
  maintenanceFee: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  paymentStatus: 'Paid' | 'Partial' | 'Partially Paid' | 'Overdue' | 'Unpaid' | string;
  lastPaymentDate?: string;
  receipts?: {
    id: string;
    date: string;
    amount: number;
    transactionRef: string;
    mode: string;
  }[];
}

export interface Notice {
  id: string;
  title: string;
  content?: string;
  description?: string;
  category: 'Hostel' | 'Mess' | 'Maintenance' | 'Academic' | 'Emergency' | 'General' | string;
  priority: 'Normal' | 'Low' | 'Medium' | 'High' | 'Urgent' | string;
  targetRole?: 'all' | 'students' | 'wardens' | string;
  targetAudience?: 'All' | 'Boys Hostel' | 'Girls Hostel' | 'Staff' | string;
  datePublished: string;
  date?: string;
  expiryDate?: string;
  postedBy?: string;
  publishedBy?: string;
  isPinned?: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string; // 'all' | 'students' | 'wardens' | specific ID
  title: string;
  message: string;
  type: 'announcement' | 'leave_update' | 'complaint_update' | 'mess_update' | 'emergency' | 'fee_reminder';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface SOSAlert {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  hostelName: string;
  timestamp: string;
  contactNumber: string;
  status: 'Active' | 'Attended' | 'Resolved';
  note?: string;
}

export interface RoomChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentRoom: string;
  currentHostel: string;
  preferredRoomType: string;
  preferredBlock: string;
  reasonCategory: 'Academic' | 'Medical' | 'Mutual Swap' | 'Discipline' | 'Other' | string;
  reason: string;
  mutualStudentPRN?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  remarks?: string;
}
