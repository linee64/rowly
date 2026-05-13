import React from 'react';
import { useGameStore } from '../../store/gameStore';
import type { CellValue } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../ui/Card';

export const NumberPad: React.FC = () => {
  const { inputValue, isComplete, isPaused, isGameOver } = useGameStore();

  return (
    <div className="flex items-center justify-between w-full px-1 py-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          className={cn(
            "text-2xl sm:text-3xl font-medium transition-all active:scale-90 touch-manipulation",
            isComplete || isPaused || isGameOver 
              ? 'opacity-30 cursor-not-allowed' 
              : 'text-tx-primary hover:text-gold active:text-gold'
          )}
          onClick={() => inputValue(num as CellValue)}
          disabled={isComplete || isPaused || isGameOver}
        >
          {num}
        </button>
      ))}
    </div>
  );
};
