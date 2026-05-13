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
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black mb-3 text-tx-primary">Start Playing</h1>
        <p className="text-tx-secondary text-lg">Choose your challenge and master the art of logic.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Game - Main Card */}
        <Card className="p-8 flex flex-col items-center text-center border-gold/30 bg-gradient-to-br from-surface to-gold/5 md:col-span-2">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold mb-6 shadow-lg shadow-gold/10">
            <Zap className="w-10 h-10 fill-current" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Quick Game</h2>
          <p className="text-tx-secondary mb-8 max-w-md text-lg">
            Jump straight into a classic Sudoku match with a balanced medium difficulty.
          </p>
          <Button 
            variant="gold" 
            size="lg" 
            className="w-full md:w-auto px-12 py-6 text-xl rounded-2xl shadow-xl shadow-gold/20 hover:scale-105 transition-transform"
            onClick={handleQuickGame}
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            Play Now
          </Button>
        </Card>

        {/* Other Options */}
        <Card className="p-6 flex flex-col items-center text-center hover:border-gold/30 transition-colors group">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-tx-secondary mb-4 group-hover:text-gold group-hover:border-gold/20 transition-colors">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
          <p className="text-tx-muted mb-6 text-sm">
            Chat with an AI coach: board analysis, hints on what to place where, and strategy explanations.
          </p>
          <Button variant="secondary" className="w-full" onClick={handleLearnAi}>
            Open practice mode
          </Button>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center hover:border-gold/30 transition-colors group">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-tx-secondary mb-4 group-hover:text-gold group-hover:border-gold/20 transition-colors">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
          <p className="text-tx-muted mb-6 text-sm">Solve today's unique puzzle and earn rewards.</p>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
};
