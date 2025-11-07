import { useEffect, useRef } from 'react';

export function useScreenShake() {
  const shakeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the main content div to shake
    shakeRef.current = document.querySelector('.shake-container') as HTMLElement;
  }, []);

  const triggerShake = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!shakeRef.current) return;

    const intensityMap = {
      light: 'shake-light',
      medium: 'shake-medium',
      heavy: 'shake-heavy',
    };

    const shakeClass = intensityMap[intensity];
    shakeRef.current.classList.add(shakeClass);

    setTimeout(() => {
      if (shakeRef.current) {
        shakeRef.current.classList.remove(shakeClass);
      }
    }, 500);
  };

  return { triggerShake };
}
