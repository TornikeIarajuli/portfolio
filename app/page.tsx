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
import KonamiCode from '@/components/KonamiCode';
import { SoundProvider } from '@/components/SoundEffects';
import ScrollAnimation from '@/components/ScrollAnimation';
import AchievementsModal from '@/components/AchievementsModal';
import LeaderboardModal from '@/components/LeaderboardModal';
import PlayerNamePrompt from '@/components/PlayerNamePrompt';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [playerNameOpen, setPlayerNameOpen] = useState(false);

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
    <SoundProvider>
      <LoadingScreen />
      <BackgroundParticles />
      <KonamiCode />
      <AchievementsModal isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
      <PlayerNamePrompt isOpen={playerNameOpen} onClose={() => setPlayerNameOpen(false)} />

      <div className="min-h-screen bg-[#0a0014] retro-grid scanlines relative">
        <Navigation
          activeSection={activeSection}
          onOpenAchievements={() => setAchievementsOpen(true)}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
          onOpenPlayerName={() => setPlayerNameOpen(true)}
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
  );
}
