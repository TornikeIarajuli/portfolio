'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addToLeaderboard, trackGamePlayed, checkAchievement, getPlayerName, updateAchievementProgress } from '@/lib/gameStats';
import AchievementToast from '@/components/AchievementToast';
import PlayerNamePrompt from '@/components/PlayerNamePrompt';
import { getAchievements } from '@/lib/gameStats';
import { useSound } from '@/components/SoundEffects';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const ALL_SYMBOLS = ['🐍', '🎮', '🚀', '⚡', '🎯', '🌟', '💎', '🔥', '👾', '🎲', '🎪', '🎨'];

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 6, gridCols: 4, label: 'EASY - 6 PAIRS (4x3)' },
  medium: { pairs: 8, gridCols: 4, label: 'MEDIUM - 8 PAIRS (4x4)' },
  hard: { pairs: 10, gridCols: 5, label: 'HARD - 10 PAIRS (5x4)' },
};

export default function MemoryGame() {
  const { playSound } = useSound();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingScore, setPendingScore] = useState<{score: number, timer: number} | null>(null);

  const startGameWithDifficulty = (selectedDifficulty: Difficulty) => {
    trackGamePlayed('memory');
    setDifficulty(selectedDifficulty);
    setShowDifficultySelect(false);
    initializeGame(selectedDifficulty);
  };

  const initializeGame = (gameDifficulty: Difficulty = difficulty) => {
    const pairCount = DIFFICULTY_SETTINGS[gameDifficulty].pairs;
    const selectedSymbols = ALL_SYMBOLS.slice(0, pairCount);
    const duplicatedSymbols = [...selectedSymbols, ...selectedSymbols];
    const shuffled = duplicatedSymbols
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(true);
    setGameWon(false);
    setTimer(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameWon]);

  useEffect(() => {
    const pairCount = DIFFICULTY_SETTINGS[difficulty].pairs;
    if (matches === pairCount && gameStarted) {
      setGameWon(true);
      setIsTimerRunning(false);
      playSound('win');

      if (bestTime === null || timer < bestTime) {
        setBestTime(timer);
      }
      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves);
      }

      // Check achievements and save to leaderboard
      const score = Math.max(0, 1000 - (timer * 5) - (moves * 10));
      const achievements = checkAchievement('memory_time', timer);
      if (achievements) {
        const achievement = getAchievements().find(a => a.id === achievements);
        setUnlockedAchievement(achievement);
      }
      const perfectAchievement = checkAchievement('memory_complete', { score, moves });
      if (perfectAchievement && !achievements) {
        const achievement = getAchievements().find(a => a.id === perfectAchievement);
        setUnlockedAchievement(achievement);
      }
      // Update progress for time-based achievements (inverted - lower is better)
      updateAchievementProgress('memory_genius', Math.max(0, 30 - timer), 30);
      updateAchievementProgress('memory_speedster', Math.max(0, 20 - timer), 20);
      updateAchievementProgress('perfect_memory', Math.max(0, 12 - moves), 12);
      if (difficulty === 'hard') {
        checkAchievement('hard_mode_complete', '');
      }

      // Show name prompt for score
      setPendingScore({ score, timer });
      setShowNamePrompt(true);
    }
  }, [matches, gameStarted, timer, moves, bestTime, bestMoves, difficulty, playSound]);

  const handleNameSubmit = (playerName: string) => {
    if (pendingScore !== null) {
      addToLeaderboard('memory', {
        playerName,
        score: pendingScore.score,
        date: new Date().toISOString(),
        difficulty: difficulty,
      });
    }
    setShowNamePrompt(false);
    setPendingScore(null);
  };

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (flippedCards.length === 2 || card.isFlipped || card.isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    playSound('cardFlip');

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (newCards[firstIndex].symbol === newCards[secondIndex].symbol) {
        playSound('match');
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          setMatches(matches + 1);
        }, 500);
      } else {
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].isFlipped = false;
          updatedCards[secondIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6">
        <AchievementToast
          achievement={unlockedAchievement}
          onClose={() => setUnlockedAchievement(null)}
        />

        <div className="container mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00ffff] hover:text-[#ff10f0] mb-6 transition-colors font-bold tracking-wider border-2 border-[#00ffff] hover:border-[#ff10f0] px-4 py-2"
          >
            <span className="text-xl">◀</span>
            BACK TO PORTFOLIO
          </Link>

          <div className="bg-black border-4 border-[#ff10f0] neon-border p-8 pixel-corners text-center">
            <div className="inline-block border-4 border-[#00ffff] neon-border-cyan bg-black px-6 py-2 mb-8">
              <h1 className="text-4xl font-bold text-[#00ffff] tracking-widest neon-text-cyan">
                🎴 MEMORY CARDS 🎴
              </h1>
            </div>

            {showDifficultySelect ? (
              <>
                <p className="text-xl text-[#ffff00] mb-8 tracking-wider">
                  ▸ SELECT DIFFICULTY ◂
                </p>

                <div className="space-y-4 mb-8">
                  <button
                    onClick={() => startGameWithDifficulty('easy')}
                    className="w-full max-w-md mx-auto block px-8 py-4 bg-black border-3 border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-all duration-200 font-bold tracking-wider text-lg"
                    style={{borderWidth: '3px'}}
                  >
                    ▶ {DIFFICULTY_SETTINGS.easy.label}
                  </button>
                  <button
                    onClick={() => startGameWithDifficulty('medium')}
                    className="w-full max-w-md mx-auto block px-8 py-4 bg-black border-3 border-[#ffff00] text-[#ffff00] hover:bg-[#ffff00] hover:text-black transition-all duration-200 font-bold tracking-wider text-lg"
                    style={{borderWidth: '3px'}}
                  >
                    ▶ {DIFFICULTY_SETTINGS.medium.label}
                  </button>
                  <button
                    onClick={() => startGameWithDifficulty('hard')}
                    className="w-full max-w-md mx-auto block px-8 py-4 bg-black border-3 border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-black transition-all duration-200 font-bold tracking-wider text-lg"
                    style={{borderWidth: '3px'}}
                  >
                    ▶ {DIFFICULTY_SETTINGS.hard.label}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl text-[#ffff00] mb-8 tracking-wider">
                  ▸ FIND ALL MATCHING PAIRS ◂
                </p>

                {(bestTime !== null || bestMoves !== null) && (
                  <div className="mb-8 p-6 bg-black border-4 border-[#39ff14]" style={{boxShadow: '0 0 20px #39ff14'}}>
                    <h3 className="text-xl font-bold text-[#39ff14] mb-4 tracking-wider" style={{textShadow: '0 0 15px #39ff14'}}>
                      ★ HIGH SCORES ★
                    </h3>
                    <div className="flex justify-center gap-8">
                      {bestTime !== null && (
                        <div className="bg-black border-3 border-[#ff10f0] px-4 py-3" style={{borderWidth: '3px'}}>
                          <p className="text-[#00ffff] text-xs tracking-wider mb-1">BEST TIME</p>
                          <p className="text-2xl font-bold text-[#ff10f0] tracking-widest" style={{textShadow: '0 0 10px #ff10f0'}}>
                            {formatTime(bestTime)}
                          </p>
                        </div>
                      )}
                      {bestMoves !== null && (
                        <div className="bg-black border-3 border-[#00ffff] px-4 py-3" style={{borderWidth: '3px'}}>
                          <p className="text-[#00ffff] text-xs tracking-wider mb-1">BEST MOVES</p>
                          <p className="text-2xl font-bold text-[#00ffff] tracking-widest" style={{textShadow: '0 0 10px #00ffff'}}>
                            {bestMoves}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => initializeGame()}
                  className="retro-btn px-8 py-4 text-white text-xl mb-8"
                >
                  ▶ START GAME
                </button>
              </>
            )}

            <div className="border-t-2 border-[#ff10f0]/30 pt-6 mt-6">
              <p className="text-[#00ffff] font-bold tracking-wider mb-3">HOW TO PLAY:</p>
              <div className="text-left text-[#00ffff] text-sm tracking-wider space-y-1 font-mono max-w-md mx-auto">
                <p>▸ CLICK CARDS TO FLIP THEM</p>
                <p>▸ FIND MATCHING PAIRS</p>
                <p>▸ BEAT YOUR BEST TIME & MOVES</p>
                <p>▸ MORE PAIRS = HARDER DIFFICULTY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6">
      <AchievementToast
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />
      <PlayerNamePrompt
        isOpen={showNamePrompt}
        onClose={handleNameSubmit}
      />

      <div className="container mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#00ffff] hover:text-[#ff10f0] mb-6 transition-colors font-bold tracking-wider border-2 border-[#00ffff] hover:border-[#ff10f0] px-4 py-2"
        >
          <span className="text-xl">◀</span>
          BACK TO PORTFOLIO
        </Link>

        <div className="bg-black border-4 border-[#ff10f0] neon-border p-8 pixel-corners">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block border-4 border-[#00ffff] neon-border-cyan bg-black px-6 py-2 mb-6">
              <h1 className="text-4xl font-bold text-[#00ffff] tracking-widest neon-text-cyan">
                🎴 MEMORY CARDS 🎴
              </h1>
            </div>

            {/* Stats display */}
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
              <div className="bg-black border-4 border-[#ffff00] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">TIME</p>
                <p className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{textShadow: '0 0 15px #ffff00'}}>
                  {formatTime(timer)}
                </p>
              </div>

              <div className="bg-black border-4 border-[#ff10f0] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">MOVES</p>
                <p className="text-3xl font-bold text-[#ff10f0] tracking-widest" style={{textShadow: '0 0 15px #ff10f0'}}>
                  {moves.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="bg-black border-4 border-[#39ff14] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">MATCHES</p>
                <p className="text-3xl font-bold text-[#39ff14] tracking-widest" style={{textShadow: '0 0 15px #39ff14'}}>
                  {matches}/{DIFFICULTY_SETTINGS[difficulty].pairs}
                </p>
              </div>

              <div className="bg-black border-4 border-[#b000ff] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">DIFFICULTY</p>
                <p className="text-xl font-bold text-[#b000ff] tracking-widest uppercase" style={{textShadow: '0 0 15px #b000ff'}}>
                  {difficulty}
                </p>
              </div>
            </div>
          </div>

          {/* Game board */}
          <div className="flex justify-center mb-6">
            <div
              className={`grid gap-4 max-w-2xl p-6 bg-black border-4 border-[#00ffff]`}
              style={{
                gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].gridCols}, minmax(0, 1fr))`,
                boxShadow: '0 0 20px #00ffff'
              }}
            >
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={card.isMatched || card.isFlipped || flippedCards.length === 2}
                  className={`w-20 h-20 md:w-24 md:h-24 text-4xl transition-all duration-500 border-4 ${
                    card.isFlipped || card.isMatched
                      ? 'bg-[#ff10f0] border-[#ff10f0]'
                      : 'bg-black border-[#00ffff] hover:bg-[#00ffff]/20 hover:scale-105'
                  } ${
                    card.isMatched ? 'opacity-30' : ''
                  } disabled:cursor-not-allowed pixel-corners`}
                  style={card.isFlipped || card.isMatched ? {boxShadow: '0 0 15px #ff10f0'} : {}}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span className="block">{card.symbol}</span>
                  ) : (
                    <span className="block text-[#00ffff]">?</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Win message */}
          {gameWon && (
            <div className="text-center mb-6 p-6 bg-black border-4 border-[#39ff14]" style={{boxShadow: '0 0 20px #39ff14'}}>
              <h2 className="text-4xl font-bold text-[#39ff14] mb-4 tracking-widest" style={{textShadow: '0 0 20px #39ff14'}}>
                ★ VICTORY! ★
              </h2>
              <p className="text-xl text-[#00ffff] mb-2 tracking-wider">
                COMPLETED IN{' '}
                <span className="text-[#ffff00] font-bold" style={{textShadow: '0 0 10px #ffff00'}}>
                  {formatTime(timer)}
                </span>
                {' '}WITH{' '}
                <span className="text-[#ff10f0] font-bold" style={{textShadow: '0 0 10px #ff10f0'}}>
                  {moves}
                </span>
                {' '}MOVES
              </p>
              <p className="text-[#b000ff] tracking-wider mt-2 uppercase">
                {difficulty} MODE
              </p>
              {(timer === bestTime || moves === bestMoves) && (
                <p className="text-lg text-[#ffff00] font-bold tracking-widest mt-3" style={{textShadow: '0 0 15px #ffff00'}}>
                  🏆 NEW HIGH SCORE! 🏆
                </p>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => initializeGame()}
              className="px-6 py-3 bg-black border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-200 font-bold tracking-wider"
              style={{borderWidth: '3px'}}
            >
              ▶ NEW GAME
            </button>
            <button
              onClick={() => {
                setGameStarted(false);
                setShowDifficultySelect(true);
              }}
              className="px-6 py-3 bg-black border-3 border-[#ffff00] text-[#ffff00] hover:bg-[#ffff00] hover:text-black transition-all duration-200 font-bold tracking-wider"
              style={{borderWidth: '3px'}}
            >
              ⚙ CHANGE DIFFICULTY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
