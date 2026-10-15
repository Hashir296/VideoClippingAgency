import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BARS = 96;
const STAGES = ['Isolated', 'Captioned', 'Scheduled', 'Syndicated', 'Captured'];

const moments = [
  { at: 14, len: 7, time: '00:41:18', title: 'The contrarian opening claim', quote: '"Everyone tells you to post daily. That advice is why you are invisible."', hook: 94, pace: 168, retention: 82 },
  { at: 43, len: 6, time: '01:32:05', title: 'Guest reveals the real number', quote: '"We never spent a dollar until the third week — then we put everything behind one clip."', hook: 89, pace: 154, retention: 77 },
  { at: 72, len: 8, time: '02:48:51', title: 'The unscripted turning point', quote: '"That was the moment the entire room went quiet."', hook: 91, pace: 142, retention: 85 },
];

function waveform() {
  return Array.from({ length: BARS }, (_, i) => {
    const a = Math.sin(i * 0.42) * 0.22 + Math.sin(i * 1.17 + 1.3) * 0.18 + Math.sin(i * 0.11) * 0.12;
    return Math.min(0.96, Math.max(0.12, 0.38 + a + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.08));
  });
}

function Metric({ label, value, suffix = '' }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">{label}</div>
      <div className="mt-1 font-serif text-4xl font-medium leading-none text-[#F5F3EF]">
        <AnimatePresence mode="popLayout">
          <motion.span key={value} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35 }} className="inline-block">
            {value}{suffix}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MomentConsole() {
  const bars = useMemo(waveform, []);
  const [active, setActive] = useState(0);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [stage, setStage] = useState(0);
  const timer = useRef(null);
  const m = moments[active];

  useEffect(() => {
    setStage(0);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setStage((s) => {
        if (s >= STAGES.length) { clearInterval(timer.current); return s; }
        return s + 1;
      });
    }, 520);
    return () => clearInterval(timer.current);
  }, [active]);

  useEffect(() => {
    const auto = setInterval(() => setActive((a) => (a + 1) % moments.length), 9000);
    return () => clearInterval(auto);
  }, [active]);

  const inMoment = (i) => moments.findIndex((x) => i >= x.at && i < x.at + x.len);

  return (
    <div className="surface overflow-hidden border border-white/10" role="group" aria-label="Moment isolation console">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#0D0D12]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
          </span>
          <span className="eyebrow !text-neutral-300">Moment Isolation — Episode 112</span>
        </div>
        <span className="hidden font-mono text-[11px] text-neutral-400 sm:block">03:42:10 / 3 moments isolated</span>
      </div>

      {/* Waveform track */}
      <div className="px-6 pb-2 pt-8 bg-[#121217]">
        <div
          className="relative flex h-36 items-center gap-[3px]"
          onPointerLeave={() => setHoverIdx(null)}
        >
          {bars.map((h, i) => {
            const mi = inMoment(i);
            const isActive = mi === active;
            const near = hoverIdx !== null && Math.abs(hoverIdx - i) < 3;
            return (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onPointerEnter={() => setHoverIdx(i)}
                onClick={() => mi >= 0 && setActive(mi)}
                className="relative flex h-full flex-1 items-center justify-center"
              >
                <motion.span
                  animate={{
                    height: `${(h + (near ? 0.12 : 0)) * 100}%`,
                    backgroundColor: isActive ? '#D4AF37' : mi >= 0 ? '#C5A880' : '#262633',
                    boxShadow: isActive ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                  className="block w-full rounded-full"
                />
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between font-mono text-[10px] tracking-wider text-neutral-500">
          <span>00:00:00</span><span>01:50:00</span><span>03:42:10</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 pb-4" role="tablist" aria-label="Isolated moments">
          {moments.map((x, i) => (
            <button
              key={x.time}
              id={`moment-${i + 1}`}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-wider transition-all duration-200 ${
                active === i
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {x.time}
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="grid gap-px border-t border-white/[0.08] bg-white/[0.08] md:grid-cols-5">
        <div className="bg-[#121217] p-6 md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <p className="eyebrow mb-3 !text-[#D4AF37]">{m.title}</p>
              <p className="font-serif text-2xl italic leading-snug text-[#F5F3EF]">{m.quote}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
            <Metric label="Hook score" value={m.hook} suffix="%" />
            <Metric label="Pace wpm" value={m.pace} />
            <Metric label="Retention" value={m.retention} suffix="%" />
          </div>
        </div>
        <div className="bg-[#0D0D12] p-6 md:col-span-2">
          <p className="eyebrow mb-4 !text-neutral-400">Automated Pipeline</p>
          <ol className="space-y-3">
            {STAGES.map((s, i) => {
              const done = stage > i;
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <motion.span
                    animate={{
                      backgroundColor: done ? '#D4AF37' : '#1A1A24',
                      borderColor: done ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                    }}
                    className="grid h-5 w-5 place-items-center rounded-full border"
                  >
                    {done && <Check size={11} className="text-black" strokeWidth={3} />}
                  </motion.span>
                  <span className={done ? 'text-[#F5F3EF] font-medium' : 'text-neutral-500'}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
