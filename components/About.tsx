'use client';

export default function About() {
  return (
    <section id="about" className="min-h-screen flex items-center py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Arcade-style section header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block border-4 border-[#00ffff] neon-border-cyan bg-black px-4 sm:px-6 md:px-8 py-2 sm:py-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold neon-text-cyan text-[#00ffff] tracking-widest">
              █ PLAYER STATS █
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left column */}
          <div className="space-y-4 md:space-y-6">
            {/* Summary */}
            <div className="bg-black border-4 border-[#ff10f0] p-4 sm:p-5 md:p-6 pixel-corners">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-[#ffff00] text-lg sm:text-xl">▸</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#ff10f0] tracking-wider">SUMMARY</h3>
              </div>
              <p className="text-[#00ffff] leading-relaxed font-mono text-xs sm:text-sm">
                Experienced Senior QA Engineer with 6+ years specializing in backend testing,
                integration frameworks, and distributed systems. Proven track record in building
                comprehensive Test Automation Frameworks from scratch using Python/Selenium/PyTest.
              </p>
            </div>

            {/* Expertise */}
            <div className="bg-black border-4 border-[#39ff14] p-4 sm:p-5 md:p-6 pixel-corners">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-[#ffff00] text-lg sm:text-xl">▸</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#39ff14] tracking-wider">EXPERTISE</h3>
              </div>
              <p className="text-[#00ffff] leading-relaxed font-mono text-xs sm:text-sm">
                Expert in API testing, database validation, and CI/CD integration with strong
                leadership experience managing QA teams up to 23 members.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4 md:space-y-6">
            {/* Education */}
            <div className="bg-black border-4 border-[#ff10f0] p-4 sm:p-5 md:p-6 pixel-corners">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-[#ffff00] text-lg sm:text-xl">▸</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#ff10f0] tracking-wider">EDUCATION</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="border-l-4 border-[#00ffff] pl-3 md:pl-4">
                  <h4 className="font-bold text-[#ffff00] text-xs sm:text-sm">SAN DIEGO STATE UNIVERSITY GEORGIA</h4>
                  <p className="text-[#39ff14] text-xs sm:text-sm">→ Computer Science</p>
                  <p className="text-[#00ffff] text-xs sm:text-sm">2017 - 2021</p>
                </div>
                <div className="border-l-4 border-[#ff10f0] pl-3 md:pl-4">
                  <h4 className="font-bold text-[#ffff00] text-xs sm:text-sm">
                    TBILISI ACADEMICIAN ILIA VEKUA PUBLIC SCHOOL
                  </h4>
                  <p className="text-[#39ff14] text-xs sm:text-sm">→ Physics and Mathematics</p>
                  <p className="text-[#00ffff] text-xs sm:text-sm">2011 - 2017</p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-black border-4 border-[#39ff14] p-4 sm:p-5 md:p-6 pixel-corners">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-[#ffff00] text-lg sm:text-xl">▸</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#39ff14] tracking-wider">LANGUAGES</h3>
              </div>
              <div className="space-y-2 font-mono text-xs sm:text-sm">
                <div className="flex justify-between text-[#00ffff]">
                  <span>GEORGIAN</span>
                  <span className="text-[#ffff00]">★★★★★ NATIVE</span>
                </div>
                <div className="flex justify-between text-[#00ffff]">
                  <span>ENGLISH</span>
                  <span className="text-[#ffff00]">★★★★☆ C1</span>
                </div>
                <div className="flex justify-between text-[#00ffff]">
                  <span>RUSSIAN</span>
                  <span className="text-[#ffff00]">★★☆☆☆ A2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
