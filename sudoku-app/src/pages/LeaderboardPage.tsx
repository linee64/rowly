import React, { useState, useEffect, useCallback } from 'react';
import { useStatsStore } from '../store/statsStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Trophy, Loader2, Award, RefreshCw } from 'lucide-react';
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
  avatarUrl?: string | null;
}

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { completedGames, activeTitle, playerName, avatarUrl } = useStatsStore();

  const fetchLeaderboard = useCallback(async (manualSync = false) => {
    if (manualSync) {
      setIsSyncing(true);
    } else {
      setIsLoading(true);
    }
    
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
              isCurrentUser: name === playerName || name.endsWith(' ' + playerName),
              avatarUrl: row.avatar_url,
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
      avatarUrl: avatarUrl,
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
    
    if (manualSync) {
      setIsSyncing(false);
    } else {
      setIsLoading(false);
    }
  }, [completedGames, activeTitle, playerName, avatarUrl]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const filteredEntries = entries.filter(e => filter === 'all' || e.difficulty === filter);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderName = (entry: LeaderboardEntry) => {
    // Check for prestige titles (handling both 1-word and 2-word titles)
    const prestigeTitles = ['Grandmaster', 'Ninja', 'Logic King', 'Sudoku Hero'];
    
    let matchedTitle = '';
    let remainingName = entry.name;

    for (const title of prestigeTitles) {
      if (entry.name.startsWith(title + ' ')) {
        matchedTitle = title;
        remainingName = entry.name.substring(title.length + 1);
        break;
      }
    }
    
    if (matchedTitle) {
      return (
        <div className="flex flex-col">
          <span className="text-[10px] text-gold font-bold uppercase tracking-wider flex items-center">
            <Award className="w-2 h-2 mr-1" />
            {matchedTitle}
          </span>
          <span className="font-bold">{remainingName}</span>
        </div>
      );
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
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchLeaderboard(true)}
            disabled={isSyncing || isLoading}
            className="flex items-center w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          
          <div className="flex space-x-2 bg-surface p-1 rounded-lg border border-border w-full sm:w-auto overflow-x-auto">
            {(['all', 'easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
              <Button
                key={diff}
                variant={filter === diff ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(diff)}
                className="capitalize whitespace-nowrap"
              >
                {diff}
              </Button>
            ))}
          </div>
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
                  className={`border-b border-border/50 last:border-0 transition-all duration-300 ${
                    entry.isCurrentUser 
                      ? 'bg-gold/10 border-l-4 border-l-gold border-b-gold/20 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]' 
                      : 'hover:bg-elevated/30'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className={`font-bold text-lg ${
                      index === 0 ? 'text-gold' : 
                      index === 1 ? 'text-tx-secondary' : 
                      index === 2 ? 'text-[#cd7f32]' : 
                      entry.isCurrentUser ? 'text-gold' : 'text-tx-muted'
                    }`}>
                      #{index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden border-2 ${
                        entry.isCurrentUser 
                          ? 'bg-gold text-[#111110] border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                          : 'bg-elevated text-tx-secondary border-border'
                      }`}>
                        {entry.avatarUrl ? (
                          <img src={entry.avatarUrl} alt={entry.initials} className="w-full h-full object-cover" />
                        ) : (
                          entry.initials
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className={`${entry.isCurrentUser ? 'text-gold font-extrabold' : 'text-tx-primary font-bold'}`}>
                            {renderName(entry)}
                          </div>
                          {entry.isCurrentUser && (
                            <span className="bg-gold text-[#111110] text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm animate-pulse">
                              You
                            </span>
                          )}
                        </div>
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
