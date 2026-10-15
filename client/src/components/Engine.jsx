import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { GlowCard, SPRING } from './ui.jsx';

const modules = [
  {
    n: '01',
    name: 'Content',
    sub: 'AI Moment Extraction',
    lede: '20–30 high-impact short clips extracted systematically from every long-form source.',
    metrics: [
      ['20–30', 'Clips per source'],
      ['1.5s', 'Hook window'],
      ['100%', 'Brand captioned'],
    ],
    deliverables: [
      'Transcript-level moment scoring',
      'Dynamic, brand-matched captions',
      'High-retention hook engineering',
      'Platform-native aspect and pacing',
    ],
  },
  {
    n: '02',
    name: 'Distribution',
    sub: 'Platform Auto-Push',
    lede: 'Direct native scheduling across TikTok, Reels, and Shorts without watermark degradation.',
    metrics: [
      ['3', 'Native platforms'],
      ['Daily', 'Posting cadence'],
      ['Live', 'Retention analytics'],
    ],
    deliverables: [
      'Native uploads, never watermarked reposts',
      'Peak-window scheduling algorithm',
      'Retention curves fed back into selection',
      'Weekly performance ledger',
    ],
  },
  {
    n: '03',
    name: 'Paid Boost',
    sub: 'Organic Winner Ads',
    lede: 'The top 10–20% of organic performers amplified directly through ad infrastructure.',
    metrics: [
      ['10–20%', 'Top clips syndicated'],
      ['Spark', 'TikTok Ads API'],
      ['Boost', 'Instagram integration'],
    ],
    deliverables: [
      'Winner identification from organic telemetry',
      'TikTok Spark Ads and Instagram Boosts',
      'Budget pacing and creative rotation',
      'Cost-per-view and lead attribution',
    ],
  },
  {
    n: '04',
    name: 'Capture',
    sub: 'Link Hub & Lead Funnels',
    lede: 'Bespoke systems that seamlessly convert volatile platform attention into owned audience equity.',
    metrics: [
      ['Hub', 'Custom link portal'],
      ['Gate', 'Discord community'],
      ['Funnel', 'Lead capture engine'],
    ],
    deliverables: [
      'High-converting link hubs and landing pages',
      'Discord community gating & access control',
      'Custom lead funnels with instant routing',
      'Source-level UTM attribution tracking',
    ],
  },
  {
    n: '05',
    name: 'Monetization',
    sub: 'Auto DMs & Inbound Pipeline',
    lede: 'Autonomous automation that turns comments and captured audience into high-ticket pipeline.',
    metrics: [
      ['Auto', 'DM conversation triggers'],
      ['CRM', 'Real-time synchronization'],
      ['Sponsor', 'Deal flow funnels'],
    ],
    deliverables: [
      'Comment-triggered DMs ("Comment JOIN")',
      'CRM syncing and inbound lead scoring',
      'Brand sponsor media kits and funnels',
      'Monthly executive review and growth audit',
    ],
  },
];

const N = modules.length;
const STEP = 1 / (N - 1);

function ModuleCard({ m, i, progress, cardRef }) {
  const center = i * STEP;
  const range = [center - STEP * 0.9, center, center + STEP * 0.9];
  const scale = useTransform(progress, range, [0.9, 1, 0.9]);
  const opacity = useTransform(progress, range, [0.35, 1, 0.35]);
  const filter = useTransform(progress, range, ['blur(3px)', 'blur(0px)', 'blur(3px)']);
  const y = useTransform(progress, range, [20, 0, 20]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity, filter, y }}
      className="w-[var(--card-width)] shrink-0 will-change-transform"
    >
      <GlowCard className="relative flex h-[min(62vh,540px)] min-h-[440px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#121217] p-7 shadow-lift border border-white/10 md:p-10">
        {/* Giant luxury watermark numeral */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-14 -right-4 select-none font-serif text-[14rem] font-medium leading-none text-white/[0.03]"
        >
          {m.n}
        </span>

        <div>
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              <span className="eyebrow tracking-[0.16em]">
                Module {m.n} / 0{N}
              </span>
            </div>
            <span className="font-mono text-[11px] text-neutral-400">Proprietary Architecture</span>
          </div>

          <h3 className="mt-6 font-serif text-4xl font-medium tracking-tight text-[#F5F3EF] md:text-5xl">
            {m.name}
          </h3>
          <p className="mt-2 font-serif text-xl italic text-[#D4AF37]">{m.sub}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#A3A3B0]">{m.lede}</p>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            {m.metrics.map(([v, l]) => (
              <div key={l} className="border-l border-[#D4AF37]/50 pl-3">
                <dt className="font-serif text-2xl font-medium text-[#F5F3EF] md:text-3xl">{v}</dt>
                <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative pt-6">
          <p className="eyebrow mb-3 !text-[9.5px]">Core Deliverables</p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {m.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-[#171720] px-3 py-2 text-[12px] text-[#F5F3EF]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                <span className="truncate">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export default function Engine() {
  const sectionRef = useRef(null);
  const firstCardRef = useRef(null);
  const [stepPx, setStepPx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const progress = useSpring(scrollYProgress, SPRING);

  useEffect(() => {
    const measure = () => {
      const card = firstCardRef.current;
      if (!card || !card.parentElement) return;
      const gap = parseFloat(window.getComputedStyle(card.parentElement).columnGap) || 24;
      setStepPx(card.offsetWidth + gap);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const x = useTransform(progress, [0, 1], [0, -stepPx * (N - 1)]);
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(progress, 'change', (val) => {
    const idx = Math.min(N - 1, Math.max(0, Math.round(val * (N - 1))));
    setActiveIdx(idx);
  });

  const jumpTo = (i) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionStart = rect.top + scrollTop;
    const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
    const target = sectionStart + (i / (N - 1)) * sectionHeight;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <section
      id="methodology"
      ref={sectionRef}
      className="relative h-[440vh] bg-[#0A0A0E]"
      aria-label="Pinned Horizontal Growth Engine Scrub"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-8 pt-20">
        {/* Section Header */}
        <div className="mx-auto mb-6 flex w-full max-w-6xl items-end justify-between gap-6 px-5">
          <div>
            <p className="eyebrow mb-3">[ Chapter II — The Growth Engine ]</p>
            <h2 className="h2 !text-3xl sm:!text-4xl md:!text-5xl">
              Five engines. <em className="italic text-[#D4AF37]">One compounding system.</em>
            </h2>
          </div>

          <div className="hidden text-right md:block">
            <div className="font-serif text-6xl font-medium leading-none text-[#F5F3EF]">
              <motion.span
                key={activeIdx}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={SPRING}
                className="inline-block text-[#D4AF37]"
              >
                0{activeIdx + 1}
              </motion.span>
              <span className="text-2xl text-neutral-500">/0{N}</span>
            </div>
            <p className="eyebrow mt-1 text-[10px] !text-neutral-400">Scroll down to scrub</p>
          </div>
        </div>

        {/* Horizontal Scrub Track */}
        <motion.div
          style={{
            x,
            '--card-width': 'min(86vw, 560px)',
            paddingLeft: 'calc(50vw - var(--card-width) / 2)',
            paddingRight: 'calc(50vw - var(--card-width) / 2)',
          }}
          className="flex w-max gap-6 will-change-transform"
        >
          {modules.map((m, i) => (
            <ModuleCard
              key={m.n}
              m={m}
              i={i}
              progress={progress}
              cardRef={i === 0 ? firstCardRef : undefined}
            />
          ))}
        </motion.div>

        {/* Scrub Progress Bar and Navigation */}
        <div className="mx-auto mt-8 w-full max-w-6xl px-5">
          <div className="relative h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="absolute inset-y-0 left-0 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
            />
          </div>

          <ol className="mt-4 flex justify-between gap-2">
            {modules.map((m, i) => {
              const active = i === activeIdx;
              return (
                <li key={m.n} className="flex-1">
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    className="group w-full text-left transition-colors"
                  >
                    <span
                      className={`block font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                        active ? 'text-[#D4AF37] font-semibold' : 'text-neutral-500 group-hover:text-[#F5F3EF]'
                      }`}
                    >
                      {m.n} <span className="hidden sm:inline">· {m.name}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
