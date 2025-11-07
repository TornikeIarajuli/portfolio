'use client';

import { useState, useEffect } from 'react';
import { SoundProvider } from '@/components/SoundEffects';
import { CRTProvider } from '@/components/CRTEffect';
import CoinInsertLoading from '@/components/CoinInsertLoading';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Reset loading on route change
    setShowLoading(true);
  }, []);

  if (showLoading) {
    return <CoinInsertLoading onComplete={() => setShowLoading(false)} />;
  }

  return (
    <CRTProvider>
      <SoundProvider>
        <div className="crt-enabled">
          {children}
        </div>
      </SoundProvider>
    </CRTProvider>
  );
}
