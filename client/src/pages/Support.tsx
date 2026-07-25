import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { LifeBuoy, Plus, CheckCircle } from 'lucide-react';
import { SupportTicket } from '../types';

export const Support: React.FC = () => {
  const { tickets, addTicket } = useMember();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'AC / Climate' | 'Wi-Fi / Internet' | 'Locker' | 'Seat Issue' | 'Cleanliness' | 'Other'>('AC / Climate');
  const [description, setDescription] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    addTicket({ subject, category, message: description });
    setSubject('');
    setDescription('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-amber-500" />
            Member Helpdesk & Tickets
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Report issues regarding AC temperature, Wi-Fi connectivity, or seat maintenance
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Raise Support Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-sm">
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">Your Submitted Support Tickets</h2>

        <div className="space-y-2">
          {tickets.map((t: SupportTicket) => (
            <div key={t.id} className="p-3 rounded-lg bg-accent/20 border border-border space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{t.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    {t.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{t.createdAt}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{t.message}</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                <CheckCircle className="h-3 w-3" /> Status: {t.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raise Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xs font-bold text-foreground">Raise Support Ticket</h3>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-muted-foreground text-xs">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC cooling low in Zone A"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="AC / Climate">Air Conditioning</option>
                  <option value="Wi-Fi / Internet">Wi-Fi & Internet</option>
                  <option value="Seat Issue">Seat & Furniture</option>
                  <option value="Locker">Locker</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="w-1/2 py-2 rounded-lg border border-border text-xs font-bold text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
