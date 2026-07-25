import React from 'react';
import { useMember } from '../context/MemberContext';
import { CreditCard, CheckCircle, Clock, Calendar, Zap, AlertCircle, ArrowUpRight } from 'lucide-react';

export const Membership: React.FC = () => {
  const { user } = useMember();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-500" />
            My Membership Plan
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Current subscription details, payment receipts, and renewal options
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs self-start sm:self-auto">
          <span>Renew Subscription</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Plan Details Card */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle className="h-3 w-3" /> ACTIVE PLAN
            </span>
            <h2 className="text-lg font-extrabold text-foreground">{user.planName}</h2>
            <p className="text-[11px] text-muted-foreground">Full Day Dedicated Desk Access &bull; AC Hall</p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">₹1,500 <span className="text-xs font-semibold text-muted-foreground">/ month</span></div>
            <div className="text-[10px] text-muted-foreground">Paid via UPI &bull; Txn #ETH-88492</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Start Date</span>
            <div className="font-bold text-foreground">01 July 2026</div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Expiry Date</span>
            <div className="font-bold text-amber-600 dark:text-amber-400">{user.planExpiryDate}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Days Left</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">{user.planDaysLeft} Days Remaining</div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Locker Access</span>
            <div className="font-bold text-foreground">Locker #{user.lockerNumber} (Included)</div>
          </div>
        </div>
      </div>

      {/* Plan Inclusions Grid */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Plan Amenities & Inclusions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-foreground">Personal Desk Outlet</div>
              <div className="text-[10px] text-muted-foreground">240V uninterrupted charging</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
            <div>
              <div className="font-bold text-foreground">16 Hours Daily Access</div>
              <div className="text-[10px] text-muted-foreground">6:00 AM - 10:00 PM shift</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
            <div>
              <div className="font-bold text-foreground">High-Speed Wi-Fi</div>
              <div className="text-[10px] text-muted-foreground">100 Mbps fiber optic connection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
