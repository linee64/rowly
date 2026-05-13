import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Target, AlertCircle, Share2, ArrowRight, Coins } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useStatsStore } from '../../store/statsStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const VictoryModal: React.FC = () => {
  const navigate = useNavigate();
  const { isComplete, elapsedTime, difficulty, mistakes, hintsUsed, puzzleId, clearGame } = useGameStore();
  const { addCompletedGame, bestTimes } = useStatsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    if (isComplete && puzzleId) {
      const timeSeconds = Math.floor(elapsedTime / 1000);
      const currentBest = bestTimes[difficulty];
      const personalBest = currentBest === null || timeSeconds < currentBest;
      setIsNewBest(personalBest);

      addCompletedGame({
        puzzleId,
        difficulty,
        timeSeconds,
        mistakes,
        hintsUsed,
        completedAt: new Date().toISOString(),
        isPersonalBest: personalBest
      });

      // Slight delay for animation
      setTimeout(() => setIsOpen(true), 500);
    }
  }, [isComplete, puzzleId]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setIsOpen(false);
    clearGame();
    navigate('/dashboard');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 text-gold">
        <Trophy className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-black mb-2 text-tx-primary">Puzzle Solved!</h2>
      <p className="text-tx-secondary mb-8">Excellent work completing the {difficulty} puzzle.</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center relative">
          {isNewBest && (
            <span className="absolute -top-3 bg-gold text-[#111110] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              New Best!
            </span>
          )}
          <Clock className="w-6 h-6 text-gold mb-2" />
          <span className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</span>
          <span className="text-xs text-tx-secondary mt-1">Time</span>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
          <Target className="w-6 h-6 text-info mb-2" />
          <span className="text-2xl font-mono font-bold">{100 - (mistakes * 5)}%</span>
          <span className="text-xs text-tx-secondary mt-1">Accuracy</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
          <AlertCircle className={`w-6 h-6 mb-2 ${mistakes > 0 ? 'text-error' : 'text-success'}`} />
          <span className="text-2xl font-mono font-bold">{mistakes}</span>
          <span className="text-xs text-tx-secondary mt-1">Mistakes</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
          <LightbulbIcon className="w-6 h-6 text-tx-secondary mb-2" />
          <span className="text-2xl font-mono font-bold">{hintsUsed}</span>
          <span className="text-xs text-tx-secondary mt-1">Hints Used</span>
        </div>
      </div>

      <div className="bg-gold/10 border border-gold/20 rounded-2xl p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold mr-3">
            <Coins className="w-6 h-6 fill-current" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gold font-bold uppercase tracking-wider">Reward</p>
            <p className="text-lg font-black text-tx-primary">
              +{difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : difficulty === 'hard' ? 150 : 200} Coins
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-tx-muted uppercase tracking-wider">Total Balance</p>
          <p className="text-lg font-mono font-bold text-gold">{useStatsStore.getState().coins}</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="gold" className="w-full" onClick={() => { setIsOpen(false); clearGame(); navigate('/dashboard/puzzles'); }}>
          Play Another <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1" onClick={handleClose}>
            Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);
