import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Signup: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully! Welcome to Ethics Library.");
      navigate('/');
    }, 700);
  };

  const isEmailValid = emailOrPhone.length > 3;

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-950/5 dark:bg-slate-950 transition-colors">
      {/* Full Width Responsive Container */}
      <div className="w-full max-w-md min-h-screen flex flex-col justify-between bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden">
        
        {/* Top Header Orange Section with ONLY "Sign In Instead" */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 w-full px-6 pt-12 pb-36 relative">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[11px] font-medium text-slate-950/90 hover:text-slate-950 transition-colors"
            >
              Sign In Instead
            </button>
          </div>
        </div>

        {/* Overlapping White Curved Content Sheet */}
        <div className="-mt-16 rounded-t-[32px] bg-white dark:bg-slate-900 px-6 pt-7 pb-8 flex-1 flex flex-col justify-between space-y-6 relative z-10 shadow-lg">
          
          <div className="space-y-4">
            {/* Title Header */}
            <div className="space-y-0.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Create your account
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Join Ethics Library Student Portal in seconds.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-3">
              {/* Full Name */}
              <div className="relative">
                <div className="flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 px-3.5 py-2.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <User className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email or Mobile */}
              <div className="relative">
                <div className={`flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border px-3.5 py-2.5 transition-all ${
                  isEmailValid 
                    ? 'border-emerald-500/40 dark:border-emerald-500/30' 
                    : 'border-slate-200 dark:border-slate-750 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20'
                }`}>
                  <Mail className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email Address or Mobile Number"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    required
                  />
                  {isEmailValid && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/20 shrink-0 ml-2" />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <div className="flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 px-3.5 py-2.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <Lock className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none tracking-wider"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0 ml-2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <div className="flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 px-3.5 py-2.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none tracking-wider"
                    required
                  />
                </div>
              </div>

              {/* Agree Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 accent-amber-500 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-[11px] font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                  I agree to <span className="font-bold text-amber-600 dark:text-amber-400">Library Rules & Code of Ethics</span>
                </label>
              </div>

              {/* Primary Amber Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-75"
                >
                  {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Sign In Link */}
          <div className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
