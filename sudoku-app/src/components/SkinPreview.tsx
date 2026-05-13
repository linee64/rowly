import React from 'react';
import { cn } from './ui/Card';

interface SkinPreviewProps {
  skinId: string;
}

export const SkinPreview: React.FC<SkinPreviewProps> = ({ skinId }) => {
  const getSkinStyles = () => {
    switch (skinId) {
      case 'royal':
        return {
          board: 'bg-landing-obsidian border-landing-gold/50',
          cell: 'border-landing-gold/20',
          given: 'text-landing-cream bg-landing-obsidian-2',
          user: 'text-landing-gold',
          thickBorder: 'border-landing-gold/40'
        };
      case 'emerald':
        return {
          board: 'bg-[#0a1a12] border-emerald-500/50',
          cell: 'border-emerald-900/30',
          given: 'text-emerald-100 bg-[#0d2117]',
          user: 'text-emerald-400',
          thickBorder: 'border-emerald-500/30'
        };
      case 'cyber':
        return {
          board: 'bg-[#050510] border-purple-500/50',
          cell: 'border-purple-900/30',
          given: 'text-blue-100 bg-[#08081a]',
          user: 'text-cyan-400',
          thickBorder: 'border-purple-500/30'
        };
      default:
        return {
          board: 'bg-primary border-border',
          cell: 'border-border/30',
          given: 'text-tx-primary bg-surface/50',
          user: 'text-gold',
          thickBorder: 'border-border'
        };
    }
  };

  const skin = getSkinStyles();
  const mockBoard = [
    [5, 3, 0],
    [6, 0, 0],
    [0, 9, 8]
  ];

  return (
    <div className={cn("w-full aspect-square border rounded-lg overflow-hidden scale-90", skin.board)}>
      <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
        {mockBoard.map((row, r) => 
          row.map((val, c) => (
            <div 
              key={`${r}-${c}`}
              className={cn(
                "flex items-center justify-center text-[10px] sm:text-xs font-bold border transition-all",
                skin.cell,
                val !== 0 ? skin.given : skin.user,
                r === 1 && c === 1 ? 'bg-gold/20 scale-110 z-10 border-gold/50 shadow-sm' : ''
              )}
            >
              {val !== 0 ? val : (r === 1 && c === 1 ? '7' : '')}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
