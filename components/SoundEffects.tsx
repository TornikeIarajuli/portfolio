'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: 'click' | 'hover' | 'success' | 'error') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playSound = useCallback(
    (type: 'click' | 'hover' | 'success' | 'error') => {
      if (isMuted) return;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different sound types
      switch (type) {
        case 'click':
          oscillator.frequency.value = 800;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'hover':
          oscillator.frequency.value = 600;
          gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
        case 'success':
          oscillator.frequency.value = 1000;
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'error':
          oscillator.frequency.value = 200;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
      }
    },
    [isMuted]
  );

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
      {/* Mute toggle button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 bg-black border-3 border-[#ff10f0] px-4 py-3 text-[#ff10f0] hover:bg-[#ff10f0] hover:text-black transition-all duration-200 font-bold tracking-wider pixel-corners shadow-lg"
        style={{ borderWidth: '3px', zIndex: 9999 }}
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? '🔇 MUTED' : '🔊 SOUND'}
      </button>
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
