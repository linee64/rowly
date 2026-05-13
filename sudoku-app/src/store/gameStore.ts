import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cell, CellValue, Difficulty, GameState } from '../types';
import { generatePuzzle } from '../utils/sudokuGenerator';
import { isBoardComplete } from '../utils/sudokuValidator';
import { explainError } from '../utils/aiCoach';
import { useStatsStore } from './statsStore';

interface GameStore extends GameState {
  startNewGame: (difficulty: Difficulty, puzzleId?: string, seedString?: string) => void;
  selectCell: (r: number, c: number) => void;
  inputValue: (val: CellValue) => void;
  toggleNotesMode: () => void;
  eraseCell: () => void;
  undo: () => void;
  useHint: () => void;
  askCoach: () => void;
  clearCoachMessage: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updateElapsedTime: () => void;
  clearGame: () => void;
  buyExtraLife: () => boolean;
  autoCompleteForTesting: () => void;
}

const createEmptyBoard = (): Cell[][] => 
  Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: 0,
      isGiven: false,
      isError: false,
      notes: new Set<number>()
    }))
  );

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      board: createEmptyBoard(),
      solution: [],
      selectedCell: null,
      difficulty: 'easy',
      mistakes: 0,
      hintsUsed: 0,
      isComplete: false,
      isGameOver: false,
      isNotesMode: false,
      isPaused: false,
      history: [],
      puzzleId: '',
      startTime: 0,
      elapsedTime: 0,
      coachMessage: null,

      startNewGame: (difficulty, puzzleId, seedString) => {
        const { puzzle, solution } = generatePuzzle(difficulty, seedString);
        
        const board: Cell[][] = puzzle.map((row) =>
          row.map((val) => ({
            value: val,
            isGiven: val !== 0,
            isError: false,
            notes: new Set<number>()
          }))
        );

        set({
          board,
          solution,
          selectedCell: null,
          difficulty,
          mistakes: 0,
          hintsUsed: 0,
          isComplete: false,
          isGameOver: false,
          isNotesMode: false,
          isPaused: false,
          history: [],
          puzzleId: puzzleId || `random-${Date.now()}`,
          startTime: Date.now(),
          elapsedTime: 0
        });
      },

      selectCell: (r, c) => {
        if (get().isComplete || get().isPaused || get().isGameOver) return;
        set({ selectedCell: [r, c] });
      },

      inputValue: (val) => {
        const state = get();
        if (state.isComplete || state.isPaused || state.isGameOver || !state.selectedCell) return;
        
        const [r, c] = state.selectedCell;
        const cell = state.board[r][c];
        
        if (cell.isGiven) return;

        const newBoard = state.board.map(row => row.map(cell => ({ ...cell, notes: new Set(cell.notes) })));
        
        if (state.isNotesMode) {
          if (val !== 0) {
            if (newBoard[r][c].notes.has(val)) {
              newBoard[r][c].notes.delete(val);
            } else {
              newBoard[r][c].notes.add(val);
            }
            newBoard[r][c].value = 0;
            newBoard[r][c].isError = false;
          }
        } else {
          newBoard[r][c].value = val;
          newBoard[r][c].notes.clear();
          
          if (val !== 0) {
            // Check against the actual solution for this cell
            const isCorrect = val === state.solution[r][c];
            
            if (!isCorrect) {
              newBoard[r][c].isError = true;
              const newMistakes = state.mistakes + 1;
              
              // Generate AI Coach explanation for the error
              const explanation = explainError(state.board, r, c, val);
              
              set({ 
                mistakes: newMistakes,
                isGameOver: newMistakes >= 3,
                coachMessage: explanation
              });
            } else {
              newBoard[r][c].isError = false;
              set({ coachMessage: null });
            }
          } else {
            newBoard[r][c].isError = false;
            set({ coachMessage: null });
          }
        }

        const isComplete = !state.isNotesMode && val !== 0 && isBoardComplete(
          newBoard.map(row => row.map(c => c.value)),
          state.solution
        );

        set({
          board: newBoard,
          history: [...state.history, state.board.map(row => row.map(c => ({...c, notes: new Set(c.notes)})))],
          isComplete
        });
      },

      toggleNotesMode: () => set(state => ({ isNotesMode: !state.isNotesMode })),

      eraseCell: () => {
        get().inputValue(0);
      },

      undo: () => {
        const state = get();
        if (state.history.length === 0 || state.isComplete || state.isPaused || state.isGameOver) return;
        
        const newHistory = [...state.history];
        const previousBoard = newHistory.pop()!;
        
        set({
          board: previousBoard,
          history: newHistory
        });
      },

      useHint: () => {
        const state = get();
        if (state.isComplete || state.isPaused || state.isGameOver || !state.selectedCell) return;
        
        const [r, c] = state.selectedCell;
        const cell = state.board[r][c];
        
        if (cell.isGiven || cell.value === state.solution[r][c]) return;

        const newBoard = state.board.map(row => row.map(c => ({...c, notes: new Set(c.notes)})));
        newBoard[r][c].value = state.solution[r][c];
        newBoard[r][c].isError = false;
        newBoard[r][c].notes.clear();

        const isComplete = isBoardComplete(
          newBoard.map(row => row.map(c => c.value)),
          state.solution
        );

        set({
          board: newBoard,
          hintsUsed: state.hintsUsed + 1,
          history: [...state.history, state.board.map(row => row.map(c => ({...c, notes: new Set(c.notes)})))],
          isComplete,
          coachMessage: null
        });
      },

      askCoach: async () => {
        const state = get();
        if (state.isComplete || state.isPaused || state.isGameOver) return;

        // Покажем пользователю, что мы думаем
        set({
          coachMessage: {
            text: "Думаю... Запрашиваю совет у Gemini 🧠",
            type: 'hint'
          }
        });

        const { getGeminiAdvice } = await import('../utils/aiCoach');
        const advice = await getGeminiAdvice(state.board, state.mistakes, state.difficulty);

        set({
          coachMessage: {
            text: advice,
            type: 'strategy',
            strategyName: 'Gemini 2.5 Flash'
          }
        });
      },

      clearCoachMessage: () => set({ coachMessage: null }),

      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false, startTime: Date.now() - get().elapsedTime }),
      
      updateElapsedTime: () => {
        const state = get();
        if (!state.isPaused && !state.isComplete && !state.isGameOver && state.puzzleId) {
          set({ elapsedTime: state.elapsedTime + 1000 });
        }
      },
      
      clearGame: () => set({ puzzleId: '', board: createEmptyBoard() }),

      buyExtraLife: () => {
        const state = get();
        const statsStore = useStatsStore.getState();
        const cost = 100; // Cost for extra life

        if (statsStore.spendCoins(cost)) {
          set({ 
            mistakes: Math.max(0, state.mistakes - 1),
            isGameOver: false 
          });
          return true;
        }
        return false;
      },
      
      autoCompleteForTesting: () => {
        const state = get();
        if (state.isComplete || state.isGameOver) return;
        
        const newBoard = state.board.map((row, r) => 
          row.map((cell, c) => ({
            ...cell,
            value: state.solution[r][c],
            isError: false,
            notes: new Set<number>()
          }))
        );

        set({
          board: newBoard,
          isComplete: true,
          history: [...state.history, state.board.map(row => row.map(c => ({...c, notes: new Set(c.notes)})))],
          coachMessage: null
        });
      }
    }),
    {
      name: 'sudoku-game-storage',
      partialize: (state) => ({
        board: state.board.map(row => row.map(c => ({ ...c, notes: Array.from(c.notes) }))),
        solution: state.solution,
        difficulty: state.difficulty,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        isComplete: state.isComplete,
        isGameOver: state.isGameOver,
        isNotesMode: state.isNotesMode,
        puzzleId: state.puzzleId,
        elapsedTime: state.elapsedTime,
      }),
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;
        return {
          ...currentState,
          ...persistedState,
          board: persistedState.board?.map((row: any) => 
            row.map((c: any) => ({ ...c, notes: new Set(c.notes) }))
          ) || createEmptyBoard(),
        };
      }
    }
  )
);
