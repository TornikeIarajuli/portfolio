'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface CRTContextType {
  crtEnabled: boolean;
  toggleCRT: () => void;
}

const CRTContext = createContext<CRTContextType | undefined>(undefined);

export function CRTProvider({ children }: { children: ReactNode }) {
  const [crtEnabled, setCRTEnabled] = useState(false);

  useEffect(() => {
    // Load CRT preference from localStorage
    const saved = localStorage.getItem('crt_enabled');
    if (saved !== null) {
      setCRTEnabled(saved === 'true');
    }
  }, []);

  const toggleCRT = useCallback(() => {
    setCRTEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem('crt_enabled', String(newValue));
      return newValue;
    });
  }, []);

  return (
    <CRTContext.Provider value={{ crtEnabled, toggleCRT }}>
      {children}
      {crtEnabled && (
        <style jsx global>{`
          /* CRT Screen curvature */
          .crt-enabled {
            animation: flicker 0.15s infinite;
          }

          .crt-enabled::before {
            content: " ";
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
          }

          .crt-enabled::after {
            content: " ";
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: rgba(18, 16, 16, 0.1);
            opacity: 0;
            z-index: 2;
            pointer-events: none;
            animation: flicker 0.15s infinite;
          }

          @keyframes flicker {
            0% {
              opacity: 0.27861;
            }
            5% {
              opacity: 0.34769;
            }
            10% {
              opacity: 0.23604;
            }
            15% {
              opacity: 0.90626;
            }
            20% {
              opacity: 0.18128;
            }
            25% {
              opacity: 0.83891;
            }
            30% {
              opacity: 0.65583;
            }
            35% {
              opacity: 0.67807;
            }
            40% {
              opacity: 0.26559;
            }
            45% {
              opacity: 0.84693;
            }
            50% {
              opacity: 0.96019;
            }
            55% {
              opacity: 0.08594;
            }
            60% {
              opacity: 0.20313;
            }
            65% {
              opacity: 0.71988;
            }
            70% {
              opacity: 0.53455;
            }
            75% {
              opacity: 0.37288;
            }
            80% {
              opacity: 0.71428;
            }
            85% {
              opacity: 0.70419;
            }
            90% {
              opacity: 0.7003;
            }
            95% {
              opacity: 0.36108;
            }
            100% {
              opacity: 0.24387;
            }
          }

          /* Screen curvature - subtle */
          .crt-enabled {
            perspective: 1000px;
          }
        `}</style>
      )}
    </CRTContext.Provider>
  );
}

export function useCRT() {
  const context = useContext(CRTContext);
  if (context === undefined) {
    throw new Error('useCRT must be used within a CRTProvider');
  }
  return context;
}
