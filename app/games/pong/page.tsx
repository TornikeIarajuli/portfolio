'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { addToLeaderboard, trackGamePlayed, checkAchievement } from '@/lib/gameStats';
import AchievementToast from '@/components/AchievementToast';
import { getAchievements } from '@/lib/gameStats';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 10;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<any>(null);

  const gameStateRef = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVelX: BALL_SPEED,
    ballVelY: BALL_SPEED,
    keys: {} as Record<string, boolean>,
  });

  const startGame = () => {
    trackGamePlayed('pong');
    setGameStarted(true);
    setGameOver(false);
    setPlayerScore(0);
    setAiScore(0);
    gameStateRef.current = {
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVelX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      ballVelY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      keys: {},
    };
  };

  const updateGame = useCallback(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const state = gameStateRef.current;

    // Move player paddle
    if (state.keys['ArrowUp'] && state.playerY > 0) {
      state.playerY -= PADDLE_SPEED;
    }
    if (state.keys['ArrowDown'] && state.playerY < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      state.playerY += PADDLE_SPEED;
    }

    // AI movement
    const aiTarget = state.ballY - PADDLE_HEIGHT / 2;
    if (state.aiY < aiTarget - 2) {
      state.aiY += PADDLE_SPEED * 0.7;
    } else if (state.aiY > aiTarget + 2) {
      state.aiY -= PADDLE_SPEED * 0.7;
    }

    // Move ball
    state.ballX += state.ballVelX;
    state.ballY += state.ballVelY;

    // Ball collision with top/bottom
    if (state.ballY <= 0 || state.ballY >= CANVAS_HEIGHT) {
      state.ballVelY *= -1;
    }

    // Ball collision with player paddle
    if (
      state.ballX <= PADDLE_WIDTH &&
      state.ballY >= state.playerY &&
      state.ballY <= state.playerY + PADDLE_HEIGHT
    ) {
      state.ballVelX *= -1.1;
      const hitPos = (state.ballY - state.playerY) / PADDLE_HEIGHT - 0.5;
      state.ballVelY = hitPos * 10;
    }

    // Ball collision with AI paddle
    if (
      state.ballX >= CANVAS_WIDTH - PADDLE_WIDTH &&
      state.ballY >= state.aiY &&
      state.ballY <= state.aiY + PADDLE_HEIGHT
    ) {
      state.ballVelX *= -1.1;
      const hitPos = (state.ballY - state.aiY) / PADDLE_HEIGHT - 0.5;
      state.ballVelY = hitPos * 10;
    }

    // Score
    if (state.ballX < 0) {
      setAiScore(prev => {
        const newScore = prev + 1;
        if (newScore >= 10) {
          setGameOver(true);
        }
        return newScore;
      });
      resetBall();
    } else if (state.ballX > CANVAS_WIDTH) {
      setPlayerScore(prev => {
        const newScore = prev + 1;
        if (newScore >= 10) {
          setGameOver(true);
          // Save score and check achievements
          const achievements = checkAchievement('pong_score', newScore);
          if (achievements) {
            const achievement = getAchievements().find(a => a.id === achievements);
            setUnlockedAchievement(achievement);
          }
          addToLeaderboard('pong', {
            playerName: 'Player',
            score: newScore,
            date: new Date().toISOString(),
          });
        }
        return newScore;
      });
      resetBall();
    }
  }, [gameStarted, isPaused, gameOver]);

  const resetBall = () => {
    const state = gameStateRef.current;
    state.ballX = CANVAS_WIDTH / 2;
    state.ballY = CANVAS_HEIGHT / 2;
    state.ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    state.ballVelY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
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

    // Draw center line
    ctx.strokeStyle = '#ff10f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(0, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#ff10f0';
    ctx.shadowColor = '#ff10f0';
    ctx.shadowBlur = 15;
    ctx.fillRect(state.ballX - BALL_SIZE / 2, state.ballY - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);

    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (!gameStarted) {
          startGame();
        } else {
          setIsPaused(prev => !prev);
        }
        e.preventDefault();
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
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      updateGame();
      draw();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, updateGame, draw]);

  return (
    <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6">
      <AchievementToast
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />

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
              <h1 className="text-4xl font-bold text-[#39ff14] tracking-widest" style={{textShadow: '0 0 20px #39ff14'}}>
                🏓 PONG ARCADE 🏓
              </h1>
            </div>

            <div className="flex justify-center gap-12 mb-4">
              <div className="bg-black border-4 border-[#00ffff] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">PLAYER</p>
                <p className="text-4xl font-bold text-[#00ffff] tracking-widest" style={{textShadow: '0 0 15px #00ffff'}}>
                  {playerScore.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="bg-black border-4 border-[#ff10f0] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">AI</p>
                <p className="text-4xl font-bold text-[#ff10f0] tracking-widest" style={{textShadow: '0 0 15px #ff10f0'}}>
                  {aiScore.toString().padStart(2, '0')}
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
                    <p>▲ ▼ ARROW KEYS TO MOVE</p>
                    <p>FIRST TO 10 POINTS WINS</p>
                  </div>
                </div>
              </div>
            )}

            {isPaused && gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                <div className="border-4 border-[#ffff00] bg-black px-8 py-6">
                  <h2 className="text-4xl font-bold text-[#ffff00] mb-2 tracking-widest" style={{textShadow: '0 0 20px #ffff00'}}>
                    ⏸ PAUSED
                  </h2>
                  <p className="text-[#00ffff] tracking-wider">PRESS SPACE TO CONTINUE</p>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
                <div className="text-center">
                  <div className={`border-4 ${playerScore >= 10 ? 'border-[#39ff14]' : 'border-[#ff0000]'} bg-black px-8 py-6 mb-6`}>
                    <h2 className={`text-4xl font-bold mb-2 tracking-widest ${playerScore >= 10 ? 'text-[#39ff14]' : 'text-[#ff0000]'}`}
                        style={{textShadow: `0 0 20px ${playerScore >= 10 ? '#39ff14' : '#ff0000'}`}}>
                      {playerScore >= 10 ? '★ YOU WIN! ★' : 'GAME OVER!'}
                    </h2>
                    <p className="text-[#00ffff] tracking-wider">FINAL SCORE</p>
                    <p className="text-5xl text-[#ffff00] font-bold tracking-widest mt-2">
                      {playerScore} - {aiScore}
                    </p>
                  </div>
                  <button
                    onClick={startGame}
                    className="retro-btn px-8 py-3 text-white"
                  >
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
                style={{borderWidth: '3px'}}
              >
                {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
              </button>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-black border-3 border-[#ff10f0] text-[#ff10f0] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wider uppercase"
                style={{borderWidth: '3px'}}
              >
                ⟲ RESTART
              </button>
            </div>

            <div className="border-t-2 border-[#ff10f0]/30 pt-4 mt-4">
              <div className="text-[#00ffff] text-xs tracking-wider space-y-1 font-mono">
                <p>🎮 USE ▲ ▼ ARROW KEYS TO MOVE PADDLE</p>
                <p>⏸ PRESS SPACE TO PAUSE/RESUME</p>
                <p>🏓 FIRST TO 10 POINTS WINS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
