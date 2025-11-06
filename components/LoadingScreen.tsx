'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0014] flex items-center justify-center">
      <div className="text-center">
        {/* Arcade cabinet frame */}
        <div className="border-4 border-[#ff10f0] neon-border bg-black p-12 pixel-corners">
          {/* Coin slot animation */}
          <div className="mb-8 h-32 flex items-center justify-center overflow-hidden">
            <div className="coin-animation text-6xl">🪙</div>
          </div>

          {/* Insert coin text */}
          <h1 className="text-4xl font-bold text-[#ffff00] tracking-widest mb-4 neon-text-yellow">
            INSERT COIN
          </h1>

          {/* Blinking cursor */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <span className="text-[#00ffff] text-xl tracking-wider">LOADING</span>
            <span className="text-[#00ffff] text-xl blink">█</span>
          </div>

          {/* Credits display */}
          <div className="mt-8 text-[#39ff14] text-sm tracking-wider">
            <p>CREDITS: ∞</p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-[#ff10f0] text-xs tracking-widest">
          ★ PORTFOLIO v1.0 ★
        </p>
      </div>
    </div>
  );
}
