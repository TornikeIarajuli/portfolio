'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  isMusicMuted: boolean;
  volume: number;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Chiptune melody patterns (C major scale notes)
const NOTES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  REST: 0,
};

// Energetic arcade melody pattern - Space Invaders/Pac-Man inspired
const MELODY_PATTERN = [
  // Main hook
  { note: NOTES.C5, duration: 0.12 },
  { note: NOTES.E5, duration: 0.12 },
  { note: NOTES.G5, duration: 0.12 },
  { note: NOTES.C5, duration: 0.12 },
  { note: NOTES.E5, duration: 0.12 },
  { note: NOTES.G5, duration: 0.12 },
  { note: NOTES.B4, duration: 0.12 },
  { note: NOTES.D5, duration: 0.12 },
  { note: NOTES.F5, duration: 0.12 },
  { note: NOTES.B4, duration: 0.12 },
  { note: NOTES.D5, duration: 0.12 },
  { note: NOTES.F5, duration: 0.12 },

  // Ascending run
  { note: NOTES.A4, duration: 0.12 },
  { note: NOTES.C5, duration: 0.12 },
  { note: NOTES.E5, duration: 0.12 },
  { note: NOTES.A5, duration: 0.18 },
  { note: NOTES.REST, duration: 0.06 },
  { note: NOTES.G5, duration: 0.18 },
  { note: NOTES.REST, duration: 0.06 },
  { note: NOTES.F5, duration: 0.18 },
  { note: NOTES.REST, duration: 0.06 },
  { note: NOTES.E5, duration: 0.18 },
  { note: NOTES.REST, duration: 0.06 },

  // Fast arpeggio
  { note: NOTES.D5, duration: 0.08 },
  { note: NOTES.E5, duration: 0.08 },
  { note: NOTES.F5, duration: 0.08 },
  { note: NOTES.G5, duration: 0.08 },
  { note: NOTES.A5, duration: 0.24 },
  { note: NOTES.REST, duration: 0.12 },
  { note: NOTES.G5, duration: 0.12 },
  { note: NOTES.E5, duration: 0.12 },
  { note: NOTES.C5, duration: 0.24 },
  { note: NOTES.REST, duration: 0.12 },
];

// Driving bass line pattern
const BASS_PATTERN = [
  { note: NOTES.C4, duration: 0.12 },
  { note: NOTES.C4, duration: 0.12 },
  { note: NOTES.REST, duration: 0.12 },
  { note: NOTES.C4, duration: 0.12 },
  { note: NOTES.G4, duration: 0.12 },
  { note: NOTES.REST, duration: 0.12 },
  { note: NOTES.F4, duration: 0.12 },
  { note: NOTES.REST, duration: 0.12 },
  { note: NOTES.A4, duration: 0.12 },
  { note: NOTES.A4, duration: 0.12 },
  { note: NOTES.REST, duration: 0.12 },
  { note: NOTES.G4, duration: 0.12 },
];

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(true); // Start muted
  const [volume, setVolumeState] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isLoopingRef = useRef(false);
  const userInteractedRef = useRef(false);

  // Initialize audio context on user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = isMusicMuted ? 0 : volume;
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [volume, isMusicMuted]);

  // Play a single note
  const playNote = useCallback((frequency: number, startTime: number, duration: number, gainNode: GainNode) => {
    if (!audioContextRef.current || frequency === 0) return;

    const oscillator = audioContextRef.current.createOscillator();
    const noteGain = audioContextRef.current.createGain();

    oscillator.type = 'square'; // Classic chiptune sound
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Envelope for more musical sound
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    noteGain.gain.linearRampToValueAtTime(0.2, startTime + duration * 0.5);
    noteGain.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(noteGain);
    noteGain.connect(gainNode);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, []);

  // Play melody and bass loop
  const playLoop = useCallback(() => {
    if (!audioContextRef.current || !masterGainRef.current || !isLoopingRef.current) return;

    const ctx = audioContextRef.current;
    const currentTime = ctx.currentTime;

    // Calculate total duration of one loop
    const melodyDuration = MELODY_PATTERN.reduce((sum, note) => sum + note.duration, 0);

    // Play melody
    let melodyTime = currentTime;
    MELODY_PATTERN.forEach((noteData) => {
      playNote(noteData.note, melodyTime, noteData.duration * 0.9, masterGainRef.current!);
      melodyTime += noteData.duration;
    });

    // Play bass line (repeat to match melody length)
    let bassTime = currentTime;
    const bassDuration = BASS_PATTERN.reduce((sum, note) => sum + note.duration, 0);
    const bassRepeats = Math.ceil(melodyDuration / bassDuration);

    for (let i = 0; i < bassRepeats; i++) {
      BASS_PATTERN.forEach((noteData) => {
        if (bassTime < currentTime + melodyDuration) {
          playNote(noteData.note * 0.5, bassTime, noteData.duration * 0.9, masterGainRef.current!);
          bassTime += noteData.duration;
        }
      });
    }

    // Schedule next loop
    const nextLoopTime = (melodyDuration - 0.1) * 1000;
    setTimeout(() => {
      if (isLoopingRef.current) {
        playLoop();
      }
    }, nextLoopTime);
  }, [playNote]);

  // Start music
  const startMusic = useCallback(() => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true;
    }

    initAudioContext();

    if (!isLoopingRef.current) {
      isLoopingRef.current = true;
      setIsPlaying(true);
      playLoop();
    }
  }, [initAudioContext, playLoop]);

  // Stop music
  const stopMusic = useCallback(() => {
    isLoopingRef.current = false;
    setIsPlaying(false);
  }, []);

  // Toggle music
  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);

    if (masterGainRef.current && !isMusicMuted) {
      masterGainRef.current.gain.setValueAtTime(
        clampedVolume,
        audioContextRef.current?.currentTime || 0
      );
    }
  }, [isMusicMuted]);

  // Update master gain when mute state or volume changes
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMusicMuted ? 0 : volume,
        audioContextRef.current.currentTime
      );
    }
  }, [isMusicMuted, volume]);

  // Auto-start music on first user interaction (click anywhere)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
        initAudioContext();
        // Auto-start music unmuted on first interaction
        setIsMusicMuted(false);
        startMusic();
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initAudioContext, startMusic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isLoopingRef.current = false;
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Toggle mute (separate from stop/start)
  const toggleMute = useCallback(() => {
    setIsMusicMuted(prev => !prev);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMusicMuted,
        volume,
        toggleMusic: toggleMute, // Using mute/unmute instead of play/stop
        setVolume
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useBackgroundMusic must be used within a BackgroundMusicProvider');
  }
  return context;
}
