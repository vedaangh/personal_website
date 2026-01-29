'use client'

import { Outfit, Newsreader } from 'next/font/google'
import Link from 'next/link'

const outfit = Outfit({ subsets: ['latin'], weight: ['500', '600', '700'] })
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'] })

const posts = [
  {
    number: '01',
    title: 'CCP-eval: Benchmarking Open Source Model Alignment',
    href: '/blog/ccpval'
  }
]

export default function Blog() {
  return (
    <main className={`min-h-screen flex flex-col justify-between px-6 py-12 md:px-16 md:py-20 ${newsreader.className}`}>
      <div className="max-w-2xl">
        <div>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            ← Back
          </Link>
        </div>

        <h1
          className={`${outfit.className} text-4xl md:text-6xl font-semibold tracking-tight leading-none mt-12 mb-16`}
        >
          Writing
        </h1>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <article
              key={post.href}
            >
              <Link
                href={post.href}
                className="group block py-4 border-b border-[var(--border)] hover:border-[var(--fg)] transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className={`${outfit.className} text-xs text-[var(--muted)] font-bold tracking-widest`}>
                    {post.number}
                  </span>
                  <h2 className="text-lg md:text-xl group-hover:text-[var(--accent)] transition-colors">
                    {post.title}
                  </h2>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <footer
        className="flex gap-8 text-sm text-[var(--muted)] mt-24"
      >
        <Link href="https://x.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">Twitter</Link>
        <Link href="mailto:vedaangh.rungta@gmail.com" className="hover:text-[var(--fg)] transition-colors">Email</Link>
        <Link href="https://github.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">GitHub</Link>
      </footer>
    </main>
  )
}
