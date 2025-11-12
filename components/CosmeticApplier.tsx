'use client';

import { useEffect } from 'react';
import { useShop } from '@/contexts/ShopContext';

export default function CosmeticApplier() {
  const { activeCursor, activeNameColor } = useShop();

  useEffect(() => {
    // Apply cursor style
    const cursorStyles: Record<string, string> = {
      'default': '',
      'pixel-sword': 'cursor-pixel-sword',
      'retro-hand': 'cursor-retro-hand',
      'neon-circle': 'cursor-neon-circle',
      'star-cursor': 'cursor-star-cursor',
    };

    // Remove all cursor classes
    Object.values(cursorStyles).forEach(className => {
      if (className) document.body.classList.remove(className);
    });

    // Add active cursor class
    if (cursorStyles[activeCursor]) {
      document.body.classList.add(cursorStyles[activeCursor]);
    }
  }, [activeCursor]);

  useEffect(() => {
    // Apply name color by setting CSS variable
    const colorMap: Record<string, string> = {
      'default': '#ffffff',
      'gold': '#ffd700',
      'rainbow': 'rainbow', // special case
      'neon-pink': '#ff10f0',
      'matrix-green': '#00ff41',
      'cyber-blue': '#00d4ff',
    };

    const colorValue = colorMap[activeNameColor];

    if (colorValue === 'rainbow') {
      document.documentElement.style.setProperty('--player-name-color', '#ff10f0');
      document.documentElement.classList.add('rainbow-name');
    } else {
      document.documentElement.classList.remove('rainbow-name');
      document.documentElement.style.setProperty('--player-name-color', colorValue);
    }
  }, [activeNameColor]);

  return null; // This component doesn't render anything
}
