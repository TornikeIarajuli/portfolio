'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/contexts/ShopContext';
import { getCoins } from '@/lib/coinSystem';

type Category = 'all' | 'cursor' | 'nameColor' | 'badge' | 'title';

export default function ShopPage() {
  const {
    shopItems,
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
  } = useShop();

  const [coins, setCoins] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  // Load coins
  useEffect(() => {
    setCoins(getCoins());

    const handleStorageChange = () => {
      setCoins(getCoins());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handlePurchase = (itemId: string, price: number) => {
    const success = purchaseItem(itemId, price);
    if (success) {
      setPurchaseSuccess(itemId);
      setTimeout(() => setPurchaseSuccess(null), 2000);
    } else {
      alert(`Not enough coins! You need ${price} coins.`);
    }
  };

  const isOwned = (itemId: string): boolean => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return false;

    if (item.category === 'cursor') {
      const cursorMap: Record<string, string> = {
        'cursor-sword': 'pixel-sword',
        'cursor-hand': 'retro-hand',
        'cursor-circle': 'neon-circle',
        'cursor-star': 'star-cursor',
      };
      return ownedCursors.includes(cursorMap[itemId] as any);
    } else if (item.category === 'nameColor') {
      const colorMap: Record<string, string> = {
        'color-gold': 'gold',
        'color-rainbow': 'rainbow',
        'color-pink': 'neon-pink',
        'color-green': 'matrix-green',
        'color-blue': 'cyber-blue',
      };
      return ownedNameColors.includes(colorMap[itemId] as any);
    } else if (item.category === 'badgeSlot') {
      if (itemId === 'badge-slot-2') return unlockedBadgeSlots >= 2;
      if (itemId === 'badge-slot-3') return unlockedBadgeSlots >= 3;
    } else if (item.category === 'badge') {
      return ownedBadges.includes(itemId);
    } else if (item.category === 'title') {
      return ownedTitles.includes(item.name);
    }

    return false;
  };

  const isEquipped = (itemId: string): boolean => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return false;

    if (item.category === 'cursor') {
      const cursorMap: Record<string, string> = {
        'cursor-sword': 'pixel-sword',
        'cursor-hand': 'retro-hand',
        'cursor-circle': 'neon-circle',
        'cursor-star': 'star-cursor',
      };
      return activeCursor === cursorMap[itemId];
    } else if (item.category === 'nameColor') {
      const colorMap: Record<string, string> = {
        'color-gold': 'gold',
        'color-rainbow': 'rainbow',
        'color-pink': 'neon-pink',
        'color-green': 'matrix-green',
        'color-blue': 'cyber-blue',
      };
      return activeNameColor === colorMap[itemId];
    } else if (item.category === 'badge') {
      return activeBadges.includes(itemId);
    } else if (item.category === 'title') {
      return activeTitle === item.name;
    }

    return false;
  };

  const handleEquip = (itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.category === 'cursor') {
      const cursorMap: Record<string, string> = {
        'cursor-sword': 'pixel-sword',
        'cursor-hand': 'retro-hand',
        'cursor-circle': 'neon-circle',
        'cursor-star': 'star-cursor',
      };
      setActiveCursor(cursorMap[itemId] as any);
    } else if (item.category === 'nameColor') {
      const colorMap: Record<string, string> = {
        'color-gold': 'gold',
        'color-rainbow': 'rainbow',
        'color-pink': 'neon-pink',
        'color-green': 'matrix-green',
        'color-blue': 'cyber-blue',
      };
      setActiveNameColor(colorMap[itemId] as any);
    } else if (item.category === 'badge') {
      // Check if we have enough badge slots
      if (activeBadges.includes(itemId)) {
        // Unequip
        setActiveBadges(activeBadges.filter(b => b !== itemId));
      } else {
        // Equip if we have space
        if (activeBadges.length < unlockedBadgeSlots) {
          setActiveBadges([...activeBadges, itemId]);
        } else {
          alert(`You need to unlock more badge slots! (Currently: ${unlockedBadgeSlots})`);
        }
      }
    } else if (item.category === 'title') {
      if (activeTitle === item.name) {
        setActiveTitle(null); // Unequip
      } else {
        setActiveTitle(item.name);
      }
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? shopItems
    : shopItems.filter(item => {
        if (selectedCategory === 'badge') {
          // Show both badges and badge slots in the badge category
          return item.category === 'badge' || item.category === 'badgeSlot';
        }
        return item.category === selectedCategory;
      });

  return (
    <div className="min-h-screen bg-[#0a0014] retro-grid scanlines pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-8 py-4 bg-black border-4 border-[#ff10f0] mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#ff10f0] tracking-wider">
              🏪 ARCADE SHOP
            </h1>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="px-6 py-3 bg-black border-3 border-[#ffff00]">
              <p className="text-[#ffff00] text-xl font-bold tracking-wider">
                🪙 {coins} COINS
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-300 font-bold tracking-wider"
              style={{ borderWidth: '3px' }}
            >
              ← BACK
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {(['all', 'cursor', 'nameColor', 'badge', 'title'] as Category[]).map((category) => {
            const labels = {
              all: '🎮 ALL',
              cursor: '🖱️ CURSORS',
              nameColor: '🎨 COLORS',
              badge: '🎖️ BADGES',
              title: '👑 TITLES',
            };

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border-2 font-bold tracking-wider text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-[#ff10f0] text-black border-[#ff10f0]'
                    : 'bg-black text-[#00ffff] border-[#00ffff] hover:bg-[#00ffff] hover:text-black'
                }`}
              >
                {labels[category]}
              </button>
            );
          })}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const owned = isOwned(item.id);

            return (
              <div
                key={item.id}
                className={`border-3 p-6 bg-black transition-all ${
                  owned
                    ? 'border-[#39ff14]'
                    : 'border-[#00ffff] hover:border-[#ff10f0]'
                }`}
                style={{ borderWidth: '3px' }}
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#ff10f0] tracking-wider mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[#00ffff] text-sm mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[#ffff00] font-bold text-lg">
                      🪙 {item.price}
                    </div>

                    {owned ? (
                      <div className="px-4 py-2 bg-[#39ff14] text-black font-bold text-sm">
                        ✓ OWNED
                      </div>
                    ) : purchaseSuccess === item.id ? (
                      <div className="px-4 py-2 bg-[#39ff14] text-black font-bold text-sm animate-pulse">
                        PURCHASED!
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item.id, item.price)}
                        disabled={coins < item.price}
                        className={`px-4 py-2 font-bold text-sm transition-all ${
                          coins >= item.price
                            ? 'bg-[#ff10f0] text-black hover:bg-[#00ffff] hover:text-black'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        BUY
                      </button>
                    )}
                  </div>

                  {/* Equip button for owned items (excluding badge slots) */}
                  {owned && item.category !== 'badgeSlot' && (
                    <button
                      onClick={() => handleEquip(item.id)}
                      className={`w-full px-4 py-2 font-bold text-sm transition-all ${
                        isEquipped(item.id)
                          ? 'bg-[#ffff00] text-black border-2 border-[#ffff00]'
                          : 'bg-black text-[#00ffff] border-2 border-[#00ffff] hover:bg-[#00ffff] hover:text-black'
                      }`}
                    >
                      {isEquipped(item.id) ? '★ EQUIPPED' : 'EQUIP'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#00ffff] text-xl">No items in this category yet!</p>
          </div>
        )}

        {/* Earn More Coins CTA */}
        <div className="mt-12 text-center border-4 border-[#ffff00] p-8 bg-black/50">
          <h3 className="text-2xl font-bold text-[#ffff00] mb-4 tracking-wider">
            💰 NEED MORE COINS?
          </h3>
          <p className="text-[#00ffff] mb-6">
            Play games to earn coins! Higher scores = more coins!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-[#39ff14] text-black font-bold tracking-wider hover:bg-[#00ffff] transition-all duration-300"
          >
            🎮 PLAY GAMES
          </Link>
        </div>
      </div>
    </div>
  );
}
