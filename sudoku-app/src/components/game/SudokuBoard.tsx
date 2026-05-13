import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useStatsStore } from '../../store/statsStore';
import { cn } from '../ui/Card';

export const SudokuBoard: React.FC = () => {
  const { board, selectedCell, selectCell, isPaused, isComplete } = useGameStore();
  const { activeSkin } = useStatsStore();

  const getSkinStyles = () => {
    switch (activeSkin) {
      case 'royal':
        return {
          board: 'bg-landing-obsidian border-landing-gold/50 shadow-2xl shadow-landing-gold/5',
          cell: 'border-landing-gold/20',
          given: 'text-landing-cream bg-landing-obsidian-2',
          user: 'text-landing-gold',
          selected: 'bg-landing-obsidian-3 border-landing-gold shadow-lg shadow-landing-gold/20',
          related: 'bg-landing-obsidian-2/50',
          thickBorder: 'border-landing-gold/40'
        };
      case 'emerald':
        return {
          board: 'bg-[#0a1a12] border-emerald-500/50 shadow-2xl shadow-emerald-900/20',
          cell: 'border-emerald-900/30',
          given: 'text-emerald-100 bg-[#0d2117]',
          user: 'text-emerald-400',
          selected: 'bg-[#153123] border-emerald-500 shadow-lg shadow-emerald-500/20',
          related: 'bg-[#0d2117]/50',
          thickBorder: 'border-emerald-500/30'
        };
      case 'cyber':
        return {
          board: 'bg-[#050510] border-purple-500/50 shadow-2xl shadow-purple-500/10',
          cell: 'border-purple-900/30',
          given: 'text-blue-100 bg-[#08081a]',
          user: 'text-cyan-400',
          selected: 'bg-[#0d0d2a] border-cyan-400 shadow-lg shadow-cyan-400/20',
          related: 'bg-[#08081a]/50',
          thickBorder: 'border-purple-500/30'
        };
      default:
        return {
          board: 'bg-primary border-border',
          cell: 'border-border/30',
          given: 'text-tx-primary bg-surface/50',
          user: 'text-gold',
          selected: 'bg-elevated border-gold',
          related: 'bg-surface',
          thickBorder: 'border-border'
        };
    }
  };

  const skin = getSkinStyles();

  const getCellClasses = (r: number, c: number) => {
    const cell = board[r][c];
    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
    const isRelated = selectedCell && !isSelected && (selectedCell[0] === r || selectedCell[1] === c || (Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) && Math.floor(selectedCell[1] / 3) === Math.floor(c / 3)));
    const isSameValue = selectedCell && board[selectedCell[0]][selectedCell[1]].value !== 0 && board[selectedCell[0]][selectedCell[1]].value === cell.value && !isSelected;
    
    // Check if cell is in the same row, column, or 3x3 box as selected
    const isInSelectedRow = selectedCell?.[0] === r;
    const isInSelectedCol = selectedCell?.[1] === c;
    const isInSelectedBox = selectedCell && (Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) && Math.floor(selectedCell[1] / 3) === Math.floor(c / 3));
    const isGlobalHighlight = selectedCell && (isInSelectedRow || isInSelectedCol || isInSelectedBox) && !isSelected;

    // Find if this cell is part of a conflict (same value in row/col/box)
    const hasConflict = selectedCell && 
                      board[selectedCell[0]][selectedCell[1]].value !== 0 && 
                      board[selectedCell[0]][selectedCell[1]].isError && 
                      isRelated && 
                      cell.value === board[selectedCell[0]][selectedCell[1]].value;

    return cn(
      'w-full h-full flex items-center justify-center text-xl sm:text-2xl transition-all cursor-pointer select-none active:scale-95 touch-manipulation',
      cell.isGiven ? `font-bold ${skin.given}` : `font-medium ${skin.user}`,
      cell.isError && !cell.isGiven ? 'bg-error/20 text-error' : '',
      hasConflict ? 'bg-error/10 text-error' : '',
      isSelected ? `border-2 outline-none z-10 scale-105 sm:scale-110 shadow-xl ${skin.selected}` : `border ${skin.cell}`,
      isGlobalHighlight && !cell.isError && !hasConflict ? 'bg-gold/5' : '',
      isSameValue && !isSelected && !cell.isError && !hasConflict ? 'bg-gold/10' : '',
      // Add thick borders for 3x3 boxes
      c % 3 === 0 ? `border-l-2 ${skin.thickBorder}` : '',
      c === 8 ? `border-r-2 ${skin.thickBorder}` : '',
      r % 3 === 0 ? `border-t-2 ${skin.thickBorder}` : '',
      r === 8 ? `border-b-2 ${skin.thickBorder}` : ''
    );
  };

  if (isPaused) {
    return (
      <div className="w-full aspect-square max-w-[600px] mx-auto bg-surface border-2 border-border rounded-xl flex items-center justify-center">
        <p className="text-2xl font-bold text-tx-secondary">Game Paused</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full aspect-square max-w-[600px] mx-auto border-2 rounded-xl overflow-hidden relative", skin.board)}>
      <div className="grid grid-cols-9 grid-rows-9 w-full h-full">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={getCellClasses(r, c)}
              onClick={() => selectCell(r, c)}
            >
              {cell.value !== 0 ? (
                <span>{cell.value}</span>
              ) : (
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <div key={n} className="flex items-center justify-center">
                      {cell.notes.has(n) && (
                        <span className="text-[11px] sm:text-xs md:text-sm text-tx-secondary font-medium leading-none">
                          {n}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {isComplete && (
        <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm z-20 flex items-center justify-center">
          {/* Managed by VictoryModal but we can show a nice overlay here */}
        </div>
      )}
    </div>
  );
};
