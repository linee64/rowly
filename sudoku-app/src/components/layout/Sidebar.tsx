import React, { useEffect, useState } from 'react';
import { Home, Play, Puzzle, Trophy, BarChart2, Moon, Sun, ShoppingBag, Coins, User, Settings } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useStatsStore } from '../../store/statsStore';
import { cn } from '../ui/Card';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Play, label: 'Play', path: '/dashboard/play' },
  { icon: Puzzle, label: 'Puzzles', path: '/dashboard/puzzles' },
  { icon: ShoppingBag, label: 'Shop', path: '/dashboard/shop' },
  { icon: Trophy, label: 'Leaderboard', path: '/dashboard/leaderboard' },
  { icon: BarChart2, label: 'Stats', path: '/dashboard/stats' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUiStore();
  const { coins, activeTitle, playerName, avatarUrl, updateProfile } = useStatsStore();
  const [displayName, setDisplayName] = useState(playerName);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || playerName;
        setDisplayName(name);
        // Sync with store if it's the first time
        if (playerName === 'Guest Player') {
          updateProfile({ playerName: name });
        }
      }
    };
    fetchUser();
  }, [playerName]);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-black text-gold tracking-widest">Rowly</h1>
        <div className="mt-4 bg-gold/5 border border-gold/20 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center text-gold">
            <Coins className="w-4 h-4 mr-2 fill-current" />
            <span className="font-mono font-bold">{coins}</span>
          </div>
          <span className="text-[10px] text-tx-muted uppercase font-bold tracking-widest">Balance</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium',
                isActive
                  ? 'bg-elevated text-gold border-l-4 border-gold'
                  : 'text-tx-secondary hover:bg-elevated hover:text-tx-primary border-l-4 border-transparent'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center gap-2">
          {/* Settings Link */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              cn(
                'p-2.5 rounded-xl transition-all duration-200 flex-shrink-0',
                isActive
                  ? 'bg-gold/10 text-gold shadow-lg shadow-gold/5 border border-gold/20'
                  : 'text-tx-secondary hover:bg-elevated hover:text-tx-primary border border-transparent'
              )
            }
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-tx-secondary hover:bg-elevated hover:text-tx-primary transition-all duration-200 border border-transparent flex-shrink-0"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Button */}
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="flex items-center space-x-2 p-2 flex-1 min-w-0 rounded-xl hover:bg-elevated transition-all duration-300 group border border-transparent hover:border-border overflow-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-gold border border-surface flex-shrink-0 overflow-hidden flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-primary fill-current" />
              )}
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <span className="font-bold text-tx-primary truncate leading-tight text-xs">
                {playerName !== 'Guest Player' ? playerName : displayName}
              </span>
              {activeTitle && (
                <span className="text-[7px] text-gold font-bold uppercase tracking-widest truncate">
                  {activeTitle}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};
