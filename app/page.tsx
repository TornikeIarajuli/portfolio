'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/LoadingScreen';
import BackgroundParticles from '@/components/BackgroundParticles';
import SpaceshipBackground from '@/components/SpaceshipBackground';
import KonamiCode from '@/components/KonamiCode';
import EasterEggs from '@/components/EasterEggs';
import { SoundProvider } from '@/components/SoundEffects';
import { CRTProvider } from '@/components/CRTEffect';
import ScrollAnimation from '@/components/ScrollAnimation';
import AchievementsModal from '@/components/AchievementsModal';
import LeaderboardModal from '@/components/LeaderboardModal';
import PlayerNamePrompt from '@/components/PlayerNamePrompt';
import ShortcutsModal from '@/components/ShortcutsModal';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [playerNameOpen, setPlayerNameOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CRTProvider>
      <SoundProvider>
        <LoadingScreen />
        <BackgroundParticles />
        <SpaceshipBackground />
        <KonamiCode />
        <EasterEggs />
        <AchievementsModal isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
        <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
        <PlayerNamePrompt isOpen={playerNameOpen} onClose={() => setPlayerNameOpen(false)} />
        <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

        <div className="min-h-screen bg-[#0a0014] retro-grid scanlines relative crt-enabled">
          <Navigation
            activeSection={activeSection}
            onOpenAchievements={() => setAchievementsOpen(true)}
            onOpenLeaderboard={() => setLeaderboardOpen(true)}
            onOpenPlayerName={() => setPlayerNameOpen(true)}
            onOpenShortcuts={() => setShortcutsOpen(true)}
          />

        <Hero />

        <ScrollAnimation delay={100}>
          <About />
        </ScrollAnimation>

        <ScrollAnimation delay={200}>
          <Experience />
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <Skills />
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <Contact />
        </ScrollAnimation>
      </div>
    </SoundProvider>
  </CRTProvider>
  );
}
