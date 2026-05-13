import type { CellValue, Cell } from '../types';
import { isValidPlacement } from './sudokuValidator';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CoachExplanation {
  text: string;
  type: 'error' | 'hint' | 'strategy';
  strategyName?: string;
  highlightCells?: [number, number][];
}

// Инициализация Gemini API (используем VITE_GEMINI_API_KEY из .env)
// Для продакшена лучше выносить ключи на бэкенд, но для текущей архитектуры оставляем на фронте
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

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

/**
 * Запрашивает подсказку у Gemini AI для текущего состояния доски
 */
export const getGeminiAdvice = async (
  board: Cell[][],
  mistakes: number,
  difficulty: string
): Promise<string> => {
  if (!API_KEY) {
    return "API ключ для Gemini не настроен. Добавь VITE_GEMINI_API_KEY в файл .env.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Используем 2.5 flash

    // Подготавливаем строковое представление доски для AI
    let boardString = "Текущая доска судоку (0 - пустая ячейка):\n";
    for (let r = 0; r < 9; r++) {
      let row = "";
      for (let c = 0; c < 9; c++) {
        row += board[r][c].value + " ";
      }
      boardString += row.trim() + "\n";
    }

    const prompt = `
Ты опытный тренер по игре Судоку. Твоя задача - дать короткий, поддерживающий и обучающий совет игроку.
Игрок играет на сложности: ${difficulty}. Текущее количество ошибок: ${mistakes}/3.

${boardString}

Проанализируй доску и дай один конкретный совет:
1. Обрати внимание игрока на строку, столбец или квадрат 3x3, где осталось мало пустых ячеек (1-3 штуки), и посоветуй сфокусироваться там.
2. Не давай прямых ответов (например, "поставь 5 в левый верхний угол"), а направляй мысль.
3. Ответ должен быть на русском языке, дружелюбным и коротким (максимум 2-3 предложения).
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Хмм, мои нейронные сети сейчас перегружены. Но я вижу, что ты справляешься! Попробуй поискать блоки 3x3, где не хватает всего пары цифр.";
  }
};

export type LearnChatTurn = { role: 'user' | 'assistant'; content: string };

function boardLines(board: Cell[][]): string {
  let s = '';
  for (let r = 0; r < 9; r++) {
    s += board[r].map((c) => c.value).join(' ') + '\n';
  }
  return s;
}

function solutionLines(solution: CellValue[][]): string {
  let s = '';
  for (let r = 0; r < 9; r++) {
    s += solution[r].join(' ') + '\n';
  }
  return s;
}

/**
 * Practice mode: chat with a coach that sees the board and reference solution for accurate explanations.
 */
export async function getGeminiLearnChatReply(
  board: Cell[][],
  solution: CellValue[][],
  difficulty: string,
  history: LearnChatTurn[],
  userMessage: string,
  selectedCell: [number, number] | null
): Promise<string> {
  if (!API_KEY) {
    return 'Add VITE_GEMINI_API_KEY to your .env file so I can respond.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const sel =
      selectedCell !== null
        ? `Selected cell (1-based for the player: row ${selectedCell[0] + 1}, column ${selectedCell[1] + 1}).`
        : 'No cell is selected.';

    const recent = history.slice(-16);
    const transcript = recent
      .map((m) => `${m.role === 'user' ? 'Student' : 'Coach'}: ${m.content}`)
      .join('\n\n');

    const prompt = `You are a friendly Sudoku coach. Reply in English.

Rules:
- You see the player's current board (0 = empty) and the full solution—use the solution only to stay logically correct; do not dump the whole grid unless the student clearly asks for it.
- Teach strategies: naked/hidden singles, intersections, 3×3 blocks, pairs/triples, etc.
- If they ask where to play or what to do next, you may suggest ONE concrete next move in this form: "Place digit N in row R, column C (1-based)" plus 1–2 short sentences why.
- Keep answers concise (about 120 words max).

Difficulty: ${difficulty}.

Current board:
${boardLines(board)}

Reference solution (for your eyes only—do not paste it wholesale to the student):
${solutionLines(solution)}

${sel}

Conversation so far:
${transcript || '(start of conversation)'}

New student message: ${userMessage}

Answer as the coach.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini learn chat error:', error);
    return 'Could not reach the AI right now. Try again in a moment or check your API key.';
  }
}
