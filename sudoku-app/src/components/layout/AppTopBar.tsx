import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Sun, Moon, User } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useStatsStore } from '../../store/statsStore';

/**
 * Shared top bar for all dashboard routes: logo, settings, theme, profile avatar.
 */
export const AppTopBar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUiStore();
  const { avatarUrl } = useStatsStore();

  return (
    <header className="shrink-0 px-4 sm:px-6 md:px-8 pt-2 sm:pt-3 pb-8 sm:pb-10 mb-6 sm:mb-8 border-b border-border/50 bg-primary/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="font-display font-bold text-2xl sm:text-3xl text-gold tracking-tight hover:opacity-90 transition-opacity py-1 shrink-0"
        >
          Rowly
        </Link>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/dashboard/settings')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-surface border border-border text-tx-secondary shadow-sm active:scale-95 transition-transform"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-surface border border-border text-tx-secondary shadow-sm active:scale-95 transition-transform"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/profile')}
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border-2 border-gold overflow-hidden bg-surface shadow-sm active:scale-95 transition-transform flex items-center justify-center shrink-0"
            aria-label="Profile"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-tx-secondary" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
