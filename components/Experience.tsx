'use client';

import { useState } from 'react';

interface Job {
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  tools: string[];
}

export default function Experience() {
  const [selectedJob, setSelectedJob] = useState(0);

  const jobs: Job[] = [
    {
      title: 'QA CHAPTER LEAD',
      company: 'Making Science • Sweeft',
      period: 'Oct 2023 - Present',
      description: 'Leading QA chapter activities and mentoring team members',
      achievements: [
        'Managed chapter activities for 23 members, increasing participation by 40%',
        'Mentored 5 interns and created personalized development plans, resulting in 3 full-time hires',
        'Authored comprehensive programming guide that reduced onboarding time by 65%',
        'Built test automation framework from scratch using Pytest/Selenium, cutting QA cycle time by 70%',
        'Developed test plans for 8 projects, achieving 97% test coverage',
        'Collaborated with clients daily, conducting UAT that improved satisfaction ratings by 32%',
        'Maintained Java codebase for gambling project, resolving 45+ critical bugs and reducing system crashes by 88%'
      ],
      tools: ['Python', 'Selenium', 'Pytest', 'Java', 'Jira', 'TestRail']
    },
    {
      title: 'SENIOR QA ENGINEER',
      company: 'Pangea IT',
      period: 'May 2022 - Oct 2023',
      description: 'Architected test automation framework and performed comprehensive testing',
      achievements: [
        'Architected TAF from scratch using Python, Selenium, PyTest, unittest with Page Object Model pattern',
        'Integrated Allure Reports and Jenkins for automated test reporting and CI/CD pipeline visibility',
        'Performed API contract testing using Postman, Swagger, validated JSON/XML responses',
        'Built 500+ regression test cases in TestRail; created UAT acceptance criteria documentation',
        'Executed on-site UAT with clients, documenting change requests and defects in Jira'
      ],
      tools: ['Python', 'Selenium', 'PyTest', 'Postman', 'Swagger', 'TestRail', 'Jira', 'Allure', 'Jenkins']
    },
    {
      title: 'SENIOR AUTOMATION ENGINEER',
      company: 'EPAM Systems',
      period: 'March 2022 - October 2022',
      description: 'Enhanced PyTest TAF for video streaming applications',
      achievements: [
        'Enhanced existing PyTest TAF for video streaming application; maintained 85% test stability',
        'Validated streaming protocols using ffmpeg, VLC, Charles Proxy for performance and quality testing',
        'Collaborated with PM on sprint planning, resource allocation, and cross-team coordination',
        'Organized technical documentation and test artifacts in Confluence'
      ],
      tools: ['PyTest', 'ffmpeg', 'VLC', 'Charles Proxy', 'Confluence', 'Jira', 'Git']
    },
    {
      title: 'QA MANAGER',
      company: 'Xunison',
      period: 'February 2021 - April 2022',
      description: 'Managed QA team and developed automation suite for IoT platform',
      achievements: [
        'Managed team of 9 QA engineers; established testing standards and sprint workflows',
        'Developed backend automation suite using Python, Bash scripts for IoT platform APIs',
        'Created and maintained test plans, RTM, and 1,200+ test cases in QA Touch',
        'Built monitoring dashboards using Grafana, Prometheus to track defect trends and test metrics',
        'Developed mobile TAF using Appium, Java, TestNG for Android/iOS regression testing'
      ],
      tools: ['Python', 'Bash', 'REST Assured', 'QA Touch', 'Grafana', 'Prometheus', 'Appium', 'Java', 'TestNG', 'Git']
    },
    {
      title: 'SOFTWARE TESTER',
      company: 'Exactpro Systems',
      period: 'January 2019 - February 2021',
      description: 'Tested high-frequency trading systems for major stock exchanges',
      achievements: [
        'Tested high-frequency trading systems (London Stock Exchange, Turquoise, Borsa Italiana) in 120+ person team',
        'Executed regression, smoke, and ad-hoc testing using Sailfish, ClearTH, Shsha automation frameworks',
        'Analyzed FIX protocol messages and market data feeds for trading venue integrations',
        'Built Python-based coverage analysis models using MySQL Workbench, HeidiSQL; queried trade databases',
        'Created test scenarios from business requirements, documented defects with detailed repro steps'
      ],
      tools: ['Sailfish', 'ClearTH', 'Python', 'MySQL', 'HeidiSQL', 'Jira', 'SVN']
    }
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Arcade header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block border-4 border-[#ff10f0] neon-border bg-black px-4 sm:px-6 md:px-8 py-2 sm:py-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold neon-text text-[#ff10f0] tracking-widest">
              ◀ LEVEL SELECT ▶
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Job selector - arcade machine style */}
          <div className="lg:w-1/3">
            <div className="space-y-2 md:space-y-3">
              {jobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedJob(index)}
                  className={`w-full text-left p-3 sm:p-4 transition-all duration-200 font-bold tracking-wide border-4 ${
                    selectedJob === index
                      ? 'bg-[#ff10f0] border-[#ff10f0] text-black scale-105 neon-border'
                      : 'bg-black border-[#00ffff] text-[#00ffff] hover:border-[#ff10f0] hover:text-[#ff10f0]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{selectedJob === index ? '▶' : '▸'}</span>
                    <div>
                      <h3 className="text-xs sm:text-sm mb-1">{job.title}</h3>
                      <p className={`text-[10px] sm:text-xs ${selectedJob === index ? 'text-black/80' : 'text-[#39ff14]'}`}>
                        {job.company}
                      </p>
                      <p className={`text-[10px] sm:text-xs ${selectedJob === index ? 'text-black/70' : 'text-[#ffff00]'}`}>
                        {job.period}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Job details - arcade screen */}
          <div className="lg:w-2/3">
            <div className="bg-black border-4 border-[#00ffff] neon-border-cyan p-4 sm:p-6 md:p-8 pixel-corners min-h-[400px] md:min-h-[600px]">
              {/* Title */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ff10f0] neon-text mb-2 tracking-wide">{jobs[selectedJob].title}</h3>
                <p className="text-[#00ffff] text-base sm:text-lg md:text-xl mb-1">{jobs[selectedJob].company}</p>
                <p className="text-[#39ff14] font-mono text-xs sm:text-sm md:text-base">{jobs[selectedJob].period}</p>
              </div>

              <p className="text-[#ffff00] mb-4 md:mb-6 font-mono text-xs sm:text-sm">{jobs[selectedJob].description}</p>

              {/* Achievements */}
              <div className="mb-4 md:mb-6">
                <h4 className="text-base sm:text-lg font-bold text-[#ff10f0] mb-3 md:mb-4 tracking-wider flex items-center gap-2">
                  <span>★</span> ACHIEVEMENTS
                </h4>
                <ul className="space-y-1.5 md:space-y-2">
                  {jobs[selectedJob].achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2 md:gap-3 text-[#00ffff] font-mono text-[10px] sm:text-xs md:text-sm">
                      <span className="text-[#39ff14] mt-0.5 md:mt-1">▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#ff10f0] mb-3 md:mb-4 tracking-wider flex items-center gap-2">
                  <span>⚙</span> TECH STACK
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {jobs[selectedJob].tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-[#ff10f0] text-black font-bold text-[10px] sm:text-xs tracking-wide border-2 border-[#ff10f0] hover:bg-black hover:text-[#ff10f0] transition-all duration-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
