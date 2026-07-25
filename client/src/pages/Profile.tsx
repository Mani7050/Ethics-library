import React from 'react';
import { useMember } from '../context/MemberContext';
import { User, Mail, Phone, Shield, QrCode, CheckCircle, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DigitalIdModal } from '../components/modals/DigitalIdModal';

export const Profile: React.FC = () => {
  const { user } = useMember();
  const [showIdModal, setShowIdModal] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            Member Profile & Settings
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Personal profile details, membership status, and gate pass QR code
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIdModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs"
          >
            <QrCode className="h-4 w-4" />
            View Digital Pass
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold text-xs shadow-2xs"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-lg border border-amber-500 object-cover shadow-2xs"
          />
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle className="h-3 w-3" /> VERIFIED MEMBER
            </span>
            <h2 className="text-lg font-extrabold text-foreground">{user.name}</h2>
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              Member ID: {user.membershipId}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-accent/20 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
              <Mail className="h-3 w-3 text-amber-500" /> Email Address
            </span>
            <div className="font-bold text-foreground">{user.email}</div>
          </div>

          <div className="p-3 rounded-lg bg-accent/20 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
              <Phone className="h-3 w-3 text-amber-500" /> Phone Number
            </span>
            <div className="font-bold text-foreground">{user.phone}</div>
          </div>

          <div className="p-3 rounded-lg bg-accent/20 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
              <Calendar className="h-3 w-3 text-amber-500" /> Member Since
            </span>
            <div className="font-bold text-foreground">{user.memberSince}</div>
          </div>

          <div className="p-3 rounded-lg bg-accent/20 border border-border space-y-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
              <Shield className="h-3 w-3 text-amber-500" /> Assigned Desk & Floor
            </span>
            <div className="font-bold text-foreground">{user.currentSeat} ({user.floor})</div>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 font-bold text-xs transition-all shadow"
          >
            <LogOut className="h-4 w-4" />
            Logout from Account
          </button>
        </div>
      </div>

      <DigitalIdModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />
    </div>
  );
};
