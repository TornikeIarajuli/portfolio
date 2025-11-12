'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CursorStyle = 'default' | 'pixel-sword' | 'retro-hand' | 'neon-circle' | 'star-cursor';
export type NameColor = 'default' | 'gold' | 'rainbow' | 'neon-pink' | 'matrix-green' | 'cyber-blue';
export type BadgeSlot = 1 | 2 | 3;

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'cursor' | 'nameColor' | 'badgeSlot' | 'badge' | 'title';
  icon: string;
}

interface ShopContextType {
  // Purchased items
  ownedCursors: CursorStyle[];
  ownedNameColors: NameColor[];
  unlockedBadgeSlots: number;
  ownedBadges: string[];
  ownedTitles: string[];

  // Active selections
  activeCursor: CursorStyle;
  activeNameColor: NameColor;
  activeTitle: string | null;
  activeBadges: string[];

  // Actions
  purchaseItem: (itemId: string, price: number) => boolean;
  setActiveCursor: (cursor: CursorStyle) => void;
  setActiveNameColor: (color: NameColor) => void;
  setActiveTitle: (title: string | null) => void;
  setActiveBadges: (badges: string[]) => void;

  // Shop items
  shopItems: ShopItem[];
}

const SHOP_ITEMS: ShopItem[] = [
  // Cursors
  { id: 'cursor-sword', name: 'Pixel Sword', description: 'Epic pixelated sword cursor', price: 3, category: 'cursor', icon: '⚔️' },
  { id: 'cursor-hand', name: 'Retro Hand', description: 'Classic pointing hand', price: 3, category: 'cursor', icon: '👆' },
  { id: 'cursor-circle', name: 'Neon Circle', description: 'Glowing neon ring cursor', price: 5, category: 'cursor', icon: '⭕' },
  { id: 'cursor-star', name: 'Star Cursor', description: 'Shining star pointer', price: 5, category: 'cursor', icon: '⭐' },

  // Name Colors
  { id: 'color-gold', name: 'Golden Name', description: 'Shiny gold text', price: 2, category: 'nameColor', icon: '🟡' },
  { id: 'color-rainbow', name: 'Rainbow Name', description: 'Animated rainbow effect', price: 5, category: 'nameColor', icon: '🌈' },
  { id: 'color-pink', name: 'Neon Pink', description: 'Hot pink with glow', price: 2, category: 'nameColor', icon: '💖' },
  { id: 'color-green', name: 'Matrix Green', description: 'Hacker style green', price: 2, category: 'nameColor', icon: '💚' },
  { id: 'color-blue', name: 'Cyber Blue', description: 'Electric blue glow', price: 2, category: 'nameColor', icon: '💙' },

  // Badge Slots
  { id: 'badge-slot-2', name: 'Badge Slot 2', description: 'Unlock 2nd badge slot', price: 5, category: 'badgeSlot', icon: '🎖️' },
  { id: 'badge-slot-3', name: 'Badge Slot 3', description: 'Unlock 3rd badge slot', price: 10, category: 'badgeSlot', icon: '🎖️' },

  // Actual Badges
  { id: 'badge-snake-master', name: 'Snake Master', description: 'Master of the serpent', price: 3, category: 'badge', icon: '🐍' },
  { id: 'badge-high-scorer', name: 'High Scorer', description: 'Points champion', price: 3, category: 'badge', icon: '💯' },
  { id: 'badge-speed-runner', name: 'Speed Runner', description: 'Lightning fast', price: 4, category: 'badge', icon: '⚡' },
  { id: 'badge-perfectionist', name: 'Perfectionist', description: 'Flawless execution', price: 5, category: 'badge', icon: '✨' },
  { id: 'badge-veteran', name: 'Veteran', description: 'Seasoned player', price: 4, category: 'badge', icon: '🎖️' },
  { id: 'badge-coin-collector', name: 'Coin Hoarder', description: 'Rich player', price: 3, category: 'badge', icon: '💰' },
  { id: 'badge-night-owl', name: 'Night Owl', description: 'Late night gamer', price: 3, category: 'badge', icon: '🦉' },
  { id: 'badge-champion', name: 'Champion', description: 'Ultimate winner', price: 8, category: 'badge', icon: '🏆' },

  // Titles
  { id: 'title-legend', name: 'The Legend', description: 'Display "The Legend" title', price: 10, category: 'title', icon: '👑' },
  { id: 'title-champion', name: 'Champion', description: 'Display "Champion" title', price: 8, category: 'title', icon: '🏆' },
  { id: 'title-master', name: 'Arcade Master', description: 'Display "Arcade Master" title', price: 8, category: 'title', icon: '🎮' },
  { id: 'title-hacker', name: 'Code Breaker', description: 'Display "Code Breaker" title', price: 5, category: 'title', icon: '💻' },
  { id: 'title-collector', name: 'Coin Collector', description: 'Display "Coin Collector" title', price: 5, category: 'title', icon: '🪙' },
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [ownedCursors, setOwnedCursors] = useState<CursorStyle[]>(['default']);
  const [ownedNameColors, setOwnedNameColors] = useState<NameColor[]>(['default']);
  const [unlockedBadgeSlots, setUnlockedBadgeSlots] = useState(1);
  const [ownedBadges, setOwnedBadges] = useState<string[]>([]);
  const [ownedTitles, setOwnedTitles] = useState<string[]>([]);

  const [activeCursor, setActiveCursorState] = useState<CursorStyle>('default');
  const [activeNameColor, setActiveNameColorState] = useState<NameColor>('default');
  const [activeTitle, setActiveTitleState] = useState<string | null>(null);
  const [activeBadges, setActiveBadgesState] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCursors = localStorage.getItem('arcade-owned-cursors');
    const savedColors = localStorage.getItem('arcade-owned-colors');
    const savedSlots = localStorage.getItem('arcade-badge-slots');
    const savedOwnedBadges = localStorage.getItem('arcade-owned-badges');
    const savedTitles = localStorage.getItem('arcade-owned-titles');
    const savedActiveCursor = localStorage.getItem('arcade-active-cursor');
    const savedActiveColor = localStorage.getItem('arcade-active-color');
    const savedActiveTitle = localStorage.getItem('arcade-active-title');
    const savedActiveBadges = localStorage.getItem('arcade-active-badges');

    if (savedCursors) setOwnedCursors(JSON.parse(savedCursors));
    if (savedColors) setOwnedNameColors(JSON.parse(savedColors));
    if (savedSlots) setUnlockedBadgeSlots(parseInt(savedSlots));
    if (savedOwnedBadges) setOwnedBadges(JSON.parse(savedOwnedBadges));
    if (savedTitles) setOwnedTitles(JSON.parse(savedTitles));
    if (savedActiveCursor) setActiveCursorState(savedActiveCursor as CursorStyle);
    if (savedActiveColor) setActiveNameColorState(savedActiveColor as NameColor);
    if (savedActiveTitle) setActiveTitleState(savedActiveTitle);
    if (savedActiveBadges) setActiveBadgesState(JSON.parse(savedActiveBadges));
  }, []);

  const purchaseItem = (itemId: string, price: number): boolean => {
    const coins = parseInt(localStorage.getItem('arcade-coins') || '0');
    if (coins < price) return false;

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    // Deduct coins
    const newCoins = coins - price;
    localStorage.setItem('arcade-coins', newCoins.toString());
    window.dispatchEvent(new Event('storage'));

    // Add item to owned
    if (item.category === 'cursor') {
      const cursorMap: Record<string, CursorStyle> = {
        'cursor-sword': 'pixel-sword',
        'cursor-hand': 'retro-hand',
        'cursor-circle': 'neon-circle',
        'cursor-star': 'star-cursor',
      };
      const cursorStyle = cursorMap[itemId];
      if (cursorStyle && !ownedCursors.includes(cursorStyle)) {
        const newCursors = [...ownedCursors, cursorStyle];
        setOwnedCursors(newCursors);
        localStorage.setItem('arcade-owned-cursors', JSON.stringify(newCursors));
      }
    } else if (item.category === 'nameColor') {
      const colorMap: Record<string, NameColor> = {
        'color-gold': 'gold',
        'color-rainbow': 'rainbow',
        'color-pink': 'neon-pink',
        'color-green': 'matrix-green',
        'color-blue': 'cyber-blue',
      };
      const color = colorMap[itemId];
      if (color && !ownedNameColors.includes(color)) {
        const newColors = [...ownedNameColors, color];
        setOwnedNameColors(newColors);
        localStorage.setItem('arcade-owned-colors', JSON.stringify(newColors));
      }
    } else if (item.category === 'badgeSlot') {
      if (itemId === 'badge-slot-2' && unlockedBadgeSlots < 2) {
        setUnlockedBadgeSlots(2);
        localStorage.setItem('arcade-badge-slots', '2');
      } else if (itemId === 'badge-slot-3' && unlockedBadgeSlots < 3) {
        setUnlockedBadgeSlots(3);
        localStorage.setItem('arcade-badge-slots', '3');
      }
    } else if (item.category === 'badge') {
      if (!ownedBadges.includes(item.id)) {
        const newBadges = [...ownedBadges, item.id];
        setOwnedBadges(newBadges);
        localStorage.setItem('arcade-owned-badges', JSON.stringify(newBadges));
      }
    } else if (item.category === 'title') {
      if (!ownedTitles.includes(item.name)) {
        const newTitles = [...ownedTitles, item.name];
        setOwnedTitles(newTitles);
        localStorage.setItem('arcade-owned-titles', JSON.stringify(newTitles));
      }
    }

    return true;
  };

  const setActiveCursor = (cursor: CursorStyle) => {
    setActiveCursorState(cursor);
    localStorage.setItem('arcade-active-cursor', cursor);
    // Apply cursor to document
    // Will be handled by a custom hook or component
  };

  const setActiveNameColor = (color: NameColor) => {
    setActiveNameColorState(color);
    localStorage.setItem('arcade-active-color', color);
  };

  const setActiveTitle = (title: string | null) => {
    setActiveTitleState(title);
    if (title) {
      localStorage.setItem('arcade-active-title', title);
    } else {
      localStorage.removeItem('arcade-active-title');
    }
  };

  const setActiveBadges = (badges: string[]) => {
    setActiveBadgesState(badges);
    localStorage.setItem('arcade-active-badges', JSON.stringify(badges));
  };

  return (
    <ShopContext.Provider
      value={{
        ownedCursors,
        ownedNameColors,
        unlockedBadgeSlots,
        ownedBadges,
        ownedTitles,
        activeCursor,
        activeNameColor,
        activeTitle,
        activeBadges,
        purchaseItem,
        setActiveCursor,
        setActiveNameColor,
        setActiveTitle,
        setActiveBadges,
        shopItems: SHOP_ITEMS,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
