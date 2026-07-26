import React, { useState, useEffect } from 'react';
import { useMember } from '../context/MemberContext';
import { API_BASE_URL } from '../config/api';
import {
  User,
  Mail,
  Phone,
  Shield,
  QrCode,
  CheckCircle2,
  LogOut,
  Edit3,
  Save,
  Award,
  BookOpen,
  Lock,
  Sun,
  Moon,
  Flame,
  Clock,
  KeyRound,
  Check,
  Camera,
  MapPin,
  Sparkles,
  Copy,
  LifeBuoy,
  Send,
  HelpCircle,
  MessageSquare,
  Headphones,
  FileText,
  UploadCloud,
  ShieldCheck,
  AlertCircle,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DigitalIdModal } from '../components/modals/DigitalIdModal';

export const Profile: React.FC = () => {
  const { user, isDarkMode, toggleDarkMode, updateUserProfile, logout } = useMember();
  const [showIdModal, setShowIdModal] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'membership' | 'security' | 'support'>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [ticketSuccess, setTicketSuccess] = useState<boolean>(false);
  const [docSuccessMsg, setDocSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: user.name || 'Mani Kumar',
    email: user.email || 'mani@gmail.com',
    phone: user.phone || '+91 98765 43210',
    targetExam: user.targetExam || 'UPSC Civil Services / BPSC',
    dailyTargetHours: user.dailyTargetHours || '8',
    emergencyContact: user.emergencyContact || '+91 98765 00000',
  });

  // Sync formData whenever user context changes
  useEffect(() => {
    setFormData({
      name: user.name || 'Mani Kumar',
      email: user.email || 'mani@gmail.com',
      phone: user.phone || '+91 98765 43210',
      targetExam: user.targetExam || 'UPSC Civil Services / BPSC',
      dailyTargetHours: user.dailyTargetHours || '8',
      emergencyContact: user.emergencyContact || '+91 98765 00000',
    });
  }, [user]);

  // Fetch latest profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = localStorage.getItem('ethics_token') || sessionStorage.getItem('ethics_token');
        if (!storedToken) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            updateUserProfile(data.user);
          }
        }
      } catch (err) {
        console.warn('Could not fetch updated user profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // KYC Documents State
  const [documents, setDocuments] = useState({
    aadhaar: { number: '5412 8990 8821', status: 'verified', fileName: 'aadhaar_front_back.pdf', date: '10 Jan 2026' },
    pan: { number: 'ABCDE1234F', status: 'verified', fileName: 'pan_card_copy.jpg', date: '12 Jan 2026' },
    voter: { number: 'WB/12/045/8821', status: 'pending', fileName: 'voter_id_front.png', date: '22 Jul 2026' },
  });

  const [uploadInputs, setUploadInputs] = useState({
    aadhaarNumber: '5412 8990 8821',
    panNumber: 'ABCDE1234F',
    voterNumber: 'WB/12/045/8821',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  const [ticketForm, setTicketForm] = useState({
    category: 'Wi-Fi & Internet',
    subject: '',
    description: '',
  });

  const handleDocUpload = (docType: 'aadhaar' | 'pan' | 'voter', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        number: uploadInputs[`${docType}Number` as keyof typeof uploadInputs] || 'Uploaded Document',
        status: 'pending',
        fileName: file.name,
        date: 'Today',
      },
    }));

    setDocSuccessMsg(`${docType.toUpperCase()} document uploaded! Pending Admin Verification.`);
    setTimeout(() => setDocSuccessMsg(null), 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields = {
      name: formData.name,
      phone: formData.phone,
      targetExam: formData.targetExam,
      dailyTargetHours: formData.dailyTargetHours,
      emergencyContact: formData.emergencyContact,
    };

    try {
      const storedToken = localStorage.getItem('ethics_token') || sessionStorage.getItem('ethics_token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();
      if (data.user) {
        updateUserProfile({ ...updatedFields, ...data.user });
      } else {
        updateUserProfile(updatedFields);
      }
    } catch (err) {
      console.warn('API update failed, updating local state:', err);
      updateUserProfile(updatedFields);
    }

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPass || passwordForm.newPass !== passwordForm.confirmPass) {
      alert('New passwords do not match!');
      return;
    }
    setPasswordSuccess(true);
    setPasswordForm({ current: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.description) return;
    setTicketSuccess(true);
    setTicketForm({ category: 'Wi-Fi & Internet', subject: '', description: '' });
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.membershipId || 'ETH-2026-8842');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.85);

          // 1. Immediately update UI local & Redux state
          updateUserProfile({ avatar: resizedBase64 });

          // 2. Persist to Backend API
          try {
            const storedToken = localStorage.getItem('ethics_token') || sessionStorage.getItem('ethics_token');
            const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(storedToken && { Authorization: `Bearer ${storedToken}` }),
              },
              body: JSON.stringify({ avatar: resizedBase64 }),
            });
            const data = await response.json();
            if (data.user) {
              updateUserProfile(data.user);
            }
          } catch (err) {
            console.warn('Failed to persist avatar update to server:', err);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* ⚪ CLEAN MINIMALIST MEMBER HEADER CARD */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                alt={user.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop';
                }}
                onClick={() => setShowPhotoModal(true)}
                className="h-20 w-20 rounded-2xl border border-border object-cover shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                title="Click to view full profile photo"
              />
              <div className="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="View Full Photo"
                >
                  <Eye className="h-4 w-4 text-white" />
                </button>
                <label
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="Change Photo"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED MEMBER
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-3 w-3" /> {formData.targetExam}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-foreground tracking-tight">{user.name}</h1>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground font-medium flex-wrap">
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                  title="Click to copy Member ID"
                >
                  <span>Member ID:</span>
                  <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">{user.membershipId}</code>
                  {copiedId ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                </button>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-foreground font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  Desk {user.currentSeat} ({user.floor})
                </span>
              </div>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowIdModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <QrCode className="h-4 w-4" />
              <span>Digital ID</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-border text-center">
          <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Desk Allocated</div>
            <div className="text-sm font-extrabold text-foreground mt-0.5">{user.currentSeat}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Plan Validity</div>
            <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{user.daysRemaining || 158} Days</div>
          </div>
          <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Daily Goal</div>
            <div className="text-sm font-extrabold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {formData.dailyTargetHours} Hours
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">Study Streak</div>
            <div className="text-sm font-extrabold text-amber-500 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-amber-500" /> 14 Days
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 RESPONSIVE SEGMENTED TABS CONTAINER (NO CUTOFF) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-xl bg-accent/40 border border-border shadow-2xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">Personal</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">KYC & Docs</span>
        </button>

        <button
          onClick={() => setActiveTab('membership')}
          className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'membership'
              ? 'bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">Plan & Desk</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">Security</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'support'
              ? 'bg-card text-amber-600 dark:text-amber-400 shadow-sm border border-border font-extrabold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LifeBuoy className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">Support</span>
        </button>
      </div>

      {/* 📄 TAB 1: Personal Information */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Personal & Contact Details</h3>
              <p className="text-[11px] text-muted-foreground">Keep your contact info up to date</p>
            </div>

            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                <Check className="h-3.5 w-3.5" /> Saved!
              </span>
            )}

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-accent/30 text-xs font-bold text-foreground hover:border-amber-500/40 transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                <span>Edit Profile</span>
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
                  <div className="p-3 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2.5">
                    <User className="h-4 w-4 text-amber-500 shrink-0" /> {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center justify-between">
                  <span>Email Address</span>
                  {isEditing && (
                    <span className="text-[10px] normal-case text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Non-editable
                    </span>
                  )}
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email || formData.email}
                      disabled
                      readOnly
                      title="Email address cannot be modified"
                      className="w-full px-3 py-2 pr-9 rounded-lg bg-accent/30 border border-border text-xs text-muted-foreground font-semibold cursor-not-allowed select-none opacity-75"
                    />
                    <Lock className="h-3.5 w-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-amber-500 shrink-0" /> {user.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Mobile Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                    required
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-amber-500 shrink-0" /> {user.phone}
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
                  <div className="p-3 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 text-amber-500 shrink-0" /> {formData.targetExam}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Daily Study Target (Hours)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.dailyTargetHours}
                    onChange={(e) => setFormData({ ...formData, dailyTargetHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                  />
                ) : (
                  <div className="p-3 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-amber-500 shrink-0" /> {formData.dailyTargetHours} Hours / Day
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
                  <div className="p-3 rounded-lg bg-accent/20 border border-border font-bold text-foreground flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-amber-500 shrink-0" /> {formData.emergencyContact}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-2xs cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* 📁 TAB 2: KYC & Document Verification */}
      {activeTab === 'documents' && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" /> Identity & KYC Document Verification
              </h3>
              <p className="text-[11px] text-muted-foreground">Upload official government documents for library desk security & verification</p>
            </div>

            {docSuccessMsg && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                <Check className="h-3.5 w-3.5" /> {docSuccessMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Aadhaar Card Upload Card */}
            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <span>Aadhaar Card</span>
                  </div>
                  {documents.aadhaar.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <AlertCircle className="h-3 w-3" /> PENDING
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">Aadhaar Number (12 Digits)</label>
                  <input
                    type="text"
                    value={uploadInputs.aadhaarNumber}
                    onChange={(e) => setUploadInputs({ ...uploadInputs, aadhaarNumber: e.target.value })}
                    placeholder="12-digit Aadhaar Number"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {documents.aadhaar.fileName && (
                  <div className="p-2 rounded-lg bg-card border border-border text-[11px] flex items-center justify-between">
                    <div className="truncate max-w-[140px] font-medium text-foreground">
                      📄 {documents.aadhaar.fileName}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{documents.aadhaar.date}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs">
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Aadhaar PDF / Photo</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocUpload('aadhaar', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 2. PAN Card Upload Card */}
            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <span>PAN Card</span>
                  </div>
                  {documents.pan.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <AlertCircle className="h-3 w-3" /> PENDING
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">PAN Number (10 Alphanumeric)</label>
                  <input
                    type="text"
                    value={uploadInputs.panNumber}
                    onChange={(e) => setUploadInputs({ ...uploadInputs, panNumber: e.target.value })}
                    placeholder="10-char PAN Number"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                {documents.pan.fileName && (
                  <div className="p-2 rounded-lg bg-card border border-border text-[11px] flex items-center justify-between">
                    <div className="truncate max-w-[140px] font-medium text-foreground">
                      📄 {documents.pan.fileName}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{documents.pan.date}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs">
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload PAN Card Image</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocUpload('pan', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 3. Voter ID / Driving License Card */}
            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <span>Voter ID / Driving License</span>
                  </div>
                  {documents.voter.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <AlertCircle className="h-3 w-3" /> PENDING
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground">EPIC / License Number</label>
                  <input
                    type="text"
                    value={uploadInputs.voterNumber}
                    onChange={(e) => setUploadInputs({ ...uploadInputs, voterNumber: e.target.value })}
                    placeholder="Voter ID / DL Number"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {documents.voter.fileName && (
                  <div className="p-2 rounded-lg bg-card border border-border text-[11px] flex items-center justify-between">
                    <div className="truncate max-w-[140px] font-medium text-foreground">
                      📄 {documents.voter.fileName}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{documents.voter.date}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs">
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Voter ID / DL</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocUpload('voter', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💳 TAB 2: Membership Details */}
      {activeTab === 'membership' && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Active Plan & Desk Allocation</h3>
            <p className="text-[11px] text-muted-foreground">Subscription validity and allocated physical facilities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-1.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Current Membership Plan</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400">{user.planName}</div>
              <p className="text-[11px] text-muted-foreground">Full Day Access (07:00 AM - 11:00 PM)</p>
            </div>

            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-1.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Validity & Expiry</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{user.daysRemaining || 158} Days Remaining</div>
              <p className="text-[11px] text-muted-foreground">Expires on: {user.validTill || '2026-12-31'}</p>
            </div>

            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-1.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Reserved Desk & Floor</div>
              <div className="text-base font-black text-foreground">{user.currentSeat} &bull; {user.floor}</div>
              <p className="text-[11px] text-muted-foreground">Silent Zone with Dedicated 240V Outlet & Desk Lamp</p>
            </div>

            <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-1.5">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Locker Facility</div>
              <div className="text-base font-black text-foreground">Locker Slot #42 (Active)</div>
              <p className="text-[11px] text-muted-foreground">Personal key issued by reception</p>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 TAB 3: Preferences & Security */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Preferences & Security</h3>
            <p className="text-[11px] text-muted-foreground">Theme toggle and account password updates</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Dark Mode Switcher */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/20 border border-border">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="h-5 w-5 text-amber-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <div className="font-bold text-foreground">Theme Preference</div>
                  <div className="text-[11px] text-muted-foreground">Currently using {isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Switch Theme
              </button>
            </div>

            {/* Change Password Box */}
            <form onSubmit={handlePasswordChange} className="p-4 rounded-xl bg-accent/20 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <KeyRound className="h-4 w-4 text-amber-500" />
                  <span>Security & Password</span>
                </div>

                {passwordSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    <Check className="h-3.5 w-3.5" /> Updated!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  placeholder="Current Password"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  placeholder="New Password"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="password"
                  value={passwordForm.confirmPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                  placeholder="Confirm New Password"
                  className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:border-amber-500/40 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎧 TAB 4: Help & Support Desk */}
      {activeTab === 'support' && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-amber-500" /> Member Helpdesk & Support
              </h3>
              <p className="text-[11px] text-muted-foreground">Submit requests or connect directly with library administration</p>
            </div>

            {ticketSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                <Check className="h-3.5 w-3.5" /> Ticket Submitted to Admin!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Ticket Submission Form */}
            <div className="md:col-span-2 space-y-4">
              <form onSubmit={handleTicketSubmit} className="p-4 rounded-xl bg-accent/20 border border-border space-y-3.5">
                <div className="text-xs font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <span>Raise a Support Ticket</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="Wi-Fi & Internet">Wi-Fi & Internet Issue</option>
                      <option value="AC & Cooling">AC & Temperature Control</option>
                      <option value="Desk & Lighting">Desk, Plug or Lamp Issue</option>
                      <option value="Locker Service">Locker Key & Access</option>
                      <option value="Noise Complaint">Silence & Noise Complaint</option>
                      <option value="Plan & Billing">Plan Renewal & Payments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief topic..."
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">Description / Details</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your issue or request..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-amber-500 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Direct Admin Contact Info */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-3 text-xs">
                <div className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-amber-500" />
                  <span>Direct Help Contacts</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-card border border-border space-y-0.5">
                    <div className="font-bold text-foreground">Reception Help Desk</div>
                    <div className="text-muted-foreground">Ext: 101 / Counter Ground Floor</div>
                    <div className="text-amber-600 dark:text-amber-400 font-mono font-bold">+91 98765 43210</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                    <div className="font-bold text-foreground">Library Email Support</div>
                    <div className="text-amber-600 dark:text-amber-400 font-mono font-bold">support@ethicslibrary.com</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                    <div className="font-bold text-foreground">Operating Hours</div>
                    <div className="text-muted-foreground">07:00 AM - 11:00 PM (Daily)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital ID Pass Modal */}
      <DigitalIdModal isOpen={showIdModal} onClose={() => setShowIdModal(false)} />

      {/* 🖼️ PROFILE PHOTO LIGHTBOX PREVIEW MODAL */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-center overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-500" /> Profile Photo Preview
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Full Photo View */}
            <div className="relative flex justify-center py-2">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                alt={user.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop';
                }}
                className="max-h-72 w-auto max-w-full rounded-2xl border-2 border-amber-500/40 object-cover shadow-lg"
              />
            </div>

            {/* Member Details */}
            <div className="space-y-0.5">
              <h4 className="text-base font-extrabold text-foreground">{user.name}</h4>
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">{user.membershipId}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5">
                <Camera className="h-4 w-4" />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleAvatarChange(e);
                    setShowPhotoModal(false);
                  }}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2.5 rounded-xl bg-accent border border-border text-xs font-bold text-foreground hover:bg-accent/80 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


