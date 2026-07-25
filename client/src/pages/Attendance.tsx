import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { CalendarCheck, Clock, CheckCircle, Flame, Download, Award, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Attendance: React.FC = () => {
  const { attendanceLog, user } = useMember();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const chartDataWeekly = [
    { day: 'Mon', hours: 10.0 },
    { day: 'Tue', hours: 12.5 },
    { day: 'Wed', hours: 11.5 },
    { day: 'Thu', hours: 12.75 },
    { day: 'Fri', hours: 6.5 },
    { day: 'Sat', hours: 9.0 },
    { day: 'Sun', hours: 11.0 },
  ];

  const chartDataMonthly = [
    { day: 'W1', hours: 68.5 },
    { day: 'W2', hours: 74.0 },
    { day: 'W3', hours: 82.5 },
    { day: 'W4', hours: 79.0 },
  ];

  // Generate 28-day compact heatmap
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const dayNum = 28 - i;
    const hoursLogged = [0, 11.5, 12.0, 9.5, 13.0, 6.5, 10.5, 12.75, 8.0, 11.0, 0, 12.5, 10.0][i % 13];
    return {
      dayNum,
      hoursLogged,
      date: `Jul ${dayNum}`
    };
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-amber-500" />
            Attendance & Study Analytics
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Gate check-ins, daily study hours, and consistency streak
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-accent transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-amber-500" />
          Export Log (PDF)
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">Monthly Study</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">148.5 <span className="text-xs font-normal text-muted-foreground">Hours</span></div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+18% vs last month</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">Study Streak</span>
            <Flame className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">14 <span className="text-xs font-normal text-muted-foreground">Days</span></div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Consistent badge active</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold">Avg. Daily</span>
            <Award className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">10.6 <span className="text-xs font-normal text-muted-foreground">Hours/Day</span></div>
          <p className="text-[10px] text-muted-foreground">Shift: {user.shift}</p>
        </div>
      </div>

      {/* Compact Activity Heatmap */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 text-amber-500" />
              Monthly Study Heatmap
            </h2>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded bg-accent border border-border"></span>
            <span className="h-2.5 w-2.5 rounded bg-amber-500/30"></span>
            <span className="h-2.5 w-2.5 rounded bg-amber-500"></span>
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 p-3 rounded-xl bg-accent/20 border border-border max-w-xl mx-auto">
          {heatmapDays.map((day, idx) => {
            let bgClass = 'bg-accent/40 text-muted-foreground border-border/50';
            if (day.hoursLogged > 10) bgClass = 'bg-amber-500 text-slate-950 font-black shadow-2xs';
            else if (day.hoursLogged > 6) bgClass = 'bg-amber-500/60 text-slate-950 font-bold';
            else if (day.hoursLogged > 0) bgClass = 'bg-amber-500/30 text-foreground font-semibold';

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] aspect-square transition-all hover:scale-105 cursor-pointer ${bgClass}`}
                title={`${day.date}: ${day.hoursLogged} hours`}
              >
                <span className="text-[8px] opacity-75">{day.date}</span>
                <span className="font-mono text-[9px] font-bold">{day.hoursLogged > 0 ? `${day.hoursLogged}h` : '-'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Study Hours Analytics</h2>

          <div className="flex items-center bg-accent/50 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                timeframe === 'weekly' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                timeframe === 'monthly' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeframe === 'weekly' ? chartDataWeekly : chartDataMonthly}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}h`} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="hours" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Check-In History Log Table & Mobile Cards */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Gate Check-In History</h2>
          <span className="text-[10px] text-muted-foreground font-mono">Turnstile Records</span>
        </div>

        {/* Mobile View: Compact Mobile Cards (shown on mobile, hidden on sm+) */}
        <div className="space-y-2 sm:hidden">
          {attendanceLog.map((rec) => (
            <div key={rec.id} className="p-3 rounded-xl bg-accent/20 border border-border flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{rec.date}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px] border border-amber-500/20">
                    {rec.seatNumber}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground font-medium">
                  {rec.checkIn} &bull; {rec.checkOut || 'In Progress'}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="font-extrabold text-foreground">{rec.durationHours.toFixed(1)} hrs</div>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  rec.status === 'in_progress'
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                }`}>
                  <CheckCircle className="h-2.5 w-2.5" />
                  {rec.status === 'in_progress' ? 'Active' : 'Done'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table (hidden on mobile, shown on sm+) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px]">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Desk</th>
                <th className="py-2 px-3">Check In</th>
                <th className="py-2 px-3">Check Out</th>
                <th className="py-2 px-3">Hours</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {attendanceLog.map((rec) => (
                <tr key={rec.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-foreground">{rec.date}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">{rec.seatNumber}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{rec.checkIn}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{rec.checkOut || 'In Progress'}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{rec.durationHours.toFixed(1)} hrs</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'in_progress'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}>
                      <CheckCircle className="h-2.5 w-2.5" />
                      {rec.status === 'in_progress' ? 'Active' : 'Done'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
