'use client';

interface Skill {
  name: string;
  icon: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
  color: string;
}

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      name: 'PROGRAMMING LANGUAGES',
      color: '#ff10f0',
      skills: [
        { name: 'Python', icon: '🐍' },
        { name: 'JavaScript', icon: '🟨' },
        { name: 'SQL', icon: '🗄️' },
        { name: 'Bash', icon: '💻' },
      ],
    },
    {
      name: 'TEST AUTOMATION',
      color: '#00ffff',
      skills: [
        { name: 'Selenium', icon: '🌐' },
        { name: 'PyTest', icon: '🧪' },
        { name: 'Appium', icon: '📱' },
        { name: 'TestNG', icon: '✅' },
        { name: 'Postman', icon: '📮' },
        { name: 'Playwright', icon: '🎭' },
        { name: 'Cypress', icon: '🌲' },
      ],
    },
    {
      name: 'TOOLS & FRAMEWORKS',
      color: '#39ff14',
      skills: [
        { name: 'Jenkins', icon: '🔧' },
        { name: 'Git', icon: '📦' },
        { name: 'Jira', icon: '📋' },
        { name: 'TestRail', icon: '🚂' },
        { name: 'Allure Reports', icon: '📊' },
        { name: 'Docker', icon: '🐳' },
        { name: 'Kubernetes', icon: '☸️' },
        { name: 'GitHub Actions', icon: '⚡' },
      ],
    },
    {
      name: 'DATABASES & SYSTEMS',
      color: '#ffff00',
      skills: [
        { name: 'MySQL', icon: '🐬' },
        { name: 'PostgreSQL', icon: '🐘' },
        { name: 'MongoDB', icon: '🍃' },
        { name: 'Linux', icon: '🐧' },
        { name: 'AWS', icon: '☁️' },
        { name: 'GraphQL', icon: '⚡' },
      ],
    },
    {
      name: 'METHODOLOGIES & PRACTICES',
      color: '#b000ff',
      skills: [
        { name: 'Agile/Scrum', icon: '🔄' },
        { name: 'CI/CD', icon: '🚀' },
        { name: 'API Testing', icon: '🔗' },
        { name: 'Performance Testing', icon: '⚡' },
        { name: 'Test Design', icon: '📐' },
        { name: 'Team Leadership', icon: '👥' },
        { name: 'Code Review', icon: '👁️' },
        { name: 'Documentation', icon: '📝' },
      ],
    },
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center py-20 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Arcade header */}
        <div className="text-center mb-12">
          <div className="inline-block border-4 border-[#39ff14] bg-black px-8 py-3">
            <h2 className="text-4xl font-bold text-[#39ff14] tracking-widest" style={{textShadow: '0 0 20px #39ff14'}}>
              ⚔ POWER-UPS ⚔
            </h2>
          </div>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-1 flex-grow" style={{background: `linear-gradient(to right, transparent, ${category.color}, transparent)`}}></div>
                <h3
                  className="text-xl font-bold tracking-wider px-4 py-2 border-4 bg-black uppercase"
                  style={{
                    color: category.color,
                    borderColor: category.color,
                    boxShadow: `0 0 10px ${category.color}`
                  }}
                >
                  {category.name}
                </h3>
                <div className="h-1 flex-grow" style={{background: `linear-gradient(to right, ${category.color}, transparent)`}}></div>
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="bg-black border-3 p-4 text-center transition-all duration-200 hover:scale-110 pixel-corners"
                    style={{
                      borderWidth: '3px',
                      borderColor: category.color,
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="text-3xl mb-2">
                      {skill.icon}
                    </div>
                    <h4
                      className="font-bold text-xs tracking-wide uppercase"
                      style={{color: category.color}}
                    >
                      {skill.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Arcade-style score footer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-black border-4 border-[#ffff00] px-8 py-3">
            <p className="text-[#ffff00] font-bold tracking-widest" style={{textShadow: '0 0 10px #ffff00'}}>
              TOTAL SKILLS: {skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
