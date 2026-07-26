import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, AttendanceRecord, SupportTicket, Announcement } from '../../types';

interface MemberState {
  user: UserProfile;
  token: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  isDarkMode: boolean;
  isCheckedIn: boolean;
  checkInTime: string | null;
  attendanceLog: AttendanceRecord[];
  tickets: SupportTicket[];
  announcements: Announcement[];
}

const initialUser: UserProfile = {
  id: 'usr_8842',
  name: 'Mani Kumar',
  email: 'mani@gmail.com',
  phone: '+91 98765 43210',
  membershipId: 'ETH-2026-8842',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
  planName: 'Prime Dedicated Bay (AC)',
  validTill: '2026-12-31',
  daysRemaining: 158,
  currentSeat: 'A-12',
  floor: 'First Floor (Silent Zone)',
  shift: 'Full Day (07:00 AM - 11:00 PM)',
  joinedDate: '2026-01-15',
};

const initialAttendanceLog: AttendanceRecord[] = [
  { id: '1', date: '2026-07-25', checkIn: '10:39 PM', checkOut: null, durationHours: 0.1, status: 'in_progress', seatNumber: 'A-12' },
  { id: '2', date: '2026-07-25', checkIn: '08:30 AM', checkOut: '10:39 PM', durationHours: 6.5, status: 'completed', seatNumber: 'A-12' },
  { id: '3', date: '2026-07-24', checkIn: '08:15 AM', checkOut: '09:00 PM', durationHours: 12.8, status: 'completed', seatNumber: 'A-12' },
  { id: '4', date: '2026-07-23', checkIn: '09:00 AM', checkOut: '08:30 PM', durationHours: 11.5, status: 'completed', seatNumber: 'A-12' },
  { id: '5', date: '2026-07-22', checkIn: '08:45 AM', checkOut: '09:15 PM', durationHours: 12.5, status: 'completed', seatNumber: 'A-12' },
  { id: '6', date: '2026-07-21', checkIn: '09:30 AM', checkOut: '07:30 PM', durationHours: 10.0, status: 'completed', seatNumber: 'A-12' },
  { id: '7', date: '2026-07-20', checkIn: '08:00 AM', checkOut: '09:00 PM', durationHours: 13.0, status: 'completed', seatNumber: 'A-10' },
];

const initialTickets: SupportTicket[] = [
  {
    id: 't-101',
    subject: 'AC cooling low in Silent Corner',
    category: 'AC / Climate',
    status: 'In Progress',
    createdAt: '2026-07-24',
    message: 'The temperature near seat A-12 is slightly warm during 2 PM to 5 PM.',
    adminReply: 'Maintenance team has been dispatched to check unit 4.',
  },
  {
    id: 't-102',
    subject: 'Locker #42 key cylinder loose',
    category: 'Locker',
    status: 'Resolved',
    createdAt: '2026-07-20',
    message: 'Key turns loosely in lock.',
    adminReply: 'Locker lock cylinder replaced by staff.',
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Library Maintenance & AC Servicing',
    date: '2026-07-24',
    category: 'Maintenance',
    priority: 'medium',
    content: 'AC servicing scheduled for 2nd Floor on Sunday between 06:00 AM - 09:00 AM. 1st Floor silent zone will remain operational.',
  },
  {
    id: '2',
    title: 'Upcoming Mock Test Series (UPSC / BPSC)',
    date: '2026-07-22',
    category: 'Event',
    priority: 'high',
    content: 'Free full-length mock exam answer sheets available at reception for all registered members.',
  },
];

const savedToken = localStorage.getItem('ethics_token') || sessionStorage.getItem('ethics_token');
const savedUserRaw = localStorage.getItem('ethics_user') || sessionStorage.getItem('ethics_user');
let savedUser: UserProfile = initialUser;
if (savedUserRaw) {
  try {
    savedUser = JSON.parse(savedUserRaw);
  } catch (e) {
    // fallback
  }
}

const initialState: MemberState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
  authLoading: false,
  authError: null,
  isDarkMode: false,
  isCheckedIn: true,
  checkInTime: '10:39 PM',
  attendanceLog: initialAttendanceLog,
  tickets: initialTickets,
  announcements: initialAnnouncements,
};

export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setAuthStart: (state) => {
      state.authLoading = true;
      state.authError = null;
    },
    setAuthSuccess: (
      state,
      action: PayloadAction<{ token: string; user: UserProfile; rememberMe?: boolean }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authLoading = false;
      state.authError = null;

      const storage = action.payload.rememberMe !== false ? localStorage : sessionStorage;
      storage.setItem('ethics_token', action.payload.token);
      storage.setItem('ethics_user', JSON.stringify(action.payload.user));
    },
    setAuthFailure: (state, action: PayloadAction<string>) => {
      state.authLoading = false;
      state.authError = action.payload;
      state.isAuthenticated = false;
    },
    logoutUser: (state) => {
      state.token = null;
      state.user = initialUser;
      state.isAuthenticated = false;
      state.authLoading = false;
      state.authError = null;

      localStorage.removeItem('ethics_token');
      localStorage.removeItem('ethics_user');
      sessionStorage.removeItem('ethics_token');
      sessionStorage.removeItem('ethics_user');
    },
    clearAuthError: (state) => {
      state.authError = null;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleCheckIn: (state) => {
      if (state.isCheckedIn) {
        state.isCheckedIn = false;
        state.checkInTime = null;
        if (state.attendanceLog.length > 0 && state.attendanceLog[0].status === 'in_progress') {
          state.attendanceLog[0].status = 'completed';
          state.attendanceLog[0].checkOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } else {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        state.isCheckedIn = true;
        state.checkInTime = timeNow;
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          checkIn: timeNow,
          checkOut: null,
          durationHours: 0,
          status: 'in_progress',
          seatNumber: state.user.currentSeat,
        };
        state.attendanceLog.unshift(newRecord);
      }
    },
    updateUserSeat: (state, action: PayloadAction<{ seat: string; floor: string }>) => {
      state.user.currentSeat = action.payload.seat;
      state.user.floor = action.payload.floor;
      const storage = localStorage.getItem('ethics_token') ? localStorage : sessionStorage;
      storage.setItem('ethics_user', JSON.stringify(state.user));
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user, ...action.payload };
      const storage = localStorage.getItem('ethics_token') ? localStorage : sessionStorage;
      storage.setItem('ethics_user', JSON.stringify(state.user));
    },
    addTicket: (state, action: PayloadAction<Omit<SupportTicket, 'id' | 'createdAt' | 'status'>>) => {
      const newTicket: SupportTicket = {
        id: `t-${Date.now()}`,
        subject: action.payload.subject,
        category: action.payload.category,
        message: action.payload.message,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.tickets.unshift(newTicket);
    },
  },
});

export const {
  setAuthStart,
  setAuthSuccess,
  setAuthFailure,
  logoutUser,
  clearAuthError,
  toggleDarkMode,
  setDarkMode,
  toggleCheckIn,
  updateUserSeat,
  updateUserProfile,
  addTicket,
} = memberSlice.actions;

export default memberSlice.reducer;

