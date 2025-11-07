'use client';

import Link from 'next/link';
import { useSound } from '@/components/SoundEffects';
import { useCRT } from '@/components/CRTEffect';
import { useEffect, useState } from 'react';
import { getPlayerName } from '@/lib/gameStats';

interface NavigationProps {
  activeSection: string;
  onOpenAchievements?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenPlayerName?: () => void;
  onOpenShortcuts?: () => void;
}

export default function Navigation({ activeSection, onOpenAchievements, onOpenLeaderboard, onOpenPlayerName, onOpenShortcuts }: NavigationProps) {
  const { isMuted, toggleMute } = useSound();
  const { crtEnabled, toggleCRT } = useCRT();
  const [playerName, setPlayerNameState] = useState('Player');

  useEffect(() => {
    setPlayerNameState(getPlayerName());

    // Listen for storage changes to update name when changed in modal
    const handleStorageChange = () => {
      setPlayerNameState(getPlayerName());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also create a custom event for same-window updates
    window.addEventListener('playerNameChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('playerNameChanged', handleStorageChange);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'XP' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const games = [
    { id: 'snake', label: 'SNAKE', icon: '🐍' },
    { id: 'tictactoe', label: 'TIC-TAC-TOE', icon: '❌' },
    { id: 'memory', label: 'MEMORY', icon: '🎴' },
    { id: 'pong', label: 'PONG', icon: '🏓' },
    { id: 'spaceinvaders', label: 'SPACE INVADERS', icon: '👾' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b-4 border-[#ff10f0] neon-border backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Arcade-style logo */}
          <h1 className="text-2xl font-bold neon-text-yellow text-[#ffff00] tracking-widest pixel-corners bg-black px-4 py-2 border-2 border-[#ffff00]">
            TI
          </h1>

          <ul className="flex gap-6 items-center">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-all duration-200 font-bold tracking-wider text-sm cursor-pointer ${
                    activeSection === item.id
                      ? 'text-[#ff10f0] neon-text scale-110'
                      : 'text-[#00ffff] hover:text-[#ff10f0] hover:scale-105'
                  }`}
                >
                  {activeSection === item.id ? '▶ ' : ''}{item.label}
                </button>
              </li>
            ))}

            {/* Arcade Games dropdown */}
            <li className="relative group">
              <button className="text-[#39ff14] hover:text-[#ffff00] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#39ff14] px-3 py-1 hover:border-[#ffff00] cursor-pointer">
                🎮 GAMES
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown with arcade style */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-black border-4 border-[#ff10f0] neon-border overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {games.map((game) => (
                  <Link
                    key={game.id}
                    href={`/games/${game.id}`}
                    className="block px-4 py-3 text-[#00ffff] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wide border-b-2 border-[#ff10f0]/30 last:border-b-0"
                  >
                    <span className="inline-block mr-2">{game.icon}</span>
                    <span>▸ {game.label}</span>
                  </Link>
                ))}
              </div>
            </li>

            {/* Achievements button */}
            {onOpenAchievements && (
              <li>
                <button
                  onClick={onOpenAchievements}
                  className="text-[#ffff00] hover:text-[#ff10f0] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#ffff00] px-3 py-1 hover:border-[#ff10f0] cursor-pointer"
                >
                  🏆 TROPHIES
                </button>
              </li>
            )}

            {/* Leaderboard button */}
            {onOpenLeaderboard && (
              <li>
                <button
                  onClick={onOpenLeaderboard}
                  className="text-[#00ffff] hover:text-[#ff10f0] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#00ffff] px-3 py-1 hover:border-[#ff10f0] cursor-pointer"
                >
                  📊 RANKS
                </button>
              </li>
            )}

            {/* Sound toggle button */}
            <li>
              <button
                onClick={toggleMute}
                className="text-[#ff10f0] hover:text-[#ffff00] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#ff10f0] px-3 py-1 hover:border-[#ffff00] cursor-pointer"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </li>

            {/* CRT Effect toggle */}
            <li>
              <button
                onClick={toggleCRT}
                className="text-[#00ffff] hover:text-[#ff10f0] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#00ffff] px-3 py-1 hover:border-[#ff10f0] cursor-pointer"
                title={crtEnabled ? 'Disable CRT effect' : 'Enable CRT effect'}
              >
                {crtEnabled ? '📺' : '🖥️'}
              </button>
            </li>

            {/* Shortcuts button */}
            {onOpenShortcuts && (
              <li>
                <button
                  onClick={onOpenShortcuts}
                  className="text-[#ffff00] hover:text-[#ff10f0] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#ffff00] px-3 py-1 hover:border-[#ff10f0] cursor-pointer"
                  title="View keyboard shortcuts"
                >
                  ⌨️
                </button>
              </li>
            )}

            {/* Player name button */}
            {onOpenPlayerName && (
              <li>
                <button
                  onClick={onOpenPlayerName}
                  className="text-[#39ff14] hover:text-[#ff10f0] transition-all duration-200 flex items-center gap-1 font-bold tracking-wider text-sm border-2 border-[#39ff14] px-3 py-1 hover:border-[#ff10f0] cursor-pointer"
                  title="Change player name"
                >
                  👤 {playerName}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
