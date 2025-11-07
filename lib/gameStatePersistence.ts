// Game state persistence utility

export interface SavedGameState {
  gameName: string;
  timestamp: number;
  state: any;
}

const STORAGE_PREFIX = 'game_state_';

export function saveGameState(gameName: string, state: any): void {
  try {
    const savedState: SavedGameState = {
      gameName,
      timestamp: Date.now(),
      state,
    };
    localStorage.setItem(`${STORAGE_PREFIX}${gameName}`, JSON.stringify(savedState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(gameName: string): SavedGameState | null {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${gameName}`);
    if (!saved) return null;

    const savedState: SavedGameState = JSON.parse(saved);

    // Check if state is older than 24 hours
    const hoursSinceLastSave = (Date.now() - savedState.timestamp) / (1000 * 60 * 60);
    if (hoursSinceLastSave > 24) {
      clearGameState(gameName);
      return null;
    }

    return savedState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState(gameName: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${gameName}`);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}

export function hasGameState(gameName: string): boolean {
  const saved = loadGameState(gameName);
  return saved !== null;
}

// Preferences persistence
const PREFS_PREFIX = 'game_prefs_';

export interface GamePreferences {
  difficulty?: string;
  soundEnabled?: boolean;
  crtEnabled?: boolean;
  [key: string]: any;
}

export function saveGamePreferences(gameName: string, prefs: GamePreferences): void {
  try {
    localStorage.setItem(`${PREFS_PREFIX}${gameName}`, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save game preferences:', error);
  }
}

export function loadGamePreferences(gameName: string): GamePreferences | null {
  try {
    const saved = localStorage.getItem(`${PREFS_PREFIX}${gameName}`);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load game preferences:', error);
    return null;
  }
}
