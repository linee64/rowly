import type { CellValue, Cell } from '../types';
import { isValidPlacement } from './sudokuValidator';

export interface CoachExplanation {
  text: string;
  type: 'error' | 'hint' | 'strategy';
  strategyName?: string;
  highlightCells?: [number, number][];
}

/**
 * Объясняет, почему цифра не может быть поставлена в данную ячейку.
 */
export const explainError = (
  board: Cell[][],
  row: number,
  col: number,
  value: CellValue
): CoachExplanation => {
  const boardValues = board.map(r => r.map(c => c.value));
  
  // Проверка строки
  for (let c = 0; c < 9; c++) {
    if (c !== col && boardValues[row][c] === value) {
      return {
        text: `Цифра ${value} уже есть в этой строке (столбец ${c + 1}). В Sudoku цифры не могут повторяться в одной строке.`,
        type: 'error',
        highlightCells: [[row, c]]
      };
    }
  }

  // Проверка колонки
  for (let r = 0; r < 9; r++) {
    if (r !== row && boardValues[r][col] === value) {
      return {
        text: `Цифра ${value} уже есть в этом столбце (строка ${r + 1}). В Sudoku цифры не могут повторяться в одном столбце.`,
        type: 'error',
        highlightCells: [[r, col]]
      };
    }
  }

  // Проверка квадрата 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currR = boxRow + r;
      const currC = boxCol + c;
      if ((currR !== row || currC !== col) && boardValues[currR][currC] === value) {
        return {
          text: `Цифра ${value} уже есть в этом квадрате 3x3. Помни, что в каждом блоке 3x3 должны быть уникальные цифры от 1 до 9.`,
          type: 'error',
          highlightCells: [[currR, currC]]
        };
      }
    }
  }

  return {
    text: `Эта цифра не подходит по правилам судоку, хотя явных конфликтов в строке, столбце или квадрате нет. Возможно, она конфликтует с финальным решением пазла.`,
    type: 'error'
  };
};

/**
 * Пытается найти стратегию для объяснения следующего хода.
 */
export const explainNextMove = (
  board: Cell[][],
  row: number,
  col: number,
  solutionValue: CellValue
): CoachExplanation => {
  const boardValues = board.map(r => r.map(c => c.value));
  
  // 1. Проверка на Naked Single (Единственный кандидат в ячейке)
  const candidates: number[] = [];
  for (let v = 1; v <= 9; v++) {
    if (isValidPlacement(boardValues, row, col, v as CellValue)) {
      candidates.push(v);
    }
  }

  if (candidates.length === 1) {
    return {
      text: `В этой ячейке может стоять только цифра ${solutionValue}, так как все остальные цифры уже присутствуют в этой строке, столбце или квадрате. Это стратегия "Одиночка" (Naked Single).`,
      type: 'strategy',
      strategyName: 'Naked Single'
    };
  }

  // 2. Проверка на Hidden Single (Единственное место для цифры в группе)
  // Проверка строки
  let rowPossible = true;
  for (let c = 0; c < 9; c++) {
    if (c !== col && boardValues[row][c] === 0) {
      if (isValidPlacement(boardValues, row, c, solutionValue)) {
        rowPossible = false;
        break;
      }
    }
  }
  if (rowPossible) {
    return {
      text: `В этой строке цифра ${solutionValue} может стоять только в этой ячейке. Даже если в самой ячейке возможны другие кандидаты, в других пустых ячейках этой строки ${solutionValue} поставить нельзя.`,
      type: 'strategy',
      strategyName: 'Hidden Single (Row)'
    };
  }

  // Проверка колонки
  let colPossible = true;
  for (let r = 0; r < 9; r++) {
    if (r !== row && boardValues[r][col] === 0) {
      if (isValidPlacement(boardValues, r, col, solutionValue)) {
        colPossible = false;
        break;
      }
    }
  }
  if (colPossible) {
    return {
      text: `В этом столбце цифра ${solutionValue} может стоять только в этой ячейке. Это единственный вариант для данного столбца.`,
      type: 'strategy',
      strategyName: 'Hidden Single (Column)'
    };
  }

  return {
    text: `ИИ-Тренер советует поставить сюда ${solutionValue}. Попробуй проанализировать окружающие ячейки, чтобы понять, почему это единственный верный вариант!`,
    type: 'hint'
  };
};
