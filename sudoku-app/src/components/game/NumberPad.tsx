import React from 'react';
import { useGameStore } from '../../store/gameStore';
import type { CellValue } from '../../types';
import { cn } from '../ui/Card';

export const NumberPad: React.FC = () => {
  const { inputValue, isComplete, isPaused, isGameOver } = useGameStore();

  return (
    <div className="grid grid-cols-9 gap-0.5 sm:gap-1 w-full py-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          type="button"
          className={cn(
            'flex-1 w-full min-h-[48px] max-h-[52px] rounded-xl text-base sm:text-xl md:text-2xl font-semibold transition-all active:scale-90 touch-manipulation flex items-center justify-center',
            isComplete || isPaused || isGameOver
              ? 'opacity-30 cursor-not-allowed'
              : 'text-tx-primary bg-elevated/40 border border-transparent hover:border-gold/30 hover:bg-gold/10 hover:text-gold active:bg-gold/15'
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
