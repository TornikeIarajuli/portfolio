'use client';

import { useEffect, useState } from 'react';

interface Spaceship {
  id: number;
  top: number;
  speed: number;
  type: 'fighter' | 'cruiser' | 'alien' | 'ufo';
  scale: number;
  startPosition: number;
}

export default function SpaceshipBackground() {
  const [spaceships, setSpaceships] = useState<Spaceship[]>([]);

  useEffect(() => {
    // Generate 8 spaceships at random positions along the path
    const types: Array<'fighter' | 'cruiser' | 'alien' | 'ufo'> = ['fighter', 'cruiser', 'alien', 'ufo'];
    const initialSpaceships: Spaceship[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 70 + 10, // 10% to 80% from top
      speed: Math.random() * 10 + 20, // 20-30 seconds
      type: types[Math.floor(Math.random() * types.length)],
      scale: Math.random() * 0.4 + 0.6, // 0.6 to 1.0 scale
      startPosition: Math.random() * 100, // Random start position (0-100%)
    }));
    setSpaceships(initialSpaceships);
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {spaceships.map((ship) => {
          // Calculate animation delay based on start position
          // If ship starts at 50% across screen, it should be 50% through its animation
          const animationProgress = ship.startPosition / 100;
          const animationDelay = -(ship.speed * animationProgress); // Negative delay = already in progress

          return (
            <div
              key={ship.id}
              className="absolute spaceship"
              style={{
                top: `${ship.top}%`,
                animation: `flyAcross ${ship.speed}s linear infinite`,
                animationDelay: `${animationDelay}s`,
                transform: `scale(${ship.scale})`,
              }}
            >
              <div className="spaceship-inner">
                {ship.type === 'fighter' && <FighterShip />}
                {ship.type === 'cruiser' && <CruiserShip />}
                {ship.type === 'alien' && <AlienShip />}
                {ship.type === 'ufo' && <UFOShip />}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes flyAcross {
          0% {
            left: -100px;
          }
          100% {
            left: calc(100% + 100px);
          }
        }

        .spaceship {
          filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6));
          opacity: 0.7;
        }

        .spaceship-inner {
          width: 50px;
          height: 30px;
        }
      `}</style>
    </>
  );
}

// Pixel art spaceships as React components
function FighterShip() {
  return (
    <svg width="50" height="30" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="0" width="8" height="4" fill="#00ffff"/>
      <rect x="12" y="4" width="16" height="4" fill="#00ffff"/>
      <rect x="8" y="8" width="24" height="8" fill="#ff10f0"/>
      <rect x="12" y="16" width="16" height="4" fill="#ff10f0"/>
      <rect x="16" y="20" width="8" height="4" fill="#00ffff"/>
      <rect x="0" y="8" width="8" height="4" fill="#ffff00"/>
      <rect x="32" y="8" width="8" height="4" fill="#ffff00"/>
    </svg>
  );
}

function CruiserShip() {
  return (
    <svg width="60" height="25" viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="0" width="8" height="4" fill="#39ff14"/>
      <rect x="16" y="4" width="16" height="4" fill="#39ff14"/>
      <rect x="8" y="8" width="32" height="4" fill="#00ffff"/>
      <rect x="16" y="12" width="16" height="4" fill="#00ffff"/>
      <rect x="20" y="16" width="8" height="4" fill="#39ff14"/>
      <rect x="0" y="8" width="8" height="4" fill="#ffff00"/>
      <rect x="40" y="8" width="8" height="4" fill="#ffff00"/>
    </svg>
  );
}

function AlienShip() {
  return (
    <svg width="40" height="30" viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="0" width="16" height="4" fill="#ff10f0"/>
      <rect x="4" y="4" width="24" height="4" fill="#ff10f0"/>
      <rect x="0" y="8" width="32" height="8" fill="#ff0088"/>
      <rect x="4" y="16" width="24" height="4" fill="#ff10f0"/>
      <rect x="8" y="20" width="16" height="4" fill="#ff10f0"/>
      <rect x="8" y="8" width="4" height="4" fill="#ffff00"/>
      <rect x="20" y="8" width="4" height="4" fill="#ffff00"/>
    </svg>
  );
}

function UFOShip() {
  return (
    <svg width="45" height="25" viewBox="0 0 36 20" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="0" width="12" height="4" fill="#39ff14"/>
      <rect x="8" y="4" width="20" height="4" fill="#39ff14"/>
      <rect x="4" y="8" width="28" height="4" fill="#00ffff"/>
      <rect x="0" y="12" width="36" height="4" fill="#00ffff"/>
      <rect x="4" y="16" width="4" height="4" fill="#ffff00"/>
      <rect x="14" y="16" width="4" height="4" fill="#ffff00"/>
      <rect x="28" y="16" width="4" height="4" fill="#ffff00"/>
    </svg>
  );
}
