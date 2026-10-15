import { createElement, Fragment, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const SPRING = { stiffness: 120, damping: 20, mass: 0.8 };
export const EASE_OUT = [0.25, 1, 0.5, 1];

export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

export function Stagger({ children, className = '', gap = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_OUT } },
};

/**
 * Kinetic Text Split Reveal:
 * Words/character spans stagger upward (y: ["100%", "0%"], opacity: [0, 1])
 * with elegant cubic-bezier easing ([0.25, 1, 0.5, 1]).
 * Each word is clipped in an overflow-hidden wrapper for a clean editorial mask.
 */
export function SplitText({
  segments,
  as = 'h1',
  className = '',
  delay = 0,
  stagger = 0.022,
  inView = false,
}) {
  let charCounter = 0;
  const label = segments.map((s) => s.t).join(' ');
  const trigger = inView
    ? { whileInView: { y: '0%', opacity: 1 }, viewport: { once: true, margin: '-60px' } }
    : { animate: { y: '0%', opacity: 1 } };

  return createElement(
    as,
    { 'aria-label': label, className },
    segments.map((seg, si) => (
      <span key={si} className="inline">
        {seg.t.split(' ').map((word, wi) => (
          <Fragment key={`${si}-${wi}`}>
            <span
              aria-hidden="true"
              className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
            >
              <span className={`inline-block ${seg.cls || ''}`}>
                {[...word].map((ch, ci) => {
                  const i = charCounter++;
                  return (
                    <motion.span
                      key={ci}
                      className="inline-block will-change-transform"
                      initial={{ y: '100%', opacity: 0 }}
                      {...trigger}
                      transition={{
                        duration: 0.9,
                        delay: delay + i * stagger,
                        ease: EASE_OUT,
                      }}
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
            </span>{' '}
          </Fragment>
        ))}
      </span>
    ))
  );
}

/**
 * Tactile Magnetic Interaction:
 * Magnetic attraction to mouse pointer within a 50px radius (transform: translate(x, y) physics).
 * Uses custom spring physics: stiffness: 120, damping: 20, mass: 0.8
 */
export function Magnetic({ children, strength = 0.35, radius = 50, className = '' }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const currentX = x.get();
      const currentY = y.get();

      // Original unshifted boundaries
      const left = rect.left - currentX;
      const top = rect.top - currentY;
      const right = left + rect.width;
      const bottom = top + rect.height;
      const centerX = left + rect.width / 2;
      const centerY = top + rect.height / 2;

      // Distance from element perimeter
      const dx = Math.max(left - e.clientX, 0, e.clientX - right);
      const dy = Math.max(top - e.clientY, 0, e.clientY - bottom);
      const dist = Math.hypot(dx, dy);

      if (dist <= radius) {
        // Attract toward mouse cursor
        const pullX = (e.clientX - centerX) * strength;
        const pullY = (e.clientY - centerY) * strength;
        mx.set(pullX);
        my.set(pullY);
      } else {
        // Smoothly release back to neutral
        mx.set(0);
        my.set(0);
      }
    };

    const leave = () => {
      mx.set(0);
      my.set(0);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
    };
  }, [mx, my, x, y, radius, strength]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={`inline-block will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}

/**
 * Hairline Border Illumination:
 * Subtle radial gradient border trail on card hover.
 * Delicate luxury shimmer following the cursor along the 1px hairline border.
 */
export function GlowCard({ children, className = '', as = 'div', ...rest }) {
  const ref = useRef(null);
  const Tag = motion[as] || motion.div;

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--gx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <Tag ref={ref} onPointerMove={onMove} className={`group/glow relative ${className}`} {...rest}>
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          padding: 1,
          background:
            'radial-gradient(320px circle at var(--gx, 50%) var(--gy, 50%), rgba(197, 168, 128, 0.75), rgba(169, 139, 93, 0.3) 40%, rgba(197, 168, 128, 0) 75%)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
    </Tag>
  );
}

export function SectionHead({ index, label, title, children }) {
  return (
    <div className="mb-16 grid gap-6 md:grid-cols-12 md:items-end">
      <Reveal className="md:col-span-7">
        <p className="eyebrow mb-5">[ {index} — {label} ]</p>
        <h2 className="h2">{title}</h2>
      </Reveal>
      {children && (
        <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
          <p className="leading-relaxed">{children}</p>
        </Reveal>
      )}
    </div>
  );
}
