'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, GameScore } from '@/lib/gameStats';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [selectedGame, setSelectedGame] = useState('snake');
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);

  const games = [
    { id: 'snake', name: 'SNAKE', icon: '🐍' },
    { id: 'tictactoe', name: 'TIC-TAC-TOE', icon: '❌' },
    { id: 'memory', name: 'MEMORY', icon: '🎴' },
    { id: 'pong', name: 'PONG', icon: '🏓' },
  ];

  useEffect(() => {
    if (isOpen) {
      setLeaderboard(getLeaderboard(selectedGame));
    }
  }, [isOpen, selectedGame]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
          <div className="bg-black border-4 border-[#00ffff] neon-border-cyan pixel-corners p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-[#00ffff] tracking-widest neon-text-cyan">
                📊 LEADERBOARD 📊
              </h2>
              <button
                onClick={onClose}
                className="text-[#ff10f0] text-4xl hover:scale-110 transition-transform cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Game selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`px-4 py-2 font-bold tracking-wider transition-all cursor-pointer ${
                    selectedGame === game.id
                      ? 'bg-[#ff10f0] border-[#ff10f0] text-black'
                      : 'bg-black border-[#ff10f0] text-[#ff10f0] hover:bg-[#ff10f0]/20'
                  } border-3`}
                  style={{ borderWidth: '3px' }}
                >
                  {game.icon} {game.name}
                </button>
              ))}
            </div>

            {/* Leaderboard table */}
            {leaderboard.length > 0 ? (
              <div className="border-3 border-[#39ff14]" style={{ borderWidth: '3px' }}>
                <table className="w-full">
                  <thead className="bg-[#39ff14]/20">
                    <tr>
                      <th className="text-[#ffff00] p-3 text-left font-bold tracking-wider">RANK</th>
                      <th className="text-[#ffff00] p-3 text-left font-bold tracking-wider">PLAYER</th>
                      <th className="text-[#ffff00] p-3 text-left font-bold tracking-wider">SCORE</th>
                      <th className="text-[#ffff00] p-3 text-left font-bold tracking-wider">DATE</th>
                      {leaderboard[0]?.difficulty && (
                        <th className="text-[#ffff00] p-3 text-left font-bold tracking-wider">DIFFICULTY</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={index}
                        className={`border-t-2 border-[#39ff14]/30 ${
                          index < 3 ? 'bg-[#ffff00]/10' : ''
                        }`}
                      >
                        <td className="text-[#00ffff] p-3 font-bold">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </td>
                        <td className="text-[#00ffff] p-3">{entry.playerName}</td>
                        <td className="text-[#ff10f0] p-3 font-bold">{entry.score}</td>
                        <td className="text-[#39ff14] p-3 text-sm">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        {entry.difficulty && (
                          <td className="text-[#ffff00] p-3 text-sm uppercase">{entry.difficulty}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border-3 border-[#ff10f0]/30" style={{ borderWidth: '3px' }}>
                <p className="text-[#00ffff] text-xl tracking-wider">NO SCORES YET</p>
                <p className="text-[#ffff00] mt-2">BE THE FIRST TO SET A RECORD!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
