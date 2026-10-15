import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionHead, Reveal } from './ui.jsx';

const engines = ['Content', 'Distribution', 'Paid Leverage', 'Audience Capture', 'Monetization'];

const segments = [
  {
    id: 'creators',
    tab: 'Streamers & Podcasters',
    tagline: 'From stream highlights to a self-sustaining audience.',
    outcome: 'Subscriber growth, sponsor inbound, community depth.',
    rows: [
      'Clutch plays, rage reactions and guest hot takes isolated from multi-hour VODs.',
      'Daily native posting with retention-led selection of the next batch.',
      'Spark-boosted highlights that drive sub conversions and channel follows.',
      'Discord invites and newsletter gates at the point of peak attention.',
      '"Comment JOIN" DM automation and brand sponsor funnels.',
    ],
  },
  {
    id: 'educators',
    tab: 'High-Ticket Educators',
    tagline: 'From framework clips to a qualified application queue.',
    outcome: 'Webinar registrations, cohort applications, authority.',
    rows: [
      'Proprietary frameworks and teaching moments distilled from webinars and lessons.',
      'Authority-first cadence tuned to professional audiences on every platform.',
      'Paid syndication of the clips that already pull the highest-intent viewers.',
      'Dedicated landing pages with application and webinar capture.',
      'Automated DM qualification and calendar booking into your CRM.',
    ],
  },
  {
    id: 'founders',
    tab: 'Venture Founders',
    tagline: 'From founder voice to inbound enterprise deal flow.',
    outcome: 'Pipeline, hiring brand, investor and partner awareness.',
    rows: [
      'Point-of-view moments from interviews, keynotes and internal town halls.',
      'Distribution built around founder credibility and category narrative.',
      'Targeted paid reach into the buyer, investor and talent segments you name.',
      'Private capture hubs routing intent to sales, recruiting and partnerships.',
      'CRM-synced outreach triggers and executive-level reporting.',
    ],
  },
];

export default function Segments() {
  const [active, setActive] = useState(segments[0].id);
  const s = segments.find((x) => x.id === active);

  return (
    <section id="segments" className="px-5 py-28 md:py-40 bg-[#070709]">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="Chapter III"
          label="Curated Case Studies"
          title={
            <>
              One architecture. <em className="italic text-[#D4AF37]">Three disciplines.</em>
            </>
          }
        >
          The same five engines, adapted to the economics of the business behind the content.
        </SectionHead>

        <Reveal>
          <div
            role="tablist"
            aria-label="Client segments"
            className="no-scrollbar mb-10 flex gap-8 overflow-x-auto border-b border-white/10"
          >
            {segments.map((x) => (
              <button
                key={x.id}
                id={`segment-${x.id}`}
                role="tab"
                aria-selected={active === x.id}
                onClick={() => setActive(x.id)}
                className={`relative shrink-0 pb-5 text-sm tracking-wide transition-colors ${
                  active === x.id ? 'text-[#F5F3EF] font-medium' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {x.tab}
                {active === x.id && (
                  <motion.span
                    layoutId="segment-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-12 md:grid-cols-12" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id + '-a'}
                className="md:col-span-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[#F5F3EF] md:text-4xl">
                  {s.tagline}
                </h3>
                <p className="eyebrow mt-8 !text-[#D4AF37]">Strategic Outcome</p>
                <p className="mt-2 text-[#A3A3B0] leading-relaxed">{s.outcome}</p>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.ol
                key={s.id + '-b'}
                className="md:col-span-7"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              >
                {s.rows.map((r, i) => (
                  <motion.li
                    key={r}
                    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ x: 6 }}
                    className="grid grid-cols-[40px_150px_1fr] items-baseline gap-3 border-t border-white/10 py-5 last:border-b"
                  >
                    <span className="font-mono text-[11px] text-[#D4AF37]">0{i + 1}</span>
                    <span className="font-serif text-xl text-[#F5F3EF]">{engines[i]}</span>
                    <span className="text-sm leading-relaxed text-[#A3A3B0]">{r}</span>
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
