import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMember } from '../../context/MemberContext';
import {
  LayoutDashboard,
  Armchair,
  CalendarCheck,
  Timer,
  CreditCard,
  LifeBuoy,
  User,
  Sparkles,
  QrCode,
  LogOut
} from 'lucide-react';
import { DigitalIdModal } from '../modals/DigitalIdModal';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Seat & Map', path: '/seat', icon: Armchair },
  { name: 'Attendance Log', path: '/attendance', icon: CalendarCheck },
  { name: 'Focus & Sound Engine', path: '/focus', icon: Timer },
  { name: 'My Membership', path: '/membership', icon: CreditCard },
  { name: 'Helpdesk & Support', path: '/support', icon: LifeBuoy },
  { name: 'Profile & Settings', path: '/profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const { user } = useMember();
  const [showIdModal, setShowIdModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground min-h-screen sticky top-0 transition-colors">
        {/* Brand Header */}
        <div className="flex h-14 items-center px-5 border-b border-border gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-slate-950 font-black text-lg shadow-sm">
            E
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-foreground leading-none">ETHICS</h2>
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Student & Member App</p>
          </div>
        </div>

        {/* Member Card Banner */}
        <div className="p-3">
          <button
            onClick={() => setShowIdModal(true)}
            className="w-full text-left rounded-lg bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-3 border border-amber-500/20 shadow-2xs hover:border-amber-500/40 transition-all group cursor-pointer"
            title="Click to open Digital ID Pass"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-md border border-amber-500 object-cover shadow-2xs"
              />
              <div className="overflow-hidden">
                <h3 className="text-xs font-extrabold text-foreground truncate">{user.name}</h3>
                <p className="text-[11px] text-muted-foreground truncate">{user.planName}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-border/50">
              <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">
                <QrCode className="h-3 w-3 text-amber-500" /> Digital Pass
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/20">{user.currentSeat}</span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-2.5 py-2 space-y-1">
          <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Member Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Logout & Library Guidelines Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-2xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out / Logout</span>
          </button>

          <div className="rounded-lg bg-card p-2 border border-border text-xs space-y-1 shadow-2xs">
            <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[10px]">
              <Sparkles className="h-3 w-3" />
              <span>Library Motto</span>
            </div>
            <p className="text-[10px] text-muted-foreground italic leading-tight">
              "Silence is the environment where greatness is forged."
            </p>
          </div>
        </div>
      </aside>

      {/* Digital ID Pass Modal */}
      <DigitalIdModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />
    </>
  );
};
