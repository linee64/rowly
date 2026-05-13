import React, { useState, useEffect } from 'react';
import { useStatsStore } from '../store/statsStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Trophy, Loader2, Award } from 'lucide-react';
import type { Difficulty } from '../types';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  id: string | number;
  name: string;
  initials: string;
  timeSeconds: number;
  difficulty: Difficulty;
  date: string;
  isCurrentUser: boolean;
}

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { completedGames, activeTitle, playerName } = useStatsStore();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      
      let dbEntries: LeaderboardEntry[] = [];
      
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('time_seconds', { ascending: true })
            .limit(100);
            
          if (!error && data) {
            dbEntries = data.map(row => {
              const name = row.player_name || 'Anonymous';
              return {
                id: row.id,
                name: name,
                initials: name.substring(0, 2).toUpperCase(),
                timeSeconds: row.time_seconds,
                difficulty: row.difficulty as Difficulty,
                date: row.created_at,
                isCurrentUser: name === playerName || name.includes(playerName),
              };
            });
          }
        } catch (err) {
          console.error("Error fetching from supabase:", err);
        }
      }
      
      // If DB is empty or fails, we only show local user's data
      // Otherwise, we merge and sort
      
      const realEntries: LeaderboardEntry[] = completedGames.map(game => ({
        id: game.puzzleId,
        name: activeTitle ? `${activeTitle} ${playerName}` : playerName,
        initials: playerName.substring(0, 2).toUpperCase(),
        timeSeconds: game.timeSeconds,
        difficulty: game.difficulty,
        date: game.completedAt,
        isCurrentUser: true,
      }));

      // Combine DB entries with any local games that might not be synced yet
      // Removing duplicates by name and time for simplicity
      const combined = [...dbEntries];
      
      realEntries.forEach(localEntry => {
        const alreadyExists = combined.some(dbEntry => 
          dbEntry.name === localEntry.name && dbEntry.timeSeconds === localEntry.timeSeconds
        );
        if (!alreadyExists) {
          combined.push(localEntry);
        }
      });
      
      setEntries(combined.sort((a, b) => a.timeSeconds - b.timeSeconds));
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, [completedGames, activeTitle, playerName]);

  const filteredEntries = entries.filter(e => filter === 'all' || e.difficulty === filter);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderName = (entry: LeaderboardEntry) => {
    if (entry.name.includes(' ')) {
      const parts = entry.name.split(' ');
      const title = parts[0];
      const name = parts.slice(1).join(' ');
      
      // Check if title is one of our shop titles
      const isPrestige = ['Grandmaster', 'Ninja', 'King', 'Hero'].some(t => title.includes(t));
      
      if (isPrestige) {
        return (
          <div className="flex flex-col">
            <span className="text-[10px] text-gold font-bold uppercase tracking-wider flex items-center">
              <Award className="w-2 h-2 mr-1" />
              {title}
            </span>
            <span className="font-bold">{name}</span>
          </div>
        );
      }
    }
    return <span className="font-bold">{entry.name}</span>;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tx-primary flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-gold" />
            Global Leaderboard
          </h1>
          <p className="text-tx-secondary mt-1">See how you stack up against the best.</p>
        </div>
        
        <div className="flex space-x-2 bg-surface p-1 rounded-lg border border-border">
          {(['all', 'easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
            <Button
              key={diff}
              variant={filter === diff ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(diff)}
              className="capitalize"
            >
              {diff}
            </Button>
          ))}
        </div>
      </header>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-tx-secondary uppercase bg-elevated/50">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-tx-secondary">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gold" />
                    Loading leaderboard...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-tx-secondary">
                    No records found for this difficulty.
                  </td>
                </tr>
              ) : (
                filteredEntries.slice(0, 50).map((entry, index) => (
                <tr 
                  key={`${entry.id}-${index}`} 
                  className={`border-b border-border/50 last:border-0 hover:bg-elevated/30 transition-colors ${
                    entry.isCurrentUser ? 'bg-gold/5 border-gold/20' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className={`font-bold text-lg ${
                      index === 0 ? 'text-gold' : 
                      index === 1 ? 'text-tx-secondary' : 
                      index === 2 ? 'text-[#cd7f32]' : 'text-tx-muted'
                    }`}>
                      #{index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        entry.isCurrentUser ? 'bg-gold text-[#111110]' : 'bg-elevated text-tx-secondary'
                      }`}>
                        {entry.initials}
                      </div>
                      <div className={`${entry.isCurrentUser ? 'text-gold' : 'text-tx-primary'}`}>
                        {renderName(entry)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge difficulty={entry.difficulty} className="uppercase">{entry.difficulty}</Badge>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-lg">
                    {formatTime(entry.timeSeconds)}
                  </td>
                  <td className="px-6 py-4 text-right text-tx-secondary">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
