import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Play, Puzzle, Trophy, BarChart2, ShoppingBag } from 'lucide-react';
import { cn } from '../ui/Card';

// ... (in navItems)
const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Play, label: 'Play', path: '/dashboard/play' },
  { icon: ShoppingBag, label: 'Shop', path: '/dashboard/shop' },
  { icon: Trophy, label: 'Leaders', path: '/dashboard/leaderboard' },
  { icon: BarChart2, label: 'Stats', path: '/dashboard/stats' },
];

export const MobileNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around items-center p-2 pb-safe z-40">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/dashboard'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center p-2 rounded-lg transition-colors',
              isActive ? 'text-gold' : 'text-tx-secondary hover:text-tx-primary'
            )
          }
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
