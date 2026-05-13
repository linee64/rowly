import React from 'react';
import { useStatsStore } from '../store/statsStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Trophy, Zap, Star, Shield, Target, Award, Crown } from 'lucide-react';
import type { Difficulty } from '../types';

export const StatsPage: React.FC = () => {
  const { gamesPlayed, bestTimes, currentStreak, bestStreak, achievements, completedGames } = useStatsStore();

  const totalGames = Object.values(gamesPlayed).reduce((a, b) => a + b, 0);
  const winRate = totalGames > 0 ? 100 : 0; // In this app, games are only recorded when won

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const allAchievements = [
    { id: 'first_win', name: 'First Win', desc: 'Complete your first puzzle', icon: Star },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete under 3 minutes', icon: Zap },
    { id: 'perfectionist', name: 'Perfectionist', desc: 'Complete with no mistakes', icon: Target },
    { id: 'week_warrior', name: 'Week Warrior', desc: 'Achieve a 7-day streak', icon: Shield },
    { id: 'century', name: 'Century', desc: 'Play 100 games', icon: Crown },
    { id: 'hint_free', name: 'Hint-Free', desc: 'Complete without hints', icon: Award },
    { id: 'expert_slayer', name: 'Expert Slayer', desc: 'Complete an Expert puzzle', icon: Trophy },
  ];

  const maxGames = Math.max(...Object.values(gamesPlayed), 1);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-tx-primary">Statistics</h1>
        <p className="text-tx-secondary mt-1">Track your progress and achievements.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-tx-secondary mb-1">Total Games</p>
          <p className="text-3xl font-bold">{totalGames}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-tx-secondary mb-1">Win Rate</p>
          <p className="text-3xl font-bold">{winRate}%</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-tx-secondary mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-gold">{currentStreak}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-tx-secondary mb-1">Best Streak</p>
          <p className="text-3xl font-bold">{bestStreak}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Games by Difficulty</h3>
          <div className="space-y-4">
            {(Object.entries(gamesPlayed) as [Difficulty, number][]).map(([diff, count]) => (
              <div key={diff} className="flex items-center">
                <div className="w-24 uppercase text-xs font-bold text-tx-secondary">{diff}</div>
                <div className="flex-1 h-4 bg-elevated rounded-full overflow-hidden mx-4">
                  <div 
                    className="h-full bg-gold transition-all duration-1000" 
                    style={{ width: `${(count / maxGames) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right font-bold">{count}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Best Times</h3>
          <div className="space-y-4">
            {(Object.entries(bestTimes) as [Difficulty, number | null][]).map(([diff, time]) => (
              <div key={diff} className="flex items-center justify-between p-3 bg-elevated rounded-lg border border-border">
                <Badge difficulty={diff} className="uppercase">{diff}</Badge>
                <span className="font-mono font-bold text-lg">{formatTime(time)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-gold" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {allAchievements.map((ach) => {
            const isUnlocked = achievements.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all ${
                  isUnlocked ? 'bg-gold/10 border-gold/30' : 'bg-surface border-border opacity-50 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  isUnlocked ? 'bg-gold text-[#111110]' : 'bg-elevated text-tx-muted'
                }`}>
                  <ach.icon className="w-6 h-6" />
                </div>
                <p className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-gold' : 'text-tx-secondary'}`}>{ach.name}</p>
                <p className="text-[10px] text-tx-secondary leading-tight">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Recent Games</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-tx-secondary uppercase bg-elevated/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Date</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Mistakes</th>
                <th className="px-4 py-3 rounded-tr-lg">Hints</th>
              </tr>
            </thead>
            <tbody>
              {completedGames.slice(0, 10).map((game, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-elevated/30">
                  <td className="px-4 py-3 text-tx-secondary">{new Date(game.completedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge difficulty={game.difficulty}>{game.difficulty}</Badge></td>
                  <td className="px-4 py-3 font-mono font-medium">{formatTime(game.timeSeconds)}</td>
                  <td className="px-4 py-3 text-tx-secondary">{game.mistakes}</td>
                  <td className="px-4 py-3 text-tx-secondary">{game.hintsUsed}</td>
                </tr>
              ))}
              {completedGames.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-tx-secondary">No games played yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
