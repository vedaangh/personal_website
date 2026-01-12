'use client'

import { Cinzel, Crimson_Text } from 'next/font/google'
import Link from 'next/link'

const cinzel = Cinzel({ subsets: ['latin'] })
const crimson = Crimson_Text({ weight: ['400', '600', '700'], subsets: ['latin'] })

export default function CCPVal() {
  return (
    <main className={`min-h-screen bg-[#f4f1ea] text-[#2c2c2c] flex flex-col items-center justify-center py-16 px-8 md:px-24 ${crimson.className} selection:bg-stone-300`}>
      <h1 className={`${cinzel.className} text-3xl md:text-5xl tracking-[0.15em] font-bold mb-8`}>
        COMING SOON
      </h1>
      <Link 
        href="/blog" 
        className="text-sm uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
      >
        Return
      </Link>
    </main>
  )
}
