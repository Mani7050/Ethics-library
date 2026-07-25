import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.png';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: 'Reserved Study Cabins & Desk Map',
    description: 'Reserve quiet study bays, ergonomically designed desks, and dedicated AC silent reading cabins tailored for competitive exams.',
    bgImage: slide1,
  },
  {
    id: 2,
    title: 'Digital Gate Pass & Smart Attendance',
    description: 'Tap your digital RFID QR pass for instant library gate entry, track daily attendance hours, and maintain your streak.',
    bgImage: slide2,
  },
  {
    id: 3,
    title: 'Focus Audio & 24/7 Library Desk',
    description: 'Study with ambient rain audio, Pomodoro focus sprint timers, and instant support from Ethics Library administration.',
    bgImage: slide3,
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 transition-colors overflow-hidden">
      {/* Top 70% Background Image Area */}
      <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Background Image with Smooth Fade */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
          style={{ backgroundImage: `url('${currentSlide.bgImage}')` }}
        >
          {/* Subtle Dark Gradient Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60" />
        </div>

        {/* Top Header Bar with Step Pill Indicator */}
        <div className="relative z-20 flex items-center justify-between p-4 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-slate-950 font-extrabold text-[11px] shadow-md">
              E
            </div>
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-white shadow-sm">
              ETHICS
            </span>
          </div>

          {/* Top Right Pill Pagination Indicator: [ ▬ • • ] */}
          <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex
                    ? 'w-4 h-1.5 bg-amber-500 shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Bottom Overlapping Curved White Card Sheet with Compact Padding */}
      <div className="-mt-8 rounded-t-[28px] bg-white dark:bg-slate-900 px-5 pt-5 pb-6 relative z-20 shadow-2xl flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {currentSlide.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
            {currentSlide.description}
          </p>
        </div>

        {/* Bottom Action Row with Compact Sleek Button */}
        <div className="flex items-center justify-between pt-1">
          {/* Skip Intro Link */}
          <button
            onClick={onComplete}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Skip Intro
          </button>

          {/* Solid Amber/Orange NEXT Button */}
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span>{isLastSlide ? 'GET STARTED' : 'NEXT'}</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
