import React from 'react';
import { Undo, Eraser, Lightbulb, Pencil, GraduationCap, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui/Button';

export const GameControls: React.FC<{ hideWinDev?: boolean }> = ({ hideWinDev }) => {
  const { undo, eraseCell, useHint, toggleNotesMode, isNotesMode, askCoach, autoCompleteForTesting } = useGameStore();

  const controls = [
    { icon: Undo, label: 'Undo', onClick: undo },
    { icon: Eraser, label: 'Erase', onClick: eraseCell },
    {
      icon: Pencil,
      label: 'Notes',
      onClick: toggleNotesMode,
      isActive: isNotesMode,
    },
    { icon: Lightbulb, label: 'Hint', onClick: useHint },
    {
      icon: GraduationCap,
      label: 'Coach',
      onClick: askCoach,
      isSpecial: true,
    },
    ...(hideWinDev
      ? []
      : [
          {
            icon: Zap,
            label: 'Win (Dev)',
            onClick: autoCompleteForTesting,
          },
        ]),
  ];

  return (
    <div className={`grid gap-1.5 sm:gap-2 w-full ${hideWinDev ? 'grid-cols-5' : 'grid-cols-6'}`}>
      {controls.map((ctrl, i) => (
        <Button
          key={i}
          variant="ghost"
          className={`min-h-[48px] sm:min-h-[52px] flex flex-col items-center justify-center p-1.5 sm:p-3 h-auto rounded-xl transition-all active:scale-90 touch-manipulation relative ${
            ctrl.isActive ? 'text-gold bg-gold/10' : 
            ctrl.isSpecial ? 'text-gold bg-gold/5 hover:bg-gold/10' :
            'text-tx-secondary hover:text-tx-primary hover:bg-elevated'
          }`}
          onClick={ctrl.onClick}
        >
          <ctrl.icon className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 sm:mb-1.5 ${ctrl.isSpecial ? 'animate-pulse-slow' : ''}`} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
            {ctrl.label}
          </span>
          {/* Badge removed or modified for Hint/Coach if needed */}
        </Button>
      ))}
    </div>
  );
};
