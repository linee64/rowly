export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Cell {
  value: CellValue;
  isGiven: boolean;
  isError: boolean;
  notes: Set<number>;
}

export interface CompletedGame {
  puzzleId: string;
  difficulty: Difficulty;
  timeSeconds: number;
  mistakes: number;
  hintsUsed: number;
  completedAt: string;
  isPersonalBest: boolean;
}

export interface GameState {
  board: Cell[][];
  solution: CellValue[][];
  selectedCell: [number, number] | null;
  difficulty: Difficulty;
  mistakes: number;
  hintsUsed: number;
  isComplete: boolean;
  isGameOver: boolean;
  isNotesMode: boolean;
  isPaused: boolean;
  history: Cell[][][];
  puzzleId: string;
  startTime: number;
  elapsedTime: number;
  coachMessage: CoachExplanation | null;
}

export interface CoachExplanation {
  text: string;
  type: 'error' | 'hint' | 'strategy';
  strategyName?: string;
  highlightCells?: [number, number][];
}

export interface UserStats {
  gamesPlayed: Record<Difficulty, number>;
  bestTimes: Record<Difficulty, number | null>;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;
  totalHintsUsed: number;
  totalMistakes: number;
  completedGames: CompletedGame[];
  achievements: string[];
  coins: number;
  ownedSkins: string[];
  activeSkin: string;
  ownedTitles: string[];
  activeTitle: string | null;
  playerName: string;
  avatarUrl: string | null;
  nameChangeCount: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'title';
  preview?: string;
}
