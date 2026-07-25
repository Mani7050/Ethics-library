import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import {
  Clock,
  Calendar,
  Armchair,
  CheckCircle,
  Bell,
  Sparkles,
  ArrowRight,
  Flame,
  Zap,
  Lock,
  Timer,
  QrCode,
  LifeBuoy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DigitalIdModal } from '../components/modals/DigitalIdModal';
import { Announcement } from '../types';

export const Dashboard: React.FC = () => {
  const { user, isCheckedIn, checkInTime, toggleCheckIn, announcements, todayHours, attendanceLog } = useMember();
  const [showIdModal, setShowIdModal] = useState<boolean>(false);

  const totalMonthlyHours = attendanceLog.reduce((acc, curr) => acc + curr.durationHours, 0);

  return (
    <div className="space-y-4">
      {/* Compact Hero Banner with Minor Rounding */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-4 sm:p-5 text-slate-950 shadow-sm border border-amber-400/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-950/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm border border-slate-950/10">
              <Sparkles className="h-3 w-3 text-slate-950" />
              Ethics Library Student Portal
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xs font-medium text-slate-900/90 max-w-lg leading-tight">
              Assigned desk <span className="underline font-bold font-mono">{user.currentSeat}</span> ({user.floor}) is reserved for your study session today.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setShowIdModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-amber-400 font-bold text-xs shadow-sm hover:bg-slate-900 transition-colors"
              >
                <QrCode className="h-3.5 w-3.5 text-amber-400" />
                <span>Gate Pass QR</span>
              </button>

              <button
                onClick={toggleCheckIn}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  isCheckedIn
                    ? 'bg-slate-950/20 text-slate-950 border border-slate-950/30'
                    : 'bg-white text-slate-950 hover:bg-slate-100'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCheckedIn ? 'bg-emerald-400' : 'bg-amber-600'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isCheckedIn ? 'bg-emerald-500' : 'bg-slate-950'}`}></span>
                </span>
                <span>{isCheckedIn ? `Checked In (${checkInTime || '08:30 AM'})` : 'Check-In Now'}</span>
              </button>
            </div>
          </div>

          {/* Quick Seat Status Box */}
          <div className="flex items-center gap-3 bg-slate-950/15 backdrop-blur-md rounded-lg p-3 border border-slate-950/15 shrink-0">
            <div className="flex px-3 py-2 items-center justify-center rounded-md bg-slate-950 text-amber-400 font-black font-mono text-base shadow whitespace-nowrap shrink-0">
              {user.currentSeat}
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="text-[10px] font-bold text-slate-900/80 uppercase">Desk Code</div>
              <div className="font-bold text-slate-950">{user.floor}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Link
          to="/seat"
          className="p-3 rounded-lg border border-border bg-card hover:border-amber-500/40 transition-all flex items-center gap-2.5 group shadow-2xs"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Armchair className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-foreground truncate">My Desk</div>
            <div className="text-[10px] text-muted-foreground truncate">Seat map & swap</div>
          </div>
        </Link>

        <Link
          to="/focus"
          className="p-3 rounded-lg border border-border bg-card hover:border-amber-500/40 transition-all flex items-center gap-2.5 group shadow-2xs"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Timer className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-foreground truncate">Focus Timer</div>
            <div className="text-[10px] text-muted-foreground truncate">Rain & Audio</div>
          </div>
        </Link>

        <Link
          to="/attendance"
          className="p-3 rounded-lg border border-border bg-card hover:border-amber-500/40 transition-all flex items-center gap-2.5 group shadow-2xs"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-foreground truncate">Attendance</div>
            <div className="text-[10px] text-muted-foreground truncate">Streak log</div>
          </div>
        </Link>

        <Link
          to="/support"
          className="p-3 rounded-lg border border-border bg-card hover:border-amber-500/40 transition-all flex items-center gap-2.5 group shadow-2xs"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-foreground truncate">Support</div>
            <div className="text-[10px] text-muted-foreground truncate">Helpdesk</div>
          </div>
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">Today's Study</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground">{todayHours.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">hrs</span></div>
          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Flame className="h-3 w-3" /> Target 8h
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">This Month</span>
            <Zap className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground">{totalMonthlyHours.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">hrs</span></div>
          <div className="text-[10px] text-muted-foreground">Top 5% active</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">Plan Validity</span>
            <Calendar className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground">{user.daysRemaining || 158} <span className="text-xs font-normal text-muted-foreground">days</span></div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">Exp: {user.validTill}</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">Locker</span>
            <Lock className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground">#42</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Key Active</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Tracker */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Turnstile Access Tracker</h2>
              <p className="text-[11px] text-muted-foreground">Real-time gate check-in status</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
              isCheckedIn ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500'
            }`}>
              <CheckCircle className="h-3 w-3" />
              {isCheckedIn ? 'Checked-In' : 'Checked-Out'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-lg bg-accent/30 border border-border">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Current Gate Status</div>
              <div className="text-base font-extrabold text-foreground">
                {isCheckedIn ? `In Library since ${checkInTime}` : 'Outside Library'}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isCheckedIn ? 'Tap Check-Out when leaving.' : 'Tap check-in upon arrival at your desk.'}
              </p>
            </div>

            <button
              onClick={toggleCheckIn}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs transition-all shadow ${
                isCheckedIn
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isCheckedIn ? 'Tap to Check-Out' : 'Tap to Check-In Now'}
            </button>
          </div>

          {/* Mini Check-In Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground">Recent Log</h3>
              <Link to="/attendance" className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1">
                View Log <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              {attendanceLog.slice(0, 3).map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    <div>
                      <span className="font-bold text-foreground">{rec.date}</span>
                      <span className="text-muted-foreground text-[11px] ml-1.5">({rec.checkIn} - {rec.checkOut || 'Present'})</span>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                    {rec.durationHours.toFixed(1)} hrs
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notices Column */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                <Bell className="h-3.5 w-3.5 text-amber-500" />
                <h2>Official Notices</h2>
              </div>
              <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md border border-amber-500/20">
                Updates
              </span>
            </div>

            <div className="space-y-2">
              {announcements.map((ann: Announcement) => (
                <div key={ann.id} className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate max-w-[160px]">{ann.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{ann.date}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <Link
              to="/seat"
              className="flex items-center justify-between w-full p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all font-bold text-xs"
            >
              <div className="flex items-center gap-1.5">
                <Armchair className="h-3.5 w-3.5" />
                <span>Interactive Desk Layout</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Digital ID Modal */}
      <DigitalIdModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />
    </div>
  );
};
