'use client';

import { useEffect, useState } from 'react';
import { awardCoins } from '@/lib/coinSystem';

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
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-KONAMI_CODE.length);

        if (newKeys.join(',') === KONAMI_CODE.join(',') && !activated) {
          triggerKonamiReward();
        }

        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activated]);

  const triggerKonamiReward = () => {
    setActivated(true);
    setShowMessage(true);

    // Award bonus coins
    const bonusCoins = 30;
    awardCoins(bonusCoins);

    // Apply rainbow effect to body
    document.body.classList.add('konami-active');

    // Play success sound
    playKonamiSound();

    // Hide message after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    // Remove rainbow effect after 10 seconds
    setTimeout(() => {
      document.body.classList.remove('konami-active');
      setActivated(false);
    }, 10000);
  };

  const playKonamiSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create ascending arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
      notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.value = freq;
        oscillator.type = 'square';

        const startTime = audioContext.currentTime + (i * 0.1);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    } catch (error) {
      console.log('Audio not available');
    }
  };

  if (!showMessage) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none">
      <div className="animate-bounce">
        <div className="border-4 border-[#39ff14] bg-black px-12 py-8 pixel-corners" style={{ boxShadow: '0 0 40px #39ff14' }}>
          <p className="text-5xl font-bold text-[#39ff14] tracking-widest mb-4 text-center" style={{ textShadow: '0 0 30px #39ff14' }}>
            🎮 KONAMI CODE! 🎮
          </p>
          <p className="text-3xl text-[#ffff00] tracking-wider text-center mb-2">
            SECRET UNLOCKED
          </p>
          <p className="text-2xl text-[#00ffff] text-center">
            +30 COINS BONUS!
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {['🌟', '✨', '💎', '🏆', '✨', '🌟'].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}
