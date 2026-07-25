import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import {
  User,
  Mail,
  Phone,
  Shield,
  QrCode,
  CheckCircle,
  Calendar,
  LogOut,
  Edit3,
  Save,
  Award,
  BookOpen,
  Lock,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Flame,
  Clock,
  KeyRound,
  Check,
  Camera,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DigitalIdModal } from '../components/modals/DigitalIdModal';

export const Profile: React.FC = () => {
  const { user, isDarkMode, toggleDarkMode, updateUserProfile } = useMember();
  const [showIdModal, setShowIdModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'membership' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: user.name || 'Mani Kumar',
    email: user.email || 'mani@gmail.com',
    phone: user.phone || '+91 98765 43210',
    targetExam: 'UPSC Civil Services / BPSC',
    dailyTargetHours: '8',
    emergencyContact: '+91 98765 00000',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            Member Account & Profile
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Manage your personal information, membership details, and portal security settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIdModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs cursor-pointer transition-all"
          >
            <QrCode className="h-4 w-4" />
            <span>Digital ID Pass</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold text-xs shadow-2xs cursor-pointer transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-amber-500/10 via-card to-card p-4 sm:p-5 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Avatar Container with Edit Camera Overlay */}
            <div className="relative group shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl border-2 border-amber-500 object-cover shadow-md"
              />
              <button
                className="absolute inset-0 bg-slate-950/60 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                  <CheckCircle className="h-2.5 w-2.5" /> VERIFIED MEMBER
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Sparkles className="h-2.5 w-2.5" /> {formData.targetExam}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">{user.name}</h2>

              <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                <span>ID: <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">{user.membershipId}</code></span>
                <span>&bull;</span>
                <span>Seat: <strong className="text-foreground">{user.currentSeat}</strong> ({user.floor})</span>
              </div>
            </div>
          </div>

          {/* Quick Member Stats */}
          <div className="flex items-center gap-2 bg-card p-2.5 rounded-lg border border-border shrink-0 self-start sm:self-auto">
            <div className="text-center px-3 py-1 border-r border-border">
              <div className="text-[10px] text-muted-foreground font-bold uppercase">Streak</div>
              <div className="text-sm font-extrabold text-amber-500 flex items-center justify-center gap-0.5">
                <Flame className="h-3.5 w-3.5 fill-amber-500" /> 14 Days
              </div>
            </div>
            <div className="text-center px-3 py-1">
              <div className="text-[10px] text-muted-foreground font-bold uppercase">Total Study</div>
              <div className="text-sm font-extrabold text-foreground flex items-center justify-center gap-0.5">
                <Clock className="h-3.5 w-3.5 text-blue-500" /> 284 hrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-card text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab('membership')}
          className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'membership'
              ? 'bg-card text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Plan & Locker Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-card text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Preferences & Security</span>
        </button>
      </div>

      {/* TAB 1: Personal Information Form */}
      {activeTab === 'profile' && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Personal & Contact Info</h3>
              <p className="text-[11px] text-muted-foreground">Keep your contact details up to date for library notices</p>
            </div>

            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <Check className="h-3.5 w-3.5" /> Saved Successfully!
              </span>
            )}

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-accent/30 text-xs font-bold text-foreground hover:border-amber-500/40 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                <span>Edit Info</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground px-2"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                    required
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-amber-500" /> {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                    required
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-amber-500" /> {user.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                    required
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-amber-500" /> {user.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Target Exam Goal</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.targetExam}
                    onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-amber-500" /> {formData.targetExam}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Daily Study Goal (Hours)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.dailyTargetHours}
                    onChange={(e) => setFormData({ ...formData, dailyTargetHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> {formData.dailyTargetHours} Hours / Day
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-amber-500" /> {formData.emergencyContact}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 2: Membership & Subscription Details */}
      {activeTab === 'membership' && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Active Plan & Facilities</h3>
            <p className="text-[11px] text-muted-foreground">Your subscription validity and assigned physical seat allocation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-accent/20 border border-border space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Current Membership Plan</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400">{user.planName}</div>
              <div className="text-[11px] text-muted-foreground">Full Day Access (07:00 AM - 11:00 PM)</div>
            </div>

            <div className="p-3.5 rounded-lg bg-accent/20 border border-border space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Validity & Expiry</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{user.daysRemaining || 158} Days Remaining</div>
              <div className="text-[11px] text-muted-foreground">Expires on: {user.validTill || '2026-12-31'}</div>
            </div>

            <div className="p-3.5 rounded-lg bg-accent/20 border border-border space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Reserved Desk & Floor</div>
              <div className="text-base font-black text-foreground">{user.currentSeat} &bull; {user.floor}</div>
              <div className="text-[11px] text-muted-foreground">Silent Zone with Dedicated 240V Outlet & Desk Lamp</div>
            </div>

            <div className="p-3.5 rounded-lg bg-accent/20 border border-border space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Locker Facility</div>
              <div className="text-base font-black text-foreground">Locker #42 (Active)</div>
              <div className="text-[11px] text-muted-foreground">Personal key issued by library reception</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Preferences & Security */}
      {activeTab === 'security' && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">App Preferences & Security</h3>
            <p className="text-[11px] text-muted-foreground">Customize your portal experience and account password</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Dark Mode Switcher */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border">
              <div className="flex items-center gap-2.5">
                {isDarkMode ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                <div>
                  <div className="font-bold text-foreground">Theme Preference</div>
                  <div className="text-[10px] text-muted-foreground">Currently using {isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-2xs cursor-pointer"
              >
                Toggle Theme
              </button>
            </div>

            {/* Change Password Box */}
            <div className="p-3.5 rounded-lg bg-accent/20 border border-border space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <KeyRound className="h-4 w-4 text-amber-500" />
                <span>Security & Password</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:border-amber-500/40 transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital ID Pass Modal */}
      <DigitalIdModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />
    </div>
  );
};
