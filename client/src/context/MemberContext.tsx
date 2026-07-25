import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemberProfile, AttendanceRecord, SeatInfo, Announcement, SupportTicket } from '../types';

interface MemberContextType {
  user: MemberProfile;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCheckedIn: boolean;
  checkInTime: string | null;
  toggleCheckIn: () => void;
  attendanceLog: AttendanceRecord[];
  seats: SeatInfo[];
  changeSeat: (seatId: string) => void;
  announcements: Announcement[];
  tickets: SupportTicket[];
  addTicket: (subject: string, category: SupportTicket['category'], message: string) => void;
  todayHours: number;
  replayIntro: () => void;
}

const initialProfile: MemberProfile = {
  id: "MEM-8842",
  name: "Rahul Verma",
  email: "rahul.verma@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  memberSince: "15 Jan 2025",
  membershipId: "ETH-2026-8842",
  currentSeat: "A-12",
  floor: "Ground Floor",
  zone: "AC Zone",
  lockerNumber: "Locker #18",
  shift: "Full Day (6:00 AM - 10:00 PM)",
  planName: "Ultra Study Pass (Monthly)",
  planExpiryDate: "18 Aug 2026",
  planDaysLeft: 24,
  status: 'active'
};

const initialAttendance: AttendanceRecord[] = [
  { id: '1', date: '2026-07-25', checkIn: '08:30 AM', durationHours: 6.5, seatNumber: 'A-12', status: 'in_progress' },
  { id: '2', date: '2026-07-24', checkIn: '08:15 AM', checkOut: '09:00 PM', durationHours: 12.75, seatNumber: 'A-12', status: 'completed' },
  { id: '3', date: '2026-07-23', checkIn: '09:00 AM', checkOut: '08:30 PM', durationHours: 11.5, seatNumber: 'A-12', status: 'completed' },
  { id: '4', date: '2026-07-22', checkIn: '08:45 AM', checkOut: '09:15 PM', durationHours: 12.5, seatNumber: 'A-12', status: 'completed' },
  { id: '5', date: '2026-07-21', checkIn: '09:30 AM', checkOut: '07:30 PM', durationHours: 10.0, seatNumber: 'A-12', status: 'completed' },
  { id: '6', date: '2026-07-20', checkIn: '08:00 AM', checkOut: '09:00 PM', durationHours: 13.0, seatNumber: 'A-10', status: 'completed' },
];

const initialSeats: SeatInfo[] = Array.from({ length: 30 }, (_, i) => {
  const num = i + 1;
  const code = `${num <= 10 ? 'A' : num <= 20 ? 'B' : 'C'}-${num}`;
  const isMySeat = code === 'A-12';
  const isOccupied = [2, 3, 5, 8, 9, 14, 15, 19, 21, 24, 27].includes(num);
  return {
    id: `seat-${num}`,
    code,
    floor: num <= 15 ? 'Ground Floor' : '1st Floor',
    zone: num % 3 === 0 ? 'Window Side' : num % 2 === 0 ? 'AC Zone' : 'Silent Corner',
    status: isMySeat ? 'my_seat' : isOccupied ? 'occupied' : 'available',
    hasPowerOutlet: true,
    hasLight: true,
    hasErgoChair: num % 2 === 0
  };
});

const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '24x7 Exam Special Hours',
    content: 'Ethics Library will remain open 24x7 during the upcoming UPSC & State PSC prelims month starting Aug 1st.',
    date: '24 Jul 2026',
    priority: 'high',
    category: 'Timing'
  },
  {
    id: 'ann-2',
    title: 'High Speed Fiber Wi-Fi Upgrade',
    content: 'We have upgraded to a dual 1Gbps fiber connection. Password for member SSID "Ethics_5G": StudyHard2026',
    date: '20 Jul 2026',
    priority: 'medium',
    category: 'Maintenance'
  },
  {
    id: 'ann-3',
    title: 'Monthly Mock Test & Study Group',
    content: 'Join our weekly silent discussion session on Sunday 4 PM in the Ground Floor Discussion Room.',
    date: '15 Jul 2026',
    priority: 'low',
    category: 'Event'
  }
];

const initialTickets: SupportTicket[] = [
  {
    id: 'TK-101',
    subject: 'AC cooling temperature on Row A',
    category: 'AC / Climate',
    status: 'Resolved',
    createdAt: '22 Jul 2026',
    message: 'Could you please set AC #2 to 24°C? It gets a bit too cold near Seat A-12.',
    adminReply: 'Adjusted to 24°C. Thank you for notifying us!'
  }
];

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode; onReplayIntro?: () => void }> = ({ children, onReplayIntro }) => {
  const [user, setUser] = useState<MemberProfile>(initialProfile);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mitra_theme') === 'dark';
  });
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string | null>('08:30 AM');
  const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>(initialAttendance);
  const [seats, setSeats] = useState<SeatInfo[]>(initialSeats);
  const [announcements] = useState<Announcement[]>(initialAnnouncements);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mitra_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mitra_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const toggleCheckIn = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckInTime(null);
      setAttendanceLog(prev => prev.map(rec => rec.id === '1' ? {
        ...rec,
        checkOut: nowStr,
        status: 'completed'
      } : rec));
    } else {
      setIsCheckedIn(true);
      setCheckInTime(nowStr);
      const todayDate = new Date().toISOString().split('T')[0];
      const newRec: AttendanceRecord = {
        id: Date.now().toString(),
        date: todayDate,
        checkIn: nowStr,
        durationHours: 0.1,
        seatNumber: user.currentSeat,
        status: 'in_progress'
      };
      setAttendanceLog(prev => [newRec, ...prev]);
    }
  };

  const changeSeat = (seatId: string) => {
    const targetSeat = seats.find(s => s.id === seatId);
    if (!targetSeat || targetSeat.status === 'occupied') return;

    setSeats(prev => prev.map(s => {
      if (s.code === user.currentSeat) {
        return { ...s, status: 'available' };
      }
      if (s.id === seatId) {
        return { ...s, status: 'my_seat' };
      }
      return s;
    }));

    setUser(prev => ({
      ...prev,
      currentSeat: targetSeat.code,
      floor: targetSeat.floor,
      zone: targetSeat.zone
    }));
  };

  const addTicket = (subject: string, category: SupportTicket['category'], message: string) => {
    const newTk: SupportTicket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      subject,
      category,
      status: 'Open',
      createdAt: 'Just now',
      message
    };
    setTickets(prev => [newTk, ...prev]);
  };

  const todayHours = attendanceLog.find(a => a.date === '2026-07-25')?.durationHours || 6.5;

  const replayIntro = () => {
    if (onReplayIntro) onReplayIntro();
  };

  return (
    <MemberContext.Provider
      value={{
        user,
        isDarkMode,
        toggleDarkMode,
        isCheckedIn,
        checkInTime,
        toggleCheckIn,
        attendanceLog,
        seats,
        changeSeat,
        announcements,
        tickets,
        addTicket,
        todayHours,
        replayIntro
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
};
