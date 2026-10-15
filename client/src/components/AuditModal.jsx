import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAudit } from '../context/AuditContext.jsx';
import AuditForm from './AuditForm.jsx';
import { SPRING } from './ui.jsx';

/**
 * Interactive "Old Money" Audit Drawer / Slide-Over Sheet (Dark Theme Edition):
 * Smooth fluid drawer expanding from the side with layered dark backdrop-blur.
 */
export default function AuditModal() {
  const { open, closeAudit } = useAudit();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeAudit();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeAudit]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Layered frosted dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeAudit}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Fluid Old Money Slide-Over Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={SPRING}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#0B0B0F] text-[#F5F3EF] shadow-2xl border-l border-white/10 overflow-y-auto"
          >
            {/* Drawer Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0B0B0F]/90 px-6 py-5 backdrop-blur-md md:px-10">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                <p className="eyebrow !text-[10px] tracking-[0.2em] !text-[#D4AF37]">[ Private Application ]</p>
              </div>

              <button
                id="modal-close"
                aria-label="Close"
                onClick={closeAudit}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F5F3EF] transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
              >
                <X size={16} className="transition-transform duration-200 group-hover:rotate-90" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 px-6 py-8 md:px-10 md:py-10">
              <div className="mb-8">
                <h2 id="modal-title" className="font-serif text-3xl font-medium tracking-tight text-[#F5F3EF] md:text-4xl">
                  Request Private Audit
                </h2>
                <p className="mt-2 text-sm text-[#A3A3B0] leading-relaxed">
                  We review your channel personally and return three sample clips plus an executive distribution roadmap.
                </p>
              </div>

              <AuditForm idPrefix="drawer" onComplete={undefined} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
