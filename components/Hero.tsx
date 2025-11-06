'use client';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative pt-16"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Arcade-style header */}
          <div className="mb-8">
            <div className="inline-block px-8 py-2 bg-black border-4 border-[#ff10f0] neon-border mb-4">
              <p className="text-[#00ffff] text-sm tracking-widest font-bold">PLAYER 01</p>
            </div>
          </div>

          {/* Main title with neon glow */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text text-[#ff10f0] tracking-wider" style={{fontFamily: 'Courier New, monospace'}}>
            TORNIKE<br/>IARAJULI
          </h1>

          {/* Subtitle with different neon color */}
          <div className="mb-4">
            <p className="text-2xl md:text-4xl neon-text-cyan text-[#00ffff] font-bold tracking-wide mb-2">
              &gt; QA CHAPTER LEAD
            </p>
            <p className="text-[#39ff14] text-lg tracking-wider">
              ▸ 6+ YEARS EXPERIENCE ▸ TEST AUTOMATION ▸ TEAM LEADERSHIP
            </p>
          </div>

          {/* Score-style divider */}
          <div className="my-8 flex items-center justify-center gap-4">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#ff10f0] to-transparent"></div>
            <span className="text-[#ffff00] text-2xl">★</span>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#ff10f0] to-transparent"></div>
          </div>

          {/* Arcade buttons */}
          <div className="flex gap-6 justify-center mt-12">
            <a
              href="#contact"
              className="retro-btn px-8 py-4 text-white"
            >
              ▶ START
            </a>
            <a
              href="#experience"
              className="px-8 py-4 border-4 border-[#00ffff] neon-border-cyan bg-black text-[#00ffff] font-bold tracking-wider uppercase hover:bg-[#00ffff] hover:text-black transition-all duration-300"
            >
              ⊕ INSERT COIN
            </a>
          </div>

          {/* High score style text */}
          <div className="mt-12 text-[#ffff00] text-sm tracking-widest">
            <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            <p className="my-2">HIGH SCORE: EXCELLENCE IN QA</p>
            <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
          </div>
        </div>
      </div>

      {/* Pixel-style scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-[#ff10f0] text-2xl">▼</div>
      </div>
    </section>
  );
}
