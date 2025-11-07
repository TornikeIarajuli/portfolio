'use client';

import { useState, useEffect } from 'react';

interface GameInstructionsProps {
  gameName: string;
  instructions: string[];
  onClose: () => void;
}

export default function GameInstructions({ gameName, instructions, onClose }: GameInstructionsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen instructions for this game
    const storageKey = `instructions_seen_${gameName}`;
    const hasSeen = localStorage.getItem(storageKey);

    if (!hasSeen) {
      setIsVisible(true);
    } else {
      onClose();
    }
  }, [gameName, onClose]);

  const handleClose = () => {
    const storageKey = `instructions_seen_${gameName}`;
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6">
      <div className="bg-black border-4 border-[#00ffff] neon-border-cyan pixel-corners p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block border-4 border-[#ffff00] bg-black px-6 py-3 mb-4">
            <h2 className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{ textShadow: '0 0 20px #ffff00' }}>
              🎮 HOW TO PLAY
            </h2>
          </div>
          <p className="text-[#00ffff] text-xl tracking-wider font-bold">{gameName}</p>
        </div>

        {/* Instructions */}
        <div className="bg-black border-4 border-[#ff10f0] p-6 mb-6">
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-[#39ff14] text-xl font-bold tracking-wider">▶</span>
                <p className="text-[#00ffff] tracking-wide flex-1">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-[#ffff00] text-sm tracking-wider mb-4">
              💡 You can view keyboard shortcuts anytime by clicking ⌨️ in the navigation bar
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleClose}
              className="retro-btn px-8 py-3 text-white text-lg"
            >
              ▶ START PLAYING
            </button>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-black border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-200 font-bold tracking-wider text-lg"
              style={{ borderWidth: '3px' }}
            >
              GOT IT!
            </button>
          </div>

          <div className="text-center">
            <p className="text-[#39ff14] text-xs tracking-wider opacity-70">
              This message will only show once per game
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
