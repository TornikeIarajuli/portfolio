'use client';

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative pt-16 px-4"
    >
      <div className="container mx-auto px-6 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Arcade-style header */}
          <div className="mb-8 sm:mb-8">
            <div className="inline-block px-6 sm:px-8 py-3 bg-black border-3 sm:border-4 border-[#ff10f0] neon-border mb-4">
              <p className="text-[#00ffff] text-sm sm:text-sm tracking-widest font-bold">PLAYER 01</p>
            </div>
          </div>

          {/* Main title with neon glow */}
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-6 neon-text text-[#ff10f0] tracking-wider leading-tight" style={{fontFamily: 'Courier New, monospace'}}>
            TORNIKE<br/>IARAJULI
          </h1>

          {/* Subtitle with different neon color */}
          <div className="mb-6 px-4">
            <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl neon-text-cyan text-[#00ffff] font-bold tracking-wide mb-3">
              &gt; QA CHAPTER LEAD
            </p>
            <p className="text-[#39ff14] text-base sm:text-base md:text-lg tracking-wider break-words leading-relaxed">
              <span className="hidden sm:inline">▸ 6+ YEARS EXPERIENCE ▸ TEST AUTOMATION ▸ TEAM LEADERSHIP</span>
              <span className="sm:hidden">6+ YEARS<br/>TEST AUTOMATION<br/>TEAM LEADERSHIP</span>
            </p>
          </div>

          {/* Score-style divider */}
          <div className="my-8 sm:my-8 flex items-center justify-center gap-3 sm:gap-4">
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-transparent via-[#ff10f0] to-transparent"></div>
            <span className="text-[#ffff00] text-2xl sm:text-2xl">★</span>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-transparent via-[#ff10f0] to-transparent"></div>
          </div>

          {/* Arcade buttons */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center mt-10 sm:mt-12 px-4">
            <a
              href="#contact"
              className="retro-btn px-8 sm:px-8 py-4 sm:py-4 text-white text-base sm:text-base font-bold tracking-wider"
            >
              ▶ START
            </a>
            <a
              href="#experience"
              className="px-8 sm:px-8 py-4 sm:py-4 border-3 sm:border-4 border-[#00ffff] neon-border-cyan bg-black text-[#00ffff] font-bold tracking-wider uppercase hover:bg-[#00ffff] hover:text-black transition-all duration-300 text-base sm:text-base"
              style={{borderWidth: '3px'}}
            >
              ⊕ INSERT COIN
            </a>
          </div>

          {/* High score style text */}
          <div className="mt-10 sm:mt-12 text-[#ffff00] text-sm sm:text-sm tracking-widest overflow-hidden px-4">
            <p className="truncate">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            <p className="my-2 text-sm sm:text-sm">HIGH SCORE: EXCELLENCE IN QA</p>
            <p className="truncate">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
          </div>
        </div>
      </div>

      {/* Pixel-style scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-[#ff10f0] text-2xl sm:text-2xl">▼</div>
      </div>
    </section>
  );
}
