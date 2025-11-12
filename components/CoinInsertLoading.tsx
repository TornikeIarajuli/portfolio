'use client';

import { useEffect } from 'react';

interface CoinInsertLoadingProps {
  onComplete: () => void;
}

export default function CoinInsertLoading({ onComplete }: CoinInsertLoadingProps) {
  useEffect(() => {
    // Show INSERT COIN for 1.5 seconds then complete
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="coin-animation text-8xl">🪙</div>
        <div className="border-4 border-[#ffff00] bg-black px-8 py-4 inline-block pixel-corners">
          <p className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{ textShadow: '0 0 20px #ffff00' }}>
            INSERT COIN
          </p>
        </div>
      </div>
    </div>
  );
}
