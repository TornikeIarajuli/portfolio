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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGamesDropdown, setShowGamesDropdown] = useState(false);

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
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'XP' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const games = [
    { id: 'snake', label: 'SNAKE', icon: '🐍', preview: '/previews/snake.svg', description: 'Classic snake game - Eat and grow!' },
    { id: 'tictactoe', label: 'TIC-TAC-TOE', icon: '❌', preview: '/previews/tictactoe.svg', description: 'Strategic board game' },
    { id: 'memory', label: 'MEMORY', icon: '🎴', preview: '/previews/memory.svg', description: 'Match the cards!' },
    { id: 'pong', label: 'PONG', icon: '🏓', preview: '/previews/pong.svg', description: 'Arcade classic ping pong' },
    { id: 'spaceinvaders', label: 'SPACE INVADERS', icon: '👾', preview: '/previews/spaceinvaders.svg', description: 'Defend against alien invasion!' },
  ];

  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b-4 border-[#ff10f0] neon-border backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Arcade-style logo */}
          <h1 className="text-xl sm:text-2xl font-bold neon-text-yellow text-[#ffff00] tracking-widest pixel-corners bg-black px-3 sm:px-4 py-2 border-2 border-[#ffff00]">
            TI
          </h1>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-6 items-center">
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

              {/* Dropdown with arcade style and preview */}
              <div className="absolute top-full right-0 mt-2 flex gap-4 bg-black border-4 border-[#ff10f0] neon-border overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {/* Games list */}
                <div className="w-56">
                  {games.map((game) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.id}`}
                      onMouseEnter={() => setHoveredGame(game.id)}
                      onMouseLeave={() => setHoveredGame(null)}
                      className="block px-4 py-3 text-[#00ffff] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wide border-b-2 border-[#ff10f0]/30 last:border-b-0"
                    >
                      <span className="inline-block mr-2">{game.icon}</span>
                      <span>▸ {game.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Preview panel */}
                <div className="w-64 border-l-4 border-[#ff10f0] p-4 bg-black/50">
                  {hoveredGame ? (
                    <div className="space-y-2">
                      <div className="border-2 border-[#00ffff] neon-border-cyan overflow-hidden">
                        <img
                          src={games.find(g => g.id === hoveredGame)?.preview}
                          alt={games.find(g => g.id === hoveredGame)?.label}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            // Fallback to placeholder
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="128" viewBox="0 0 256 128"><rect width="256" height="128" fill="%230a0014"/><text x="50%" y="50%" fill="%23ff10f0" font-family="monospace" font-size="16" text-anchor="middle" dominant-baseline="middle">GAME PREVIEW</text></svg>';
                          }}
                        />
                      </div>
                      <p className="text-[#ffff00] text-xs tracking-wider font-bold">
                        {games.find(g => g.id === hoveredGame)?.description}
                      </p>
                      <p className="text-[#39ff14] text-xs tracking-wider">
                        ▶ CLICK TO PLAY
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-[#ff10f0] text-xs tracking-wider text-center">
                        HOVER OVER A GAME<br/>TO SEE PREVIEW
                      </p>
                    </div>
                  )}
                </div>
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

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#ff10f0] hover:text-[#00ffff] transition-all duration-200 border-2 border-[#ff10f0] hover:border-[#00ffff] px-3 py-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-1 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-1 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-1 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-3 pb-4">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left transition-all duration-200 font-bold tracking-wider text-sm px-4 py-3 border-2 cursor-pointer ${
                    activeSection === item.id
                      ? 'text-[#ff10f0] neon-text border-[#ff10f0] bg-[#ff10f0]/10'
                      : 'text-[#00ffff] hover:text-[#ff10f0] border-[#00ffff] hover:border-[#ff10f0]'
                  }`}
                >
                  {activeSection === item.id ? '▶ ' : ''}{item.label}
                </button>
              </li>
            ))}

            {/* Games Section */}
            <li>
              <button
                onClick={() => setShowGamesDropdown(!showGamesDropdown)}
                className="w-full text-left text-[#39ff14] hover:text-[#ffff00] transition-all duration-200 flex items-center justify-between font-bold tracking-wider text-sm border-2 border-[#39ff14] px-4 py-3 hover:border-[#ffff00] cursor-pointer"
              >
                <span>🎮 GAMES</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showGamesDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mobile Games Dropdown */}
              {showGamesDropdown && (
                <div className="mt-2 ml-4 border-l-4 border-[#ff10f0]">
                  {games.map((game) => (
                    <div key={game.id}>
                      <Link
                        href={`/games/${game.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 text-[#00ffff] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wide border-b-2 border-[#ff10f0]/30"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{game.icon}</span>
                          <span>▸ {game.label}</span>
                        </div>
                        {/* Mobile preview */}
                        <div className="mt-2 border-2 border-[#00ffff]/50 overflow-hidden">
                          <img
                            src={game.preview}
                            alt={game.label}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="96" viewBox="0 0 256 96"><rect width="256" height="96" fill="%230a0014"/><text x="50%" y="50%" fill="%23ff10f0" font-family="monospace" font-size="12" text-anchor="middle" dominant-baseline="middle">PREVIEW</text></svg>';
                            }}
                          />
                        </div>
                        <p className="text-[#ffff00] text-xs mt-2 tracking-wide">
                          {game.description}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* Utility Buttons Row 1 */}
            <li className="grid grid-cols-2 gap-3 mt-2">
              {onOpenAchievements && (
                <button
                  onClick={() => {
                    onOpenAchievements();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#ffff00] hover:text-[#ff10f0] transition-all duration-200 flex items-center justify-center gap-1 font-bold tracking-wider text-sm border-2 border-[#ffff00] px-3 py-3 hover:border-[#ff10f0] cursor-pointer"
                >
                  🏆 TROPHIES
                </button>
              )}

              {onOpenLeaderboard && (
                <button
                  onClick={() => {
                    onOpenLeaderboard();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#00ffff] hover:text-[#ff10f0] transition-all duration-200 flex items-center justify-center gap-1 font-bold tracking-wider text-sm border-2 border-[#00ffff] px-3 py-3 hover:border-[#ff10f0] cursor-pointer"
                >
                  📊 RANKS
                </button>
              )}
            </li>

            {/* Utility Buttons Row 2 */}
            <li className="grid grid-cols-4 gap-2">
              <button
                onClick={toggleMute}
                className="text-[#ff10f0] hover:text-[#ffff00] transition-all duration-200 flex items-center justify-center font-bold text-lg border-2 border-[#ff10f0] px-3 py-3 hover:border-[#ffff00] cursor-pointer"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>

              <button
                onClick={toggleCRT}
                className="text-[#00ffff] hover:text-[#ff10f0] transition-all duration-200 flex items-center justify-center font-bold text-lg border-2 border-[#00ffff] px-3 py-3 hover:border-[#ff10f0] cursor-pointer"
                title={crtEnabled ? 'Disable CRT effect' : 'Enable CRT effect'}
              >
                {crtEnabled ? '📺' : '🖥️'}
              </button>

              {onOpenShortcuts && (
                <button
                  onClick={() => {
                    onOpenShortcuts();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#ffff00] hover:text-[#ff10f0] transition-all duration-200 flex items-center justify-center font-bold text-lg border-2 border-[#ffff00] px-3 py-3 hover:border-[#ff10f0] cursor-pointer"
                  title="View keyboard shortcuts"
                >
                  ⌨️
                </button>
              )}

              {onOpenPlayerName && (
                <button
                  onClick={() => {
                    onOpenPlayerName();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#39ff14] hover:text-[#ff10f0] transition-all duration-200 flex items-center justify-center font-bold text-lg border-2 border-[#39ff14] px-3 py-3 hover:border-[#ff10f0] cursor-pointer col-span-4"
                  title="Change player name"
                >
                  <span className="flex items-center gap-2">
                    👤 <span className="text-sm tracking-wider">{playerName}</span>
                  </span>
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
