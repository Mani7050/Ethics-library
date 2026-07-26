import React, { useEffect, useState } from 'react';
import { useMember } from '../context/MemberContext';
import { CreditCard, CheckCircle, Clock, Calendar, Zap, ArrowUpRight, Award, Gem, ShieldCheck, Layers, X, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const Membership: React.FC = () => {
  const { user, updateUserProfile, token } = useMember();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE_URL}/api/plans`, { headers });
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        } else {
          throw new Error('Failed to load plans');
        }
      } catch (err) {
        setPlans([
          { id: '1', name: "General Library Access", price: "₹800", duration: "Monthly", type: "Standard", desc: "Access to common hall reading tables, high-speed Wi-Fi, and standard seating.", iconName: "Award" },
          { id: '2', name: "Premium Reading Desk", price: "₹1,500", duration: "Monthly", type: "Reserved", desc: "Assigned reserved reading desk, private study lamp, locker access, and personal socket.", iconName: "Gem" },
          { id: '3', name: "VIP Quiet Cabin", price: "₹3,000", duration: "Monthly", type: "Private", desc: "Personal private partition cabin, noise cancellation chamber, ergonomic office chair.", iconName: "ShieldCheck" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getIcon = (plan: any) => {
    if (plan.iconName === 'Gem' || plan.name?.includes('Premium')) return <Gem className="h-5 w-5 text-amber-500" />;
    if (plan.iconName === 'ShieldCheck' || plan.name?.includes('VIP')) return <ShieldCheck className="h-5 w-5 text-purple-500" />;
    return <Award className="h-5 w-5 text-blue-500" />;
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlanForUpgrade) return;
    setIsUpdating(true);
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ planName: selectedPlanForUpgrade.name })
        });
      }
      updateUserProfile({ planName: selectedPlanForUpgrade.name });
      setSuccessMsg(`Successfully upgraded to "${selectedPlanForUpgrade.name}"!`);
      setSelectedPlanForUpgrade(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      updateUserProfile({ planName: selectedPlanForUpgrade.name });
      setSuccessMsg(`Plan updated to "${selectedPlanForUpgrade.name}"!`);
      setSelectedPlanForUpgrade(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
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

        <button 
          onClick={() => {
            if (plans.length > 0) setSelectedPlanForUpgrade(plans[0]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <span>Renew / Change Subscription</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:opacity-80">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Plan Details Card */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle className="h-3 w-3" /> ACTIVE PLAN
            </span>
            <h2 className="text-lg font-extrabold text-foreground">{user?.planName || 'General Library Access'}</h2>
            <p className="text-[11px] text-muted-foreground">Full Day Dedicated Desk Access &bull; AC Hall</p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {plans.find(p => p.name?.toLowerCase() === user?.planName?.toLowerCase())?.price || '₹1,500'} 
              <span className="text-xs font-semibold text-muted-foreground">/ month</span>
            </div>
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
            <div className="font-bold text-amber-600 dark:text-amber-400">{user?.planExpiryDate || '30 Aug 2026'}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Days Left</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">{user?.planDaysLeft || 35} Days Remaining</div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent/20 border border-border space-y-0.5">
            <span className="text-[10px] text-muted-foreground">Locker Access</span>
            <div className="font-bold text-foreground">Locker #{user?.lockerNumber || '04'} (Included)</div>
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

      {/* All Available Membership Tiers & Plans */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-500" />
              Available Membership Plans & Tiers (Created by Admin)
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Select or upgrade to any plan configured by the library administrator
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-medium border border-dashed rounded-xl">
            Loading membership plans from database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p, idx) => {
              const isCurrent = user?.planName?.toLowerCase() === p.name?.toLowerCase();
              return (
                <div
                  key={p.id || idx}
                  className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 shadow-xs relative transition-all ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20'
                      : 'border-border bg-card hover:border-amber-500/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/60 text-muted-foreground border border-border">
                        {p.type || 'Standard'}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle className="h-2.5 w-2.5" /> Active Plan
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {getIcon(p)}
                      <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{p.price}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">/ {p.duration || 'Monthly'}</span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/80">
                    <button
                      onClick={() => !isCurrent && setSelectedPlanForUpgrade(p)}
                      disabled={isCurrent}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-accent/60 text-muted-foreground cursor-default border border-border'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs active:scale-[0.98]'
                      }`}
                    >
                      {isCurrent ? 'Current Active Pass' : 'Select / Upgrade Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan Upgrade Confirmation Modal */}
      {selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-base text-foreground">Confirm Plan Subscription</h3>
              </div>
              <button 
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Selected Plan
                </span>
                <div className="text-base font-extrabold text-foreground">{selectedPlanForUpgrade.name}</div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {selectedPlanForUpgrade.price} <span className="text-xs font-normal text-muted-foreground">/ {selectedPlanForUpgrade.duration || 'Monthly'}</span>
                </div>
                <p className="text-xs text-muted-foreground pt-1">{selectedPlanForUpgrade.desc}</p>
              </div>

              <div className="text-xs space-y-2 p-3 rounded-xl bg-accent/20 border border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Student Name:</span>
                  <span className="font-bold text-foreground">{user?.name}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Membership ID:</span>
                  <span className="font-bold text-foreground">{user?.membershipId}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Status:</span>
                  <span className="font-bold text-emerald-600">Pay at Reception / UPI</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpgrade}
                disabled={isUpdating}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Activating...' : 'Activate Plan Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
