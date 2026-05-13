import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Loader2, Sparkles, Lightbulb, Target } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { SudokuBoard } from '../components/game/SudokuBoard';
import { NumberPad } from '../components/game/NumberPad';
import { GameControls } from '../components/game/GameControls';
import { GameTimer } from '../components/game/GameTimer';
import { VictoryModal } from '../components/game/VictoryModal';
import { GameOverModal } from '../components/game/GameOverModal';
import { useKeyboard } from '../hooks/useKeyboard';
import { Button } from '../components/ui/Button';
import { getGeminiLearnChatReply, type LearnChatTurn } from '../utils/aiCoach';
import type { CellValue } from '../types';

const WELCOME =
  "Hi! I'm your AI coach. Tap an empty cell and ask what could go there, or use the quick actions below—we'll work through the position together.";

export const LearnModePage: React.FC = () => {
  const navigate = useNavigate();
  const puzzleId = useGameStore((s) => s.puzzleId);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const board = useGameStore((s) => s.board);
  const solution = useGameStore((s) => s.solution);
  const difficulty = useGameStore((s) => s.difficulty);
  const selectedCell = useGameStore((s) => s.selectedCell);

  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string }[]>([
    { id: 'welcome', role: 'assistant', text: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  useKeyboard();

  useEffect(() => {
    if (!puzzleId) {
      startNewGame('easy');
    }
  }, [puzzleId, startNewGame]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const pushAssistant = useCallback((text: string) => {
    setMessages((m) => [
      ...m,
      { id: `a-${Date.now()}`, role: 'assistant', text },
    ]);
  }, []);

  const runPrompt = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || loading) return;

      const historyBefore: LearnChatTurn[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const sol =
        solution.length === 9 && solution[0]?.length === 9 ? (solution as CellValue[][]) : null;
      if (!sol) {
        pushAssistant('The board is not ready yet. Wait a moment and try again.');
        return;
      }

      setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text: trimmed }]);
      setInput('');
      setLoading(true);

      try {
        const reply = await getGeminiLearnChatReply(
          board,
          sol,
          difficulty,
          historyBefore,
          trimmed,
          selectedCell
        );
        pushAssistant(reply);
      } finally {
        setLoading(false);
      }
    },
    [board, solution, difficulty, selectedCell, loading, messages, pushAssistant]
  );

  const quickAnalyze = () =>
    runPrompt(
      'Briefly say what to focus on in the current position and suggest one logical next step.'
    );
  const quickWhy = () =>
    runPrompt(
      selectedCell
        ? `I selected row ${selectedCell[0] + 1}, column ${selectedCell[1] + 1}. What candidates are possible there and why?`
        : 'Which cell should I look at first and why?'
    );

  if (!puzzleId) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen p-2 sm:p-4 md:p-6 w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <header className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="-ml-2">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            <h1 className="text-xl sm:text-2xl font-bold text-tx-primary">Practice Mode</h1>
          </div>
          <span className="text-xs uppercase tracking-widest text-tx-muted font-bold">AI coach · Easy</span>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
          <div className="w-full lg:max-w-[480px] flex flex-col gap-3 shrink-0 mx-auto lg:mx-0">
            <div className="flex items-center justify-between bg-surface/50 p-3 rounded-2xl border border-border">
              <GameTimer />
            </div>
            <div className="w-full max-w-[480px] mx-auto aspect-square">
              <SudokuBoard />
            </div>
            <div className="w-full flex flex-col bg-surface p-3 sm:p-4 rounded-2xl border border-border gap-3">
              <GameControls hideWinDev />
              <NumberPad />
            </div>
          </div>

          <section className="flex-1 min-h-[420px] flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-elevated/50 flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" className="text-xs" onClick={quickAnalyze} disabled={loading}>
                <Lightbulb className="w-4 h-4 mr-1" />
                Board overview
              </Button>
              <Button type="button" variant="secondary" size="sm" className="text-xs" onClick={quickWhy} disabled={loading}>
                <Target className="w-4 h-4 mr-1" />
                Selected cell
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[min(50vh,420px)] lg:max-h-[calc(100vh-12rem)]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gold/15 text-tx-primary border border-gold/25'
                        : 'bg-elevated text-tx-primary border border-border'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1">AI coach</p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-elevated border border-border flex items-center gap-2 text-sm text-tx-secondary">
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    Analyzing the board…
                  </div>
                </div>
              )}
              <div ref={listEndRef} />
            </div>

            <form
              className="p-3 border-t border-border flex gap-2 bg-primary/30"
              onSubmit={(e) => {
                e.preventDefault();
                void runPrompt(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask: where to place a digit, what strategy to use…"
                className="flex-1 min-w-0 rounded-xl bg-elevated border border-border px-3 py-2.5 text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none focus:ring-2 focus:ring-gold/30"
                disabled={loading}
              />
              <Button type="submit" variant="gold" size="sm" className="shrink-0 px-4" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </section>
        </div>
      </div>

      <VictoryModal />
      <GameOverModal />
    </div>
  );
};
