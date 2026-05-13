import React from 'react';
import { StatsBar } from '../components/dashboard/StatsBar';
import { QuickPlayCards } from '../components/dashboard/QuickPlayCards';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useGameStore } from '../store/gameStore';
import { useStatsStore } from '../store/statsStore';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Play, Zap } from 'lucide-react';
import { getDailyPuzzleSeed } from '../utils/dailyPuzzle';
import { cn } from '../components/ui/Card';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { puzzleId, isComplete, elapsedTime, difficulty, resumeGame } = useGameStore();
  const { completedGames } = useStatsStore();
  const dailySeed = getDailyPuzzleSeed();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 pb-10 md:pb-12 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <header className="mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-tx-primary tracking-tight">Let's Play!</h1>
        <p className="text-tx-secondary mt-2 sm:mt-2.5 text-sm sm:text-base">Ready for your next challenge?</p>
      </header>

      <StatsBar />
      <QuickPlayCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {puzzleId && !isComplete && (
            <Card className="p-4 sm:p-6 bg-surface border-gold/30 relative overflow-hidden rounded-2xl shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Resume Game</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-0">
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
                  className="w-full sm:w-auto min-h-[48px] px-8 shrink-0 rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Continue
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-4 sm:p-6 rounded-2xl border-border/90 shadow-sm">
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

        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-gold/10 to-transparent border-gold/20 rounded-2xl shadow-sm">
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
              className="w-full min-h-[48px] rounded-xl"
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
