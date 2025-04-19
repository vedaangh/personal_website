'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';

interface Position {
  x: number;
  y: number;
}

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

// Optimize cursor with debounce
const CustomCursor = ({ className }: { className?: string }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lastUpdateTime = useRef(0);
  const currentPosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Use requestAnimationFrame for smoother cursor movement
    let rafId: number;
    
    const updateCursor = (e: MouseEvent) => {
      // Store the position but don't update state directly
      currentPosition.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         target.closest('button') || 
                         target.closest('a');
      setIsHovering(!!isClickable);
    };

    // Hide cursor when mouse leaves window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Show cursor when mouse enters window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth animation loop with throttling
    const animateCursor = (timestamp: number) => {
      // Throttle updates to every ~16ms (60fps)
      if (timestamp - lastUpdateTime.current >= 16) {
        lastUpdateTime.current = timestamp;
        setPosition(prev => ({
          x: prev.x + (currentPosition.current.x - prev.x) * 0.5,
          y: prev.y + (currentPosition.current.y - prev.y) * 0.5
        }));
      }
      rafId = requestAnimationFrame(animateCursor);
    };
    
    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', updateHoverState);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    // Start the animation
    rafId = requestAnimationFrame(animateCursor);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', updateHoverState);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      className={`fixed w-8 h-8 rounded-full border-2 pointer-events-none z-50 will-change-transform ${
        isHovering ? 'bg-gray-300/30 border-black/80 scale-110' : 'border-black'
      } ${className || ''} transition-[background,border,transform] duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0)`
      }}
      aria-hidden="true"
    />
  );
};

const contentVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
      staggerChildren: 0.04,
      when: "beforeChildren"
    }
  },
  exit: {
    y: 10,
    opacity: 0,
    transition: { 
      duration: 0.25,
      ease: [0.32, 0.72, 0, 1],
      when: "afterChildren"
    }
  }
};

const itemVariants = {
  enter: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
  },
  exit: {
    y: 10,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
  }
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<'about' | 'career' | 'research' | 'blog' | 'things'>('about');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Prevent hydration mismatch with dark mode
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

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

  // Add scroll restoration
  useEffect(() => {
    // Save scroll position when navigating between sections
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Restore scroll position
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }
    
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Memoize section change handler
  const handleSectionChange = useCallback((section: 'about' | 'career' | 'research' | 'blog' | 'things') => {
    setActiveSection(section);
    // Scroll to top on mobile when changing sections
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isMobile]);

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

  // Only render UI after client-side hydration
  if (!isMounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900"></div>;
  }

  return (
    <>
      <Head>
        <title>Vedaangh Rungta | Cambridge University</title>
        <meta name="description" content="Personal website of Vedaangh Rungta - CS @ Cambridge, AI researcher, and community builder." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={`min-h-screen ${isMobile ? '' : 'cursor-none'} font-light transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}>
        {!isMobile && <CustomCursor className="hidden md:block" />}
        
        <button
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-4 right-4 md:top-8 md:right-8 p-2 rounded-full ${isMobile ? '' : 'cursor-none'} z-50 transition-all duration-200 hover:scale-110 ${
            isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-black hover:bg-gray-200'
          }`}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <div className={`
          fixed top-0 left-0 w-full md:w-64 md:h-screen 
          p-4 md:p-8 
          border-b md:border-r md:border-b-0 
          bg-opacity-90 backdrop-blur-md
          z-40
          transition-colors ${isDark ? 'border-gray-800 bg-gray-900/90' : 'border-gray-100 bg-white/90'}
        `}>
          <div className="md:mb-32 mb-4">
            <h1 className="text-xl md:text-2xl mb-1 font-medium">Vedaangh Rungta</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Cambridge University</p>
          </div>

          <nav className="flex md:block space-x-4 md:space-x-0 md:space-y-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {(['about', 'career', 'research', 'blog', 'things'] as const).map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`block text-left whitespace-nowrap hover:opacity-50 transition-opacity ${isMobile ? '' : 'cursor-none'} ${
                  activeSection === section ? 'opacity-100' : 'opacity-30'
                }`}
                aria-current={activeSection === section ? 'page' : undefined}
              >
                {section === 'things' ? "things I'm a part of" : section}
              </button>
            ))}
          </nav>
        </div>

        <main className="pt-28 md:pt-8 md:ml-64 p-4 md:p-8">
          <div className="max-w-2xl mx-auto md:ml-32 md:mt-32">
            <LazyMotion features={domAnimation}>
              <AnimatePresence mode="wait" initial={false}>
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
                        className={`relative inline-block ${isMobile ? '' : 'cursor-none'}`}
                        onMouseEnter={(e) => {
                          if (isMobile) return;
                          
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
                          // Speed up typing animation
                          typingInterval = setInterval(typeNextLetter, 80);
                          
                          suffix.dataset.interval = String(typingInterval);
                        }}
                        onMouseLeave={(e) => {
                          if (isMobile) return;
                          
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
                        <span className={`suffix absolute left-full ${isMobile ? '' : 'cursor-none'} transition-all duration-100`} />
                      </span>
                      <span className="transition-opacity duration-200">.</span>
                    </h2>
                    <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p className="text-xl">CS @ Cambridge. AI-something-something. Something about startups.</p>
                      <p className="leading-relaxed">
                        I'm studying computer science at Cambridge. In my free time I obsess over both the theory and implementation of AI. I'm also trying to get better at building things: communities (like <a 
                          href="https://cuai.org.uk" 
                          className={`underline transition-colors ${isMobile ? '' : 'cursor-none'} ${
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
                          className={`underline transition-colors ${isMobile ? '' : 'cursor-none'} ${
                            isDark ? 'hover:text-white' : 'hover:text-gray-900'
                          }`}
                        >
                          contact me via X
                        </a>, or{' '}
                        <a 
                          href="https://cal.com/vedaangh/meal?month=2025-02&date=2025-02-08" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`underline transition-colors ${isMobile ? '' : 'cursor-none'} ${
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
                    className="space-y-12"
                  >
                    {content.career.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`group p-6 md:p-8 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 will-change-transform ${
                          isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-0">
                            <h3 className={`text-xl md:text-2xl font-light transition-colors ${
                              isDark ? 'group-hover:text-white' : 'group-hover:text-black'
                            }`}>
                              {item.company}
                            </h3>
                            <span className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
            </LazyMotion>
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
              shadow-lg backdrop-blur-sm
              ${isContactOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
              ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-100'}
            `}
          >
            <div className="space-y-4">
              <a 
                href="https://github.com/vedaangh" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-3 hover:opacity-70 transition-opacity ${isMobile ? '' : 'cursor-none'} ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
                aria-label="GitHub Profile"
              >
                <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <span>github.com/vedaangh</span>
              </a>
              <a 
                href="https://x.com/vedaangh" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-3 hover:opacity-70 transition-opacity ${isMobile ? '' : 'cursor-none'} ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
                aria-label="X (Twitter) Profile"
              >
                <span className="w-4 inline-flex justify-center text-base" aria-hidden="true">𝕏</span>
                <span>@vedaangh</span>
              </a>
              <a 
                href="mailto:vedaangh.rungta@gmail.com" 
                className={`flex items-center gap-3 hover:opacity-70 transition-opacity ${isMobile ? '' : 'cursor-none'} ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
                aria-label="Email"
              >
                <span className="w-4 inline-flex justify-center text-base" aria-hidden="true">✉</span>
                <span>vedaangh.rungta@gmail.com</span>
              </a>
            </div>
            <p className={`text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              You can contact me via{' '}
              <a 
                href="https://x.com/vedaangh" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`underline hover:opacity-70 transition-opacity ${isMobile ? '' : 'cursor-none'}`}
              >
                X
              </a>
            </p>
          </div>
          <button 
            className={`text-gray-500 hover:opacity-70 transition-opacity ${isMobile ? '' : 'cursor-none'} px-3 py-1.5 rounded-full ${
              isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/80'
            }`}
            aria-expanded={isContactOpen}
            aria-label="Toggle contact information"
          >
            Contact
          </button>
        </div>
      </div>
    </>
  );
}