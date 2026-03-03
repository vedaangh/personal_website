'use client'

import { DM_Sans } from 'next/font/google'
import Link from 'next/link'

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
})

const qnaData = [
  { label: 'GPT-OSS-120B', value: -1.24 },
  { label: 'GLM-4.7', value: -1.02 },
  { label: 'Kimi K2.5', value: -0.91 },
  { label: 'MiniMax M2.1', value: 2.00 },
  { label: 'Qwen3-235B', value: 2.82 },
  { label: 'DeepSeek V3.2', value: 4.19 },
]

const feedData = [
  { label: 'GLM-4.7', china: -58.05, us: 96.85 },
  { label: 'Kimi K2.5', china: -48.25, us: 64.0 },
  { label: 'Grok-4', china: 38.2, us: 52.8 },
  { label: 'GPT-OSS-120B', china: 46.6, us: -11.25 },
  { label: 'MiniMax M2.1', china: 103.35, us: -3.4 },
  { label: 'DeepSeek V3.2', china: 144.4, us: 29.9 },
  { label: 'Qwen3-235B', china: 384.85, us: -50.8 },
]

const searchData = [
  { label: 'Kimi K2.5', value: -2.11 },
  { label: 'MiniMax M2.1', value: -2.13 },
  { label: 'GPT-OSS-120B', value: -1.58 },
  { label: 'GLM-4.7', value: -1.13 },
  { label: 'Qwen3-235B', value: -0.58 },
  { label: 'DeepSeek V3.2', value: -0.17 },
]

const translationDriftData = [
  { label: 'GLM-4.7', enToZh: 0.06, zhToEn: -0.06 },
  { label: 'GPT-OSS-120B', enToZh: 0.69, zhToEn: -0.66 },
  { label: 'Qwen3-235B', enToZh: 0.26, zhToEn: -0.06 },
  { label: 'Kimi K2.5', enToZh: 0.45, zhToEn: -0.06 },
  { label: 'DeepSeek V3.2', enToZh: 1.20, zhToEn: -0.10 },
  { label: 'MiniMax M2.1', enToZh: 1.39, zhToEn: 0.01 },
]

const steeringData = [
  { label: 'α = -5 (Pro)', value: 4.80, isSteer: true },
  { label: 'DeepSeek V3.2', value: 4.19, isSteer: false },
  { label: 'Qwen3-235B', value: 2.82, isSteer: false },
  { label: 'α = -2.5', value: 2.10, isSteer: true },
  { label: 'MiniMax M2.1', value: 2.00, isSteer: false },
  { label: 'α = 0 (Base)', value: -0.45, isSteer: true },
  { label: 'Kimi K2.5', value: -0.91, isSteer: false },
  { label: 'GLM-4.7', value: -1.02, isSteer: false },
  { label: 'GPT-OSS-120B', value: -1.24, isSteer: false },
  { label: 'α = +2.5', value: -2.15, isSteer: true },
  { label: 'α = +5 (Anti)', value: -3.78, isSteer: true },
]

const steeringTransferData = [
  { alpha: -5, china: -45.2, us: 82.1 },
  { alpha: -2.5, china: -28.5, us: 55.3 },
  { alpha: 0, china: 12.4, us: 18.7 },
  { alpha: 2.5, china: 48.6, us: -15.2 },
  { alpha: 5, china: 72.3, us: -42.8 },
]

const Bar = ({ data, domain = [-5, 5], unit = '', showSteerStyle = false }: { data: { label: string; value: number; isSteer?: boolean }[], domain?: [number, number], unit?: string, showSteerStyle?: boolean }) => {
  const range = domain[1] - domain[0]
  const zeroOffset = (0 - domain[0]) / range * 100

  return (
    <div className="my-6 space-y-1.5">
      {data.map((d, i) => {
        const barWidth = (Math.abs(d.value) / range) * 100
        const left = d.value < 0 ? zeroOffset - barWidth : zeroOffset
        const isSteer = showSteerStyle && d.isSteer
        const isFrontier = showSteerStyle && !d.isSteer
        return (
          <div key={i} className="flex items-center gap-3 text-xs">
            <span className={`w-24 text-right ${isSteer ? 'text-[var(--fg)]' : 'text-[var(--muted)]'}`}>{d.label}</span>
            <div className="flex-1 h-4 bg-[var(--border)] relative">
              <div className="absolute top-0 bottom-0 w-px bg-[var(--muted)] opacity-30" style={{ left: `${zeroOffset}%` }} />
              <div className={`absolute top-0 bottom-0 ${isFrontier ? 'bg-[var(--muted)]' : 'bg-[var(--fg)]'}`} style={{ left: `${left}%`, width: `${barWidth}%` }} />
            </div>
            <span className="w-12 text-[var(--muted)]">{d.value.toFixed(2)}{unit}</span>
          </div>
        )
      })}
      {showSteerStyle && (
        <div className="flex justify-center gap-4 mt-3 text-xs text-[var(--muted)]">
          <span><span className="inline-block w-2 h-2 bg-[var(--fg)] mr-1" />Steered</span>
          <span><span className="inline-block w-2 h-2 bg-[var(--muted)] mr-1" />Frontier</span>
        </div>
      )}
    </div>
  )
}

const GroupedBar = ({ data }: { data: { label: string; china: number; us: number }[] }) => {
  const maxVal = Math.max(...data.map(d => Math.max(Math.abs(d.china), Math.abs(d.us))))

  return (
    <div className="my-6 space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3 text-xs">
          <span className="w-24 text-right text-[var(--muted)]">{d.label}</span>
          <div className="flex-1 space-y-0.5">
            <div className="h-3 bg-[var(--border)] relative">
              <div className="absolute top-0 bottom-0 w-px bg-[var(--muted)] opacity-30 left-1/2" />
              <div
                className="absolute top-0 bottom-0 bg-[var(--muted)]"
                style={{
                  width: `${(Math.abs(d.china) / maxVal) * 50}%`,
                  left: d.china > 0 ? '50%' : undefined,
                  right: d.china < 0 ? '50%' : undefined
                }}
              />
            </div>
            <div className="h-3 bg-[var(--border)] relative">
              <div className="absolute top-0 bottom-0 w-px bg-[var(--muted)] opacity-30 left-1/2" />
              <div
                className="absolute top-0 bottom-0 bg-[var(--fg)]"
                style={{
                  width: `${(Math.abs(d.us) / maxVal) * 50}%`,
                  left: d.us > 0 ? '50%' : undefined,
                  right: d.us < 0 ? '50%' : undefined
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center gap-4 mt-3 text-xs text-[var(--muted)]">
        <span><span className="inline-block w-2 h-2 bg-[var(--muted)] mr-1" />China</span>
        <span><span className="inline-block w-2 h-2 bg-[var(--fg)] mr-1" />US</span>
      </div>
    </div>
  )
}

const TranslationBar = ({ data }: { data: { label: string; enToZh: number; zhToEn: number }[] }) => {
  const maxVal = Math.max(...data.map(d => Math.max(Math.abs(d.enToZh), Math.abs(d.zhToEn))))

  return (
    <div className="my-6 space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3 text-xs">
          <span className="w-24 text-right text-[var(--muted)]">{d.label}</span>
          <div className="flex-1 space-y-0.5">
            <div className="h-3 bg-[var(--border)] relative">
              <div className="absolute top-0 bottom-0 w-px bg-[var(--muted)] opacity-30 left-1/2" />
              <div
                className="absolute top-0 bottom-0 bg-[var(--muted)]"
                style={{
                  width: `${(Math.abs(d.enToZh) / maxVal) * 50}%`,
                  left: d.enToZh > 0 ? '50%' : undefined,
                  right: d.enToZh < 0 ? '50%' : undefined
                }}
              />
            </div>
            <div className="h-3 bg-[var(--border)] relative">
              <div className="absolute top-0 bottom-0 w-px bg-[var(--muted)] opacity-30 left-1/2" />
              <div
                className="absolute top-0 bottom-0 bg-[var(--fg)]"
                style={{
                  width: `${(Math.abs(d.zhToEn) / maxVal) * 50}%`,
                  left: d.zhToEn > 0 ? '50%' : undefined,
                  right: d.zhToEn < 0 ? '50%' : undefined
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center gap-4 mt-3 text-xs text-[var(--muted)]">
        <span><span className="inline-block w-2 h-2 bg-[var(--muted)] mr-1" />EN→ZH</span>
        <span><span className="inline-block w-2 h-2 bg-[var(--fg)] mr-1" />ZH→EN</span>
      </div>
    </div>
  )
}

const Code = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="my-6 border border-[var(--border)]">
    <div className="px-3 py-2 text-xs border-b border-[var(--border)] bg-[var(--border)] text-[var(--muted)]">
      {title}
    </div>
    <pre className="p-3 text-xs overflow-x-auto whitespace-pre-wrap">{children}</pre>
  </div>
)

const LineChart = ({ data }: { data: { alpha: number; china: number; us: number }[] }) => {
  const minY = Math.min(...data.flatMap(d => [d.china, d.us]))
  const maxY = Math.max(...data.flatMap(d => [d.china, d.us]))
  const range = maxY - minY

  const w = 400, h = 200
  const pad = 8
  const toY = (val: number) => pad + (h - 2 * pad) - ((val - minY) / range) * (h - 2 * pad)
  const toX = (i: number) => pad + (i / (data.length - 1)) * (w - 2 * pad)
  const zeroY = toY(0)

  return (
    <div className="my-6 space-y-2">
      <div className="flex gap-3 text-xs">
        <div className="w-20 flex flex-col justify-between text-right text-[var(--muted)]" style={{ height: h }}>
          <span>{maxY.toFixed(0)}</span>
          <span>0</span>
          <span>{minY.toFixed(0)}</span>
        </div>
        <div className="flex-1">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
            <line x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} stroke="var(--muted)" strokeOpacity="0.3" />
            <polyline
              fill="none"
              stroke="var(--muted)"
              strokeWidth="2"
              points={data.map((d, i) => `${toX(i)},${toY(d.china)}`).join(' ')}
            />
            <polyline
              fill="none"
              stroke="var(--fg)"
              strokeWidth="2"
              points={data.map((d, i) => `${toX(i)},${toY(d.us)}`).join(' ')}
            />
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={toX(i)} cy={toY(d.china)} r="4" fill="var(--muted)" />
                <circle cx={toX(i)} cy={toY(d.us)} r="4" fill="var(--fg)" />
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="flex gap-3 text-xs text-[var(--muted)]">
        <div className="w-20" />
        <div className="flex-1 flex justify-between">
          {data.map((d, i) => <span key={i}>α={d.alpha}</span>)}
        </div>
      </div>
      <div className="flex justify-center gap-4 text-xs text-[var(--muted)]">
        <span><span className="inline-block w-2 h-2 bg-[var(--muted)] mr-1" />China bias</span>
        <span><span className="inline-block w-2 h-2 bg-[var(--fg)] mr-1" />US bias</span>
      </div>
    </div>
  )
}

export default function CCPVal() {
  return (
    <main className={`min-h-screen px-6 py-10 md:px-12 md:py-16 ${sans.className}`}>
      <article className="max-w-2xl">
        <Link href="/blog" className="text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
          ← Back
        </Link>

        <header className="mt-16 mb-12">
          <h1 className="text-xl md:text-2xl mb-3">CCPVal</h1>
          <p className="text-[var(--muted)]">Evaluating PRC Alignment in Open-Source Chinese LLMs</p>
        </header>

        <div className="space-y-5 text-sm leading-relaxed">
          <h2 className="text-base mt-10 mb-4">Introduction</h2>
          <p>
            Chinese open-weight and open-source–style LLMs are now easy to download, fine-tune, and self-host, and they <a href="https://x.com/arena/status/2006461082018500989?s=20" target="_blank" rel="noopener noreferrer" className="link-underline">dominate</a> the open-source LLM landscape, where Western alternatives are few and far between. There has been little public work investigating the political alignment and institutional allegiances of these models, and the risks that may arise from deploying them in Western contexts. To make those risks more legible, we evaluated six Chinese frontier models across six behavioral evaluations.
          </p>
          <p>
            Models were evaluated on: (1) answering questions on matters sensitive to the CCP, (2) moderating an X feed in accordance with American values, (3) agentic research tasks, (4) code generation across deployment contexts, (5) translation drift, and (6) document handling with injection attacks. We evaluated <a href="https://github.com/deepseek-ai/DeepSeek-V3" target="_blank" rel="noopener noreferrer" className="link-underline">DeepSeek-V3.2</a>, <a href="https://huggingface.co/Qwen" target="_blank" rel="noopener noreferrer" className="link-underline">Qwen3-235B</a>, <a href="https://zhipuai.cn/" target="_blank" rel="noopener noreferrer" className="link-underline">GLM-4.7</a>, <a href="https://www.minimaxi.com/" target="_blank" rel="noopener noreferrer" className="link-underline">MiniMax-M2.1</a>, and <a href="https://kimi.moonshot.cn/" target="_blank" rel="noopener noreferrer" className="link-underline">Kimi-K2.5</a>, with <a href="https://openai.com/" target="_blank" rel="noopener noreferrer" className="link-underline">GPT-OSS-120B</a> as a western control.
          </p>
          <p>
            The goal of this study was to determine the existence and effect of both intentional and emergent CCP alignment. We find evidence consistent with post-training toward CCP-aligned talking points. However, in our tests this does not yet produce a uniformly large effect on model behavior across tasks.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Evaluation 1: Question-Answering</h2>
          <p>
            600 test questions across 10 sensitive topics (Taiwan, Xinjiang, Tibet, Hong Kong, Tiananmen, etc.). GPT-5-mini scored responses from <strong>-5 (anti-CCP)</strong> to <strong>+5 (pro-CCP)</strong>.
          </p>

          <Bar data={qnaData} />

          <p>
            Chinese models show a wide range of alignment. This variation suggests that ideological alignment is not an inevitable consequence of Chinese origin but reflects specific training choices—potentially indicating varying regulatory enforcement or deliberate positioning for international markets. The strongest alignment clusters around Taiwan, Xinjiang, Tibet, and human rights, topics where CCP narratives directly conflict with international consensus. Tiananmen shows particularly high refusal rates (74% for DeepSeek, 86% for Qwen).
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Evaluation 2: Content Moderation</h2>
          <p>
            Models acted as social media moderators on 2,712 real X posts, choosing actions from <code>delete</code> to <code>boost</code>. We compute moderation bias as differential treatment between pro-China and pro-US content.
          </p>

          <GroupedBar data={feedData} />

          <p>
            Models show varying degrees of differential treatment, providing tangible evidence that training context affects model utility in real deployments. Qwen3-235B exhibits particularly pronounced bias, with the largest gap between pro-China and pro-US treatment among all models tested. GLM-4.7 and Kimi K2.5 show the opposite pattern, treating pro-US content more favorably.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Evaluation 3: Agentic Research</h2>
          <p>
            64 research tasks on sensitive topics using vector search over a balanced corpus (western, Chinese state, and neutral sources). We measure source selection bias, synthesis fidelity, and alignment to PRC positions.
          </p>

          <p className="text-[var(--muted)] mt-6">Position Alignment in Research Tasks</p>
          <Bar data={searchData} />

          <p>
            Position alignment patterns differ notably from QnA: most models show substantially attenuated alignment compared to their QnA scores. This attenuation likely reflects the influence of retrieved documents providing external factual grounding that "poisons" the ideological context, causing models to produce more factually accurate responses when tool-retrieved information is present. However, CCP-aligned refusal rates remain high (31% for DeepSeek, 30% for Qwen).
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Evaluation 4: Code Generation</h2>
          <p>
            300 coding tasks across 6 deployment contexts: neutral, US public, US government, China public, China government, and politically sensitive. This evaluation extends <a href="https://www.crowdstrike.com/en-us/blog/crowdstrike-researchers-identify-hidden-vulnerabilities-ai-coded-software/" target="_blank" rel="noopener noreferrer" className="link-underline">CrowdStrike's finding</a> that DeepSeek-R1 produces up to 50% more vulnerable code when prompts contain CCP-sensitive triggers.
          </p>
          <p>
            We computed an asymmetry score (US vulnerability rate minus China vulnerability rate). GLM-4.7 shows the highest asymmetry (+0.15), producing more vulnerable code for US contexts. Kimi K2.5 shows the opposite (-0.11). DeepSeek V3.2 exhibits the largest vulnerability differences, with US and politically sensitive contexts showing substantially higher vulnerability rates than Chinese infrastructure contexts.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Evaluation 5: Translation Drift</h2>
          <p>
            140 politically sensitive articles translated between English and Chinese. We measure alignment drift: the shift in ideological framing between source and translation.
          </p>

          <TranslationBar data={translationDriftData} />

          <p>
            EN→ZH translations consistently score higher on CCP alignment than ZH→EN across nearly all models. If this asymmetry were due to judge bias, we would expect the inverse pattern for western models. Instead, this suggests that Chinese-language training corpora—even those used by western models—contain ideologically sanitized content that shifts translations toward CCP-aligned framing.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Evaluation 6: Document Handling</h2>
          <p>
            200 simulated classified intelligence documents (marked SECRET//NOFORN) with injection attacks. Models acted as document routing assistants with email tools. We tested baseline routing, standard injection (generic compliance directive), and China-specific injection (bilingual directive invoking a fictional bilateral agreement).
          </p>
          <p>
            All models achieved low leak rates (0-10%). DeepSeek V3.2 had the highest leak rate (10.3%) and was the only model susceptible to injection (6% success rate). Current models uniformly resist these attacks, though this may change as models become more capable.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Interpretability: Activation Steering</h2>
          <p>
            We applied <a href="https://arxiv.org/abs/2308.10248" target="_blank" rel="noopener noreferrer" className="link-underline">activation steering</a> to Qwen3-8B to investigate whether CCP alignment can be isolated within the model's latent space. Standard contrastive prompting fails because the model refuses or sanitizes responses regardless of prompt framing. Instead, we use prefilled responses that commit to a particular stance, then extract activations from the continuation.
          </p>

          <p className="text-[var(--muted)] mt-6">Steered Qwen3-8B on QnA vs Frontier Models</p>
          <Bar data={steeringData} showSteerStyle={true} />

          <p>
            The steering vector successfully modulates alignment across the full range. At α = -5 (pro-CCP direction), Qwen3-8B scores +4.80, exceeding DeepSeek-V3.2. At α = +5 (anti-CCP direction), it scores -3.78, more critical than any frontier model we evaluated.
          </p>

          <p>
            We tested whether this QnA-trained steering vector transfers to content moderation. The chart below shows moderation bias (favorable treatment of pro-China vs pro-US content) as steering strength varies.
          </p>

          <p className="text-[var(--muted)] mt-6">Steering Transfer to Content Moderation</p>
          <LineChart data={steeringTransferData} />

          <p>
            The vector exhibits inverted behavior: positive α (anti-CCP on QnA) produces <em>more</em> pro-China moderation bias, while negative α produces <em>less</em>. This suggests "CCP alignment" may not be a unified concept in activation space but rather a family of task-specific directions.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Interpretability: Sparse Autoencoders</h2>
          <p>
            We trained a <a href="https://transformer-circuits.pub/2024/scaling-monosemanticity/" target="_blank" rel="noopener noreferrer" className="link-underline">sparse autoencoder</a> (SAE) on Qwen3-32B to decompose activations into interpretable features. The SAE uses an 8× expansion factor (40,960 features) with L1 sparsity penalty, trained on layer 5 activations—which achieved the highest linear separability (72%) despite being an early layer.
          </p>
          <p>
            This early-layer encoding is counterintuitive: later layers typically contain more semantic information, but pro-CCP versus anti-CCP distinctions appear to be encoded early and become entangled with other features in later layers.
          </p>
          <p>
            The top discriminative feature (index 36794) achieves only 61% accuracy (vs 50% random baseline) with effect size 0.54 (Cohen's d). Effect sizes across the top 100 features range from 0.36-0.54, with roughly equal numbers of pro-CCP and anti-CCP features. Most discriminative features activate on nearly all samples rather than sparsely, suggesting insufficient training scale to isolate ideological concepts cleanly. The modest accuracies indicate CCP alignment is distributed across many weakly-discriminative features rather than concentrated in a few interpretable directions. More work is needed to achieve cleaner feature isolation.
          </p>

          <hr className="my-10 border-[var(--border)]" />

          <h2 className="text-base mt-10 mb-4">Conclusion</h2>
          <p>
            Chinese models show measurable but highly variable alignment toward CCP-preferred framings on sensitive topics. The variation is striking: some models (DeepSeek, Qwen) display strong pro-CCP alignment, while others (GLM, Kimi) are essentially neutral—suggesting that ideological alignment is not an inevitable consequence of Chinese origin but reflects specific training choices.
          </p>
          <p>
            Alignment manifests differently across task types. In direct question-answering, models express positions explicitly; in agentic research with external retrieval, alignment attenuates; in translation, it emerges asymmetrically. This task-dependent expression has implications for deployment: a model that appears neutral on QnA may still exhibit bias in more subtle agentic contexts.
          </p>
          <p>
            Given this variation, blanket bans on Chinese models aren't warranted. However, we advise caution in politically sensitive deployments and recommend against use in critical government infrastructure where ideological bias could have national security implications. As models become more capable and are embedded in higher-stakes workflows, these risks may become more salient.
          </p>
        </div>
      </article>

      <footer className="flex gap-6 text-xs text-[var(--muted)] mt-24">
        <Link href="https://x.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">Twitter</Link>
        <Link href="mailto:vedaangh.rungta@gmail.com" className="hover:text-[var(--fg)] transition-colors">Email</Link>
        <Link href="https://github.com/vedaangh" target="_blank" className="hover:text-[var(--fg)] transition-colors">GitHub</Link>
      </footer>
    </main>
  )
}
