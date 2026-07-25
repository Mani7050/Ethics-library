import React, { useState } from 'react';
import { useMember } from '../../context/MemberContext';
import { Sun, Moon, Bell, ShieldCheck, QrCode } from 'lucide-react';
import { DigitalIdModal } from '../modals/DigitalIdModal';
import { NoticesDrawer } from '../modals/NoticesDrawer';

export const Header: React.FC = () => {
  const { user, isDarkMode, toggleDarkMode, isCheckedIn, checkInTime, toggleCheckIn } = useMember();
  const [showIdModal, setShowIdModal] = useState<boolean>(false);
  const [showNotices, setShowNotices] = useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-3 md:px-6 backdrop-blur-md transition-colors">
        <div className="flex items-center gap-2">
          {/* Mobile Brand */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 text-slate-950 font-black text-xs shadow-2xs">
              M
            </div>
            <div>
              <h1 className="text-xs font-black tracking-tight text-foreground leading-none">MITRA</h1>
              <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 leading-none">Member Portal</span>
            </div>
          </div>

          {/* Desktop Active Member Pill */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowIdModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-colors cursor-pointer group"
              title="Click to view Digital ID Pass & QR Code"
            >
              <ShieldCheck className="h-3.5 w-3.5 group-hover:scale-105 transition-transform" />
              <span>ID: <code className="font-mono font-bold">{user.membershipId}</code></span>
              <QrCode className="h-3 w-3 text-amber-500 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          {/* Attendance Toggle */}
          <button
            onClick={toggleCheckIn}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              isCheckedIn
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCheckedIn ? 'bg-emerald-400' : 'bg-amber-600'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isCheckedIn ? 'bg-emerald-500' : 'bg-amber-950'}`}></span>
            </span>
            {isCheckedIn ? (
              <span>Checked In ({checkInTime || '08:30 AM'})</span>
            ) : (
              <span>Check-In</span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-700" />}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotices(true)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Announcements & Notices"
          >
            <Bell className="h-3.5 w-3.5 text-amber-500" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          </button>

          {/* User Mini Profile */}
          <button
            onClick={() => setShowIdModal(true)}
            className="hidden sm:flex items-center gap-2 pl-2 border-l border-border hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-7 w-7 rounded-md border border-amber-500/40 object-cover shadow-2xs"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold leading-tight text-foreground">{user.name}</span>
              <span className="text-[9px] text-muted-foreground">{user.currentSeat} &bull; {user.floor}</span>
            </div>
          </button>
        </div>
      </header>

      {/* Digital ID Modal */}
      <DigitalIdModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />

      {/* Notices Drawer */}
      <NoticesDrawer isOpen={showNotices} onClose={() => setShowNotices(false)} />
    </>
  );
};
