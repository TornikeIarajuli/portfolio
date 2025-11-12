/**
 * Coin System Utilities
 * Use these functions in your game components to award and manage coins
 */

/**
 * Get the current number of coins the player has
 */
export function getCoins(): number {
  if (typeof window === 'undefined') return 0;
  const coins = localStorage.getItem('arcade-coins');
  return coins ? parseInt(coins, 10) : 0;
}

/**
 * Award coins to the player
 * @param amount - Number of coins to award (positive integer)
 * @returns The new total number of coins
 */
export function awardCoins(amount: number): number {
  if (typeof window === 'undefined') return 0;
  if (amount <= 0) return getCoins();

  const currentCoins = getCoins();
  const newCoins = currentCoins + Math.floor(amount);
  localStorage.setItem('arcade-coins', newCoins.toString());

  // Dispatch event so ThemeSelector can update display
  window.dispatchEvent(new Event('storage'));

  return newCoins;
}

/**
 * Spend coins (used by theme unlocking system)
 * @param amount - Number of coins to spend
 * @returns true if successful, false if not enough coins
 */
export function spendCoins(amount: number): boolean {
  if (typeof window === 'undefined') return false;
  if (amount <= 0) return false;

  const currentCoins = getCoins();
  if (currentCoins < amount) return false;

  const newCoins = currentCoins - Math.floor(amount);
  localStorage.setItem('arcade-coins', newCoins.toString());

  // Dispatch event so ThemeSelector can update display
  window.dispatchEvent(new Event('storage'));

  return true;
}

/**
 * Set coins to a specific amount (for testing/debugging)
 * @param amount - The exact number of coins to set
 */
export function setCoins(amount: number): void {
  if (typeof window === 'undefined') return;
  const coins = Math.max(0, Math.floor(amount));
  localStorage.setItem('arcade-coins', coins.toString());
  window.dispatchEvent(new Event('storage'));
}

/**
 * Coin reward recommendations based on game performance
 */
export const COIN_REWARDS = {
  // Small rewards
  GAME_COMPLETED: 1,
  GOOD_PERFORMANCE: 1,

  // Medium rewards
  HIGH_SCORE: 2,
  LEVEL_UP: 2,
  WIN_STREAK_3: 2,

  // Large rewards
  BEAT_PERSONAL_BEST: 3,
  PERFECT_GAME: 5,
  WIN_STREAK_10: 5,
} as const;

/**
 * Example usage in a game component:
 *
 * import { awardCoins, COIN_REWARDS } from '@/lib/coinSystem';
 *
 * const handleGameEnd = () => {
 *   if (score > highScore) {
 *     const coinsEarned = awardCoins(COIN_REWARDS.BEAT_PERSONAL_BEST);
 *     showNotification(`🪙 Earned ${COIN_REWARDS.BEAT_PERSONAL_BEST} coins!`);
 *   } else if (score > 100) {
 *     awardCoins(COIN_REWARDS.GAME_COMPLETED);
 *   }
 * };
 */
