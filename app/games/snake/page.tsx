'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { addToLeaderboard, trackGamePlayed, checkAchievement } from '@/lib/gameStats';
import AchievementToast from '@/components/AchievementToast';
import { getAchievements } from '@/lib/gameStats';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Difficulty = 'easy' | 'medium' | 'hard';

const GRID_SIZE = 15;
const CELL_SIZE = 25;
const INITIAL_SNAKE: Position[] = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';

const DIFFICULTY_SETTINGS = {
  easy: { speed: 200, scoreMultiplier: 1 },
  medium: { speed: 150, scoreMultiplier: 1.5 },
  hard: { speed: 100, scoreMultiplier: 2 },
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 12, y: 12 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const startGameWithDifficulty = (selectedDifficulty: Difficulty) => {
    trackGamePlayed('snake');
    setDifficulty(selectedDifficulty);
    setShowDifficultySelect(false);
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
  };

  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setDirection(nextDirection);

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (nextDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Handle wall wrapping
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;

      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const points = Math.floor(10 * DIFFICULTY_SETTINGS[difficulty].scoreMultiplier);
        setScore((prev) => prev + points);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, gameOver, isPaused, gameStarted, generateFood, difficulty]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && !showDifficultySelect && e.key === ' ') {
        resetGame();
        return;
      }

      if (e.key === ' ') {
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, gameStarted, showDifficultySelect]);

  useEffect(() => {
    if (gameOver && score > 0) {
      const achievements = checkAchievement('snake_score', score);
      if (achievements) {
        const achievement = getAchievements().find(a => a.id === achievements);
        setUnlockedAchievement(achievement);
      }
      addToLeaderboard('snake', {
        playerName: 'Player',
        score: score,
        date: new Date().toISOString(),
        difficulty: difficulty,
      });
    }
  }, [gameOver, score, difficulty]);

  useEffect(() => {
    const gameSpeed = DIFFICULTY_SETTINGS[difficulty].speed;
    const gameLoop = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, difficulty]);

  return (
    <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6">
      <AchievementToast
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />

      <div className="container mx-auto max-w-4xl">
        {/* Retro back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#00ffff] hover:text-[#ff10f0] mb-6 transition-colors font-bold tracking-wider border-2 border-[#00ffff] hover:border-[#ff10f0] px-4 py-2"
        >
          <span className="text-xl">◀</span>
          BACK TO PORTFOLIO
        </Link>

        <div className="bg-black border-4 border-[#ff10f0] neon-border p-8 pixel-corners">
          {/* Arcade header */}
          <div className="text-center mb-6">
            <div className="inline-block border-4 border-[#39ff14] bg-black px-6 py-2 mb-4">
              <h1 className="text-4xl font-bold text-[#39ff14] tracking-widest" style={{textShadow: '0 0 20px #39ff14'}}>
                🐍 SNAKE ARCADE 🐍
              </h1>
            </div>

            {/* Score display */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="bg-black border-4 border-[#ffff00] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">SCORE</p>
                <p className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{textShadow: '0 0 15px #ffff00'}}>
                  {score.toString().padStart(4, '0')}
                </p>
              </div>
              {gameStarted && (
                <div className="bg-black border-4 border-[#ff10f0] px-6 py-3">
                  <p className="text-xs text-[#00ffff] tracking-wider mb-1">DIFFICULTY</p>
                  <p className="text-xl font-bold text-[#ff10f0] tracking-widest uppercase" style={{textShadow: '0 0 15px #ff10f0'}}>
                    {difficulty}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Game board */}
          <div className="flex justify-center mb-6">
            <div
              className="relative bg-black border-4 border-[#00ffff] neon-border-cyan"
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
              }}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-[#00ffff]" style={{ top: i * CELL_SIZE }} />
                ))}
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-[#00ffff]" style={{ left: i * CELL_SIZE }} />
                ))}
              </div>

              {/* Snake */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute ${
                    index === 0 ? 'bg-[#39ff14]' : 'bg-[#39ff14]/80'
                  }`}
                  style={{
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    boxShadow: index === 0 ? '0 0 10px #39ff14' : '0 0 5px #39ff14',
                  }}
                />
              ))}

              {/* Food */}
              <div
                className="absolute bg-[#ff10f0] animate-pulse"
                style={{
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  boxShadow: '0 0 15px #ff10f0',
                }}
              />

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-4 border-[#ff0000] bg-black px-8 py-6 mb-6">
                      <h2 className="text-4xl font-bold text-[#ff0000] mb-2 tracking-widest" style={{textShadow: '0 0 20px #ff0000'}}>
                        GAME OVER!
                      </h2>
                      <p className="text-[#00ffff] tracking-wider">FINAL SCORE</p>
                      <p className="text-5xl text-[#ffff00] font-bold tracking-widest mt-2" style={{textShadow: '0 0 20px #ffff00'}}>
                        {score.toString().padStart(4, '0')}
                      </p>
                      <p className="text-[#ff10f0] tracking-wider mt-2 uppercase">
                        {difficulty} MODE
                      </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-black border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-200 font-bold tracking-wider"
                        style={{borderWidth: '3px'}}
                      >
                        ▶ PLAY AGAIN
                      </button>
                      <button
                        onClick={() => {
                          setGameOver(false);
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
              )}

              {/* Difficulty Selection Screen */}
              {!gameStarted && !gameOver && showDifficultySelect && (
                <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-4 border-[#00ffff] neon-border-cyan bg-black px-8 py-6 mb-6">
                      <h2 className="text-3xl font-bold text-[#00ffff] mb-4 tracking-widest neon-text-cyan">
                        SELECT DIFFICULTY
                      </h2>
                      <div className="space-y-3">
                        <button
                          onClick={() => startGameWithDifficulty('easy')}
                          className="w-full px-8 py-3 bg-black border-3 border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-all duration-200 font-bold tracking-wider"
                          style={{borderWidth: '3px'}}
                        >
                          ▶ EASY - SLOWER SPEED
                        </button>
                        <button
                          onClick={() => startGameWithDifficulty('medium')}
                          className="w-full px-8 py-3 bg-black border-3 border-[#ffff00] text-[#ffff00] hover:bg-[#ffff00] hover:text-black transition-all duration-200 font-bold tracking-wider"
                          style={{borderWidth: '3px'}}
                        >
                          ▶ MEDIUM - NORMAL SPEED
                        </button>
                        <button
                          onClick={() => startGameWithDifficulty('hard')}
                          className="w-full px-8 py-3 bg-black border-3 border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-black transition-all duration-200 font-bold tracking-wider"
                          style={{borderWidth: '3px'}}
                        >
                          ▶ HARD - FASTER SPEED
                        </button>
                      </div>
                    </div>
                    <div className="text-[#39ff14] text-sm tracking-wider space-y-1 font-mono">
                      <p>🎯 HIGHER DIFFICULTY = MORE POINTS</p>
                      <p>▲ ▼ ◀ ▶ ARROW KEYS TO MOVE</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Start Screen (when restarting without difficulty select) */}
              {!gameStarted && !gameOver && !showDifficultySelect && (
                <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-4 border-[#00ffff] neon-border-cyan bg-black px-8 py-6 mb-6">
                      <h2 className="text-3xl font-bold text-[#00ffff] mb-4 tracking-widest neon-text-cyan">
                        PRESS SPACE
                      </h2>
                      <p className="text-[#ffff00] tracking-wider">TO START GAME</p>
                    </div>
                    <div className="text-[#39ff14] text-sm tracking-wider space-y-1 font-mono">
                      <p>▲ ▼ ◀ ▶ ARROW KEYS TO MOVE</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pause Overlay */}
              {isPaused && gameStarted && !gameOver && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                  <div className="text-center">
                    <div className="border-4 border-[#ffff00] bg-black px-8 py-6">
                      <h2 className="text-4xl font-bold text-[#ffff00] mb-2 tracking-widest" style={{textShadow: '0 0 20px #ffff00'}}>
                        ⏸ PAUSED
                      </h2>
                      <p className="text-[#00ffff] tracking-wider">PRESS SPACE TO CONTINUE</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                disabled={!gameStarted || gameOver}
                className="px-6 py-2 bg-black border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-200 font-bold tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                style={{borderWidth: '3px'}}
              >
                {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-black border-3 border-[#ff10f0] text-[#ff10f0] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wider uppercase"
                style={{borderWidth: '3px'}}
              >
                ⟲ RESTART
              </button>
            </div>

            {/* Instructions */}
            <div className="border-t-2 border-[#ff10f0]/30 pt-4 mt-4">
              <div className="text-[#00ffff] text-xs tracking-wider space-y-1 font-mono">
                <p>🎮 USE ARROW KEYS TO CONTROL SNAKE</p>
                <p>⏸ PRESS SPACE TO PAUSE/RESUME</p>
                <p>🍎 EAT FOOD TO GROW & SCORE POINTS</p>
                <p>⚡ SNAKE WRAPS AROUND THE EDGES</p>
                <p>🎯 EASY: +10 | MEDIUM: +15 | HARD: +20 POINTS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
