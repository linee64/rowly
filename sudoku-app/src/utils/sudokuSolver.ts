import type { CellValue } from '../types';
import { isValidPlacement } from './sudokuValidator';

// Deep copy board
export const copyBoard = (board: CellValue[][]): CellValue[][] => {
  return board.map((row) => [...row]);
};

// Solve board, returns a valid completed board or null
export const solvePuzzle = (board: CellValue[][]): CellValue[][] | null => {
  const cloned = copyBoard(board);
  if (solve(cloned)) {
    return cloned;
  }
  return null;
};

const solve = (board: CellValue[][]): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          const val = num as CellValue;
          if (isValidPlacement(board, r, c, val)) {
            board[r][c] = val;
            if (solve(board)) {
              return true;
            }
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Count solutions for uniqueness check
export const countSolutions = (board: CellValue[][], limit = 2): number => {
  let count = 0;
  
  const solveCount = (b: CellValue[][]): void => {
    if (count >= limit) return;
    
    let row = -1;
    let col = -1;
    let isEmpty = false;
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] === 0) {
          row = r;
          col = c;
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) break;
    }
    
    if (!isEmpty) {
      count++;
      return;
    }
    
    for (let num = 1; num <= 9; num++) {
      const val = num as CellValue;
      if (isValidPlacement(b, row, col, val)) {
        b[row][col] = val;
        solveCount(b);
        b[row][col] = 0;
      }
    }
  };
  
  solveCount(copyBoard(board));
  return count;
};
