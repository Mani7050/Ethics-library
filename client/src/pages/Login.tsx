import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setAuthStart, setAuthSuccess, setAuthFailure } from '../store/slices/memberSlice';

import { API_BASE_URL } from '../config/api';

export const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false);
    setErrorMessage(null);
    dispatch(setAuthStart());

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      dispatch(
        setAuthSuccess({
          token: data.token,
          user: data.user,
          rememberMe,
        })
      );
      setIsLoading(false);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err.message);
      const errorText = err.message || 'Login failed. Invalid credentials.';
      setErrorMessage(errorText);
      dispatch(setAuthFailure(errorText));
      setIsLoading(false);
    }
  };

  const isEmailValid = emailOrPhone.length > 3;

  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-950/5 dark:bg-slate-950 transition-colors">
      {/* Full Width Responsive Container */}
      <div className="w-full max-w-md min-h-screen flex flex-col justify-between bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden">
        
        {/* Top Header Orange Section */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 w-full px-6 pt-12 pb-36 relative">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => alert("Password reset link sent to your registered email!")}
              className="text-[11px] font-medium text-slate-950/90 hover:text-slate-950 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Overlapping White Curved Content Sheet */}
        <div className="-mt-16 rounded-t-[32px] bg-white dark:bg-slate-900 px-6 pt-7 pb-8 flex-1 flex flex-col justify-between space-y-6 relative z-10 shadow-lg">
          
          <div className="space-y-5">
            {/* Title Header */}
            <div className="space-y-0.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Let's sign you in
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Good to see you back.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Field 1: Email / Username */}
              <div className="relative">
                <div className={`flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border px-3.5 py-2.5 transition-all ${
                  isEmailValid 
                    ? 'border-emerald-500/40 dark:border-emerald-500/30' 
                    : 'border-slate-200 dark:border-slate-750 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20'
                }`}>
                  <User className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email or Mobile"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    required
                  />
                  {isEmailValid && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-500/20 shrink-0 ml-2" />
                  )}
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="relative">
                <div className="flex items-center rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 px-3.5 py-2.5 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <Lock className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
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

              {/* Remember Me Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Remember me next time
                </span>

                {/* Primary Amber Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    rememberMe ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      rememberMe ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Primary Amber Submit Button */}
              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-75"
                >
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Create Account Row */}
          <div className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Create account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

