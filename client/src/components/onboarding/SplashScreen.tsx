import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onFinish();
      }, 500); // 500ms fade out transition
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-amber-500 p-8 text-slate-950 transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Empty Spacer for Centering */}
      <div className="pt-4"></div>

      {/* Center Logo & Title Block */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Outer White Square Logo Card */}
        <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-white shadow-2xl p-3 border border-white/40 transform hover:scale-105 transition-transform">
          {/* Inner Primary Amber Emblem */}
          <div className="h-full w-full rounded-xl bg-amber-500 flex flex-col items-center justify-center shadow-sm">
            <span className="font-black text-3xl sm:text-4xl text-slate-950 leading-none tracking-tighter">
              E
            </span>
            <span className="text-[7px] font-black text-slate-950/90 tracking-widest leading-none mt-1">
              ETHICS
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-[0.25em] text-slate-950 uppercase mt-6">
          ETHICS
        </h1>

        {/* Subtitle */}
        <p className="text-[10px] sm:text-xs font-extrabold text-slate-950/80 tracking-[0.3em] uppercase mt-2">
          PREMIUM LIBRARY
        </p>

        {/* 3 Animated Loading Dots */}
        <div className="flex items-center gap-2 mt-8">
          <span className="h-2 w-2 rounded-xs bg-slate-950 animate-pulse"></span>
          <span className="h-2 w-2 rounded-xs bg-slate-950 animate-pulse [animation-delay:200ms]"></span>
          <span className="h-2 w-2 rounded-xs bg-slate-950 animate-pulse [animation-delay:400ms]"></span>
        </div>
      </div>

      {/* Footer Version Info */}
      <div className="pb-4 text-center">
        <span className="text-[10px] font-black text-slate-950/80 tracking-widest uppercase">
          VERSION 2.0.1 &bull; LOADED SECURELY
        </span>
      </div>
    </div>
  );
};
