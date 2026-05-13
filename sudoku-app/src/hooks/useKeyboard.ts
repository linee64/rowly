import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { CellValue } from '../types';

export const useKeyboard = () => {
  const { 
    selectCell, 
    selectedCell, 
    inputValue, 
    toggleNotesMode, 
    undo, 
    useHint,
    eraseCell,
    isComplete,
    isPaused
  } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete || isPaused) return;

      // Number keys
      if (e.key >= '1' && e.key <= '9') {
        inputValue(parseInt(e.key) as CellValue);
        return;
      }

      // Numpad keys
      if (e.key >= 'Numpad1' && e.key <= 'Numpad9') {
        inputValue(parseInt(e.key.replace('Numpad', '')) as CellValue);
        return;
      }

      // Actions
      switch (e.key) {
        case 'Backspace':
        case 'Delete':
          eraseCell();
          break;
        case 'n':
        case 'N':
          toggleNotesMode();
          break;
        case 'h':
        case 'H':
          useHint();
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey || e.metaKey) {
            undo();
          }
          break;
      }

      // Navigation
      if (selectedCell) {
        const [r, c] = selectedCell;
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            selectCell(r > 0 ? r - 1 : 8, c);
            e.preventDefault();
            break;
          case 'ArrowDown':
          case 's':
            selectCell(r < 8 ? r + 1 : 0, c);
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case 'a':
            selectCell(r, c > 0 ? c - 1 : 8);
            e.preventDefault();
            break;
          case 'ArrowRight':
          case 'd':
            selectCell(r, c < 8 ? c + 1 : 0);
            e.preventDefault();
            break;
        }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        selectCell(4, 4); // Start in middle if nothing selected
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isComplete, isPaused, inputValue, toggleNotesMode, undo, useHint, eraseCell, selectCell]);
};
