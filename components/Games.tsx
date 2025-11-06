'use client';

import { useState } from 'react';

interface Game {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  link?: string;
}

export default function Games() {
  const [selectedGame, setSelectedGame] = useState(0);

  const games: Game[] = [
    {
      title: 'Space Shooter',
      description: 'A classic arcade-style space shooter game with modern graphics and smooth gameplay mechanics.',
      image: '🚀',
      technologies: ['Unity', 'C#', 'Blender'],
      features: [
        'Multiple enemy types with unique behaviors',
        'Power-up system for weapon upgrades',
        'Progressive difficulty system',
        'High score tracking and leaderboard',
        'Particle effects and smooth animations',
      ],
    },
    {
      title: 'Puzzle Master',
      description: 'An engaging puzzle game that challenges players with increasingly complex brain teasers.',
      image: '🧩',
      technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3'],
      features: [
        '50+ unique puzzle levels',
        'Hint system for challenging puzzles',
        'Time-based scoring system',
        'Level editor for custom puzzles',
        'Mobile-responsive design',
      ],
    },
    {
      title: 'Strategy Quest',
      description: 'A turn-based strategy game combining resource management with tactical combat.',
      image: '⚔️',
      technologies: ['Python', 'Pygame', 'SQLite'],
      features: [
        'Deep strategic gameplay mechanics',
        'Multiple playable factions',
        'Campaign mode with story',
        'AI opponents with various difficulty levels',
        'Save/load game functionality',
      ],
    },
  ];

  return (
    <section id="games" className="min-h-screen flex items-center py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Game Projects
        </h2>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <button
              key={index}
              onClick={() => setSelectedGame(index)}
              className={`p-6 rounded-xl transition-all duration-300 ${
                selectedGame === index
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 scale-105 shadow-xl shadow-purple-500/50'
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-purple-500/20'
              }`}
            >
              <div className="text-6xl mb-4">{game.image}</div>
              <h3 className={`font-bold text-xl ${selectedGame === index ? 'text-white' : 'text-purple-300'}`}>
                {game.title}
              </h3>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 min-h-[400px]">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">{games[selectedGame].image}</div>
            <h3 className="text-4xl font-bold text-white mb-4">{games[selectedGame].title}</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{games[selectedGame].description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="text-2xl font-semibold text-purple-400 mb-4">Key Features:</h4>
              <ul className="space-y-3">
                {games[selectedGame].features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <svg
                      className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-2xl font-semibold text-purple-400 mb-4">Technologies:</h4>
              <div className="flex flex-wrap gap-3">
                {games[selectedGame].technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm hover:bg-purple-500/30 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <p className="text-gray-300 leading-relaxed">
                  These game projects showcase my ability to work with different technologies and create engaging
                  user experiences. Each project demonstrates problem-solving skills and attention to detail.
                </p>
              </div>

              {games[selectedGame].link && (
                <a
                  href={games[selectedGame].link}
                  className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-purple-500/50"
                >
                  Play Game
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
