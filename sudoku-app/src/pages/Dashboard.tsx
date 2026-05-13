import React from 'react';
import { StatsBar } from '../components/dashboard/StatsBar';
import { QuickPlayCards } from '../components/dashboard/QuickPlayCards';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useGameStore } from '../store/gameStore';
import { useStatsStore } from '../store/statsStore';
import { useUiStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Play, Zap, Settings, Sun, Moon, User } from 'lucide-react';
import { getDailyPuzzleSeed } from '../utils/dailyPuzzle';
import { cn } from '../components/ui/Card';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { puzzleId, isComplete, elapsedTime, difficulty, resumeGame } = useGameStore();
  const { completedGames, playerName, activeTitle, avatarUrl } = useStatsStore();
  const { theme, toggleTheme } = useUiStore();
  
  const dailySeed = getDailyPuzzleSeed();
  const hasCompletedDaily = completedGames.some(g => g.puzzleId === `daily-${dailySeed}`);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-tx-primary">Let's Play!</h1>
          <p className="text-tx-secondary mt-1">Ready for your next challenge?</p>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="p-2 rounded-lg bg-surface border border-border text-tx-secondary"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-surface border border-border text-tx-secondary"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="w-9 h-9 rounded-full border-2 border-gold overflow-hidden bg-surface"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-1.5 text-tx-secondary" />
            )}
          </button>
        </div>
      </header>

      <StatsBar />
      <QuickPlayCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {puzzleId && !isComplete && (
            <Card className="p-6 bg-surface border-gold/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Resume Game</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge difficulty={difficulty} className="uppercase">{difficulty}</Badge>
                    <span className="flex items-center text-sm text-tx-secondary">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(Math.floor(elapsedTime / 1000))}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="gold" 
                  onClick={() => {
                    resumeGame();
                    navigate('/dashboard/game');
                  }}
                  className="px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Continue
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-gold" />
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/stats')}>View All</Button>
            </div>
            <div className="space-y-4">
              {completedGames.slice(0, 3).map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                      game.difficulty === 'easy' ? 'bg-success/10 text-success' :
                      game.difficulty === 'medium' ? 'bg-info/10 text-info' : 'bg-error/10 text-error'
                    )}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold capitalize">{game.difficulty}</p>
                      <p className="text-xs text-tx-secondary">{new Date(game.completedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-gold">{formatTime(game.timeSeconds)}</p>
                    <p className="text-[10px] text-tx-muted uppercase tracking-wider">Time</p>
                  </div>
                </div>
              ))}
              {completedGames.length === 0 && (
                <div className="text-center py-8 text-tx-muted italic">
                  No recent games. Start a new one!
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-gold/10 to-transparent border-gold/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-gold" />
              Daily Challenge
            </h3>
            <div className="text-center p-4 bg-surface rounded-xl border border-border mb-6">
              <p className="text-sm text-tx-secondary mb-1">Today's Seed</p>
              <p className="text-2xl font-black text-gold tracking-widest">{dailySeed}</p>
            </div>
            <Button 
              variant="gold" 
              className="w-full"
              onClick={() => {
                useGameStore.getState().startNewGame('hard', `daily-${dailySeed}`, dailySeed);
                navigate('/dashboard/game');
              }}
            >
              Play Daily Challenge
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Local Check icon for the recent activity since it's not imported at top
const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
