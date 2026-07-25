import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MemberProvider } from './context/MemberContext';
import { SplashScreen } from './components/onboarding/SplashScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MySeat } from './pages/MySeat';
import { Attendance } from './pages/Attendance';
import { FocusTimer } from './pages/FocusTimer';
import { Membership } from './pages/Membership';
import { Support } from './pages/Support';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const handleSplashFinish = () => {
    setShowSplash(false);
    const onboardingDone = sessionStorage.getItem('ethics_onboarding_completed');
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    sessionStorage.setItem('ethics_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem('ethics_onboarding_completed');
    setShowSplash(true);
    setShowOnboarding(false);
  };

  return (
    <MemberProvider onReplayIntro={handleReplayIntro}>
      {/* Step 1: Splash Screen */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Step 2: Onboarding Screen (Appears immediately after Splash) */}
      {!showSplash && showOnboarding && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* Step 3: Main App Router (Login / Portal) */}
      {!showSplash && !showOnboarding && (
        <BrowserRouter>
          <Routes>
            <Route
              path="/onboarding"
              element={
                <OnboardingScreen
                  onComplete={() => {
                    sessionStorage.setItem('ethics_onboarding_completed', 'true');
                    window.location.href = '/login';
                  }}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="seat" element={<MySeat />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="focus" element={<FocusTimer />} />
              <Route path="membership" element={<Membership />} />
              <Route path="support" element={<Support />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </MemberProvider>
  );
};

export default App;
