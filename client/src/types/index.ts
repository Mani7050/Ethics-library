export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince?: string;
  membershipId: string;
  currentSeat: string;
  floor: string;
  zone?: string;
  lockerNumber?: string;
  shift: string;
  planName: string;
  validTill?: string;
  planExpiryDate?: string;
  daysRemaining?: number;
  planDaysLeft?: number;
  joinedDate?: string;
  status?: 'active' | 'expiring_soon' | 'expired';
}

export type UserProfile = MemberProfile;

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string | null;
  durationHours: number;
  seatNumber: string;
  status: 'completed' | 'in_progress' | 'absent';
}

export interface SeatInfo {
  id: string;
  code: string;
  floor: 'Ground Floor' | '1st Floor' | 'Silent Zone';
  zone: 'Window Side' | 'AC Zone' | 'Silent Corner' | 'Standard';
  status: 'occupied' | 'available' | 'reserved' | 'my_seat';
  hasPowerOutlet: boolean;
  hasLight: boolean;
  hasErgoChair: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: 'Event' | 'Maintenance' | 'Timing' | 'Rules';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'AC / Climate' | 'Wi-Fi / Internet' | 'Locker' | 'Seat Issue' | 'Cleanliness' | 'Other';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  message: string;
  adminReply?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  shift: string;
  duration: string;
  price: number;
  features: string[];
  recommended?: boolean;
}
