import { Inter, Newsreader } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] })
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'] })

export default function Home() {
  return (
    <main className={`h-screen overflow-hidden flex flex-col px-6 py-8 md:px-16 md:py-10 ${newsreader.className}`}>
      <div className="flex-1 flex flex-col justify-center max-w-2xl pb-16">
        <h1 className={`${inter.className} text-3xl md:text-5xl font-medium tracking-tight leading-none mb-6 md:mb-8`}>
          Vedaangh Rungta
        </h1>

        <div className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed text-[var(--fg)]">
          <p>
            I'm currently studying Computer Science at Cambridge and training multimodal models. I'm also president of{' '}
            <Link href="https://cuai.org.uk" target="_blank" className="text-[var(--accent)] hover:underline">CUAI</Link>.
            {' '}I spend the rest of my time on political thought, theology, and fearing the collapse of meritocracy in a technofuturistic utopia (in Claude we trust).
          </p>

          <p>
            Previously wargaming with AI as a{' '}
            <Link href="https://checkmatelabs.net" target="_blank" className="text-[var(--accent)] hover:underline">YC Summer Fellow</Link>,
            {' '}product at{' '}
            <Link href="https://conduct-ai.com" target="_blank" className="text-[var(--accent)] hover:underline">Conduct AI</Link>,
            {' '}and risk at{' '}
            <Link href="https://xtxmarkets.com" target="_blank" className="text-[var(--accent)] hover:underline">XTX Markets</Link>.
            {' '}I've also been involved with research at the{' '}
            <Link href="https://www.cl.cam.ac.uk/" target="_blank" className="text-[var(--accent)] hover:underline">Cambridge Geometric Deep Learning Lab</Link>
            {' '}under{' '}
            <Link href="https://www.cl.cam.ac.uk/~pl219/" target="_blank" className="text-[var(--accent)] hover:underline">Pietro Lio</Link>,
            {' '}working on graph neural networks, diffusion-based molecular generation, and vision-language-action models for RL, and at King's College Cambridgeon decision transformers with{' '}
            <Link href="https://apih.co/" target="_blank" className="text-[var(--accent)] hover:underline">Api Hasthanasombat</Link>.
          </p>

          <div className="pt-2">
            <Link
              href="/blog"
              className={`${inter.className} inline-flex items-center gap-2 text-[var(--fg)] font-medium hover:text-[var(--accent)] transition-colors`}
            >
              Writing
              <span className="text-sm">→</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="flex gap-8 text-sm text-[var(--muted)] pb-8">
        <Link href="https://x.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">Twitter</Link>
        <Link href="mailto:vedaangh.rungta@gmail.com" className="hover:text-[var(--fg)] transition-colors">Email</Link>
        <Link href="https://github.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">GitHub</Link>
      </footer>
    </main>
  )
}
