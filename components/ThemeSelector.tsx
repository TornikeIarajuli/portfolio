'use client';

import { useState, useEffect } from 'react';
import { useTheme, ThemeType } from '@/contexts/ThemeContext';
import { getCoins } from '@/lib/coinSystem';

const themeInfo: Record<ThemeType, { name: string; icon: string; cost: number }> = {
  neon: { name: 'NEON NIGHTS', icon: '🌆', cost: 0 },
  terminal: { name: 'GREEN TERMINAL', icon: '💻', cost: 0 },
  amber: { name: 'AMBER MONITOR', icon: '📟', cost: 1 },
  matrix: { name: 'MATRIX CODE', icon: '🟢', cost: 1 },
  vaporwave: { name: 'VAPORWAVE', icon: '🌴', cost: 2 },
};

export default function ThemeSelector() {
  const { theme, setTheme, unlockedThemes, unlockTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [coins, setCoinsState] = useState(0);

  // Load coins on mount and listen for changes
  useEffect(() => {
    // Initial load
    setCoinsState(getCoins());

    // Listen for coin changes
    const handleStorageChange = () => {
      setCoinsState(getCoins());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleThemeSelect = (selectedTheme: ThemeType) => {
    if (unlockedThemes.includes(selectedTheme)) {
      setTheme(selectedTheme);
      setIsOpen(false);
    } else {
      const cost = themeInfo[selectedTheme].cost;
      if (coins >= cost) {
        const newCoins = coins - cost;
        setCoinsState(newCoins);
        localStorage.setItem('arcade-coins', newCoins.toString());
        window.dispatchEvent(new Event('storage'));
        unlockTheme(selectedTheme);
        setTheme(selectedTheme);
        setIsOpen(false);
      } else {
        alert(`Not enough coins! You need ${cost} coins. Play games to earn more!`);
      }
    }
  };

  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black border-3 border-[var(--color-primary)] px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black transition-all duration-300 font-bold tracking-wider shadow-lg text-xs sm:text-sm"
        style={{ borderWidth: '3px' }}
      >
        🎨 <span className="hidden sm:inline">THEMES</span>
      </button>

      {/* Coin Display */}
      <div className="mt-1.5 sm:mt-2 bg-black border-2 border-[var(--color-accent)] px-2 sm:px-3 py-1.5 sm:py-2 text-center">
        <p className="text-[var(--color-accent)] text-[10px] sm:text-xs tracking-wider font-bold">
          COINS: {coins}
        </p>
      </div>

      {/* Theme Selection Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black border-3 border-[var(--color-primary)] p-3 sm:p-4 min-w-[240px] sm:min-w-[280px] shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="border-b-2 border-[var(--color-secondary)] pb-2 sm:pb-3 mb-2 sm:mb-3">
            <h3 className="text-[var(--color-primary)] font-bold tracking-wider text-center text-xs sm:text-sm">
              SELECT THEME
            </h3>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            {(Object.keys(themeInfo) as ThemeType[]).map((themeKey) => {
              const info = themeInfo[themeKey];
              const isUnlocked = unlockedThemes.includes(themeKey);
              const isActive = theme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => handleThemeSelect(themeKey)}
                  disabled={isActive}
                  className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 border-2 transition-all duration-200 ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-black'
                      : isUnlocked
                      ? 'border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-black'
                      : 'border-gray-600 text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-lg">{info.icon}</span>
                      <span className="text-[10px] sm:text-xs font-bold tracking-wider">
                        {info.name}
                      </span>
                    </div>
                    <div>
                      {isActive ? (
                        <span className="text-[10px] sm:text-xs">✓</span>
                      ) : !isUnlocked ? (
                        <span className="text-[10px] sm:text-xs">🪙 {info.cost}</span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t-2 border-[var(--color-secondary)]">
            <p className="text-[var(--color-secondary)] text-[10px] sm:text-xs text-center">
              🎮 Play games to earn coins!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
