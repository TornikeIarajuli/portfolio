'use client';

import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export default function KonamiCode() {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-KONAMI_CODE.length);

        if (newKeys.join(',') === KONAMI_CODE.join(',')) {
          setActivated(true);
          // Deactivate after 10 seconds
          setTimeout(() => setActivated(false), 10000);
        }

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (activated) {
      document.body.classList.add('konami-active');
    } else {
      document.body.classList.remove('konami-active');
    }
  }, [activated]);

  if (!activated) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-black border-4 border-[#39ff14] neon-border px-12 py-8 animate-bounce">
        <h1 className="text-5xl font-bold text-[#39ff14] tracking-widest neon-text" style={{textShadow: '0 0 20px #39ff14'}}>
          ★ KONAMI CODE! ★
        </h1>
        <p className="text-[#00ffff] text-xl tracking-wider text-center mt-4">
          YOU'RE A TRUE GAMER!
        </p>
      </div>
    </div>
  );
}
