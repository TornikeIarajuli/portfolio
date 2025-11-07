'use client';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = {
    'Global': [
      { keys: ['ESC'], action: 'Close modals / Pause game' },
      { keys: ['SPACE'], action: 'Pause/Resume game' },
      { keys: ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'], action: 'Konami Code (Easter egg)' },
    ],
    'Snake': [
      { keys: ['Arrow Keys'], action: 'Move snake' },
      { keys: ['SPACE'], action: 'Pause game' },
      { keys: ['R'], action: 'Restart game (when game over)' },
    ],
    'Pong': [
      { keys: ['↑', '↓'], action: 'Move paddle' },
      { keys: ['SPACE'], action: 'Pause game' },
    ],
    'Memory': [
      { keys: ['Mouse Click'], action: 'Flip card' },
      { keys: ['SPACE'], action: 'Pause game' },
    ],
    'Tic-Tac-Toe': [
      { keys: ['Mouse Click'], action: 'Place mark' },
    ],
    'Space Invaders': [
      { keys: ['←', '→'], action: 'Move ship' },
      { keys: ['SPACE'], action: 'Shoot / Pause game' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
      <div className="bg-black border-4 border-[#00ffff] neon-border-cyan pixel-corners p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-[#00ffff] tracking-widest" style={{textShadow: '0 0 20px #00ffff'}}>
            ⌨️ KEYBOARD SHORTCUTS
          </h2>
          <button
            onClick={onClose}
            className="text-[#ff10f0] text-4xl hover:scale-110 transition-transform cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts by category */}
        <div className="space-y-6">
          {Object.entries(shortcuts).map(([category, items]) => (
            <div key={category} className="border-2 border-[#ff10f0] p-4">
              <h3 className="text-2xl font-bold text-[#ffff00] tracking-wider mb-4">
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-3 py-1 bg-[#39ff14] text-black font-bold tracking-wider text-sm border-2 border-[#39ff14] shadow-md"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <span className="text-[#00ffff] tracking-wide flex-1 text-right">
                      {shortcut.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div className="mt-6 text-center">
          <p className="text-[#39ff14] text-sm tracking-wider">
            💡 TIP: Press ESC anytime to quickly close any modal
          </p>
        </div>
      </div>
    </div>
  );
}
