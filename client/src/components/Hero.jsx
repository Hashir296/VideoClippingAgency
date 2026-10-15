import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { useAudit } from '../context/AuditContext.jsx';
import { Magnetic, SplitText, SPRING, EASE_OUT } from './ui.jsx';
import MomentConsole from './MomentConsole.jsx';
import TiltStage from './TiltStage.jsx';

const up = (d) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.95, delay: d, ease: EASE_OUT },
});

const stats = [
  ['50M+', 'Views delivered'],
  ['120k+', 'Community joins'],
  ['24/7', 'Automated funnels'],
];

const headline = [
  { t: 'Engineering Viral Distribution into' },
  { t: 'Predictable Enterprise Revenue.', cls: 'italic font-medium text-[#D4AF37]' },
];

export default function Hero({ onExploreArticles }) {
  const { openAudit } = useAudit();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const p = useSpring(scrollYProgress, SPRING);

  const yText = useTransform(p, [0, 1], [0, -85]);
  const yStage = useTransform(p, [0, 1], [0, 65]);
  const gridY = useTransform(p, [0, 1], [0, 110]);
  const opacity = useTransform(p, [0, 0.85], [1, 0.3]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden px-5 pb-28 pt-36 md:pt-48 bg-[#070709]">
      {/* Background kinetic luminous gridlines */}
      <motion.div
        style={{ y: gridY }}
        className="gridlines pointer-events-none absolute inset-0 mx-auto max-w-7xl [mask-image:linear-gradient(to_bottom,white_30%,transparent_90%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div style={{ y: yText, opacity }} className="max-w-5xl">
          {/* Eyebrow badge */}
          <motion.div {...up(0.08)} className="mb-6 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            <p className="eyebrow tracking-[0.2em]">[ System No. 01 — Full-Funnel Attention Architecture ]</p>
          </motion.div>

          {/* Kinetic Text Split Reveal */}
          <SplitText
            segments={headline}
            delay={0.2}
            className="display text-[2.85rem] leading-[0.98] sm:text-7xl md:text-[5.75rem]"
          />

          <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
            <motion.p {...up(0.85)} className="max-w-xl text-lg leading-relaxed text-[#A3A3B0] md:col-span-7">
              We move past commodity video editing. Long-form IP becomes multi-platform short-form dominance;
              winning pieces are syndicated through paid infrastructure; bespoke capture systems turn attention
              into an audience you own.
            </motion.p>

            <motion.div {...up(1.0)} className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end">
              {/* Magnetic CTA Button with 50px attraction radius */}
              <Magnetic radius={50} strength={0.35}>
                <button
                  id="hero-request"
                  onClick={() => openAudit()}
                  className="btn-ink group relative overflow-hidden"
                >
                  <span>Request Private Audit</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </Magnetic>

              <button
                onClick={onExploreArticles}
                className="btn-line inline-flex items-center gap-2"
              >
                <BookOpen size={14} className="text-[#D4AF37]" />
                Field Notes
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Minimal stats row with dark hairline borders */}
        <motion.dl {...up(1.15)} className="mt-16 grid grid-cols-3 border-y border-white/10">
          {stats.map(([v, l], i) => (
            <div key={l} className={`py-6 ${i > 0 ? 'border-l border-white/10 pl-5 md:pl-8' : ''}`}>
              <dt className="font-serif text-3xl font-medium tracking-tight text-[#F5F3EF] md:text-5xl">{v}</dt>
              <dd className="eyebrow mt-1 !text-[10px] md:!text-[11px] !text-neutral-400">{l}</dd>
            </div>
          ))}
        </motion.dl>

        {/* Interactive 3D Depth Card / Viewport Stage */}
        <motion.div style={{ y: yStage }} className="mt-20">
          <motion.div {...up(1.3)}>
            <TiltStage>
              <MomentConsole />
            </TiltStage>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
