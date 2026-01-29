'use client'

import { DM_Sans } from 'next/font/google'
import Link from 'next/link'

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
})

const posts = [
  {
    title: 'CCP-eval: Benchmarking Open Source Model Alignment',
    href: '/blog/ccpval'
  }
]

export default function Blog() {
  return (
    <main className={`min-h-screen flex flex-col justify-between px-6 py-10 md:px-12 md:py-16 ${sans.className}`}>
      <div className="max-w-md">
        <Link
          href="/"
          className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          ← Back
        </Link>

        <h1 className="text-base mt-16 mb-10">
          Writing
        </h1>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="block text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </div>

      <footer className="flex gap-6 text-xs text-[var(--muted)] mt-24">
        <Link href="https://x.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">Twitter</Link>
        <Link href="mailto:vedaangh.rungta@gmail.com" className="hover:text-[var(--fg)] transition-colors">Email</Link>
        <Link href="https://github.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">GitHub</Link>
      </footer>
    </main>
  )
}
