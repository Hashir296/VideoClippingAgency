import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SPRING } from './ui.jsx';

/**
 * Interactive 3D Depth Card / Viewport Stage:
 * Physically tilts in 3D perspective (rotateX, rotateY, scale: 1.02) following cursor.
 * Features a dynamic specular glass reflection highlight for the luxury dark theme.
 */
export default function TiltStage({ children }) {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  const rotateY = useTransform(sx, [0, 1], [-9, 9]);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);

  // Dark luxury specular glass reflection highlight
  const glare = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(650px circle at ${x * 100}% ${y * 100}%, rgba(255, 255, 255, 0.12) 0%, rgba(212, 175, 55, 0.06) 30%, transparent 65%)`
  );

  // Warm champagne gold hairline perimeter highlight
  const edgeGlow = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(520px circle at ${x * 100}% ${y * 100}%, rgba(212, 175, 55, 0.5) 0%, rgba(197, 168, 128, 0.1) 40%, transparent 70%)`
  );

  const dynamicShadow = useTransform([sx, sy], ([x, y]) => {
    const offsetX = (0.5 - x) * 45;
    const offsetY = 25 + (0.5 - y) * -25;
    return `${offsetX}px ${offsetY}px 90px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.05)`;
  });

  const onMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mx.set(nx);
    my.set(ny);
  };

  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative [perspective:1600px] will-change-transform"
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          boxShadow: dynamicShadow,
          transformStyle: 'preserve-3d',
        }}
        animate={{ scale: hovered ? 1.02 : 1 }}
        transition={SPRING}
        className="relative rounded-[28px] transition-transform duration-200"
      >
        {children}

        {/* Floating glass specular reflection highlight */}
        <motion.div
          aria-hidden="true"
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[28px] mix-blend-overlay transition-opacity duration-300"
        />

        {/* Warm hairline gold perimeter highlight */}
        <motion.div
          aria-hidden="true"
          style={{
            background: edgeGlow,
            padding: 1,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[28px]"
        />

        {/* Physical 3D Floating Badges in Dark Aesthetic */}
        <div
          aria-hidden="true"
          style={{ transform: 'translateZ(85px)' }}
          className="pointer-events-none absolute -right-3 -top-5 hidden select-none rounded-full border border-white/15 bg-[#0D0D12]/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5F3EF] shadow-2xl backdrop-blur-md md:block"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2 align-middle shadow-[0_0_8px_#34d399]" />
          Syndicating · 3 platforms
        </div>

        <div
          aria-hidden="true"
          style={{ transform: 'translateZ(65px)' }}
          className="pointer-events-none absolute -bottom-5 -left-3 hidden select-none rounded-full border border-[#D4AF37]/30 bg-[#16161F] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5F3EF] shadow-2xl md:block"
        >
          <span className="text-[#D4AF37] mr-1.5">✦</span> Hook Score 94%
        </div>
      </motion.div>
    </div>
  );
}
