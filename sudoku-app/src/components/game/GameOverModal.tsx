import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartCrack, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const GameOverModal: React.FC = () => {
  const navigate = useNavigate();
  const { isGameOver, difficulty, puzzleId, clearGame, startNewGame } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isGameOver && puzzleId) {
      // Slight delay for animation
      setTimeout(() => setIsOpen(true), 500);
    }
  }, [isGameOver, puzzleId]);

  const handleClose = () => {
    setIsOpen(false);
    clearGame();
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setIsOpen(false);
    startNewGame(difficulty, puzzleId, puzzleId.startsWith('daily-') ? puzzleId.split('-')[1] : undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/20 text-error">
        <HeartCrack className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-black mb-2 text-tx-primary">Game Over</h2>
      <p className="text-tx-secondary mb-8">You made 3 mistakes. Don't give up, try again!</p>

      <div className="space-y-3">
        <Button variant="primary" className="w-full bg-error text-white hover:bg-error/90 border-error" onClick={handleRetry}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1" onClick={() => { setIsOpen(false); clearGame(); navigate('/dashboard/puzzles'); }}>
            Other Puzzles
          </Button>
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};
