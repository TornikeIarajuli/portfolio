// Game statistics and leaderboard management

export interface GameScore {
  playerName: string;
  score: number;
  date: string;
  difficulty?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    unlocked: false,
  },
  {
    id: 'snake_master',
    title: 'Snake Master',
    description: 'Score 100+ in Snake',
    icon: '🐍',
    unlocked: false,
  },
  {
    id: 'snake_legend',
    title: 'Snake Legend',
    description: 'Score 200+ in Snake',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'perfect_snake',
    title: 'Perfect Snake',
    description: 'Reach 50 points without hitting yourself',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'tic_tac_winner',
    title: 'Tic-Tac Champion',
    description: 'Win 5 games of Tic-Tac-Toe',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'memory_genius',
    title: 'Memory Genius',
    description: 'Complete Memory Cards in under 30 seconds',
    icon: '🧠',
    unlocked: false,
  },
  {
    id: 'memory_speedster',
    title: 'Memory Speedster',
    description: 'Complete Memory Cards in under 20 seconds',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'perfect_memory',
    title: 'Perfect Memory',
    description: 'Complete Memory with no more than 12 moves',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'pong_pro',
    title: 'Pong Pro',
    description: 'Score 10+ in Pong',
    icon: '🏓',
    unlocked: false,
  },
  {
    id: 'pong_perfect',
    title: 'Pong Perfect',
    description: 'Win 10-0 in Pong',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'konami_discoverer',
    title: 'Secret Finder',
    description: 'Discover the Konami Code',
    icon: '🔐',
    unlocked: false,
  },
  {
    id: 'hard_mode',
    title: 'Hardcore Gamer',
    description: 'Beat any game on Hard difficulty',
    icon: '💀',
    unlocked: false,
  },
  {
    id: 'all_games',
    title: 'Game Completionist',
    description: 'Play all 4 games',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Play games on 3 different days',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'score_hunter',
    title: 'Score Hunter',
    description: 'Reach the top 3 in any leaderboard',
    icon: '🥇',
    unlocked: false,
  },
  {
    id: 'multi_talent',
    title: 'Multi-Talented',
    description: 'Score 50+ in Snake, Memory, and Pong',
    icon: '🎨',
    unlocked: false,
  },
];

// Leaderboard functions
export function getLeaderboard(game: string): GameScore[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(`leaderboard_${game}`);
  return data ? JSON.parse(data) : [];
}

export function addToLeaderboard(game: string, score: GameScore): void {
  const leaderboard = getLeaderboard(game);
  leaderboard.push(score);
  leaderboard.sort((a, b) => b.score - a.score);
  const topScores = leaderboard.slice(0, 10); // Keep top 10
  localStorage.setItem(`leaderboard_${game}`, JSON.stringify(topScores));
}

// Achievement functions
export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return ACHIEVEMENTS;
  const data = localStorage.getItem('achievements');
  return data ? JSON.parse(data) : ACHIEVEMENTS;
}

export function unlockAchievement(achievementId: string): boolean {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);

  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedDate = new Date().toISOString();
    localStorage.setItem('achievements', JSON.stringify(achievements));
    return true; // Newly unlocked
  }
  return false; // Already unlocked or not found
}

export function checkAchievement(type: string, value: number | string | { score: number, aiScore?: number, moves?: number, timer?: number }): string | null {
  switch (type) {
    case 'snake_score':
      if (typeof value === 'number') {
        if (value >= 200) {
          if (unlockAchievement('snake_legend')) return 'snake_legend';
        } else if (value >= 100) {
          if (unlockAchievement('snake_master')) return 'snake_master';
        }
      }
      break;
    case 'memory_time':
      if (typeof value === 'number') {
        if (value <= 20) {
          if (unlockAchievement('memory_speedster')) return 'memory_speedster';
        } else if (value <= 30) {
          if (unlockAchievement('memory_genius')) return 'memory_genius';
        }
      }
      break;
    case 'memory_complete':
      if (typeof value === 'object' && 'moves' in value && value.moves !== undefined) {
        if (value.moves <= 12) {
          if (unlockAchievement('perfect_memory')) return 'perfect_memory';
        }
      }
      break;
    case 'pong_score':
      if (typeof value === 'object' && 'score' in value && 'aiScore' in value) {
        if (value.score >= 10 && value.aiScore === 0) {
          if (unlockAchievement('pong_perfect')) return 'pong_perfect';
        } else if (value.score >= 10) {
          if (unlockAchievement('pong_pro')) return 'pong_pro';
        }
      }
      break;
    case 'hard_mode_complete':
      if (unlockAchievement('hard_mode')) return 'hard_mode';
      break;
    case 'konami_code':
      if (unlockAchievement('konami_discoverer')) return 'konami_discoverer';
      break;
  }
  return null;
}

// Track games played
export function trackGamePlayed(game: string): void {
  if (typeof window === 'undefined') return;

  // Track first game
  const gamesPlayed = localStorage.getItem('games_played');
  if (!gamesPlayed) {
    unlockAchievement('first_game');
  }

  // Track all games
  const played = gamesPlayed ? JSON.parse(gamesPlayed) : [];
  if (!played.includes(game)) {
    played.push(game);
    localStorage.setItem('games_played', JSON.stringify(played));

    if (played.length >= 4) {
      unlockAchievement('all_games');
    }
  }
}

// Achievement progress tracking
export function updateAchievementProgress(achievementId: string, current: number, max: number): void {
  if (typeof window === 'undefined') return;

  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);

  if (achievement && !achievement.unlocked) {
    achievement.progress = Math.min(current, max);
    achievement.maxProgress = max;
    console.log(`Updated progress for ${achievementId}: ${achievement.progress}/${achievement.maxProgress}`); // Debug log
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }
}

// Get current high score for a game
export function getHighScore(game: string): number {
  const leaderboard = getLeaderboard(game);
  if (leaderboard.length === 0) return 0;
  return Math.max(...leaderboard.map(entry => entry.score));
}

// Player name management
export function getPlayerName(): string {
  if (typeof window === 'undefined') return 'Player';
  return localStorage.getItem('player_name') || 'Player';
}

export function setPlayerName(name: string): void {
  if (typeof window === 'undefined') return;
  const trimmedName = name.trim();
  if (trimmedName.length > 0 && trimmedName.length <= 20) {
    localStorage.setItem('player_name', trimmedName);
  }
}
