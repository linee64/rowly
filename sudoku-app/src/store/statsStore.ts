import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserStats, CompletedGame, ShopItem } from '../types';
import { supabase } from '../lib/supabase';

interface StatsStore extends UserStats {
  addCompletedGame: (game: CompletedGame) => Promise<void>;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  buyItem: (item: ShopItem) => boolean;
  selectSkin: (skinId: string) => void;
  selectTitle: (title: string | null) => void;
  updateProfile: (updates: Partial<Pick<UserStats, 'playerName' | 'avatarUrl'>>) => boolean;
  resetStats: () => void;
}

const initialStats: UserStats = {
  gamesPlayed: { easy: 0, medium: 0, hard: 0, expert: 0 },
  bestTimes: { easy: null, medium: null, hard: null, expert: null },
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: '',
  totalHintsUsed: 0,
  totalMistakes: 0,
  completedGames: [],
  achievements: [],
  coins: 0,
  ownedSkins: ['classic'],
  activeSkin: 'classic',
  ownedTitles: [],
  activeTitle: null,
  playerName: 'Guest Player',
  avatarUrl: null,
  nameChangeCount: 0,
};

const checkAchievements = (stats: UserStats, newGame: CompletedGame): string[] => {
  const newAchievements = new Set(stats.achievements);
  
  if (!newAchievements.has('first_win')) newAchievements.add('first_win');
  if (newGame.timeSeconds < 180 && !newAchievements.has('speed_demon')) newAchievements.add('speed_demon');
  if (newGame.mistakes === 0 && !newAchievements.has('perfectionist')) newAchievements.add('perfectionist');
  if (stats.currentStreak >= 7 && !newAchievements.has('week_warrior')) newAchievements.add('week_warrior');
  
  const totalGames = Object.values(stats.gamesPlayed).reduce((a, b) => a + b, 0);
  if (totalGames >= 100 && !newAchievements.has('century')) newAchievements.add('century');
  
  if (newGame.hintsUsed === 0 && !newAchievements.has('hint_free')) newAchievements.add('hint_free');
  if (newGame.difficulty === 'expert' && !newAchievements.has('expert_slayer')) newAchievements.add('expert_slayer');

  return Array.from(newAchievements);
};

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      ...initialStats,

      addCompletedGame: async (game) => {
        const state = get();
        const today = new Date().toDateString();
        
        let newStreak = state.currentStreak;
        if (state.lastPlayedDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (state.lastPlayedDate === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        const newGamesPlayed = {
          ...state.gamesPlayed,
          [game.difficulty]: state.gamesPlayed[game.difficulty] + 1
        };

        const currentBest = state.bestTimes[game.difficulty];
        const isPersonalBest = currentBest === null || game.timeSeconds < currentBest;
        const newBestTimes = {
          ...state.bestTimes,
          [game.difficulty]: isPersonalBest ? game.timeSeconds : currentBest
        };

        const updatedGame = { ...game, isPersonalBest };

        const tempState = {
          ...state,
          gamesPlayed: newGamesPlayed,
          currentStreak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          lastPlayedDate: today,
          totalHintsUsed: state.totalHintsUsed + game.hintsUsed,
          totalMistakes: state.totalMistakes + game.mistakes,
          bestTimes: newBestTimes,
        };

        const achievements = checkAchievements(tempState, updatedGame);

        // Coin rewards based on difficulty
        const rewards = {
          easy: 50,
          medium: 100,
          hard: 150,
          expert: 200
        };
        const rewardAmount = rewards[game.difficulty] || 50;

        set({
          ...tempState,
          completedGames: [updatedGame, ...state.completedGames].slice(0, 100),
          achievements,
          coins: state.coins + rewardAmount
        });

        // Try inserting into Supabase
        if (supabase) {
          try {
            const displayName = state.activeTitle ? `${state.activeTitle} ${state.playerName}` : state.playerName;
            
            // Log for debugging
            console.log("Syncing to leaderboard:", { displayName, time: game.timeSeconds, difficulty: game.difficulty });

            const { error } = await supabase.from('leaderboard').insert([
              {
                player_name: displayName,
                time_seconds: game.timeSeconds,
                difficulty: game.difficulty,
                avatar_url: state.avatarUrl,
                // created_at is automatically handled by Supabase default values
              }
            ]);

            if (error) throw error;
          } catch (err) {
            console.error("Failed to insert score into supabase:", err);
          }
        }
      },

      addCoins: (amount) => set(state => ({ coins: state.coins + amount })),

      spendCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },

      buyItem: (item) => {
        const state = get();
        if (state.coins < item.price) return false;

        if (item.type === 'skin') {
          if (state.ownedSkins.includes(item.id)) return true;
          set({
            coins: state.coins - item.price,
            ownedSkins: [...state.ownedSkins, item.id]
          });
        } else if (item.type === 'title') {
          if (state.ownedTitles.includes(item.name)) return true;
          set({
            coins: state.coins - item.price,
            ownedTitles: [...state.ownedTitles, item.name]
          });
        }
        return true;
      },

      selectSkin: (skinId) => set({ activeSkin: skinId }),

      selectTitle: (title) => set({ activeTitle: title }),

      updateProfile: (updates) => {
        const state = get();
        const newUpdates: Partial<UserStats> = { ...updates };
        
        if (updates.playerName && updates.playerName !== state.playerName) {
          if (state.nameChangeCount >= 3) return false;
          newUpdates.nameChangeCount = state.nameChangeCount + 1;
        }
        
        set(newUpdates);
        return true;
      },

      resetStats: () => set(initialStats)
    }),
    {
      name: 'sudoku-stats-storage',
    }
  )
);
