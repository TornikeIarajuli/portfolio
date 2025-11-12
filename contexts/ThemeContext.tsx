'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'neon' | 'terminal' | 'amber' | 'matrix' | 'vaporwave';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  neon: {
    primary: '#ff10f0',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: '#000000',
    text: '#ffffff',
  },
  terminal: {
    primary: '#33ff33',
    secondary: '#00ff00',
    accent: '#88ff88',
    background: '#000000',
    text: '#33ff33',
  },
  amber: {
    primary: '#ffb000',
    secondary: '#ff8800',
    accent: '#ffd700',
    background: '#1a0f00',
    text: '#ffb000',
  },
  matrix: {
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#00ff88',
    background: '#0d0208',
    text: '#00ff41',
  },
  vaporwave: {
    primary: '#ff71ce',
    secondary: '#01cdfe',
    accent: '#05ffa1',
    background: '#2d1b69',
    text: '#ffffff',
  },
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  unlockedThemes: ThemeType[];
  unlockTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('neon');
  const [unlockedThemes, setUnlockedThemes] = useState<ThemeType[]>(['neon', 'terminal']);

  // Load theme and unlocked themes from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('arcade-theme') as ThemeType;
    const savedUnlocked = localStorage.getItem('arcade-unlocked-themes');

    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }

    if (savedUnlocked) {
      try {
        const unlocked = JSON.parse(savedUnlocked);
        setUnlockedThemes(unlocked);
      } catch (e) {
        // Invalid JSON, use defaults
      }
    }
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    const colors = themes[theme];
    const root = document.documentElement;

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('arcade-theme', newTheme);
  };

  const unlockTheme = (themeToUnlock: ThemeType) => {
    if (!unlockedThemes.includes(themeToUnlock)) {
      const updated = [...unlockedThemes, themeToUnlock];
      setUnlockedThemes(updated);
      localStorage.setItem('arcade-unlocked-themes', JSON.stringify(updated));
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colors: themes[theme],
        unlockedThemes,
        unlockTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
