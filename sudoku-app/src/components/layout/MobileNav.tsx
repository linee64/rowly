import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Play, Trophy, BarChart2, ShoppingBag } from 'lucide-react';
import { cn } from '../ui/Card';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Play, label: 'Play', path: '/dashboard/play' },
  { icon: ShoppingBag, label: 'Shop', path: '/dashboard/shop' },
  { icon: Trophy, label: 'Leaders', path: '/dashboard/leaderboard' },
  { icon: BarChart2, label: 'Stats', path: '/dashboard/stats' },
];

export const MobileNav: React.FC = () => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gold/15 bg-surface/85 backdrop-blur-xl shadow-[0_-12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_-12px_40px_rgba(0,0,0,0.45)] supports-[backdrop-filter]:bg-surface/70"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex justify-around items-stretch pt-2 pb-1 max-w-lg mx-auto px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-0 max-w-[4.5rem] rounded-xl transition-all active:scale-95',
                isActive
                  ? 'text-gold bg-gold/10 shadow-inner'
                  : 'text-tx-secondary hover:text-tx-primary hover:bg-elevated/80'
              )
            }
          >
            <item.icon className="w-[22px] h-[22px] shrink-0" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold tracking-wide truncate w-full text-center leading-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
