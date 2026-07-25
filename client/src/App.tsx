import * as React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/layout"
import { LoginForm } from "@/components/login-form"

// Import Page Components
import DashboardPage from "@/pages/dashboard"
import MembersPage from "@/pages/members"
import AttendancePage from "@/pages/attendance"
import MembershipPage from "@/pages/membership"
import SeatsPage from "@/pages/seats"
import FinancePage from "@/pages/finance"
import ReportsPage from "@/pages/reports"
import StaffPage from "@/pages/staff"
import SettingsPage from "@/pages/settings"

// Helper to check authentication status
const checkAuth = () => {
  return localStorage.getItem("isLoggedIn") === "true"
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return checkAuth() ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            checkAuth() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="grid min-h-svh lg:grid-cols-2 bg-background">
                <div className="relative flex flex-col gap-4 p-6 md:p-10 justify-center items-center">
                  {/* Top Left Branding Logo & Name */}
                  <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 select-none">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-foreground">Ethics Library</span>
                  </div>
                  
                  <div className="w-full max-w-sm">
                    <LoginForm />
                  </div>
                </div>
                <div className="relative hidden border-l border-border lg:block overflow-hidden">
                  <img 
                    src="/library_login_showcase.png" 
                    alt="Ethics Library Workspace" 
                    className="absolute inset-0 w-full h-full object-cover select-none"
                  />
                  {/* Warm overlay gradient blending the image with the system background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-primary/10 opacity-90 dark:opacity-85" />
                  
                  {/* Floating glassmorphic info container with primary border & shadow glow */}
                  <div className="absolute bottom-12 left-12 right-12 z-10 p-8 rounded-2xl border border-primary/25 bg-background/50 backdrop-blur-md shadow-[0_20px_50px_rgba(250,204,21,0.15)] text-left">
                    <div className="text-xs font-semibold tracking-widest text-primary mb-1 uppercase">Ethics Library Core</div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Premium Study Spaces & Live Seat Allotment</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Allot student seats, manage daily attendance, track operational finances, and customize membership tiers through a high-performance borderless dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Members Route */}
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Seat Status Route */}
        <Route
          path="/seats"
          element={
            <ProtectedRoute>
              <SeatsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Attendance Route */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Membership Route */}
        <Route
          path="/membership"
          element={
            <ProtectedRoute>
              <MembershipPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Finance Route */}
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinancePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Reports Route */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Staff Route */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Settings Route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Redirections */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
