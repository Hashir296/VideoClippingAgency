import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, BookOpen, Sparkles } from 'lucide-react';
import { useAudit } from '../context/AuditContext.jsx';
import { Magnetic } from './ui.jsx';

const links = [
  ['The Paradigm', '#engine'],
  ['Growth Engine', '#methodology'],
  ['Case Studies', '#segments'],
  ['Private Retainers', '#retainers'],
];

export default function Navbar({ currentView = 'home', onNavigate }) {
  const { openAudit } = useAudit();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      if (currentView !== 'home') {
        e.preventDefault();
        onNavigate('home');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
    >
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#0C0C10]/85 py-2 pl-5 pr-2.5 backdrop-blur-xl transition-all duration-300 ${
          solid ? 'shadow-[0_12px_40px_rgba(0,0,0,0.8)] border-white/20' : ''
        }`}
      >
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left font-serif text-[1.3rem] font-semibold tracking-tight text-[#F5F3EF] hover:opacity-90 transition-opacity"
        >
          Creator Growth<span className="text-[#D4AF37]">.</span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className="group relative text-[13px] tracking-wide text-neutral-400 transition-colors hover:text-[#F5F3EF]"
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}

          {/* Field Notes (Articles) Link */}
          <li>
            <button
              onClick={() => onNavigate('blog')}
              className={`group relative flex items-center gap-1.5 text-[13px] tracking-wide transition-colors ${
                currentView === 'blog' || currentView === 'article'
                  ? 'text-[#D4AF37] font-semibold'
                  : 'text-neutral-400 hover:text-[#F5F3EF]'
              }`}
            >
              <BookOpen size={13} className={currentView === 'blog' || currentView === 'article' ? 'text-[#D4AF37]' : 'text-neutral-500'} />
              <span>Field Notes</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
              <span
                className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                  currentView === 'blog' || currentView === 'article'
                    ? 'w-full bg-[#D4AF37]'
                    : 'w-0 bg-[#D4AF37] group-hover:w-full'
                }`}
              />
            </button>
          </li>
        </ul>

        {/* Right Action Button */}
        <div className="flex items-center gap-2">
          <Magnetic strength={0.2} radius={40}>
            <button
              id="nav-request"
              onClick={() => openAudit()}
              className="btn-ink !px-5 !py-2.5 !text-xs font-semibold"
            >
              Request Invitation
            </button>
          </Magnetic>

          {/* Mobile Menu Button */}
          <button
            id="nav-menu"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[#F5F3EF] hover:border-white/30 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[78px] rounded-3xl border border-white/15 bg-[#0C0C10]/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden space-y-2"
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  setOpen(false);
                  handleLinkClick(e, href);
                }}
                className="block rounded-2xl px-5 py-3 font-serif text-lg text-[#F5F3EF] hover:bg-white/5"
              >
                {label}
              </a>
            ))}

            <button
              onClick={() => {
                setOpen(false);
                onNavigate('blog');
              }}
              className="flex items-center justify-between w-full rounded-2xl px-5 py-3 font-serif text-lg text-[#D4AF37] hover:bg-white/5"
            >
              <span>Field Notes & Articles</span>
              <BookOpen size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
