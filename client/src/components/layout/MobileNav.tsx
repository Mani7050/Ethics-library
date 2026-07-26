import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Armchair,
  CalendarCheck,
  Timer,
  CreditCard,
  User
} from 'lucide-react';

const mobileItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Seat', path: '/seat', icon: Armchair },
  { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
  { name: 'Plans', path: '/membership', icon: CreditCard },
  { name: 'Profile', path: '/profile', icon: User },
];

export const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 border-t border-border backdrop-blur-lg px-1 py-1 shadow-lg">
      <nav className="flex items-center justify-around">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-md transition-all duration-150 ${
                  isActive
                    ? 'text-amber-500 font-bold bg-amber-500/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] mt-0.5 font-semibold">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
