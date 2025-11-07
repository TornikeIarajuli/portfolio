'use client';

import { SoundProvider } from '@/components/SoundEffects';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SoundProvider>{children}</SoundProvider>;
}
