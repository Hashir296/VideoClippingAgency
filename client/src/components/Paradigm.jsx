import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { Reveal, SectionHead, GlowCard } from './ui.jsx';

const commodity = [
  ['Manual output', 'Hand-cut edits with no scoring, no pacing logic, no repeatable standard.'],
  ['Fragmented archives', 'Deliverables abandoned in shared Drive folders, never distributed.'],
  ['Zero retention insight', 'No feedback loop from the audience back into the next batch.'],
  ['No backend value', 'Views accrue to the platform. Nothing is captured, owned or monetised.'],
];

const architecture = [
  ['Transcript moment scoring', 'AI ranks every second of long-form IP by hook strength and pacing.'],
  ['Systematic distribution', 'Native scheduling across TikTok, Reels and Shorts, guided by retention data.'],
  ['Ad leverage', 'The top 10–20% of organic performers are syndicated via paid infrastructure.'],
  ['Owned audience capture', 'Link hubs, community gates and DM automation convert attention into leads.'],
];

function Column({ tone, kicker, title, rows, Icon }) {
  const isArchitecture = tone === 'gold';
  return (
    <Reveal>
      <GlowCard
        className={`rounded-[28px] p-8 md:p-12 transition-all duration-300 ${
          isArchitecture
            ? 'bg-[#13131A] border border-[#D4AF37]/35 shadow-[0_15px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(212,175,55,0.08)]'
            : 'bg-[#0E0E13] border border-white/10 shadow-soft'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className={`h-1.5 w-1.5 rounded-full ${isArchitecture ? 'bg-[#D4AF37]' : 'bg-neutral-500'}`} />
          <p className={`eyebrow ${isArchitecture ? '!text-[#D4AF37]' : '!text-neutral-400'}`}>{kicker}</p>
        </div>

        <h3 className="font-serif text-3xl font-medium tracking-tight text-[#F5F3EF] md:text-4xl">{title}</h3>

        <ul className="mt-10">
          {rows.map(([t, d], i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
              className={`grid grid-cols-[28px_1fr] gap-4 border-t py-5 ${
                isArchitecture ? 'border-white/10' : 'border-white/5'
              }`}
            >
              <Icon size={16} className={`mt-1.5 ${isArchitecture ? 'text-[#D4AF37]' : 'text-neutral-500'}`} />
              <div>
                <div className="font-medium text-[#F5F3EF]">{t}</div>
                <div className="mt-1 text-sm leading-relaxed text-[#A3A3B0]">{d}</div>
              </div>
            </motion.li>
          ))}
        </ul>
      </GlowCard>
    </Reveal>
  );
}

export default function Paradigm() {
  return (
    <section id="engine" className="px-5 py-28 md:py-40 bg-[#070709]">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="Chapter I"
          label="The Paradigm Shift"
          title={
            <>
              Clips are a commodity. <em className="italic text-[#D4AF37]">Architecture is not.</em>
            </>
          }
        >
          The freelance model sells raw output. We build the system behind it — measurable, compounding, and owned.
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-2">
          <Column kicker="Before · The Fragile Way" title="The Commodity Clipper" rows={commodity} Icon={Minus} />
          <Column tone="gold" kicker="After · The Compounding Way" title="The Growth Architecture" rows={architecture} Icon={Plus} />
        </div>
      </div>
    </section>
  );
}
