'use client';

import { useState, useEffect } from 'react';
import { getPlayerName, setPlayerName } from '@/lib/gameStats';

interface PlayerNamePromptProps {
  isOpen: boolean;
  onClose: (name?: string) => void;
  initialName?: string;
}

export default function PlayerNamePrompt({ isOpen, onClose, initialName }: PlayerNamePromptProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialName || getPlayerName());
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      setPlayerName(trimmedName);
      // Dispatch custom event to notify Navigation component
      window.dispatchEvent(new Event('playerNameChanged'));
      onClose(trimmedName);
    }
  };

  const handleSkip = () => {
    const currentName = getPlayerName();
    onClose(currentName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
      <div className="bg-black border-4 border-[#ff10f0] neon-border pixel-corners p-8 max-w-md w-full">
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#ffff00] tracking-widest mb-4 text-center neon-text-yellow">
          ENTER YOUR NAME
        </h2>

        <p className="text-[#00ffff] text-center mb-6 tracking-wide">
          Your name will appear on the leaderboard!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="PLAYER NAME"
              maxLength={20}
              autoFocus
              className="w-full bg-black border-3 border-[#00ffff] text-[#00ffff] px-4 py-3 font-bold tracking-wider focus:border-[#ff10f0] focus:outline-none transition-colors placeholder-[#00ffff]/50"
              style={{ borderWidth: '3px' }}
            />
            <p className="text-[#39ff14] text-xs mt-2 text-right">
              {name.length}/20 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={name.trim().length === 0}
              className="flex-1 bg-[#ff10f0] border-3 border-[#ff10f0] text-black py-3 font-bold tracking-wider hover:bg-[#ff10f0]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ borderWidth: '3px' }}
            >
              ▶ SUBMIT
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-black border-3 border-[#00ffff] text-[#00ffff] py-3 font-bold tracking-wider hover:bg-[#00ffff]/20 transition-all cursor-pointer"
              style={{ borderWidth: '3px' }}
            >
              SKIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
