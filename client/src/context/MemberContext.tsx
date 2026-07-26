import React, { createContext, useContext } from 'react';
import { UserProfile, AttendanceRecord, SupportTicket, Announcement } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import {
  toggleDarkMode as toggleDarkModeAction,
  toggleCheckIn as toggleCheckInAction,
  updateUserSeat as updateUserSeatAction,
  updateUserProfile as updateUserProfileAction,
  addTicket as addTicketAction,
  logoutUser as logoutUserAction,
  clearAuthError as clearAuthErrorAction,
} from '../store/slices/memberSlice';
import { playSound } from '../utils/soundEngine';

interface MemberContextType {
  user: UserProfile;
  token: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  logout: () => void;
  clearAuthError: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCheckedIn: boolean;
  checkInTime: string | null;
  toggleCheckIn: () => void;
  attendanceLog: AttendanceRecord[];
  tickets: SupportTicket[];
  announcements: Announcement[];
  todayHours: number;
  updateUserSeat: (seat: string, floor: string) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  replayIntro: () => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode; onReplayIntro?: () => void }> = ({
  children,
  onReplayIntro,
}) => {
  const dispatch = useAppDispatch();
  const {
    user,
    token,
    isAuthenticated,
    authLoading,
    authError,
    isDarkMode,
    isCheckedIn,
    checkInTime,
    attendanceLog,
    tickets,
    announcements,
  } = useAppSelector((state) => state.member);

  const todayHours = 6.6;

  const logout = () => {
    playSound('click');
    dispatch(logoutUserAction());
  };

  const clearAuthError = () => {
    dispatch(clearAuthErrorAction());
  };

  const toggleDarkMode = () => {
    playSound('click');
    dispatch(toggleDarkModeAction());
  };

  const toggleCheckIn = () => {
    playSound(isCheckedIn ? 'checkOut' : 'checkIn');
    dispatch(toggleCheckInAction());
  };

  const updateUserSeat = (seat: string, floor: string) => {
    playSound('click');
    dispatch(updateUserSeatAction({ seat, floor }));
  };

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    dispatch(updateUserProfileAction(profileData));
  };

  const addTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    playSound('click');
    dispatch(addTicketAction(ticket));
  };

  const replayIntro = () => {
    if (onReplayIntro) onReplayIntro();
  };

  return (
    <MemberContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authLoading,
        authError,
        logout,
        clearAuthError,
        isDarkMode,
        toggleDarkMode,
        isCheckedIn,
        checkInTime,
        toggleCheckIn,
        attendanceLog,
        tickets,
        announcements,
        todayHours,
        updateUserSeat,
        updateUserProfile,
        addTicket,
        replayIntro,
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

