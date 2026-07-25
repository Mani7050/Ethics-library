import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle, Volume2, VolumeX, Brain, Shield, Music } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

const MOTIVATIONAL_QUOTES = [
  "Eliminate all distractions. Dedicated work inside this study hall leads to victory.",
  "Small daily habits repeated with consistency lead to extraordinary achievements.",
  "Silence is the environment where greatness is forged. Stay committed!",
  "Your competition is studying right now. Keep pushing your boundaries."
];

export const FocusTimer: React.FC = () => {
  const [sessionLength, setSessionLength] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3);
  const [timerMode, setTimerMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [activeSound, setActiveSound] = useState<'off' | 'rain' | 'waves' | 'pinknoise'>('off');
  const [volume, setVolume] = useState<number>(0.3);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      soundEngine.playChime();
      if (timerMode === 'study') {
        setCompletedSessions(prev => prev + 1);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, timerMode]);

  useEffect(() => {
    return () => {
      soundEngine.stopAmbient();
    };
  }, []);

  const handleStartPause = () => {
    if (!isRunning && activeSound !== 'off') {
      soundEngine.playAmbient(activeSound, volume);
    }
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
  };

  const handleSelectPreset = (mins: number, mode: 'study' | 'short_break' | 'long_break' = 'study') => {
    setIsRunning(false);
    setTimerMode(mode);
    setSessionLength(mins);
    setTimeLeft(mins * 60);
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleSoundToggle = (sound: 'off' | 'rain' | 'waves' | 'pinknoise') => {
    setActiveSound(sound);
    if (sound === 'off') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.playAmbient(sound, volume);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((sessionLength * 60 - timeLeft) / (sessionLength * 60)) * 100;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-amber-500" />
            Focus & Ambient Sound Engine
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Pomodoro study sprints with synthesized background ambient audio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>{completedSessions} Sessions</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-card border border-border text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            <span>{(completedSessions * 25 / 60).toFixed(1)}h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Timer Display Box */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 sm:p-6 text-center space-y-5 shadow-sm">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-1.5 bg-accent/40 p-1 rounded-xl border border-border max-w-sm mx-auto">
            <button
              onClick={() => handleSelectPreset(25, 'study')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timerMode === 'study'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Study Sprint
            </button>
            <button
              onClick={() => handleSelectPreset(5, 'short_break')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timerMode === 'short_break'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Break (5m)
            </button>
            <button
              onClick={() => handleSelectPreset(15, 'long_break')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timerMode === 'long_break'
                  ? 'bg-blue-500 text-slate-950 shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Break (15m)
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectPreset(mins, 'study')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sessionLength === mins && timerMode === 'study'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                    : 'bg-accent/40 text-muted-foreground hover:text-foreground border border-border/50'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>

          {/* Compact Dial */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className="stroke-accent"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className={`transition-all duration-1000 ${
                  timerMode === 'study'
                    ? 'stroke-amber-500'
                    : timerMode === 'short_break'
                    ? 'stroke-emerald-500'
                    : 'stroke-blue-500'
                }`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - progressPercentage / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-foreground">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isRunning
                  ? timerMode === 'study'
                    ? 'Focus Active'
                    : 'Break Time'
                  : 'Paused'}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleStartPause}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow ${
                isRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-accent/40 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Quote Display */}
          <div className="p-3 rounded-xl bg-accent/20 border border-border/80 max-w-md mx-auto">
            <p className="text-[11px] text-muted-foreground italic leading-snug">
              "{MOTIVATIONAL_QUOTES[quoteIndex]}"
            </p>
          </div>
        </div>

        {/* Ambient Sound Engine Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                <Music className="h-3.5 w-3.5 text-amber-500" />
                <h2>Ambient Focus Audio</h2>
              </div>
              <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/20">
                Web Audio
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSoundToggle('off')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSound === 'off'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                    : 'border-border bg-accent/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                <VolumeX className="h-3.5 w-3.5" />
                Mute
              </button>

              <button
                onClick={() => handleSoundToggle('rain')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSound === 'rain'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                    : 'border-border bg-accent/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                🌧️ Heavy Rain
              </button>

              <button
                onClick={() => handleSoundToggle('waves')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSound === 'waves'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                    : 'border-border bg-accent/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                🌊 Ocean Waves
              </button>

              <button
                onClick={() => handleSoundToggle('pinknoise')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSound === 'pinknoise'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold'
                    : 'border-border bg-accent/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                🧠 Pink Noise
              </button>
            </div>

            {activeSound !== 'off' && (
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Volume2 className="h-3 w-3 text-amber-500" /> Volume
                  </span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-accent rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-2 text-xs shadow-sm">
            <h3 className="font-bold text-foreground flex items-center gap-1.5 text-[11px]">
              <Shield className="h-3.5 w-3.5 text-amber-500" />
              Focus Protocol
            </h3>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>&bull; Keep phone on Silent in the quiet study hall.</li>
              <li>&bull; Take a 5-min hydration break every 45 mins.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
