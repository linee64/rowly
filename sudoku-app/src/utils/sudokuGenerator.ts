import type { CellValue, Difficulty } from '../types';
import { countSolutions } from './sudokuSolver';
import { isValidPlacement } from './sudokuValidator';

// Simple seeded PRNG (Mulberry32)
export const seededRandom = (seed: number) => {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
};

export const generateStringSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

const getCellsToRemove = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return 38; // 81 - 38 = 43 givens
    case 'medium': return 47; // 81 - 47 = 34 givens
    case 'hard': return 52; // 81 - 52 = 29 givens
    case 'expert': return 56; // 81 - 56 = 25 givens
    default: return 45;
  }
};

const shuffle = <T>(array: T[], rng: () => number): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const generateFullBoard = (rng: () => number): CellValue[][] => {
  const board: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  
  const fillBoard = (r: number, c: number): boolean => {
    if (c === 9) {
      r++;
      c = 0;
      if (r === 9) return true;
    }
    
    if (board[r][c] !== 0) return fillBoard(r, c + 1);
    
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[], rng);
    for (const num of nums) {
      if (isValidPlacement(board, r, c, num)) {
        board[r][c] = num;
        if (fillBoard(r, c + 1)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  };
  
  fillBoard(0, 0);
  return board;
};

export const generatePuzzle = (
  difficulty: Difficulty,
  seedString?: string
): { puzzle: CellValue[][]; solution: CellValue[][] } => {
  const seed = seedString ? generateStringSeed(seedString) : Math.random() * 0xFFFFFFFF;
  const rng = seededRandom(seed);
  
  const solution = generateFullBoard(rng);
  const puzzle = solution.map(row => [...row]);
  
  const cellsToRemove = getCellsToRemove(difficulty);
  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  
  shuffle(positions, rng);
  
  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break;
    
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    
    // Check if still unique solution
    const solutionsCount = countSolutions(puzzle, 2);
    if (solutionsCount !== 1) {
      puzzle[r][c] = backup; // revert
    } else {
      removed++;
    }
  }
  
  return { puzzle, solution };
};
