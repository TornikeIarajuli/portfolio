'use client';

import { useEffect, useState } from 'react';
import { useSound } from './SoundEffects';

// Various secret codes and easter eggs
const SECRET_CODES = {
  // Type "RETRO" for retro mode enhancement
  retro: ['r', 'e', 't', 'r', 'o'],
  // Type "1984" for a tribute message
  year: ['1', '9', '8', '4'],
  // Type "ARCADE" for arcade vibes
  arcade: ['a', 'r', 'c', 'a', 'd', 'e'],
  // Type "MATRIX" for matrix effect
  matrix: ['m', 'a', 't', 'r', 'i', 'x'],
};

export default function EasterEggs() {
  const { playSound } = useSound();
  const [keys, setKeys] = useState<string[]>([]);
  const [activeEgg, setActiveEgg] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Secret code detection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key.toLowerCase()].slice(-10);

        // Check each secret code
        Object.entries(SECRET_CODES).forEach(([name, code]) => {
          const recentKeys = newKeys.slice(-code.length);
          if (recentKeys.join('') === code.join('')) {
            setActiveEgg(name);
            playSound('win');
            setTimeout(() => setActiveEgg(null), 5000);
          }
        });

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playSound]);

  // Triple click easter egg - anywhere on the page
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      if (now - lastClickTime < 500) {
        setClickCount((prev) => prev + 1);
      } else {
        setClickCount(1);
      }
      setLastClickTime(now);

      if (clickCount === 2) {
        setActiveEgg('triple-click');
        playSound('win');
        setTimeout(() => setActiveEgg(null), 3000);
        setClickCount(0);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clickCount, lastClickTime, playSound]);

  // Matrix effect
  useEffect(() => {
    if (activeEgg === 'matrix') {
      document.body.classList.add('matrix-effect');
      return () => document.body.classList.remove('matrix-effect');
    }
  }, [activeEgg]);

  if (!activeEgg) return null;

  const messages = {
    retro: {
      title: '🕹️ RETRO MODE ACTIVATED!',
      subtitle: 'Welcome back to the 80s!',
      color: '#ff10f0',
    },
    year: {
      title: '📅 1984',
      subtitle: 'The year gaming changed forever!',
      color: '#00ffff',
    },
    arcade: {
      title: '🎮 ARCADE VIBES!',
      subtitle: 'Insert more coins!',
      color: '#ffff00',
    },
    matrix: {
      title: '🟢 MATRIX MODE',
      subtitle: 'Follow the white rabbit...',
      color: '#39ff14',
    },
    'triple-click': {
      title: '🖱️ SECRET FOUND!',
      subtitle: 'You discovered the triple-click easter egg!',
      color: '#b000ff',
    },
  };

  const message = messages[activeEgg as keyof typeof messages];

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <div
          className="bg-black border-4 pixel-corners px-12 py-8 animate-bounce"
          style={{
            borderColor: message.color,
            boxShadow: `0 0 30px ${message.color}`,
          }}
        >
          <h1
            className="text-5xl font-bold tracking-widest mb-4"
            style={{
              color: message.color,
              textShadow: `0 0 20px ${message.color}`,
            }}
          >
            {message.title}
          </h1>
          <p className="text-[#00ffff] text-xl tracking-wider text-center">{message.subtitle}</p>
        </div>
      </div>

      {/* Matrix falling characters effect */}
      {activeEgg === 'matrix' && (
        <style jsx global>{`
          .matrix-effect {
            position: relative;
          }
          .matrix-effect::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, transparent, rgba(57, 255, 20, 0.05));
            pointer-events: none;
            z-index: 1;
            animation: matrix-scan 2s linear infinite;
          }
          @keyframes matrix-scan {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100%);
            }
          }
        `}</style>
      )}
    </>
  );
}
