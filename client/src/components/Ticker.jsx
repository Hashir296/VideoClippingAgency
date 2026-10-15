import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const defaultPhrases = [
  '50M+ Organic Impressions',
  'Automated Syndication',
  'Zero Commodity Waste',
  'Proprietary AI Scoring',
  'High-Retention Hooks',
  'Full-Funnel Conversion',
];

/**
 * Ultra-Smooth Infinite Kinetic Editorial Ticker (Dark Luxury Edition):
 * Glides with silky smooth frame pacing, clamped delta, and gentle scroll velocity boost.
 */
export default function Ticker({ baseVelocity = -1.2, customPhrases = null }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Gentle spring dampening for silky acceleration
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 200, mass: 0.5 });
  const velocityFactor = useTransform(smoothVelocity, [-1500, 0, 1500], [-2.5, 0, 2.5], { clamp: true });

  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;

    // Clamp delta to prevent jerky jumps after background tab inactive
    const safeDelta = Math.min(delta, 32);
    let speed = baseVelocity * (safeDelta / 1000) * 12;
    const boost = velocityFactor.get();

    if (boost > 0.1) direction.current = 1;
    else if (boost < -0.1) direction.current = -1;

    // Apply smooth acceleration without sudden inversions
    const extra = Math.min(Math.abs(boost) * 0.8, 3);
    speed = speed * (1 + extra);

    baseX.set(baseX.get() + speed);
  });

  const phrases = customPhrases && customPhrases.length > 0 ? customPhrases : defaultPhrases;

  const block = (
    <div className="flex shrink-0 items-center">
      {phrases.map((phrase, i) => (
        <span key={`${phrase}-${i}`} className="flex items-center">
          <span
            className="whitespace-nowrap px-8 font-serif text-3xl font-medium italic tracking-tight md:px-12 md:text-5xl transition-colors duration-300"
            style={
              i % 2 === 1
                ? { color: 'transparent', WebkitTextStroke: '1px rgba(255, 255, 255, 0.35)' }
                : { color: '#F5F3EF' }
            }
          >
            {phrase}
          </span>
          <span className="text-xl text-[#D4AF37] md:text-2xl select-none drop-shadow-[0_0_8px_rgba(212,175,55,0.7)]">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#0B0B0F]/90 py-6 md:py-8 backdrop-blur-md">
      {/* Edge fade gradient masks for smooth luxury blend */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#070709] via-[#070709]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#070709] via-[#070709]/80 to-transparent" />

      <p className="sr-only">{phrases.join(' • ')}</p>

      <motion.div aria-hidden="true" style={{ x }} className="flex w-max select-none will-change-transform">
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="flex">
            {block}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
