import { DM_Sans } from 'next/font/google'
import Link from 'next/link'

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
})

export default function Home() {
  return (
    <main className={`min-h-screen flex flex-col justify-between px-6 py-10 md:px-12 md:py-16 ${sans.className}`}>
      <div className="flex-1 flex flex-col justify-center max-w-md">
        <p className="text-base md:text-lg leading-relaxed">
          Hey! I'm Ved. I study CS at Cambridge and am training multimodal models. I'm president of{' '}
          <Link href="https://cuai.org.uk" target="_blank" className="link-underline">CUAI</Link>.
        </p>

        <p className="text-sm text-[var(--muted)] mt-6 leading-relaxed">
          Prev. <Link href="https://checkmatelabs.net" target="_blank" className="link-underline">YC Summer Fellows</Link>,{' '}
          <Link href="https://conduct-ai.com" target="_blank" className="link-underline">Conduct AI</Link>,{' '}
          <Link href="https://nustom.com" target="_blank" className="link-underline">Nustom</Link>,{' '}
          <Link href="https://xtxmarkets.com" target="_blank" className="link-underline">XTX Markets</Link>.{' '}
          <Link href="https://www.cl.cam.ac.uk/research/nl/geometric-deep-learning/" target="_blank" className="link-underline">Cambridge GDL lab</Link>.
        </p>

        <Link
          href="/blog"
          className="mt-10 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          Writing →
        </Link>
      </div>

      <footer className="flex gap-6 text-xs text-[var(--muted)]">
        <Link href="https://x.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">Twitter</Link>
        <Link href="mailto:vedaangh.rungta@gmail.com" className="hover:text-[var(--fg)] transition-colors">Email</Link>
        <Link href="https://github.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">GitHub</Link>
      </footer>
    </main>
  )
}
