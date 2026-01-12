'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cinzel, Crimson_Text } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const cinzel = Cinzel({ subsets: ['latin'] })
const crimson = Crimson_Text({ weight: ['400', '600', '700'], subsets: ['latin'] })

export default function Blog() {
  const [introStep, setIntroStep] = useState<'humanoid' | 'finished'>('humanoid')

  useEffect(() => {
    // Start animation immediately
    const timer = setTimeout(() => {
        setIntroStep('finished')
        document.body.style.overflow = 'unset'
    }, 1500)

    // Lock scroll initially
    document.body.style.overflow = 'hidden'

    return () => {
        clearTimeout(timer)
        document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <main className={`min-h-screen bg-[#f4f1ea] text-[#2c2c2c] flex flex-col items-center py-16 px-8 md:px-24 ${crimson.className} selection:bg-stone-300`}>
        <div className="w-full flex flex-col items-center min-h-[60vh]">
           {/* Animation Container */}
           <motion.div 
              layout
              className="relative mb-6"
              initial={{ width: '20rem', height: '25rem' }}
              animate={{ 
                width: introStep === 'finished' ? '12rem' : '20rem',
                height: introStep === 'finished' ? '15rem' : '25rem',
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
           >
              {/* Vetruvian Man */}
              <motion.div
                className="absolute inset-0 mix-blend-multiply"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                <Image
                  src="/vetruvian_man.jpg"
                  alt="Vetruvian Man"
                  fill
                  className="object-contain grayscale contrast-125"
                  priority
                />
              </motion.div>

              {/* Vetruvian Humanoid */}
              <motion.div
                className="absolute inset-0 mix-blend-multiply"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <Image
                  src="/vetruvian_humanoid.jpg"
                  alt="Vetruvian Humanoid"
                  fill
                  className="object-contain grayscale contrast-125"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Contents - Fades in */}
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: introStep === 'finished' ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="space-y-4 flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-normal tracking-wide">Projects and Writings</h2>
                <div className="w-12 h-px bg-stone-300"></div>
              </div>
              
              <div className="space-y-4">
                <Link href="/blog/ccpval" className="group flex items-baseline justify-center hover:text-stone-600 transition-colors">
                  <span className={`${cinzel.className} font-bold text-stone-400 group-hover:text-stone-600 text-xs mr-3 tracking-widest`}>01</span>
                  <span className="text-lg tracking-wide">CCP-eval: Benchmarking Open Source Model Alignment</span>
                </Link>
              </div>

              <div className="pt-12">
                <Link 
                  href="/" 
                  className="text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Return
                </Link>
              </div>
            </motion.div>
        </div>

        {/* Footer / Colophon */}
        <div className="mt-auto pt-8 pb-12 text-center w-full max-w-lg border-t border-stone-200">
            <div className="flex justify-center space-x-8 text-xs md:text-sm italic text-stone-600">
            <Link href="https://x.com/vedaangh" target="_blank" className="hover:text-black hover:underline transition-all">Twitter</Link>
            <Link href="mailto:vedaangh.rungta@gmail.com" className="hover:text-black hover:underline transition-all">Email</Link>
            <Link href="https://github.com/vedaangh" target="_blank" className="hover:text-black hover:underline transition-all">GitHub</Link>
            </div>
            <p className="text-[10px] text-stone-400 mt-6 tracking-[0.2em]">
            2024 - PRESENT
            </p>
        </div>
    </main>
  )
}
