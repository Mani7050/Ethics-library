import React from 'react';
import { useMember } from '../../context/MemberContext';
import { Bell, X, AlertCircle } from 'lucide-react';

interface NoticesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoticesDrawer: React.FC<NoticesDrawerProps> = ({ isOpen, onClose }) => {
  const { announcements } = useMember();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-card border-l border-border h-full flex flex-col justify-between shadow-2xl p-4 space-y-4">
        <div className="space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
              <Bell className="h-4 w-4 text-amber-500" />
              <h2>Notice Board</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-lg bg-accent/20 border border-border space-y-1.5 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      ann.priority === 'high'
                        ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                        : ann.priority === 'medium'
                        ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                    }`}
                  >
                    <AlertCircle className="h-2.5 w-2.5" />
                    {ann.category}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{ann.date}</span>
                </div>

                <h3 className="text-xs font-bold text-foreground">{ann.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-snug">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-2xs"
          >
            Close Notice Board
          </button>
        </div>
      </div>
    </div>
  );
};
