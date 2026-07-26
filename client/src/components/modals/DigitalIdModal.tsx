import React from 'react';
import { useMember } from '../../context/MemberContext';
import { QrCode, ShieldCheck, X, Printer, CheckCircle, BookOpen } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalIdModal: React.FC<DigitalIdModalProps> = ({ isOpen, onClose }) => {
  const { user } = useMember();

  if (!isOpen) return null;

  const appUrl = window.location.origin.includes('localhost')
    ? 'https://ethics-library.onrender.com'
    : window.location.origin;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-xl border border-amber-500/30 bg-card p-5 shadow-2xl space-y-5 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-36 w-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-2xs">
              <BookOpen className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight text-foreground leading-none">ETHICS LIBRARY</h3>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">Digital Student Pass</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/50 text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Member Details */}
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-lg border border-amber-500 object-cover shadow-2xs shrink-0"
          />
          <div className="space-y-0.5 overflow-hidden">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle className="h-2.5 w-2.5" /> VERIFIED
            </div>
            <h2 className="text-base font-extrabold text-foreground truncate">{user.name}</h2>
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              ID: {user.membershipId}
            </div>
            <div className="text-[10px] text-muted-foreground font-semibold">
              Seat: <span className="text-foreground font-bold">{user.currentSeat}</span> ({user.floor})
            </div>
          </div>
        </div>

        {/* QR Code Area */}
        <div className="p-3 rounded-lg bg-accent/30 border border-border flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase">App Scan & Gate Pass</span>
            <div className="text-xs font-bold text-foreground">Scannable QR Code</div>
            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Live Scan Active
            </div>
          </div>

          <div className="bg-white p-1 rounded-md border border-border shadow-inner flex items-center justify-center shrink-0">
            <QRCodeSVG value={appUrl} size={64} level="M" />
          </div>
        </div>

        {/* Information Table */}
        <div className="space-y-1.5 text-xs border-t border-border/80 pt-2.5">
          <div className="flex justify-between py-0.5 border-b border-border/50">
            <span className="text-muted-foreground text-[11px]">Plan:</span>
            <span className="font-bold text-foreground text-[11px]">{user.planName}</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-border/50">
            <span className="text-muted-foreground text-[11px]">Expiry:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">{user.planExpiryDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 rounded-md border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-colors flex items-center justify-center gap-1"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
