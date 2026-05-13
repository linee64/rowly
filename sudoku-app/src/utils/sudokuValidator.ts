import type { CellValue } from '../types';

export const isValidPlacement = (
  board: CellValue[][],
  row: number,
  col: number,
  num: CellValue
): boolean => {
  if (num === 0) return true;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c === col) continue; // Skip the cell being evaluated
    if (board[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r === row) continue; // Skip the cell being evaluated
    if (board[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currentRow = boxRow + r;
      const currentCol = boxCol + c;
      if (currentRow === row && currentCol === col) continue; // Skip the cell being evaluated
      if (board[currentRow][currentCol] === num) return false;
    }
  }

  return true;
};

export const isBoardComplete = (board: CellValue[][], solution: CellValue[][]): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0 || board[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
};

export const getErrors = (board: CellValue[][], solution: CellValue[][]): [number, number][] => {
  const errors: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val !== 0 && val !== solution[r][c]) {
        errors.push([r, c]);
      }
    }
  }
  return errors;
};
