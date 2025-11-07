'use client';

import { useEffect, useState } from 'react';
import { Achievement } from '@/lib/gameStats';
import ConfettiEffect from './ConfettiEffect';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <>
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div
        className={`fixed top-0 left-0 right-0 transition-all duration-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ zIndex: 9999 }}
      >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-end">
          <div
            onClick={onClose}
            className="bg-black border-4 border-[#39ff14] neon-border pixel-corners p-3 min-w-[280px] max-w-[350px] cursor-pointer hover:border-[#ffff00] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h3 className="text-[#39ff14] font-bold tracking-wider text-xs mb-1" style={{textShadow: '0 0 15px #39ff14'}}>
                  ACHIEVEMENT UNLOCKED!
                </h3>
                <p className="text-[#ffff00] font-bold tracking-wide text-sm">{achievement.title}</p>
                <p className="text-[#00ffff] text-xs">{achievement.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-[#ff10f0] hover:text-[#ffff00] transition-colors text-xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
