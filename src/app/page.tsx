'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Position {
  x: number;
  y: number;
}

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

const CustomCursor = ({ className }: { className?: string }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    let frame: number;
    let currentPosition = { x: 0, y: 0 };
    let targetPosition = { x: 0, y: 0 };

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      currentPosition.x = lerp(currentPosition.x, targetPosition.x, 0.2);
      currentPosition.y = lerp(currentPosition.y, targetPosition.y, 0.2);
      
      setPosition(currentPosition);
      frame = requestAnimationFrame(animate);
    };

    const updateCursor = (e: MouseEvent) => {
      targetPosition = { x: e.clientX, y: e.clientY };
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') || 
                         target.closest('a');
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', updateHoverState);
    frame = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', updateHoverState);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div 
      className={`fixed w-8 h-8 rounded-full border-2 pointer-events-none z-50 transition-transform duration-75 ease-out ${
        isHovering ? 'scale-150 bg-gray-300/30 border-black/80' : 'scale-100 border-black'
      } ${className || ''}`}
      style={{ 
        transform: `translate(${position.x - 16}px, ${position.y - 16}px)`
      }}
    />
  );
};

const contentVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
      staggerChildren: 0.05
    }
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

const itemVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
  }
};

const navButtonClass = `
  block text-left whitespace-nowrap 
  hover:opacity-50 transition-all duration-300 
  py-2 px-1 md:px-0
  cursor-none text-base
`;

const contactLinkClass = `
  flex items-center gap-3 
  hover:opacity-50 transition-all duration-300 
  cursor-none py-1
`;

export default function Home() {
  const [activeSection, setActiveSection] = useState<'about' | 'career' | 'research' | 'blog' | 'things'>('about');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog-posts');
        const posts = await response.json();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      }
    };

    fetchBlogPosts();
  }, []);

  const content = {
    about: "Building AI systems that scale.",
    career: [
      {
        company: "Conduct AI",
        role: "Product Engineer Intern",
        period: "Dec 2023 - Present",
        description: "Building AI transparency tools for enterprise ABAP systems, focusing on code comprehension and documentation generation."
      },
      {
        company: "Nustom",
        role: "Software Engineer Intern",
        period: "Jul 2023 - Aug 2023",
        description: "Setup automated error correction for AI generated typescript code, achieving 100% resolution rates across GPT-4 and Claude models."
      },
      {
        company: "XTX Markets",
        role: "Risk Intern",
        period: "Aug 2022 - Sep 2022",
        description: "Developed production Python software for market risk analysis, processing daily PnL data for one of the world's largest algorithmic trading firms."
      }
    ],
    research: {
      current: {
        title: "General Deep Learning Research",
        place: "Cambridge Geometric Deep Learning Lab",
        period: "Jan 2024 - Present",
        description: "Working under Prof. Pietro Lio. Currently exploring VLA models for robotics.  Prev. worked on diffusion for graph generation."
      },
      publications: [
        {
          title: "Decision Transformers in Chess",
          venue: "King's College, Cambridge",
          period: "Jul 2023 - Sep 2023",
          description: "Investigated limitations of decision transformers in Markovian environments, focusing on chess gameplay analysis."
        }
      ]
    },
    projects: [
      {
        title: "Cambridge University AI Society",
        role: "Vice President & Co-Founder",
        period: "2023 - Present",
        description: "Building the most talent dense community in Cambridge."
      },
      {
        title: "CodeSec CIC",
        role: "Founder",
        period: "2021 - 2023",
        description: "Led global CS education initiative with 200+ participants across three continents, focusing on increasing diversity in tech."
      }
    ]
  };

  return (
    <div className={`min-h-screen cursor-none font-light transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
      <CustomCursor className="hidden md:block" />
      
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 md:top-8 md:right-8 p-2 rounded-full cursor-none transition-colors ${
          isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
        }`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={`
        fixed top-0 left-0 w-full md:w-64 md:h-screen 
        p-4 md:p-8 
        border-b md:border-r md:border-b-0 
        bg-opacity-80 backdrop-blur-sm
        z-40
        transition-colors ${isDark ? 'border-gray-800' : 'border-gray-100'}
      `}>
        <div className="md:mb-32 mb-4">
          <h1 className="text-xl mb-1">Vedaangh Rungta</h1>
          <p className="text-sm text-gray-500">Cambridge University</p>
        </div>

        <nav className="flex md:block space-x-6 md:space-x-0 md:space-y-4 overflow-x-auto pb-2 md:pb-0">
          {(['about', 'career', 'research', 'blog', 'things'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`${navButtonClass} ${
                activeSection === section ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {section === 'things' ? "things I'm a part of" : section}
            </button>
          ))}
        </nav>
      </div>

      <main className="pt-32 md:pt-8 md:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto md:ml-32 md:mt-32">
          <AnimatePresence mode="wait">
            {activeSection === 'about' && (
              <motion.div
                key="about"
                initial="exit"
                animate="enter"
                exit="exit"
                variants={contentVariants}
                className="space-y-8"
              >
                <h2 className="text-4xl md:text-6xl font-light leading-tight">
                  Hey, I'm{' '}
                  <span 
                    className="relative inline-block cursor-none"
                    onMouseEnter={(e) => {
                      const suffix = e.currentTarget.querySelector('.suffix') as HTMLSpanElement;
                      const fullstop = e.currentTarget.nextElementSibling;
                      if (!suffix || !fullstop) return;
                      
                      // Hide fullstop immediately
                      fullstop.classList.add('opacity-0');
                      
                      let i = 1;
                      const suffixText = 'aangh';
                      let typingInterval: NodeJS.Timeout;
                      
                      const typeNextLetter = () => {
                        suffix.textContent = suffixText.slice(0, i);
                        i++;
                        if (i > suffixText.length) {
                          clearInterval(typingInterval);
                        }
                      };
                      
                      suffix.textContent = 'a';
                      typingInterval = setInterval(typeNextLetter, 100);
                      
                      suffix.dataset.interval = String(typingInterval);
                    }}
                    onMouseLeave={(e) => {
                      const suffix = e.currentTarget.querySelector('.suffix') as HTMLSpanElement;
                      const fullstop = e.currentTarget.nextElementSibling;
                      if (!suffix || !fullstop) return;
                      
                      const intervalId = suffix.dataset.interval;
                      if (intervalId) clearInterval(Number(intervalId));
                      suffix.textContent = '';
                      
                      // Show fullstop after a brief delay
                      setTimeout(() => {
                        fullstop.classList.remove('opacity-0');
                      }, 200);
                    }}
                  >
                    Ved
                    <span className="suffix absolute left-full cursor-none transition-all duration-200" />
                  </span>
                  <span className="transition-opacity duration-200">.</span>
                </h2>
                <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p className="text-xl">CS @ Cambridge. AI-something-something. Something about startups.</p>
                  <p className="leading-relaxed">
                    I'm studying computer science at Cambridge. In my free time I obsess over both the theory and implementation of AI. I'm also trying to get better at building things: communities (like <a 
                      href="https://cuai.org.uk" 
                      className={`underline transition-colors cursor-none ${
                        isDark ? 'hover:text-white' : 'hover:text-gray-900'
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CUAI
                    </a>), technology, and Lego.
                  </p>
                  <p> 
                    You can{' '}
                    <a 
                      href="https://x.com/vedaangh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`underline transition-colors cursor-none ${
                        isDark ? 'hover:text-white' : 'hover:text-gray-900'
                      }`}
                    >
                      contact me via X
                    </a>, or{' '}
                    <a 
                      href="https://cal.com/vedaangh/meal?month=2025-02&date=2025-02-08" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`underline transition-colors cursor-none ${
                        isDark ? 'hover:text-white' : 'hover:text-gray-900'
                      }`}
                    >
                      book a meal with me
                    </a>!
                  </p>
                </div>
              </motion.div>
            )}

            {activeSection === 'career' && (
              <motion.div
                key="career"
                initial="exit"
                animate="enter"
                exit="exit"
                variants={contentVariants}
                className="space-y-16"
              >
                {content.career.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`group p-6 md:p-8 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                      isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`text-xl md:text-2xl font-light transition-colors ${
                          isDark ? 'group-hover:text-white' : 'group-hover:text-black'
                        }`}>
                          {item.company}
                        </h3>
                        <span className={`text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.period}
                        </span>
                      </div>
                      <p className={`text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.role}
                      </p>
                      <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeSection === 'research' && (
              <motion.div
                key="research"
                initial="exit"
                animate="enter"
                exit="exit"
                variants={contentVariants}
                className="space-y-16"
              >
                {/* Current Research */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-light">Current Research</h3>
                  <div className={`group p-6 md:p-8 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                    isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                  }`}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xl md:text-2xl font-light group-hover:opacity-80 transition-opacity">
                          {content.research.current.title}
                        </h4>
                        <span className="text-base md:text-lg opacity-60">
                          {content.research.current.period}
                        </span>
                      </div>
                      <p className="text-base md:text-lg opacity-80">
                        {content.research.current.place}
                      </p>
                      <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'opacity-70'}`}>
                        {content.research.current.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Previous Research */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-light">Previous Research</h3>
                  {content.research.publications.map((pub, index) => (
                    <div 
                      key={index}
                      className={`group p-6 md:p-8 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                        isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xl md:text-2xl font-light group-hover:opacity-80 transition-opacity">
                            {pub.title}
                          </h4>
                          <span className="text-base md:text-lg opacity-60">
                            {pub.period}
                          </span>
                        </div>
                        <p className="text-base md:text-lg opacity-80">
                          {pub.venue}
                        </p>
                        <p className="leading-relaxed opacity-70">
                          {pub.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {activeSection === 'blog' && (
              <motion.div
                key="blog"
                initial="exit"
                animate="enter"
                exit="exit"
                variants={contentVariants}
                className="space-y-16"
              >
                <motion.div
                  variants={itemVariants}
                  className={`group p-6 md:p-8 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                    isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-4">
                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Coming soon...
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeSection === 'things' && (
              <motion.div
                key="things"
                initial="exit"
                animate="enter"
                exit="exit"
                variants={contentVariants}
                className="space-y-16"
              >
                {content.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`group p-6 md:p-8 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                      isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xl md:text-2xl font-light group-hover:opacity-80 transition-opacity">
                          {project.title}
                        </h3>
                        <span className="text-base md:text-lg opacity-60">
                          {project.period}
                        </span>
                      </div>
                      {project.role && (
                        <p className="text-base md:text-lg opacity-80">
                          {project.role}
                        </p>
                      )}
                      <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'opacity-70'}`}>
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div 
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 text-base"
        onMouseEnter={() => setIsContactOpen(true)}
        onMouseLeave={() => setIsContactOpen(false)}
      >
        <div 
          className={`
            border rounded-lg p-6 mb-3 transform transition-all duration-300 min-w-[280px]
            ${isContactOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
            ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}
          `}
        >
          <div className="space-y-4">
            <a 
              href="https://github.com/vedaangh" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${contactLinkClass} ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" className="flex-shrink-0">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>github.com/vedaangh</span>
            </a>
            <a 
              href="https://x.com/vedaangh" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${contactLinkClass} ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span className="w-4 inline-flex justify-center text-base">𝕏</span>
              <span>@vedaangh</span>
            </a>
            <a 
              href="mailto:vedaangh.rungta@gmail.com" 
              className={`${contactLinkClass} ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span className="w-4 inline-flex justify-center text-base">✉</span>
              <span>vedaangh.rungta@gmail.com</span>
            </a>
          </div>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            You can contact me via{' '}
            <a 
              href="https://x.com/vedaangh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:opacity-50 transition-opacity cursor-none"
            >
              X
            </a>, or{' '}
            <a 
              href="https://cal.com/vedaangh/meal?month=2025-02&date=2025-02-08" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:opacity-50 transition-opacity cursor-none"
            >
              book a meal with me!
            </a>
          </p>
        </div>
        <span className="text-gray-500 hover:opacity-50 transition-opacity cursor-none">
          Contact
        </span>
      </div>
    </div>
  );
}