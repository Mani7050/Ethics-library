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
        <div className="relative z-20 flex items-center justify-between p-5 pt-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-md">
              E
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-white shadow-sm">
              ETHICS
            </span>
          </div>

          {/* Top Right Pill Pagination Indicator: [ ▬ • • ] */}
          <div className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex
                    ? 'w-5 h-2 bg-amber-500 shadow-sm'
                    : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Bottom Overlapping Curved White Card Sheet */}
      <div className="-mt-10 rounded-t-[32px] bg-white dark:bg-slate-900 px-6 pt-7 pb-8 relative z-20 shadow-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            {currentSlide.description}
          </p>
        </div>

        {/* Bottom Action Row with Right-Aligned Solid Orange Button */}
        <div className="flex items-center justify-between pt-2">
          {/* Skip Intro Link */}
          <button
            onClick={onComplete}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Skip Intro
          </button>

          {/* Solid Amber/Orange NEXT Button */}
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>{isLastSlide ? 'GET STARTED' : 'NEXT'}</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
