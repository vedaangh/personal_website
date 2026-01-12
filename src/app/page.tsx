'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cinzel, Crimson_Text } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const cinzel = Cinzel({ subsets: ['latin'] })
const crimson = Crimson_Text({ weight: ['400', '600', '700'], subsets: ['latin'] })

export default function Home() {
  const [introStep, setIntroStep] = useState<'idle' | 'man' | 'humanoid' | 'finished'>('idle')

  useEffect(() => {
    // Only scroll logic needed here now that animations are moved to /blog
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <main className={`min-h-screen bg-[#f4f1ea] text-[#2c2c2c] flex flex-col items-center py-16 px-8 md:px-24 ${crimson.className} selection:bg-stone-300`}>
      {introStep === 'idle' ? (
        <>
          <div className="w-full max-w-xl text-left mb-16 space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              Hey, I'm Ved. I'm an undergraduate student reading Computer Science at the <span className="font-semibold">University of Cambridge</span>.
            </p>
            <p>
              I spent the summer working on AI enhanced wargaming as a <Link href="https://checkmatelabs.net" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">Y Combinator Summer Fellow</Link>. Currently I'm training voice models, thinking about continual learning, and building startups.
            </p>
            <p>
              I've previously worked on product at <Link href="https://conduct-ai.com" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">Conduct AI</Link> and risk at <Link href="https://xtxmarkets.com" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">XTX Markets</Link>. I've researched GNNs, diffusion-based graph generation, VLAs and RL under <Link href="https://apih.co/" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">Professor Pietro Lio</Link> at the Cambridge Geometric Deep Learning Lab, decision transformers under <Link href="https://apih.co/" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">Api Hasthanasombat</Link>. Independent research with CycleGANs.
            </p>
            <p>
              I'm also a fellow at <Link href="https://hummingbird.vc" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">Hummingbird VC</Link> and built the <Link href="https://cuai.org.uk" target="_blank" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">most talent dense community at Cambridge</Link>. Feel free to <Link href="mailto:vedaangh.rungta@gmail.com" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">reach out to me</Link>!
            </p>
            <p>
              You can check my projects and writings out <Link href="/blog" className="underline decoration-stone-400 hover:text-stone-500 transition-colors">here</Link>.
            </p>
          </div>

          <div className="relative mb-20 w-48 h-64 md:w-64 md:h-80">
            <Image
              src="/thinking.jpg"
              alt="Thinking"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out mix-blend-multiply"
              priority
            />
          </div>
        </>
      ) : null}
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
