import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { SudokuBoard } from '../components/game/SudokuBoard';
import { NumberPad } from '../components/game/NumberPad';
import { GameControls } from '../components/game/GameControls';
import { GameTimer } from '../components/game/GameTimer';
import { VictoryModal } from '../components/game/VictoryModal';
import { GameOverModal } from '../components/game/GameOverModal';
import { AICoachMessage } from '../components/game/AICoachMessage';
import { useKeyboard } from '../hooks/useKeyboard';
import { Button } from '../components/ui/Button';

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { puzzleId, startNewGame } = useGameStore();

  useKeyboard();

  useEffect(() => {
    // If navigating directly to /play without a puzzle, start an easy one
    if (!puzzleId) {
      startNewGame('easy');
    }
  }, [puzzleId, startNewGame]);

  if (!puzzleId) return null;

  return (
    <div className="min-h-0 flex-1 w-full flex flex-col items-center overflow-x-hidden px-3 pt-1 pb-2 sm:px-4 sm:py-4 md:p-8 md:min-h-[calc(100dvh-2rem)]">
      <div className="w-full max-w-[min(36rem,100%)]">
        <header className="mb-3 sm:mb-5 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="min-h-[44px] -ml-1 shrink-0 rounded-xl">
            <ChevronLeft className="w-5 h-5 mr-0.5" />
            Back
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">Sudoku</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-start sm:justify-center w-full gap-3 sm:gap-4 pt-2 sm:pt-0">
          <div className="w-full max-w-[min(28rem,calc(100vw-1.5rem))] flex flex-col gap-3 sm:gap-4 mx-auto">
            <div className="flex items-center justify-between bg-surface/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-border/90 shadow-sm">
              <GameTimer />
            </div>
            
            <div className="w-full aspect-square flex-shrink-0 max-h-[min(85vw,28rem)] mx-auto mb-1">
              <SudokuBoard />
            </div>

            <div className="w-full flex flex-col bg-surface/90 backdrop-blur-sm p-3 sm:p-5 rounded-2xl border border-border/90 shadow-md gap-3 sm:gap-4 mt-5 sm:mt-6">
              <GameControls />
              <NumberPad />
              <AICoachMessage />
            </div>
          </div>
        </div>
      </div>

      <VictoryModal />
      <GameOverModal />
    </div>
  );
};
