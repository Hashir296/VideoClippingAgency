import { Reveal } from './ui.jsx';
import AuditForm from './AuditForm.jsx';

export default function Portal() {
  return (
    <section id="apply" className="px-5 py-28 md:py-40 bg-[#070709]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow mb-5">[ Chapter V — The Application Portal ]</p>
              <h2 className="h2 mb-8">
                Begin with a <em className="italic text-[#D4AF37]">private audit.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm leading-relaxed text-[#A3A3B0]">
                We accept a limited number of partners each quarter. Submit your channel and we will return three
                complimentary sample clips with a short growth audit — no obligation.
              </p>
              <dl className="mt-10 border-t border-white/10">
                {[
                  ['Review', 'Personal, by a senior strategist'],
                  ['Response', 'Within 24 hours'],
                  ['Samples', '3 clips delivered within 72 hours'],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[100px_1fr] gap-4 border-b border-white/10 py-4 text-sm">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#D4AF37]">{k}</dt>
                    <dd className="text-[#F5F3EF] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="md:col-span-7">
            <div className="surface p-7 md:p-12 border border-white/10 bg-[#0F0F15] shadow-2xl">
              <AuditForm idPrefix="portal" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
