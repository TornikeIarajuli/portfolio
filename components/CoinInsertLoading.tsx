'use client';

import { useEffect, useState } from 'react';

interface CoinInsertLoadingProps {
  onComplete: () => void;
}

export default function CoinInsertLoading({ onComplete }: CoinInsertLoadingProps) {
  const [stage, setStage] = useState<'coin' | 'loading' | 'ready'>('coin');
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Stage 1: Show coin animation
    const coinTimer = setTimeout(() => {
      setStage('loading');
    }, 2000);

    return () => clearTimeout(coinTimer);
  }, []);

  useEffect(() => {
    if (stage === 'loading') {
      // Animate dots
      const dotsInterval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 300);

      // Move to ready stage
      const readyTimer = setTimeout(() => {
        setStage('ready');
      }, 2000);

      return () => {
        clearInterval(dotsInterval);
        clearTimeout(readyTimer);
      };
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'ready') {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(completeTimer);
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center">
        {stage === 'coin' && (
          <div className="space-y-8">
            <div className="coin-animation text-8xl">🪙</div>
            <div className="border-4 border-[#ffff00] bg-black px-8 py-4 inline-block pixel-corners">
              <p className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{ textShadow: '0 0 20px #ffff00' }}>
                INSERT COIN
              </p>
            </div>
          </div>
        )}

        {stage === 'loading' && (
          <div className="space-y-6">
            <div className="border-4 border-[#00ffff] neon-border-cyan bg-black px-8 py-6 pixel-corners">
              <p className="text-4xl font-bold text-[#00ffff] tracking-widest neon-text-cyan mb-4">
                LOADING{dots}
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-12 bg-[#00ffff]"
                    style={{
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      boxShadow: '0 0 10px #00ffff',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'ready' && (
          <div className="space-y-6">
            <div className="border-4 border-[#39ff14] bg-black px-12 py-8 pixel-corners" style={{ boxShadow: '0 0 30px #39ff14' }}>
              <p className="text-5xl font-bold text-[#39ff14] tracking-widest mb-2" style={{ textShadow: '0 0 30px #39ff14' }}>
                READY!
              </p>
              <p className="text-2xl text-[#ffff00] tracking-wider">PLAYER 1</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleY(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
