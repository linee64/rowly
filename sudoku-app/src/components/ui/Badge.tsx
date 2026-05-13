import React from 'react';
import { cn } from './Card';
import type { Difficulty } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  difficulty?: Difficulty;
  variant?: 'default' | 'success' | 'gold';
}

export const Badge: React.FC<BadgeProps> = ({ children, difficulty, variant, className, ...props }) => {
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-info/20 text-info border-info/30';
      case 'hard': return 'bg-error/20 text-error border-error/30';
      case 'expert': return 'bg-gold/20 text-gold border-gold/30';
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        difficulty ? getDifficultyColor(difficulty) : '',
        !difficulty && variant === 'default' ? 'bg-elevated text-tx-secondary border-border' : '',
        !difficulty && variant === 'success' ? 'bg-success/20 text-success border-success/30' : '',
        !difficulty && variant === 'gold' ? 'bg-gold/20 text-gold border-gold/30' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
