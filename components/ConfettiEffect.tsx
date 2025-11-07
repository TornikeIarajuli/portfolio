'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = ['#ff10f0', '#00ffff', '#ffff00', '#39ff14', '#b000ff'];

export default function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!trigger) return;

    // Create particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setParticles(newParticles);
    setOpacity(1);

    // Animate particles
    const animationFrames = 120;
    let frame = 0;

    const animate = () => {
      frame++;

      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.3, // Gravity
          rotation: particle.rotation + particle.rotationSpeed,
        }))
      );

      setOpacity(Math.max(0, 1 - frame / 120));

      if (frame < animationFrames) {
        requestAnimationFrame(animate);
      } else {
        setParticles([]);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            boxShadow: `0 0 10px ${particle.color}`,
            transition: 'opacity 0.3s',
            opacity: opacity,
          }}
        />
      ))}
    </div>
  );
}
