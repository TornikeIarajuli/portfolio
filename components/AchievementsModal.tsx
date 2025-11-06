'use client';

import { useEffect, useState } from 'react';
import { getAchievements, Achievement } from '@/lib/gameStats';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAchievements(getAchievements());
    }
  }, [isOpen]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
          <div className="bg-black border-4 border-[#ffff00] neon-border pixel-corners p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-4xl font-bold text-[#ffff00] tracking-widest mb-2" style={{textShadow: '0 0 20px #ffff00'}}>
                  🏆 ACHIEVEMENTS 🏆
                </h2>
                <p className="text-[#00ffff] tracking-wider">
                  {unlockedCount} / {achievements.length} UNLOCKED
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#ff10f0] text-4xl hover:scale-110 transition-transform cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border-3 p-4 transition-all ${
                    achievement.unlocked
                      ? 'bg-[#39ff14]/10 border-[#39ff14]'
                      : 'bg-gray-900/50 border-gray-700 opacity-60'
                  }`}
                  style={{ borderWidth: '3px' }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold tracking-wide mb-1 ${
                        achievement.unlocked ? 'text-[#ffff00]' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-[#00ffff]' : 'text-gray-600'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-[#39ff14] text-xs mt-2">
                          ✓ {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </p>
                      )}
                      {!achievement.unlocked && (
                        <p className="text-gray-600 text-xs mt-2">🔒 LOCKED</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
