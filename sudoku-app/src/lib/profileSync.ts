import type { Difficulty, UserStats } from '../types';
import { supabase } from './supabase';

const DEBOUNCE_MS = 900;

let profileSyncUserId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

const initialShape: UserStats = {
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

export function setProfileSyncUserId(userId: string | null): void {
  profileSyncUserId = userId;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
}

export function extractUserStats(s: UserStats): UserStats {
  return {
    gamesPlayed: { ...s.gamesPlayed },
    bestTimes: { ...s.bestTimes },
    currentStreak: s.currentStreak,
    bestStreak: s.bestStreak,
    lastPlayedDate: s.lastPlayedDate,
    totalHintsUsed: s.totalHintsUsed,
    totalMistakes: s.totalMistakes,
    completedGames: s.completedGames.map((g) => ({ ...g })),
    achievements: [...s.achievements],
    coins: s.coins,
    ownedSkins: [...s.ownedSkins],
    activeSkin: s.activeSkin,
    ownedTitles: [...s.ownedTitles],
    activeTitle: s.activeTitle,
    playerName: s.playerName,
    avatarUrl: s.avatarUrl,
    nameChangeCount: s.nameChangeCount,
  };
}

function totalGamesPlayed(s: UserStats): number {
  return Object.values(s.gamesPlayed).reduce((a, b) => a + b, 0);
}

const PERSIST_KEY = 'sudoku-stats-storage';

function isLocalProfileEmpty(s: UserStats): boolean {
  return (
    totalGamesPlayed(s) === 0 &&
    s.completedGames.length === 0 &&
    s.coins === 0 &&
    s.achievements.length === 0 &&
    s.ownedTitles.length === 0 &&
    s.ownedSkins.length <= 1
  );
}

function isRemoteEmpty(s: UserStats): boolean {
  return (
    totalGamesPlayed(s) === 0 &&
    s.completedGames.length === 0 &&
    s.playerName === 'Guest Player' &&
    s.coins === 0 &&
    s.achievements.length === 0 &&
    s.ownedTitles.length === 0 &&
    s.ownedSkins.length <= 1
  );
}

/** Merge local and server snapshots when both have progress (e.g. two devices). */
function mergeBoth(a: UserStats, b: UserStats): UserStats {
  const primary = totalGamesPlayed(b) > totalGamesPlayed(a) ? b : a;
  const secondary = primary === b ? a : b;

  const key = (g: { puzzleId: string; completedAt: string }) => `${g.puzzleId}:${g.completedAt}`;
  const seen = new Set(primary.completedGames.map(key));
  const mergedList = [...primary.completedGames];
  for (const g of secondary.completedGames) {
    const k = key(g);
    if (!seen.has(k)) {
      mergedList.push(g);
      seen.add(k);
    }
  }
  mergedList.sort(
    (x, y) => new Date(y.completedAt).getTime() - new Date(x.completedAt).getTime()
  );
  const completedGames = mergedList.slice(0, 100);

  const gamesPlayed: Record<Difficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  };
  const bestTimes: Record<Difficulty, number | null> = {
    easy: null,
    medium: null,
    hard: null,
    expert: null,
  };
  for (const g of completedGames) {
    gamesPlayed[g.difficulty] += 1;
    const prev = bestTimes[g.difficulty];
    bestTimes[g.difficulty] =
      prev === null ? g.timeSeconds : Math.min(prev, g.timeSeconds);
  }

  const achievements = Array.from(new Set([...primary.achievements, ...secondary.achievements]));

  const ownedSkins = Array.from(new Set([...primary.ownedSkins, ...secondary.ownedSkins]));
  const ownedTitles = Array.from(new Set([...primary.ownedTitles, ...secondary.ownedTitles]));

  const pickName =
    primary.playerName !== 'Guest Player'
      ? primary.playerName
      : secondary.playerName !== 'Guest Player'
        ? secondary.playerName
        : primary.playerName;

  const pickAvatar = primary.avatarUrl ?? secondary.avatarUrl;

  return {
    ...primary,
    gamesPlayed,
    bestTimes,
    currentStreak: Math.max(primary.currentStreak, secondary.currentStreak),
    bestStreak: Math.max(primary.bestStreak, secondary.bestStreak),
    lastPlayedDate:
      primary.lastPlayedDate > secondary.lastPlayedDate
        ? primary.lastPlayedDate
        : secondary.lastPlayedDate,
    totalHintsUsed: primary.totalHintsUsed + secondary.totalHintsUsed,
    totalMistakes: primary.totalMistakes + secondary.totalMistakes,
    completedGames,
    achievements,
    coins: Math.max(primary.coins, secondary.coins),
    ownedSkins,
    activeSkin: primary.activeSkin,
    ownedTitles,
    activeTitle: primary.activeTitle ?? secondary.activeTitle,
    playerName: pickName,
    avatarUrl: pickAvatar,
    nameChangeCount: Math.max(primary.nameChangeCount, secondary.nameChangeCount),
  };
}

export function mergeWithRemote(local: UserStats, remote: UserStats | null): UserStats {
  if (!remote || isRemoteEmpty(remote)) {
    return local;
  }
  if (isLocalProfileEmpty(local)) {
    return remote;
  }
  if (isLocalProfileEmpty(remote)) {
    return local;
  }
  return mergeBoth(local, remote);
}

function coerceUserStats(raw: unknown): UserStats | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const gamesPlayed = o.gamesPlayed as Record<string, unknown> | undefined;
  if (!gamesPlayed) return null;
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  for (const d of difficulties) {
    if (typeof gamesPlayed[d] !== 'number') return null;
  }
  const bestTimes = o.bestTimes as Record<string, unknown> | undefined;
  if (!bestTimes) return null;
  for (const d of difficulties) {
    const v = bestTimes[d];
    if (v !== null && typeof v !== 'number') return null;
  }

  const completedGamesRaw = Array.isArray(o.completedGames) ? o.completedGames : [];
  const completedGames = completedGamesRaw
    .filter(
      (g): g is Record<string, unknown> =>
        !!g && typeof g === 'object' && typeof (g as Record<string, unknown>).puzzleId === 'string'
    )
    .map((g) => ({
      puzzleId: String(g.puzzleId),
      difficulty: difficulties.includes(g.difficulty as Difficulty)
        ? (g.difficulty as Difficulty)
        : 'easy',
      timeSeconds: Number(g.timeSeconds) || 0,
      mistakes: Number(g.mistakes) || 0,
      hintsUsed: Number(g.hintsUsed) || 0,
      completedAt: String(g.completedAt || ''),
      isPersonalBest: Boolean(g.isPersonalBest),
    }));

  return {
    gamesPlayed: {
      easy: Number(gamesPlayed.easy) || 0,
      medium: Number(gamesPlayed.medium) || 0,
      hard: Number(gamesPlayed.hard) || 0,
      expert: Number(gamesPlayed.expert) || 0,
    },
    bestTimes: {
      easy: bestTimes.easy === null ? null : Number(bestTimes.easy),
      medium: bestTimes.medium === null ? null : Number(bestTimes.medium),
      hard: bestTimes.hard === null ? null : Number(bestTimes.hard),
      expert: bestTimes.expert === null ? null : Number(bestTimes.expert),
    },
    currentStreak: Number(o.currentStreak) || 0,
    bestStreak: Number(o.bestStreak) || 0,
    lastPlayedDate: String(o.lastPlayedDate ?? ''),
    totalHintsUsed: Number(o.totalHintsUsed) || 0,
    totalMistakes: Number(o.totalMistakes) || 0,
    completedGames,
    achievements: Array.isArray(o.achievements) ? o.achievements.map(String) : [],
    coins: Number(o.coins) || 0,
    ownedSkins: Array.isArray(o.ownedSkins) ? o.ownedSkins.map(String) : ['classic'],
    activeSkin: typeof o.activeSkin === 'string' ? o.activeSkin : 'classic',
    ownedTitles: Array.isArray(o.ownedTitles) ? o.ownedTitles.map(String) : [],
    activeTitle: o.activeTitle === null || typeof o.activeTitle === 'string' ? o.activeTitle : null,
    playerName: typeof o.playerName === 'string' ? o.playerName : initialShape.playerName,
    avatarUrl: o.avatarUrl === null || typeof o.avatarUrl === 'string' ? o.avatarUrl : null,
    nameChangeCount: Number(o.nameChangeCount) || 0,
  };
}

export function readGuestStatsFromStorage(): UserStats | null {
  for (const key of [`${PERSIST_KEY}-guest`, PERSIST_KEY]) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as { state?: unknown };
      const state = parsed?.state;
      if (!state || typeof state !== 'object') continue;
      const merged = { ...initialShape, ...(state as Record<string, unknown>) };
      const coerced = coerceUserStats(merged);
      if (coerced) return coerced;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function clearGuestStatsStorage(): void {
  localStorage.removeItem(`${PERSIST_KEY}-guest`);
  localStorage.removeItem(PERSIST_KEY);
}

export async function fetchProfileStats(userId: string): Promise<UserStats | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('stats_json')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('fetchProfileStats:', error.message);
      return null;
    }
    if (!data?.stats_json) return null;
    return coerceUserStats(data.stats_json);
  } catch (e) {
    console.warn('fetchProfileStats failed', e);
    return null;
  }
}

async function upsertProfileStats(userId: string, stats: UserStats): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const payload = extractUserStats(stats);
  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      stats_json: payload as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) {
    console.error('upsertProfileStats:', error.message);
  }
}

export function scheduleProfileStatsUpload(getStats: () => UserStats): void {
  const uid = profileSyncUserId;
  if (!uid || !isSupabaseConfigured()) return;

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void upsertProfileStats(uid, getStats());
  }, DEBOUNCE_MS);
}

export async function flushProfileStatsNow(getStats: () => UserStats): Promise<void> {
  const uid = profileSyncUserId;
  if (!uid || !isSupabaseConfigured()) return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await upsertProfileStats(uid, getStats());
}
