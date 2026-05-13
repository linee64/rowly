import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Sparkles, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useGameStore } from '../store/gameStore';

export const PlayMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { startNewGame } = useGameStore();

  const handleQuickGame = () => {
    startNewGame('medium');
    navigate('/dashboard/game');
  };

  const handleLearnAi = () => {
    startNewGame('easy');
    navigate('/dashboard/learn');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pb-28 md:pb-10">
      <header className="mb-8 sm:mb-10 text-center px-1">
        <h1 className="text-3xl sm:text-4xl font-black mb-2 sm:mb-3 text-tx-primary tracking-tight">Start Playing</h1>
        <p className="text-tx-secondary text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Choose your challenge and master the art of logic.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Game - Main Card */}
        <Card className="p-6 sm:p-8 flex flex-col items-center text-center border-gold/30 bg-gradient-to-br from-surface to-gold/5 md:col-span-2 rounded-2xl shadow-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold mb-4 sm:mb-6 shadow-lg shadow-gold/10">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Quick Game</h2>
          <p className="text-tx-secondary mb-6 sm:mb-8 max-w-md text-sm sm:text-lg leading-relaxed">
            Jump straight into a classic Sudoku match with a balanced medium difficulty.
          </p>
          <Button 
            variant="gold" 
            size="lg" 
            className="w-full md:w-auto min-h-[52px] px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl shadow-xl shadow-gold/20 active:scale-[0.98] transition-transform"
            onClick={handleQuickGame}
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            Play Now
          </Button>
        </Card>

        {/* Other Options */}
        <Card className="p-6 flex flex-col items-center text-center hover:border-gold/30 transition-colors group rounded-2xl border border-border/80 bg-gradient-to-b from-surface to-elevated/20 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-tx-secondary mb-4 group-hover:text-gold group-hover:border-gold/20 transition-colors">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
          <p className="text-tx-muted mb-6 text-sm">
            Chat with an AI coach: board analysis, hints on what to place where, and strategy explanations.
          </p>
          <Button variant="secondary" className="w-full min-h-[48px] rounded-xl" onClick={handleLearnAi}>
            Open practice mode
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:border-gold/30 transition-colors group rounded-2xl border border-border/80 bg-gradient-to-b from-surface to-elevated/20 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-tx-secondary mb-4 group-hover:text-gold group-hover:border-gold/20 transition-colors">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
          <p className="text-tx-muted mb-6 text-sm">Solve today's unique puzzle and earn rewards.</p>
          <Button variant="secondary" className="w-full min-h-[48px] rounded-xl" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
};
