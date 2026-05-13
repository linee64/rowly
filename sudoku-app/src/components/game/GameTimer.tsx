import React, { useEffect, useState } from 'react';
import { Play, Pause, Heart, Plus, Coins } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Badge } from '../ui/Badge';
import clsx from 'clsx';

export const GameTimer: React.FC = () => {
  const { elapsedTime, updateElapsedTime, isPaused, pauseGame, resumeGame, difficulty, mistakes, buyExtraLife } = useGameStore();
  const [animatingHeart, setAnimatingHeart] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      updateElapsedTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateElapsedTime]);

  // Pause on tab blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isPaused) {
        pauseGame();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPaused, pauseGame]);

  // Trigger animation when mistakes increase
  useEffect(() => {
    if (mistakes > 0 && mistakes <= 3) {
      setAnimatingHeart(3 - mistakes); // Index of the heart that was just lost
      const timer = setTimeout(() => setAnimatingHeart(null), 500);
      return () => clearTimeout(timer);
    }
  }, [mistakes]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBuyLife = () => {
    if (!buyExtraLife()) {
      alert('Not enough coins! (Need 100)');
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left: Difficulty & Hearts */}
      <div className="flex items-center gap-3">
        <Badge difficulty={difficulty} className="uppercase text-[10px] px-2.5 py-1 rounded-lg font-black tracking-widest shadow-sm">
          {difficulty}
        </Badge>
        
        <div className="flex items-center gap-2 bg-elevated/40 px-3 py-1.5 rounded-xl border border-border/50">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => {
              const isLost = i >= (3 - mistakes);
              const isAnimating = i === animatingHeart;
              
              return (
                <Heart 
                  key={i} 
                  className={clsx(
                    "w-3.5 h-3.5 transition-all duration-500",
                    isLost ? "text-tx-muted/30 fill-transparent" : "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]",
                    isAnimating && "animate-ping scale-150"
                  )} 
                />
              );
            })}
          </div>

          {mistakes > 0 && (
            <div className="h-3 w-px bg-border/50 mx-1" />
          )}

          {mistakes > 0 && (
            <button 
              onClick={handleBuyLife}
              className="flex items-center gap-1 text-gold hover:text-white transition-colors group"
              title="Buy Extra Life (100 coins)"
            >
              <Plus className="w-3 h-3" />
              <div className="flex items-center bg-gold/10 px-1.5 py-0.5 rounded-md border border-gold/20 group-hover:bg-gold/30">
                <Coins className="w-2.5 h-2.5 mr-1 fill-current" />
                <span className="text-[10px] font-black">100</span>
              </div>
            </button>
          )}
        </div>
      </div>
      
      {/* Right: Timer & Pause */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-2xl font-mono font-black tracking-tighter text-tx-primary drop-shadow-sm">
            {formatTime(elapsedTime)}
          </span>
        </div>

        <button
          onClick={isPaused ? resumeGame : pauseGame}
          className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-elevated/60 border border-border/50 hover:border-gold/50 transition-all active:scale-90 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors" />
          {isPaused ? (
            <Play className="w-5 h-5 text-gold fill-gold relative z-10" />
          ) : (
            <Pause className="w-5 h-5 text-tx-primary relative z-10" />
          )}
        </button>
      </div>
    </div>
  );
};
