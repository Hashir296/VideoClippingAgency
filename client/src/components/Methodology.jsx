import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionHead, Reveal } from './ui.jsx';

const stages = [
  {
    n: '01', name: 'Content',
    lede: '20–30 short clips extracted from every long-form source.',
    metrics: [['20–30', 'Clips per source'], ['1.5s', 'Hook window'], ['100%', 'Captioned']],
    deliverables: ['Transcript-level moment scoring', 'Dynamic, brand-matched captions', 'High-retention hook engineering', 'Platform-native aspect and pacing'],
  },
  {
    n: '02', name: 'Distribution',
    lede: 'Native scheduling across TikTok, Reels and Shorts.',
    metrics: [['3', 'Native platforms'], ['Daily', 'Posting cadence'], ['Live', 'Retention analytics']],
    deliverables: ['Native uploads, never cross-posted watermarks', 'Peak-window scheduling', 'Retention curves fed back into selection', 'Weekly performance ledger'],
  },
  {
    n: '03', name: 'Paid Leverage',
    lede: 'The top 10–20% of organic performers, amplified.',
    metrics: [['10–20%', 'Of clips syndicated'], ['Spark', 'TikTok Ads'], ['Boost', 'Instagram']],
    deliverables: ['Winner identification from organic data', 'TikTok Spark Ads and Instagram Boosts', 'Budget pacing and creative rotation', 'Cost-per-view and lead reporting'],
  },
  {
    n: '04', name: 'Audience Capture',
    lede: 'Bespoke systems that convert attention into owned audience.',
    metrics: [['Hub', 'Custom link page'], ['Gate', 'Discord access'], ['Funnel', 'Lead capture']],
    deliverables: ['High-converting link hubs and landing pages', 'Discord community gates', 'Custom lead funnels', 'Source-level attribution'],
  },
  {
    n: '05', name: 'Monetization Engine',
    lede: 'Automation that turns captured audience into revenue.',
    metrics: [['Auto', 'DM replies'], ['CRM', 'Live sync'], ['Sponsor', 'Funnels']],
    deliverables: ['Comment-triggered DM automation ("Comment JOIN")', 'CRM syncing and lead scoring', 'Brand sponsor funnels and media kits', 'Monthly executive review'],
  },
];

export default function Methodology() {
  const [open, setOpen] = useState(0);

  return (
    <section id="methodology" className="bg-bone/60 px-5 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHead index="Chapter II" label="The 5-Engine Methodology" title={<>Five engines. <em className="italic text-gold-deep">One compounding system.</em></>}>
          Each stage feeds the next. Select a stage to examine its deliverables.
        </SectionHead>

        <Reveal className="border-t border-black/15">
          {stages.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.n} className="border-b border-black/15">
                <button
                  id={`stage-${s.n}`}
                  aria-expanded={isOpen}
                  aria-controls={`stage-panel-${s.n}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group grid w-full grid-cols-[56px_1fr_32px] items-center gap-4 py-7 text-left md:grid-cols-[100px_1fr_40px] md:py-9"
                >
                  <span className="font-mono text-xs tracking-widest text-body">{s.n}</span>
                  <span className={`font-serif text-3xl font-medium tracking-tight transition-all duration-500 md:text-5xl ${isOpen ? 'translate-x-2 text-ink' : 'text-neutral-400 group-hover:translate-x-2 group-hover:text-ink'}`}>
                    {s.name}
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-8 w-8 place-items-center rounded-full border border-black/20 text-ink md:h-10 md:w-10">
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`stage-panel-${s.n}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-10 pb-12 md:grid-cols-[100px_1fr_1fr]">
                        <div className="hidden md:block" />
                        <div>
                          <p className="font-serif text-2xl italic leading-snug text-ink">{s.lede}</p>
                          <dl className="mt-8 grid grid-cols-3 gap-4">
                            {s.metrics.map(([v, l]) => (
                              <div key={l} className="border-l border-gold pl-4">
                                <dt className="font-serif text-3xl font-medium text-ink">{v}</dt>
                                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-body">{l}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        <ul>
                          {s.deliverables.map((d) => (
                            <li key={d} className="flex gap-4 border-t border-black/10 py-3.5 text-sm text-ink first:border-t-0 first:pt-0">
                              <span className="mt-2 h-px w-4 shrink-0 bg-gold-deep" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
