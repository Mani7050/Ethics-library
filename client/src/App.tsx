import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

// Helper component for Onboarding Route
const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <OnboardingScreen
      onComplete={() => {
        sessionStorage.setItem('mitra_onboarding_completed', 'true');
        navigate('/login');
      }}
    />
  );
};

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem('mitra_onboarding_completed');
    setShowSplash(true);
  };

  return (
    <MemberProvider onReplayIntro={handleReplayIntro}>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
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
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </MemberProvider>
  );
};

export default App;
