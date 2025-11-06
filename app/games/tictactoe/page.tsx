'use client';

import { useState } from 'react';
import Link from 'next/link';

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],             // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);

  const checkWinner = (board: Board): { winner: Player; line: number[] } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combo };
      }
    }
    return { winner: null, line: [] };
  };

  const getAIMove = (board: Board): number => {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board];
        testBoard[i] = 'O';
        if (checkWinner(testBoard).winner === 'O') {
          return i;
        }
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const testBoard = [...board];
        testBoard[i] = 'X';
        if (checkWinner(testBoard).winner === 'X') {
          return i;
        }
      }
    }

    // Take center if available
    if (!board[4]) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((i) => !board[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const availableSpaces = board.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1);
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores((prev) => ({ ...prev, [result.winner as 'X' | 'O']: prev[result.winner as 'X' | 'O'] + 1 }));
      return;
    }

    if (newBoard.every((cell) => cell !== null)) {
      setIsDraw(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // AI move
    if (gameMode === 'ai' && nextPlayer === 'O') {
      setTimeout(() => {
        const aiMove = getAIMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);

        const aiResult = checkWinner(aiBoard);
        if (aiResult.winner) {
          setWinner(aiResult.winner);
          setWinningLine(aiResult.line);
          setScores((prev) => ({ ...prev, O: prev.O + 1 }));
          return;
        }

        if (aiBoard.every((cell) => cell !== null)) {
          setIsDraw(true);
          setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
          return;
        }

        setCurrentPlayer('X');
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
  };

  const resetAll = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
    setGameMode(null);
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6">
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
                TIC-TAC-TOE ARCADE
              </h1>
            </div>

            <p className="text-xl text-[#ffff00] mb-8 tracking-wider font-bold">▸ SELECT GAME MODE ◂</p>

            <div className="space-y-4">
              <button
                onClick={() => setGameMode('pvp')}
                className="w-full retro-btn px-8 py-6 text-white text-xl"
              >
                ▶ PLAYER VS PLAYER
              </button>
              <button
                onClick={() => setGameMode('ai')}
                className="w-full px-8 py-6 bg-black border-4 border-[#00ffff] neon-border-cyan text-[#00ffff] font-bold text-xl tracking-widest uppercase hover:bg-[#00ffff] hover:text-black transition-all duration-300"
              >
                ▶ PLAYER VS AI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0014] retro-grid scanlines flex items-center justify-center p-6">
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
                ❌ TIC-TAC-TOE ⭕
              </h1>
            </div>

            {/* Score display */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="bg-black border-4 border-[#ff10f0] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">PLAYER X</p>
                <p className="text-3xl font-bold text-[#ff10f0] tracking-widest" style={{textShadow: '0 0 15px #ff10f0'}}>
                  {scores.X.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="bg-black border-4 border-[#ffff00] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">DRAWS</p>
                <p className="text-3xl font-bold text-[#ffff00] tracking-widest" style={{textShadow: '0 0 15px #ffff00'}}>
                  {scores.draws.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="bg-black border-4 border-[#00ffff] px-6 py-3">
                <p className="text-xs text-[#00ffff] tracking-wider mb-1">PLAYER O</p>
                <p className="text-3xl font-bold text-[#00ffff] tracking-widest" style={{textShadow: '0 0 15px #00ffff'}}>
                  {scores.O.toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Current player */}
            {!winner && !isDraw && (
              <div className="inline-block bg-black border-3 px-6 py-2" style={{borderWidth: '3px', borderColor: currentPlayer === 'X' ? '#ff10f0' : '#00ffff', borderStyle: 'solid'}}>
                <p className="text-xl font-bold tracking-widest" style={{color: currentPlayer === 'X' ? '#ff10f0' : '#00ffff'}}>
                  ▸ CURRENT: {currentPlayer} ◂
                </p>
              </div>
            )}
          </div>

          {/* Game board */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-3 p-6 bg-black border-4 border-[#39ff14]" style={{boxShadow: '0 0 20px #39ff14'}}>
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={!!cell || !!winner || isDraw}
                  className={`w-24 h-24 md:w-28 md:h-28 text-5xl font-bold transition-all duration-200 border-4 ${
                    winningLine.includes(index)
                      ? 'bg-[#39ff14] border-[#39ff14] text-black animate-pulse'
                      : cell
                      ? 'bg-black'
                      : 'bg-black hover:bg-[#ff10f0]/20 hover:scale-105 border-gray-700'
                  } ${
                    cell === 'X'
                      ? 'text-[#ff10f0] border-[#ff10f0]'
                      : cell === 'O'
                      ? 'text-[#00ffff] border-[#00ffff]'
                      : 'text-gray-800 border-gray-800'
                  } disabled:cursor-not-allowed`}
                  style={cell ? {textShadow: `0 0 20px ${cell === 'X' ? '#ff10f0' : '#00ffff'}`} : {}}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>

          {/* Win/Draw message */}
          {(winner || isDraw) && (
            <div className="text-center mb-6 p-6 bg-black border-4 border-[#ffff00]" style={{boxShadow: '0 0 20px #ffff00'}}>
              {winner && (
                <>
                  <h2 className="text-4xl font-bold mb-2 tracking-widest" style={{color: winner === 'X' ? '#ff10f0' : '#00ffff', textShadow: `0 0 20px ${winner === 'X' ? '#ff10f0' : '#00ffff'}`}}>
                    PLAYER {winner} WINS!
                  </h2>
                  <p className="text-[#39ff14] text-2xl">★ VICTORY ★</p>
                </>
              )}
              {isDraw && (
                <>
                  <h2 className="text-4xl font-bold text-[#ffff00] mb-2 tracking-widest" style={{textShadow: '0 0 20px #ffff00'}}>
                    DRAW GAME!
                  </h2>
                  <p className="text-[#00ffff] text-xl">TRY AGAIN</p>
                </>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="retro-btn px-8 py-3 text-white"
            >
              ▶ NEW ROUND
            </button>
            <button
              onClick={resetAll}
              className="px-8 py-3 bg-black border-3 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all duration-200 font-bold tracking-wider uppercase"
              style={{borderWidth: '3px'}}
            >
              ⟲ CHANGE MODE
            </button>
          </div>

          {/* Mode indicator */}
          <div className="text-center mt-6">
            <div className="inline-block bg-black border-2 border-[#ff10f0]/50 px-4 py-2">
              <p className="text-[#00ffff] text-sm tracking-wider font-mono">
                MODE: {gameMode === 'pvp' ? 'PVP' : 'VS AI'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
