import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
