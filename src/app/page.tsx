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
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
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

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', updateHoverState);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', updateHoverState);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`fixed w-8 h-8 rounded-full border-2 pointer-events-none z-[9999] will-change-transform ${
        isHovering ? 'bg-gray-300/30 border-black/80 dark:border-white/80 scale-110' : 'border-black dark:border-white'
      } ${className || ''} transition-[background,border,transform] duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
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
  const [activeSection, setActiveSection] = useState<'about' | 'experience' | 'research' | 'blog' | 'things'>('about');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Prevent hydration mismatch with dark mode
  useEffect(() => {
    setIsMounted(true);
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
  const handleSectionChange = useCallback((section: 'about' | 'experience' | 'research' | 'blog' | 'things') => {
    setActiveSection(section);
    // Scroll to top on mobile when changing sections
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isMobile]);

  const content = {
    about: "Building AI systems that scale.",
    experience: [
      {
        company: "Checkmate Labs",
        role: "Founder",
        period: "Jun 2025 - Present",
        url: "https://checkmatelabs.net"
      },
      {
        company: "Conduct AI",
        role: "Product Engineer Intern",
        period: "Dec 2024 - Jan 2025",
        url: "https://conduct-ai.com"
      },
      {
        company: "Nustom",
        role: "Software Engineer Intern",
        period: "Jul 2024 - Aug 2024",
        url: "https://nustom.com"
      },
      {
        company: "XTX Markets",
        role: "Risk Intern",
        period: "Aug 2022 - Sep 2022",
        url: "https://xtxmarkets.com"
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
        },
        {
          title: "CycleGAN for Synthetic Data Generation",
          venue: "Independent Research",
          period: "Sep 2021 - Jun 2023",
          description: "Conducted research with Wayve building CycleGANs to generate realistic images from simulation screenshots."
        }
      ]
    },
    projects: [
      {
        title: "Cambridge University AI Society",
        role: "Vice President & Co-Founder",
        period: "2024 - 2025",
        description: "Building the most talent dense community in Cambridge."
      },
      {
        title: "VEX Robotics Competition",
        role: "Competitor",
        period: "2019 - 2023",
        description: "Competed in the VEX Robotics Competition."
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
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black'
      }`}>
        {!isMobile && <CustomCursor className="hidden md:block" />}
        
        <button
          onClick={() => setIsDark(!isDark)}
          className={`fixed top-4 right-4 md:top-8 md:right-8 w-12 h-6 rounded-full flex items-center p-1 z-50 transition-colors duration-200 ${
            isDark ? 'bg-gray-700' : 'bg-gray-300'
          } ${isMobile ? '' : 'cursor-none'}`}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
              isDark ? 'translate-x-0' : 'translate-x-6'
            }`}
          />
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
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>CS @ Cambridge</p>
          </div>

          <nav className="flex md:block space-x-4 md:space-x-0 md:space-y-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {(['about', 'experience', 'research', 'blog', 'things'] as const).map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                className={`block text-left whitespace-nowrap border-b-2 transition-colors duration-200 ${isMobile ? '' : 'cursor-none'} ${
                  activeSection === section ? 'opacity-100 border-current' : 'opacity-50 border-transparent hover:border-current'
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
                      <p className="text-xl">CS @ Cambridge. Founder @ Checkmate Labs. Summer Fellow @ YC.</p>
                      <p className="leading-relaxed">
                        I'm currently based in San Francisco building a new tier of simulation technology. Feel free to contact me via{' '}
                        <a
                          href="https://x.com/vedaangh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`underline transition-colors ${isMobile ? '' : 'cursor-none'} ${
                            isDark ? 'hover:text-white' : 'hover:text-gray-900'
                          }`}
                        >
                          X
                        </a>{' '}or{' '}
                        <a
                          href="mailto:vedaangh.rungta@gmail.com"
                          className={`underline transition-colors ${isMobile ? '' : 'cursor-none'} ${
                            isDark ? 'hover:text-white' : 'hover:text-gray-900'
                          }`}
                        >
                          email
                        </a>.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeSection === 'experience' && (
                  <motion.div
                    key="experience"
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    variants={contentVariants}
                    className="space-y-8"
                  >
                    <h2 className="text-3xl md:text-5xl font-light">experience</h2>
                    {content.experience.map((item, index) => (
                      <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block focus:outline-none"
                      >
                        <motion.div
                          variants={itemVariants}
                          className={`group p-5 md:p-6 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 will-change-transform ${
                            isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className={`text-lg md:text-xl font-light transition-colors ${
                                  isDark ? 'group-hover:text-white' : 'group-hover:text-black'
                                }`}>
                                  {item.company}
                                </h3>
                                <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.role}</p>
                              </div>
                              <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-300' : 'text-gray-500'}`} aria-hidden="true">→</div>
                            </div>
                            <span className={`text-xs md:text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.period}</span>
                          </div>
                        </motion.div>
                      </a>
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
                    className="space-y-8"
                  >
                    <h2 className="text-3xl md:text-5xl font-light">research</h2>
                    {/* Current Research */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      <div className={`group p-5 md:p-6 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                        isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-100'
                      }`}>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-lg md:text-xl font-light group-hover:opacity-80 transition-opacity">
                                {content.research.current.title}
                              </h4>
                              <p className="text-sm md:text-base opacity-80">{content.research.current.place}</p>
                            </div>
                            <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-300' : 'text-gray-500'}`} aria-hidden="true">→</div>
                          </div>
                          <span className={`text-xs md:text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{content.research.current.period}</span>
                          <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'opacity-70'}`}>
                            {content.research.current.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Previous Research */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      {content.research.publications.map((pub, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className={`group p-5 md:p-6 -mx-4 md:-mx-8 rounded-xl transition-all duration-300 ${
                            isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-lg md:text-xl font-light group-hover:opacity-80 transition-opacity">
                                  {pub.title}
                                </h4>
                                <p className="text-sm md:text-base opacity-80">{pub.venue}</p>
                              </div>
                              <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-300' : 'text-gray-500'}`} aria-hidden="true">→</div>
                            </div>
                            <span className={`text-xs md:text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{pub.period}</span>
                            <p className="leading-relaxed opacity-70">
                              {pub.description}
                            </p>
                          </div>
                        </motion.div>
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
                    <h2 className="text-3xl md:text-5xl font-light mb-6">blog</h2>
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
                    <h2 className="text-3xl md:text-5xl font-light mb-6">other stuff i've done</h2>
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
      </div>
    </>
  );
}