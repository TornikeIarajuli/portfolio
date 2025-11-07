'use client';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  score?: number;
  stats?: Array<{ label: string; value: string | number }>;
}

export default function PauseMenu({ isOpen, onResume, onRestart, onQuit, score, stats }: PauseMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
      <div className="bg-black border-4 border-[#ffff00] pixel-corners p-8 min-w-[400px]" style={{ boxShadow: '0 0 30px #ffff00' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-5xl font-bold text-[#ffff00] mb-2 tracking-widest" style={{ textShadow: '0 0 20px #ffff00' }}>
            ⏸ PAUSED
          </h2>
          <p className="text-[#00ffff] tracking-wider text-sm">GAME SUSPENDED</p>
        </div>

        {/* Current Stats */}
        {(score !== undefined || stats) && (
          <div className="mb-6 bg-black border-4 border-[#00ffff] p-4">
            <h3 className="text-[#00ffff] text-center font-bold tracking-wider mb-3 text-sm">CURRENT SESSION</h3>
            <div className="space-y-2">
              {score !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-[#39ff14] tracking-wide text-sm">SCORE:</span>
                  <span className="text-[#ffff00] font-bold tracking-widest text-lg" style={{ textShadow: '0 0 10px #ffff00' }}>
                    {typeof score === 'number' ? score.toString().padStart(5, '0') : score}
                  </span>
                </div>
              )}
              {stats?.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#39ff14] tracking-wide text-sm">{stat.label}:</span>
                  <span className="text-[#00ffff] font-bold tracking-wider">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={onResume}
            className="w-full px-6 py-4 bg-black border-4 border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black transition-all duration-200 font-bold tracking-wider text-lg"
            style={{ boxShadow: '0 0 10px #39ff14' }}
          >
            ▶ RESUME GAME
          </button>
          <button
            onClick={onRestart}
            className="w-full px-6 py-3 bg-black border-3 border-[#ff10f0] text-[#ff10f0] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wider"
            style={{ borderWidth: '3px' }}
          >
            ⟲ RESTART
          </button>
          <button
            onClick={onQuit}
            className="w-full px-6 py-3 bg-black border-3 border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000] hover:text-black transition-all duration-200 font-bold tracking-wider"
            style={{ borderWidth: '3px' }}
          >
            ✕ QUIT TO MENU
          </button>
        </div>

        {/* Tip */}
        <div className="text-center border-t-2 border-[#ffff00]/30 pt-4">
          <p className="text-[#00ffff] text-xs tracking-wider">
            💡 PRESS <kbd className="px-2 py-1 bg-[#39ff14] text-black font-bold text-xs">SPACE</kbd> OR <kbd className="px-2 py-1 bg-[#39ff14] text-black font-bold text-xs">ESC</kbd> TO RESUME
          </p>
        </div>
      </div>
    </div>
  );
}
