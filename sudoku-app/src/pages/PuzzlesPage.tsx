import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useStatsStore } from '../store/statsStore';
import { Button } from '../components/ui/Button';
import { Check, Star, Lock } from 'lucide-react';
import type { Difficulty } from '../types';
import clsx from 'clsx';

export const PuzzlesPage: React.FC = () => {
  const navigate = useNavigate();
  const { startNewGame } = useGameStore();
  const { completedGames } = useStatsStore();
  const [filter, setFilter] = useState<Difficulty>('easy');

  const generatePuzzleCatalog = (difficulty: Difficulty) => {
    const catalog = [];
    for (let i = 1; i <= 20; i++) {
      const id = `${difficulty}-${i}`;
      catalog.push({
        id,
        difficulty,
        number: i,
        isCompleted: completedGames.some(g => g.puzzleId === id),
      });
    }
    return catalog;
  };

  const catalog = generatePuzzleCatalog(filter);

  // Find the first uncompleted level to mark as "current"
  const firstUncompletedIndex = catalog.findIndex(p => !p.isCompleted);
  const currentIndex = firstUncompletedIndex === -1 ? catalog.length - 1 : firstUncompletedIndex;

  const getNodePosition = (i: number, difficulty: Difficulty) => {
    switch (difficulty) {
      case 'medium': {
        // Diagonal Staircase
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 20 + col * 30;
        const y = 8 + row * 13;
        return { x, y };
      }
      case 'hard': {
        // Vertical Zig-Zag
        const col = Math.floor(i / 5);
        const isTopToBottom = col % 2 === 0;
        const row = isTopToBottom ? i % 5 : 4 - (i % 5);
        const x = 15 + col * 23;
        const y = 8 + row * 18;
        return { x, y };
      }
      case 'expert': {
        // More spaced out scattered layout
        const positions = [
          { x: 50, y: 5 }, { x: 20, y: 12 }, { x: 80, y: 12 },
          { x: 50, y: 20 }, { x: 10, y: 28 }, { x: 90, y: 28 },
          { x: 50, y: 36 }, { x: 20, y: 44 }, { x: 80, y: 44 },
          { x: 50, y: 52 }, { x: 10, y: 60 }, { x: 90, y: 60 },
          { x: 50, y: 68 }, { x: 20, y: 76 }, { x: 80, y: 76 },
          { x: 50, y: 84 }, { x: 10, y: 92 }, { x: 90, y: 92 },
          { x: 50, y: 96 }, { x: 25, y: 100 }
        ];
        return positions[i % positions.length];
      }
      default: {
        // Easy: Snake Layout
        const isLeftToRight = Math.floor(i / 5) % 2 === 0;
        const row = Math.floor(i / 5);
        const col = isLeftToRight ? i % 5 : 4 - (i % 5);
        const x = 12 + col * 19;
        const y = 8 + row * 22;
        return { x, y };
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 flex flex-col h-full min-h-[calc(100vh-4rem)]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-tx-primary">Puzzle Journey</h1>
          <p className="text-tx-secondary mt-1">Complete levels to advance your journey.</p>
        </div>
        
        <div className="flex space-x-2 bg-surface p-1 rounded-lg border border-border">
          {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
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

      <div className="flex-1 relative bg-surface/30 rounded-2xl border border-border overflow-hidden p-4 md:p-8 flex justify-center py-10 md:py-20 overflow-y-auto">
        <div 
          className="relative w-full max-w-md"
          style={{ 
            minHeight: filter === 'expert' ? '120rem' : 
                       filter === 'medium' ? '90rem' : 
                       filter === 'hard' ? '75rem' : '55rem' 
          }}
        >
          {/* SVG Path connecting the nodes */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            style={{ zIndex: 0, pointerEvents: 'none' }}
            preserveAspectRatio="none"
          >
            {catalog.map((_, i) => {
              if (i === catalog.length - 1) return null;
              
              const pos1 = getNodePosition(i, filter);
              const pos2 = getNodePosition(i + 1, filter);

              const isCompletedPath = i < currentIndex;

              return (
                <line
                  key={`line-${i}`}
                  x1={`${pos1.x}%`}
                  y1={`${pos1.y}%`}
                  x2={`${pos2.x}%`}
                  y2={`${pos2.y}%`}
                  stroke={isCompletedPath ? '#22c55e' : '#3f3f46'}
                  strokeWidth="3"
                  strokeDasharray={isCompletedPath ? 'none' : '6 6'}
                  className="transition-colors duration-500"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          <div className="relative z-10 w-full h-full">
            {catalog.map((puzzle, i) => {
              const pos = getNodePosition(i, filter);

              const isCurrent = i === currentIndex;
              const isLocked = i > currentIndex;

              return (
                <div 
                  key={puzzle.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <button
                    onClick={() => {
                      if (!isLocked || puzzle.isCompleted) {
                        startNewGame(puzzle.difficulty, puzzle.id, puzzle.id);
                        navigate('/dashboard/game');
                      }
                    }}
                    disabled={isLocked && !puzzle.isCompleted}
                    className={clsx(
                      "w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm md:text-lg font-bold transition-all duration-300 border-2 md:border-4 relative",
                      puzzle.isCompleted 
                        ? "bg-success text-[#111110] border-success hover:scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
                        : isCurrent
                          ? "bg-gold text-[#111110] border-gold hover:scale-110 shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse"
                          : "bg-surface text-tx-muted border-border cursor-not-allowed"
                    )}
                  >
                    {puzzle.isCompleted ? (
                      <Check className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
                    ) : isLocked ? (
                      <Lock className="w-3 h-3 md:w-5 md:h-5 opacity-50" />
                    ) : (
                      <Star className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                    )}
                    
                    {/* Level Number Tooltip/Label */}
                    <span className="absolute -bottom-6 md:bottom-[-2.5rem] text-[10px] md:text-sm font-semibold text-tx-secondary whitespace-nowrap bg-elevated px-1.5 md:px-2 py-0.5 md:py-1 rounded-md border border-border shadow-sm">
                      Lvl {puzzle.number}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
