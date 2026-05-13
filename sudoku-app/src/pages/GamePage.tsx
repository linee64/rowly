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
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen p-2 sm:p-4 md:p-8 w-full flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-5xl">
        <header className="mb-4 sm:mb-6 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mr-4 -ml-2">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Sudoku</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center w-full gap-4">
          <div className="w-full max-w-[500px] flex flex-col gap-4">
            <div className="flex items-center justify-between bg-surface/50 p-4 rounded-2xl border border-border shadow-sm">
              <GameTimer />
            </div>
            
            <div className="w-full aspect-square flex-shrink-0">
              <SudokuBoard />
            </div>

            <div className="w-full flex flex-col bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-sm gap-4">
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
