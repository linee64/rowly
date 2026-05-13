import type { Difficulty } from '../types';

export interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  timeSeconds: number;
  difficulty: Difficulty;
  date: string;
  isCurrentUser: boolean;
}

const FIRST_NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Charlie', 'Drew'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const generateFakeTime = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return Math.floor(Math.random() * 120) + 90; // 1:30 - 3:30
    case 'medium': return Math.floor(Math.random() * 300) + 180; // 3:00 - 8:00
    case 'hard': return Math.floor(Math.random() * 600) + 420; // 7:00 - 17:00
    case 'expert': return Math.floor(Math.random() * 900) + 720; // 12:00 - 27:00
    default: return 300;
  }
};

export const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  let idCounter = 0;
  
  for (const diff of difficulties) {
    for (let i = 0; i < 5; i++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      
      entries.push({
        id: `mock-${idCounter++}`,
        name: `${firstName} ${lastName}`,
        initials: `${firstName[0]}${lastName[0]}`,
        timeSeconds: generateFakeTime(diff),
        difficulty: diff,
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        isCurrentUser: false,
      });
    }
  }
  
  return entries.sort((a, b) => a.timeSeconds - b.timeSeconds);
};
