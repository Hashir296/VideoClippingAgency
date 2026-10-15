import { useState } from 'react';
import { ArrowRight, Check, Loader2, BookOpen } from 'lucide-react';
import { api } from '../lib/api.js';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ s: 'idle', msg: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState({ s: 'error', msg: 'Please enter a valid email address.' });
    setState({ s: 'loading', msg: '' });
    try {
      const r = await api.subscribe({ email, source: 'footer' });
      setState({ s: 'ok', msg: r.message });
      setEmail('');
    } catch (err) {
      setState({ s: 'error', msg: err.errors?.email || err.message });
    }
  };

  return (
    <footer className="bg-[#050507] border-t border-white/10 px-5 pb-10 pt-24 text-neutral-400">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <p className="font-serif text-5xl font-medium leading-[1.02] tracking-tight text-[#F5F3EF] md:text-7xl">
              Attention, <em className="italic text-[#D4AF37]">architected.</em>
            </p>
            <p className="mt-4 max-w-md text-sm text-[#A3A3B0] leading-relaxed">
              Moving high-output creators, venture founders, and high-ticket educators past commodity clipping into proprietary attention systems.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono">
              <button
                onClick={() => onNavigate && onNavigate('blog')}
                className="inline-flex items-center gap-2 text-neutral-300 hover:text-[#D4AF37] transition group"
              >
                <BookOpen size={14} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>Explore Field Notes & Strategic Articles →</span>
              </button>
            </div>
          </div>

          <form onSubmit={submit} noValidate aria-label="Private list" className="md:col-span-5">
            <label htmlFor="footer-email" className="eyebrow !text-[#D4AF37]">[ The Private List ]</label>
            <p className="mb-5 mt-3 text-sm text-[#A3A3B0]">Occasional strategic field notes on syndication, paid leverage, and audience funnels.</p>
            <div className="flex items-center border-b border-white/20 pb-2 focus-within:border-[#D4AF37] transition-colors">
              <input
                id="footer-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-[#F5F3EF] placeholder-neutral-500 outline-none"
              />
              <button
                id="footer-subscribe"
                aria-label="Subscribe"
                disabled={state.s === 'loading'}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4AF37] text-black transition-all hover:bg-[#F3E5C8] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              >
                {state.s === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : state.s === 'ok' ? (
                  <Check size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            </div>
            {state.msg && (
              <p role="status" className={`mt-3 text-xs ${state.s === 'ok' ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                {state.msg}
              </p>
            )}
          </form>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 md:flex-row">
          <span>© {new Date().getFullYear()} Creator Growth System</span>
          <span>System No. 01 — Full-Funnel Attention Architecture</span>
        </div>
      </div>
    </footer>
  );
}
