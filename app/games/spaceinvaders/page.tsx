'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { addToLeaderboard, trackGamePlayed, checkAchievement, updateAchievementProgress } from '@/lib/gameStats';
import AchievementToast from '@/components/AchievementToast';
import PlayerNamePrompt from '@/components/PlayerNamePrompt';
import { getAchievements } from '@/lib/gameStats';
import { useSound } from '@/components/SoundEffects';
import { useScreenShake } from '@/hooks/useScreenShake';
import { awardCoins, COIN_REWARDS } from '@/lib/coinSystem';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 6;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 8;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 30;
const ENEMY_ROWS = 4;
const ENEMY_COLS = 8;
const ENEMY_SPACING = 60;
const ENEMY_SPEED_BASE = 1;

interface Bullet {
  x: number;
  y: number;
  isEnemy: boolean;
}

interface Enemy {
  x: number;
  y: number;
  alive: boolean;
}

export default function SpaceInvadersGame() {
  const { playSound } = useSound();
  const { triggerShake } = useScreenShake();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingScore, setPendingScore] = useState<number | null>(null);

  const gameStateRef = useRef({
    playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    enemyDirection: 1,
    enemySpeed: ENEMY_SPEED_BASE,
    keys: {} as Record<string, boolean>,
    lastShot: 0,
    lastEnemyShot: 0,
  });

  const initializeEnemies = useCallback(() => {
    const enemies: Enemy[] = [];
    const startX = (CANVAS_WIDTH - (ENEMY_COLS * ENEMY_SPACING)) / 2;
    const startY = 80;

    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        enemies.push({
          x: startX + col * ENEMY_SPACING,
          y: startY + row * ENEMY_SPACING,
          alive: true,
        });
      }
    }

    return enemies;
  }, []);

  const startGame = () => {
    trackGamePlayed('spaceinvaders');
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setWave(1);
    gameStateRef.current = {
      playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      bullets: [],
      enemies: initializeEnemies(),
      enemyDirection: 1,
      enemySpeed: ENEMY_SPEED_BASE,
      keys: {},
      lastShot: 0,
      lastEnemyShot: 0,
    };
  };

  const nextWave = useCallback(() => {
    setWave((prev) => prev + 1);
    gameStateRef.current.bullets = [];
    gameStateRef.current.enemies = initializeEnemies();
    gameStateRef.current.enemyDirection = 1;
    gameStateRef.current.enemySpeed = ENEMY_SPEED_BASE + (wave * 0.2);
  }, [initializeEnemies, wave]);

  const updateGame = useCallback(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const state = gameStateRef.current;
    const now = Date.now();

    // Move player
    if (state.keys['ArrowLeft'] && state.playerX > 0) {
      state.playerX -= PLAYER_SPEED;
    }
    if (state.keys['ArrowRight'] && state.playerX < CANVAS_WIDTH - PLAYER_WIDTH) {
      state.playerX += PLAYER_SPEED;
    }

    // Shoot
    if (state.keys[' '] && now - state.lastShot > 300) {
      state.bullets.push({
        x: state.playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10,
        isEnemy: false,
      });
      playSound('paddleHit');
      state.lastShot = now;
    }

    // Move bullets
    state.bullets = state.bullets.filter((bullet) => {
      bullet.y += bullet.isEnemy ? BULLET_SPEED : -BULLET_SPEED;
      return bullet.y > 0 && bullet.y < CANVAS_HEIGHT;
    });

    // Move enemies
    let shouldMoveDown = false;
    const aliveEnemies = state.enemies.filter((e) => e.alive);

    aliveEnemies.forEach((enemy) => {
      enemy.x += state.enemyDirection * state.enemySpeed;
      if (enemy.x <= 0 || enemy.x >= CANVAS_WIDTH - ENEMY_WIDTH) {
        shouldMoveDown = true;
      }
    });

    if (shouldMoveDown) {
      state.enemyDirection *= -1;
      state.enemies.forEach((enemy) => {
        if (enemy.alive) {
          enemy.y += ENEMY_HEIGHT / 2;
        }
      });
    }

    // Enemy shooting
    if (now - state.lastEnemyShot > 1000 && aliveEnemies.length > 0) {
      const shootingEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      state.bullets.push({
        x: shootingEnemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2,
        y: shootingEnemy.y + ENEMY_HEIGHT,
        isEnemy: true,
      });
      state.lastEnemyShot = now;
    }

    // Collision detection - bullets with enemies
    state.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.isEnemy) return;

      state.enemies.forEach((enemy, enemyIndex) => {
        if (!enemy.alive) return;

        if (
          bullet.x < enemy.x + ENEMY_WIDTH &&
          bullet.x + BULLET_WIDTH > enemy.x &&
          bullet.y < enemy.y + ENEMY_HEIGHT &&
          bullet.y + BULLET_HEIGHT > enemy.y
        ) {
          state.enemies[enemyIndex].alive = false;
          state.bullets.splice(bulletIndex, 1);
          playSound('success');
          setScore((prev) => {
            const newScore = prev + 100;
            updateAchievementProgress('space_ace', newScore, 5000);
            return newScore;
          });
        }
      });
    });

    // Collision detection - enemy bullets with player
    state.bullets.forEach((bullet, bulletIndex) => {
      if (!bullet.isEnemy) return;

      if (
        bullet.x < state.playerX + PLAYER_WIDTH &&
        bullet.x + BULLET_WIDTH > state.playerX &&
        bullet.y < CANVAS_HEIGHT - PLAYER_HEIGHT &&
        bullet.y + BULLET_HEIGHT > CANVAS_HEIGHT - PLAYER_HEIGHT - 10
      ) {
        state.bullets.splice(bulletIndex, 1);
        playSound('error');
        triggerShake('medium');
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            playSound('gameOver');
            triggerShake('heavy');
            const finalScore = score;
            setPendingScore(finalScore);
            setShowNamePrompt(true);

            // Award coins based on score
            let coinsEarned = 0;
            if (finalScore >= 500) {
              coinsEarned = COIN_REWARDS.PERFECT_GAME; // 5 coins for 500+
            } else if (finalScore >= 300) {
              coinsEarned = COIN_REWARDS.BEAT_PERSONAL_BEST; // 3 coins for 300+
            } else if (finalScore >= 150) {
              coinsEarned = COIN_REWARDS.HIGH_SCORE; // 2 coins for 150+
            } else if (finalScore >= 50) {
              coinsEarned = COIN_REWARDS.GAME_COMPLETED; // 1 coin for 50+
            }

            if (coinsEarned > 0) {
              awardCoins(coinsEarned);
            }

            const achievements = checkAchievement('space_survivor', finalScore);
            if (achievements) {
              const achievement = getAchievements().find((a) => a.id === achievements);
              setUnlockedAchievement(achievement);
            }
          }
          return newLives;
        });
      }
    });

    // Check for wave completion
    if (aliveEnemies.length === 0 && !gameOver) {
      nextWave();
    }

    // Check if enemies reached bottom
    aliveEnemies.forEach((enemy) => {
      if (enemy.y + ENEMY_HEIGHT >= CANVAS_HEIGHT - PLAYER_HEIGHT - 20) {
        setGameOver(true);
        playSound('gameOver');
        triggerShake('heavy');
        setPendingScore(score);
        setShowNamePrompt(true);
      }
    });
  }, [gameStarted, isPaused, gameOver, playSound, triggerShake, score, nextWave]);

  const handleNameSubmit = (playerName?: string) => {
    if (pendingScore !== null && playerName) {
      addToLeaderboard('spaceinvaders', {
        playerName,
        score: pendingScore,
        date: new Date().toISOString(),
      });
    }
    setShowNamePrompt(false);
    setPendingScore(null);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#0a0014';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(state.playerX + PLAYER_WIDTH / 2, CANVAS_HEIGHT - PLAYER_HEIGHT);
    ctx.lineTo(state.playerX, CANVAS_HEIGHT);
    ctx.lineTo(state.playerX + PLAYER_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Draw bullets
    state.bullets.forEach((bullet) => {
      ctx.fillStyle = bullet.isEnemy ? '#ff10f0' : '#ffff00';
      ctx.shadowColor = bullet.isEnemy ? '#ff10f0' : '#ffff00';
      ctx.shadowBlur = 10;
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Draw enemies
    state.enemies.forEach((enemy) => {
      if (!enemy.alive) return;

      ctx.fillStyle = '#39ff14';
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur = 10;

      // Draw alien shape
      ctx.fillRect(enemy.x + 10, enemy.y, 20, 10);
      ctx.fillRect(enemy.x + 5, enemy.y + 10, 30, 10);
      ctx.fillRect(enemy.x, enemy.y + 20, 40, 10);
      ctx.fillRect(enemy.x + 5, enemy.y + 10, 5, 20);
      ctx.fillRect(enemy.x + 30, enemy.y + 10, 5, 20);
    });

    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !gameStarted) {
        startGame();
        e.preventDefault();
        return;
      }

      // Use 'p' for pause instead of space
      if (e.key === 'p' && gameStarted && !gameOver) {
        setIsPaused((prev) => !prev);
        e.preventDefault();
        return;
      }

      gameStateRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      updateGame();
      draw();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, updateGame, draw]);

  return (
    <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6 shake-container">
      <AchievementToast achievement={unlockedAchievement} onClose={() => setUnlockedAchievement(null)} />
      <PlayerNamePrompt isOpen={showNamePrompt} onClose={handleNameSubmit} />

      <div className="container mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#00ffff] hover:text-[#ff10f0] mb-6 transition-colors font-bold tracking-wider border-2 border-[#00ffff] hover:border-[#ff10f0] px-4 py-2"
        >
          <span className="text-xl">◀</span>
          BACK TO PORTFOLIO
        </Link>

        <div className="bg-black border-4 border-[#ff10f0] neon-border p-8 pixel-corners">
          <div className="text-center mb-6">
            <div className="inline-block border-4 border-[#39ff14] bg-black px-6 py-2 mb-4">
              <h1 className="text-4xl font-bold text-[#39ff14] tracking-widest" style={{ textShadow: '0 0 20px #39ff14' }}>
                👾 SPACE INVADERS 👾
              </h1>
            </div>

            <div className="flex justify-center gap-6 mb-4">
              <div className="bg-black border-4 border-[#ffff00] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">SCORE</p>
                <p className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{ textShadow: '0 0 15px #ffff00' }}>
                  {score.toString().padStart(5, '0')}
                </p>
              </div>

              <div className="bg-black border-4 border-[#ff10f0] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">WAVE</p>
                <p className="text-3xl font-bold text-[#ff10f0] tracking-widest" style={{ textShadow: '0 0 15px #ff10f0' }}>
                  {wave.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="bg-black border-4 border-[#00ffff] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">LIVES</p>
                <p className="text-3xl font-bold text-[#00ffff] tracking-widest" style={{ textShadow: '0 0 15px #00ffff' }}>
                  {'♥'.repeat(lives)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6 relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-[#00ffff] neon-border-cyan"
            />

            {!gameStarted && (
              <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
                <div className="text-center">
                  <div className="border-4 border-[#00ffff] neon-border-cyan bg-black px-8 py-6 mb-6">
                    <h2 className="text-3xl font-bold text-[#00ffff] mb-4 tracking-widest neon-text-cyan">
                      PRESS SPACE
                    </h2>
                    <p className="text-[#ffff00] tracking-wider">TO START GAME</p>
                  </div>
                  <div className="text-[#39ff14] text-sm tracking-wider space-y-1 font-mono">
                    <p>◀ ▶ ARROW KEYS TO MOVE</p>
                    <p>SPACE TO SHOOT</p>
                    <p>P TO PAUSE</p>
                    <p>DEFEND EARTH FROM INVADERS!</p>
                  </div>
                </div>
              </div>
            )}

            {isPaused && gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                <div className="border-4 border-[#ffff00] bg-black px-8 py-6">
                  <h2 className="text-4xl font-bold text-[#ffff00] mb-2 tracking-widest" style={{ textShadow: '0 0 20px #ffff00' }}>
                    ⏸ PAUSED
                  </h2>
                  <p className="text-[#00ffff] tracking-wider">PRESS P TO CONTINUE</p>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
                <div className="text-center">
                  <div className="border-4 border-[#ff0000] bg-black px-8 py-6 mb-6">
                    <h2 className="text-4xl font-bold text-[#ff0000] mb-2 tracking-widest" style={{ textShadow: '0 0 20px #ff0000' }}>
                      GAME OVER!
                    </h2>
                    <p className="text-[#00ffff] tracking-wider">FINAL SCORE</p>
                    <p className="text-5xl text-[#ffff00] font-bold tracking-widest mt-2">
                      {score.toString().padStart(5, '0')}
                    </p>
                    <p className="text-[#39ff14] tracking-wider mt-2">WAVE {wave} REACHED</p>
                  </div>
                  <button onClick={startGame} className="retro-btn px-8 py-3 text-white">
                    ▶ PLAY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                disabled={!gameStarted || gameOver}
                className="px-6 py-2 bg-black border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-200 font-bold tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderWidth: '3px' }}
              >
                {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
              </button>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-black border-3 border-[#ff10f0] text-[#ff10f0] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wider uppercase"
                style={{ borderWidth: '3px' }}
              >
                ⟲ RESTART
              </button>
            </div>

            {/* Mobile Touch Controls */}
            <div className="md:hidden mt-6 flex justify-center gap-4">
              <button
                onTouchStart={() => { gameStateRef.current.keys['ArrowLeft'] = true; }}
                onTouchEnd={() => { gameStateRef.current.keys['ArrowLeft'] = false; }}
                className="w-20 h-20 bg-black border-4 border-[#00ffff] text-[#00ffff] text-3xl font-bold active:bg-[#00ffff] active:text-black transition-all"
                disabled={!gameStarted || gameOver || isPaused}
              >
                ◀
              </button>
              <button
                onTouchStart={() => { gameStateRef.current.keys[' '] = true; }}
                onTouchEnd={() => { gameStateRef.current.keys[' '] = false; }}
                className="w-20 h-20 bg-black border-4 border-[#ffff00] text-[#ffff00] text-2xl font-bold active:bg-[#ffff00] active:text-black transition-all"
                disabled={!gameStarted || gameOver || isPaused}
              >
                🔫
              </button>
              <button
                onTouchStart={() => { gameStateRef.current.keys['ArrowRight'] = true; }}
                onTouchEnd={() => { gameStateRef.current.keys['ArrowRight'] = false; }}
                className="w-20 h-20 bg-black border-4 border-[#00ffff] text-[#00ffff] text-3xl font-bold active:bg-[#00ffff] active:text-black transition-all"
                disabled={!gameStarted || gameOver || isPaused}
              >
                ▶
              </button>
            </div>

            <div className="border-t-2 border-[#ff10f0]/30 pt-4 mt-4">
              <div className="text-[#00ffff] text-xs tracking-wider space-y-1 font-mono">
                <p className="hidden md:block">🎮 USE ◀ ▶ ARROW KEYS TO MOVE</p>
                <p className="hidden md:block">🔫 PRESS SPACE TO SHOOT</p>
                <p className="hidden md:block">⏸ PRESS P TO PAUSE/RESUME</p>
                <p className="md:hidden">🎮 TAP BUTTONS TO CONTROL SHIP</p>
                <p>👾 DESTROY ALL INVADERS TO ADVANCE TO NEXT WAVE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
