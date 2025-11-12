'use client';

import { useState, useEffect } from 'react';
import { useTheme, ThemeType } from '@/contexts/ThemeContext';
import { getCoins } from '@/lib/coinSystem';

const themeInfo: Record<ThemeType, { name: string; icon: string; cost: number }> = {
  neon: { name: 'NEON', icon: '🌆', cost: 0 },
  terminal: { name: 'TERM', icon: '💻', cost: 0 },
  amber: { name: 'AMBER', icon: '📟', cost: 5 },
  matrix: { name: 'MATRIX', icon: '🟢', cost: 5 },
  vaporwave: { name: 'VAPOR', icon: '🌴', cost: 10 },
};

export default function ThemeSelectorInline() {
  const { theme, setTheme, unlockedThemes, unlockTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [coins, setCoinsState] = useState(0);

  // Load coins on mount and listen for changes
  useEffect(() => {
    setCoinsState(getCoins());

    const handleStorageChange = () => {
      setCoinsState(getCoins());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
        alert(`Not enough coins! Need ${cost} 🪙. Play games to earn more!`);
      }
    }
  };

  return (
    <li className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#b000ff] hover:text-[#ff10f0] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#b000ff] px-3 py-1 hover:border-[#ff10f0] cursor-pointer"
        title="Change theme"
      >
        🎨 <span className="hidden xl:inline">{themeInfo[theme].name}</span>
        <span className="text-[#ffff00] ml-1">🪙{coins}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black border-3 border-[#b000ff] p-3 min-w-[200px] shadow-2xl z-50">
          <div className="border-b-2 border-[#ffff00] pb-2 mb-2">
            <p className="text-[#ffff00] text-xs font-bold tracking-wider text-center">
              SELECT THEME
            </p>
          </div>

          <div className="space-y-1">
            {(Object.keys(themeInfo) as ThemeType[]).map((themeKey) => {
              const info = themeInfo[themeKey];
              const isUnlocked = unlockedThemes.includes(themeKey);
              const isActive = theme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => handleThemeSelect(themeKey)}
                  disabled={isActive}
                  className={`w-full text-left px-2 py-2 border-2 transition-all duration-200 text-xs ${
                    isActive
                      ? 'border-[#ffff00] bg-[#ffff00] text-black'
                      : isUnlocked
                      ? 'border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black'
                      : 'border-gray-600 text-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span className="font-bold tracking-wider">{info.name}</span>
                    </div>
                    <div>
                      {isActive ? (
                        <span>✓</span>
                      ) : !isUnlocked ? (
                        <span>🪙{info.cost}</span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t-2 border-[#00ffff]">
            <p className="text-[#00ffff] text-xs text-center">
              Play games to earn 🪙
            </p>
          </div>
        </div>
      )}
    </li>
  );
}
