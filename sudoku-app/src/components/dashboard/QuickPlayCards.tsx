import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, BookOpen } from 'lucide-react';
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

  const handlePracticeLearn = () => {
    startNewGame('easy');
    navigate('/dashboard/learn');
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
      desc: 'AI chat coach: board analysis, moves, and strategies',
      icon: BookOpen,
      color: 'bg-elevated hover:bg-border text-tx-primary',
      iconColor: 'text-success',
      onClick: handlePracticeLearn,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
      {cards.map((card, i) => (
        <Card 
          key={i} 
          className="group p-5 sm:p-6 cursor-pointer rounded-2xl border border-border/80 bg-gradient-to-b from-surface to-elevated/30 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 flex flex-col items-start h-full active:scale-[0.99]"
          onClick={card.onClick}
        >
          <div className="mb-4 p-3 rounded-xl bg-gold/5 border border-gold/15 group-hover:bg-gold/10 transition-colors">
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <h3 className="font-bold text-lg mb-1.5 text-tx-primary tracking-tight">{card.title}</h3>
          <p className="text-sm text-tx-secondary mb-5 flex-1 leading-relaxed">{card.desc}</p>
          <button
            type="button"
            className={`w-full py-2.5 min-h-[44px] rounded-xl font-bold text-sm transition-all ${card.color}`}
          >
            Play
          </button>
        </Card>
      ))}
    </div>
  );
};
