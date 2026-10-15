import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useAudit } from '../context/AuditContext.jsx';
import { SectionHead, GlowCard, Magnetic, SPRING } from './ui.jsx';

const FALLBACK = [
  {
    id: 'foundation',
    name: 'Starter',
    title: 'Foundation',
    tagline: 'A disciplined volume test.',
    price: 1500,
    popular: false,
    features: [
      ['Clip output', '20–30 per month'],
      ['Distribution', 'Native, automated'],
      ['Reporting', 'Monthly growth report'],
      ['Paid leverage', '—'],
      ['Capture systems', '—'],
      ['Strategy', '—'],
    ],
  },
  {
    id: 'acceleration',
    name: 'Growth',
    title: 'Acceleration',
    tagline: 'Where distribution meets leverage.',
    price: 3500,
    popular: true,
    features: [
      ['Clip output', '20–30 per month'],
      ['Distribution', 'Native, automated'],
      ['Reporting', 'Weekly deep analytics'],
      ['Paid leverage', 'Spark Ads & Boosts engine'],
      ['Capture systems', 'Custom link hub & landing page'],
      ['Strategy', '—'],
    ],
  },
  {
    id: 'private-office',
    name: 'Full System',
    title: 'Private Office',
    tagline: 'The complete architecture, run for you.',
    price: 6500,
    popular: false,
    features: [
      ['Clip output', '20–30 per month'],
      ['Distribution', 'Native, automated'],
      ['Reporting', 'Weekly deep analytics'],
      ['Paid leverage', 'Spark Ads & Boosts engine'],
      ['Capture systems', 'Proprietary landing pages, DM automation, email & Discord funnels'],
      ['Strategy', 'Sponsor funnels & executive strategy calls'],
    ],
  },
];

function Seal() {
  return (
    <div className="absolute -right-4 -top-8 h-24 w-24 md:-right-6 select-none" aria-label="Recommended Architecture">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spinSlow">
        <defs>
          <path id="seal-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="#D4AF37" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#08080A" strokeWidth="1" />
        <text fontSize="8.2" fontFamily="JetBrains Mono, monospace" letterSpacing="2.2" fill="#08080A" fontWeight="600">
          <textPath href="#seal-circle">RECOMMENDED ARCHITECTURE · RECOMMENDED ·</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-serif text-2xl font-bold italic text-[#08080A]">
        II
      </div>
    </div>
  );
}

export default function Retainers() {
  const { openAudit } = useAudit();
  // Initialize directly with FALLBACK so the page never flashes blank or delays render
  const [plans, setPlans] = useState(FALLBACK);

  useEffect(() => {
    let alive = true;
    api
      .getPackages()
      .then((r) => {
        if (alive && r?.data?.length) setPlans(r.data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="retainers" className="bg-[#0A0A0E] px-5 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="Chapter IV"
          label="Private Retainers"
          title={
            <>
              Three tiers. <em className="italic text-[#D4AF37]">By invitation.</em>
            </>
          }
        >
          Month-to-month engagements. Every relationship begins with a complimentary three-clip sample.
        </SectionHead>

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {plans.map((p, idx) => (
            <GlowCard
              as="article"
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: SPRING }}
              className={`relative flex flex-col justify-between rounded-[28px] p-8 transition-all duration-500 ${
                p.popular
                  ? 'bg-[#14141C] border border-[#D4AF37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(212,175,55,0.1)]'
                  : 'bg-[#0E0E14] border border-white/10 shadow-lift'
              }`}
            >
              {p.popular && <Seal />}
              <div>
                <p className="eyebrow !text-[#C5A880]">Tier {['I', 'II', 'III'][idx]}</p>
                <h3 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[#F5F3EF]">{p.title}</h3>
                <p className="mt-2 text-sm text-[#A3A3B0]">{p.tagline}</p>

                <div className="mt-8 flex items-baseline gap-2 border-b border-white/10 pb-8">
                  <span className="font-serif text-5xl font-medium text-[#F5F3EF]">
                    ${p.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                    / month
                  </span>
                </div>

                <dl className="mt-4">
                  {p.features.map(([k, v]) => {
                    const none = v === '—';
                    return (
                      <div
                        key={k}
                        className="grid grid-cols-[110px_1fr] gap-3 border-b border-white/[0.07] py-3.5 text-sm"
                      >
                        <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">{k}</dt>
                        <dd className={none ? 'text-neutral-600' : 'text-[#F5F3EF] font-medium'}>{v}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>

              <div className="mt-8 pt-2">
                <Magnetic radius={50} strength={0.3} className="w-full">
                  <button
                    id={`retainer-${p.id}`}
                    onClick={() => openAudit(p.name)}
                    className={`w-full ${p.popular ? 'btn-ink' : 'btn-line'}`}
                  >
                    Apply for {p.title}
                  </button>
                </Magnetic>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
