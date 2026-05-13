import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Zap, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { useGameStore } from '../../store/gameStore';
import { getDailyPuzzleSeed } from '../../utils/dailyPuzzle';

export const QuickPlayCards: React.FC = () => {
  const navigate = useNavigate();
  const startNewGame = useGameStore(state => state.startNewGame);

  const handleQuickGame = () => {
    startNewGame('medium');
    navigate('/dashboard/game');
  };

  const handleDaily = () => {
    startNewGame('hard', `daily-${getDailyPuzzleSeed()}`, getDailyPuzzleSeed());
    navigate('/dashboard/game');
  };

  const handlePractice = () => {
    startNewGame('easy');
    navigate('/dashboard/game');
  };

  const handleSpeedRun = () => {
    startNewGame('easy');
    navigate('/dashboard/game');
  };

  const cards = [
    {
      title: 'Quick Game',
      desc: 'Random Medium puzzle',
      icon: Play,
      color: 'bg-gold text-[#111110]',
      iconColor: 'text-gold',
      onClick: handleQuickGame,
    },
    {
      title: 'Daily Challenge',
      desc: 'Today\'s special puzzle',
      icon: Calendar,
      color: 'bg-elevated hover:bg-border text-tx-primary',
      iconColor: 'text-info',
      onClick: handleDaily,
    },
    {
      title: 'Practice Mode',
      desc: 'Relaxed, Easy difficulty',
      icon: BookOpen,
      color: 'bg-elevated hover:bg-border text-tx-primary',
      iconColor: 'text-success',
      onClick: handlePractice,
    },
    {
      title: 'Speed Run',
      desc: 'Race against the clock',
      icon: Zap,
      color: 'bg-elevated hover:bg-border text-tx-primary',
      iconColor: 'text-error',
      onClick: handleSpeedRun,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <Card 
          key={i} 
          className="p-5 cursor-pointer hover:border-gold/50 transition-colors flex flex-col items-start h-full"
          onClick={card.onClick}
        >
          <div className="mb-4 p-3 bg-surface rounded-lg border border-border">
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <h3 className="font-bold text-lg mb-1 text-tx-primary">{card.title}</h3>
          <p className="text-sm text-tx-secondary mb-4 flex-1">{card.desc}</p>
          <button className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${card.color}`}>
            Play
          </button>
        </Card>
      ))}
    </div>
  );
};
