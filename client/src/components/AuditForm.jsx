import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAudit } from '../context/AuditContext.jsx';

const PLATFORMS = ['YouTube', 'Twitch', 'Kick', 'Podcast', 'Other'];

const SCALES = [
  { id: 'Under 10k', label: 'Under 10k', desc: 'Emerging IP · Seed Stage', reach: '< 10,000 monthly reach' },
  { id: '10k – 100k', label: '10k – 100k', desc: 'Growth Tier · High Momentum', reach: '10,000 – 100,000 monthly reach' },
  { id: '100k – 1M', label: '100k – 1M', desc: 'Established Authority', reach: '100,000 – 1,000,000 monthly reach' },
  { id: '1M+', label: '1M+', desc: 'Enterprise Media Brand', reach: '1,000,000+ monthly reach' },
];

const MODELS = [
  'Brand sponsorships',
  'Memberships & subscriptions',
  'High-ticket services',
  'Courses & digital products',
  'Enterprise deal flow',
];

const TIERS = [
  ['Starter', 'Foundation', '$1,500/mo'],
  ['Growth', 'Acceleration', '$3,500/mo'],
  ['Full System', 'Private Office', '$6,500/mo'],
];

const STEPS = ['Identity', 'Audience', 'Ambition'];
const stepFields = [['name', 'email'], ['channelUrl', 'platform', 'audienceScale'], ['revenueModel']];
const empty = {
  name: '',
  email: '',
  channelUrl: '',
  platform: 'YouTube',
  audienceScale: '10k – 100k',
  revenueModel: 'Brand sponsorships',
  notes: '',
};

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your full name';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Please enter a valid email address';
  if (!/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(f.channelUrl.trim()))
    e.channelUrl = 'Please enter your channel or podcast URL';
  if (!f.platform) e.platform = 'Select your primary platform';
  if (!f.audienceScale) e.audienceScale = 'Select your current audience scale';
  if (!f.revenueModel) e.revenueModel = 'Select a target revenue model';
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
        >
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
    </div>
  );
}

function Confirmation({ reference, email, onReset }) {
  const steps = [
    ['Today', 'Confirmation & private intake docket generated.'],
    ['Within 24 hours', 'A senior strategist personally audits your IP and retention drops.'],
    ['Within 72 hours', 'Three complimentary sample clips and private audit dossier arrive.'],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      className="py-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 14 }}
        className="mb-8 grid h-16 w-16 place-items-center rounded-full border border-[#D4AF37] font-serif text-3xl italic text-[#D4AF37] bg-[#14141E] shadow-[0_0_20px_rgba(212,175,55,0.25)]"
      >
        ✓
      </motion.div>
      <p className="eyebrow mb-2 !text-[#D4AF37]">Application Received · Ref. {reference || 'CGS-PRIVATE'}</p>
      <h3 className="font-serif text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#F5F3EF]">
        Thank you. Your dossier is being prepared.
      </h3>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#A3A3B0]">
        Your channel application has been logged. We will send the review package directly to{' '}
        <span className="font-medium text-[#F5F3EF]">{email}</span>.
      </p>

      <ol className="mt-8 border-t border-white/10">
        {steps.map(([t, d], i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="grid grid-cols-[130px_1fr] gap-4 border-b border-white/10 py-4 text-sm"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#D4AF37]">{t}</span>
            <span className="text-[#F5F3EF]">{d}</span>
          </motion.li>
        ))}
      </ol>

      <button
        onClick={onReset}
        className="mt-8 text-xs font-mono uppercase tracking-widest text-[#D4AF37] underline underline-offset-4 hover:text-[#F3E5C8] transition-colors"
      >
        Submit another channel
      </button>
    </motion.div>
  );
}

export default function AuditForm({ idPrefix = 'apply', onComplete }) {
  const { pkg, setPkg } = useAudit();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);

  const id = (k) => `${idPrefix}-${k}`;
  const set = (k) => (v) => {
    const value = v?.target ? v.target.value : v;
    setForm((f) => ({ ...f, [k]: value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const scaleIndex = Math.max(
    0,
    SCALES.findIndex((s) => s.id === form.audienceScale)
  );

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    const chosen = SCALES[idx]?.id || SCALES[0].id;
    set('audienceScale')(chosen);
  };

  const go = (n) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const next = () => {
    const all = validate(form);
    const here = Object.fromEntries(stepFields[step].filter((k) => all[k]).map((k) => [k, all[k]]));
    setErrors(here);
    if (!Object.keys(here).length) go(step + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    const all = validate(form);
    setErrors(all);
    const bad = Object.keys(all);
    if (bad.length) {
      return go(stepFields.findIndex((s) => s.some((k) => bad.includes(k))));
    }

    setStatus('loading');
    setServerError('');
    try {
      const r = await api.submitAudit({
        ...form,
        name: form.name.trim(),
        channelUrl: form.channelUrl.trim(),
        selectedPackage: pkg,
        notes: form.notes.trim() || undefined,
      });
      setResult(r.data);
      setStatus('success');
      onComplete?.(r.data);
    } catch (err) {
      setErrors(err.errors || {});
      setServerError(err.message || 'Submission could not be completed.');
      setStatus('error');
      const badKeys = Object.keys(err.errors || {});
      if (badKeys.length) {
        go(Math.max(0, stepFields.findIndex((s) => s.some((k) => badKeys.includes(k)))));
      }
    }
  };

  if (status === 'success') {
    return (
      <Confirmation
        reference={result?.reference}
        email={form.email}
        onReset={() => {
          setForm(empty);
          setStep(0);
          setStatus('idle');
          setResult(null);
        }}
      />
    );
  }

  const loading = status === 'loading';
  const last = step === STEPS.length - 1;
  const currentScale = SCALES[scaleIndex] || SCALES[0];

  return (
    <form onSubmit={submit} noValidate aria-busy={loading} className="space-y-6">
      {/* Step Indicators with Kinetic Fluid Fill */}
      <div className="flex items-center gap-3" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => {
          const isCurrent = i === step;
          const isDone = i < step;
          return (
            <div key={s} className="flex-1">
              <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"
                  animate={{ width: isDone || isCurrent ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span
                className={`mt-2 block font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  isCurrent ? 'text-[#D4AF37] font-semibold' : 'text-neutral-500'
                }`}
              >
                0{i + 1} {s}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Contents with Directional Spring Animation */}
      <div className="min-h-[340px]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -32 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-5"
          >
            {/* Step 1: Identity */}
            {step === 0 && (
              <>
                <Field id={id('name')} label="Full Name" error={errors.name}>
                  <input
                    id={id('name')}
                    className="field"
                    placeholder="e.g. Alexandra Rivera"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field id={id('email')} label="Work or Business Email" error={errors.email}>
                  <input
                    id={id('email')}
                    type="email"
                    className="field"
                    placeholder="alexandra@studio.com"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                </Field>
                <div className="rounded-xl border border-white/10 bg-[#14141C] p-4 text-xs text-[#A3A3B0] leading-relaxed">
                  <span className="font-semibold text-[#F5F3EF]">Private Briefing Notice:</span> All disclosures and channel metrics submitted through this portal are held under strict non-disclosure.
                </div>
              </>
            )}

            {/* Step 2: Audience (Platform Selector + Interactive Reach Slider) */}
            {step === 1 && (
              <>
                <Field id={id('url')} label="Channel or Podcast URL" error={errors.channelUrl}>
                  <input
                    id={id('url')}
                    className="field"
                    placeholder="youtube.com/@channel or spotify.com/show/..."
                    value={form.channelUrl}
                    onChange={set('channelUrl')}
                    aria-invalid={!!errors.channelUrl}
                  />
                </Field>

                {/* Tactile Platform Selector with Instant Visual Feedback */}
                <div>
                  <label className="label">Primary Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const isSelected = form.platform === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          id={`${id('platform')}-${p.toLowerCase()}`}
                          onClick={() => set('platform')(p)}
                          className={`relative rounded-xl border px-4 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                              : 'border-white/10 bg-[#13131A] text-[#F5F3EF] hover:border-white/30'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  {errors.platform && (
                    <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                      <AlertCircle size={12} /> {errors.platform}
                    </p>
                  )}
                </div>

                {/* Multi-Step Interactive Channel Reach Slider with Instant Feedback */}
                <div className="rounded-2xl border border-white/10 bg-[#121218] p-5 shadow-soft space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="label !mb-0">Current Channel Reach</span>
                      <p className="font-serif text-2xl font-medium text-[#F5F3EF] mt-0.5">
                        {currentScale.label}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-[#D4AF37]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                        {currentScale.desc}
                      </span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="pt-2 pb-1">
                    <input
                      type="range"
                      min={0}
                      max={SCALES.length - 1}
                      step={1}
                      value={scaleIndex}
                      onChange={handleSliderChange}
                      className="luxury-range"
                      aria-label="Channel audience reach scale slider"
                    />
                  </div>

                  {/* Step labels */}
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    {SCALES.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => set('audienceScale')(s.id)}
                        className={`transition-colors hover:text-[#F5F3EF] ${
                          i === scaleIndex ? 'text-[#D4AF37] font-semibold' : ''
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-[#A3A3B0] border-t border-white/5 pt-3">
                    Est. benchmark: <span className="text-[#F5F3EF] font-medium">{currentScale.reach}</span>
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Ambition (Revenue Model + Retainer Tier) */}
            {step === 2 && (
              <>
                <div>
                  <label className="label">Target Revenue Model</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {MODELS.map((model) => {
                      const isSelected = form.revenueModel === model;
                      return (
                        <button
                          key={model}
                          type="button"
                          onClick={() => set('revenueModel')(model)}
                          className={`rounded-xl border px-3.5 py-3 text-left text-xs transition-all duration-200 ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                              : 'border-white/10 bg-[#13131A] text-[#F5F3EF] hover:border-white/30'
                          }`}
                        >
                          <span className="block">{model}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.revenueModel && (
                    <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                      <AlertCircle size={12} /> {errors.revenueModel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Retainer Tier of Interest</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {TIERS.map(([val, title, price]) => {
                      const isSelected = pkg === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPkg(val)}
                          className={`rounded-xl border p-3.5 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5F3EF] ring-1 ring-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'border-white/10 bg-[#13131A] text-neutral-400 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <div className="font-serif text-base font-medium text-[#F5F3EF]">{title}</div>
                          <div className="font-mono text-[10px] tracking-wider text-[#D4AF37] mt-0.5">
                            {price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field id={id('notes')} label="Strategic Objectives or Notes (Optional)">
                  <textarea
                    id={id('notes')}
                    rows={2}
                    maxLength={2000}
                    className="field resize-none text-xs"
                    placeholder="Specific growth bottlenecks, upcoming launches, or current distribution cadence..."
                    value={form.notes}
                    onChange={set('notes')}
                  />
                </Field>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {serverError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-xs text-red-300"
        >
          <AlertCircle size={14} /> {serverError}
        </motion.p>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-white/10 pt-5">
        {step > 0 ? (
          <button
            type="button"
            id={id('back')}
            onClick={() => go(step - 1)}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-[#F5F3EF] transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
        ) : (
          <span />
        )}

        {last ? (
          <button
            id={id('submit')}
            type="submit"
            disabled={loading}
            className="btn-ink !py-3 !px-6 text-xs uppercase font-mono tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Submitting
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        ) : (
          <button
            id={id('next')}
            type="button"
            onClick={next}
            className="btn-ink !py-3 !px-6 text-xs uppercase font-mono tracking-wider"
          >
            Continue <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}
