import { useState, useMemo } from 'react';
import { Search, TrendingUp, Sparkles, Copy, Check, ArrowRight, BarChart3, Target, Flame, Lightbulb } from 'lucide-react';

const PRESET_KEYWORDS = [
  {
    id: 'kw-1',
    keyword: 'video clipping agency for creators',
    volume: 18400,
    difficulty: 34,
    intent: 'Commercial',
    cpc: 4.85,
    trend: '+42%',
    category: 'Agency & Services',
    suggestedTitle: 'Why Top Creators Outsource to a High-Ticket Video Clipping Agency in 2026',
    tags: ['video clipping', 'agency', 'creator economy', 'content repurposing'],
  },
  {
    id: 'kw-2',
    keyword: 'how to repurpose podcast into viral shorts',
    volume: 49200,
    difficulty: 41,
    intent: 'Informational',
    cpc: 3.20,
    trend: '+68%',
    category: 'Syndication',
    suggestedTitle: 'The 7-Step Blueprint to Repurposing 1 Podcast Episode into 30 Viral Shorts',
    tags: ['podcast clips', 'shorts', 'reels', 'tiktok syndication'],
  },
  {
    id: 'kw-3',
    keyword: 'youtube shorts retention algorithm hacks',
    volume: 72000,
    difficulty: 52,
    intent: 'Informational',
    cpc: 2.90,
    trend: '+55%',
    category: 'Retention',
    suggestedTitle: 'Mastering the 3-Second Hook: YouTube Shorts Retention Architecture',
    tags: ['retention rate', 'youtube algorithm', 'hook writing', 'watch time'],
  },
  {
    id: 'kw-4',
    keyword: 'best video editing agency for streamers',
    volume: 24600,
    difficulty: 29,
    intent: 'Transactional',
    cpc: 5.40,
    trend: '+31%',
    category: 'Agency & Services',
    suggestedTitle: 'Streamer to Multi-Platform Giant: How Top Streamers Syndicate VODs',
    tags: ['twitch clipping', 'stream highlights', 'kick clips', 'vod editing'],
  },
  {
    id: 'kw-5',
    keyword: 'faceless channel video clipping monetization',
    volume: 88500,
    difficulty: 47,
    intent: 'Commercial',
    cpc: 3.75,
    trend: '+94%',
    category: 'Monetization',
    suggestedTitle: 'Monetizing Attention: Beyond AdSense into High-Ticket Backends',
    tags: ['monetization', 'faceless channels', 'digital products', 'affiliate syndication'],
  },
  {
    id: 'kw-6',
    keyword: 'ai video clipping vs human editors',
    volume: 33100,
    difficulty: 38,
    intent: 'Commercial',
    cpc: 4.10,
    trend: '+85%',
    category: 'AI Systems',
    suggestedTitle: 'AI Clipping vs Human Editorial Taste: Why 99% of Automated Clips Flop',
    tags: ['ai clipping', 'editorial quality', 'human touch', 'narrative structure'],
  },
  {
    id: 'kw-7',
    keyword: 'high retention caption styles premiere pro',
    volume: 41200,
    difficulty: 35,
    intent: 'Informational',
    cpc: 2.15,
    trend: '+22%',
    category: 'Retention',
    suggestedTitle: 'Kinetic Typography & Caption Dynamics: Engineering Visual Dopamine',
    tags: ['captions', 'visual hierarchy', 'premiere pro', 'kinetic text'],
  },
  {
    id: 'kw-8',
    keyword: 'creator growth system syndication framework',
    volume: 15300,
    difficulty: 24,
    intent: 'Commercial',
    cpc: 6.20,
    trend: '+39%',
    category: 'Strategy',
    suggestedTitle: 'The Multi-Platform Attention Flywheel: Turning 1 Longform Video into 50M Views',
    tags: ['growth system', 'syndication', 'omnipresence', 'funnel architecture'],
  },
  {
    id: 'kw-9',
    keyword: 'tiktok organic reach strategy 2026',
    volume: 64000,
    difficulty: 49,
    intent: 'Informational',
    cpc: 3.50,
    trend: '+40%',
    category: 'Strategy',
    suggestedTitle: 'TikTok Organic Reach in 2026: Why Pacing and Micro-Cuts Win The Feed',
    tags: ['tiktok algorithm', 'organic reach', 'micro-cuts', 'sound selection'],
  },
  {
    id: 'kw-10',
    keyword: 'podcast to lead generation funnel',
    volume: 19800,
    difficulty: 31,
    intent: 'Transactional',
    cpc: 7.15,
    trend: '+51%',
    category: 'Monetization',
    suggestedTitle: 'How B2B & High-Ticket Podcasters Convert Short Clips into $50k Clients',
    tags: ['lead generation', 'high ticket', 'b2b podcasting', 'conversion funnel'],
  },
];

export default function KeywordFinder({ onSelectKeywordForArticle }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [analyzedCustom, setAnalyzedCustom] = useState(null);

  const categories = ['All', 'Agency & Services', 'Syndication', 'Retention', 'Monetization', 'AI Systems', 'Strategy'];

  const filtered = useMemo(() => {
    return PRESET_KEYWORDS.filter((k) => {
      const matchCat = selectedCategory === 'All' || k.category === selectedCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        k.keyword.toLowerCase().includes(q) ||
        k.suggestedTitle.toLowerCase().includes(q) ||
        k.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, selectedCategory]);

  const copyKeyword = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAnalyzeCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    // Simulate smart SEO metrics calculation
    const kw = customInput.trim();
    const words = kw.split(' ').length;
    const estimatedVol = Math.floor(Math.random() * 50000) + 12000;
    const estimatedDiff = Math.min(Math.max(words > 3 ? 28 + words * 2 : 55, 20), 85);
    const estimatedCpc = (Math.random() * 4 + 2).toFixed(2);

    const generated = {
      id: `custom-${Date.now()}`,
      keyword: kw,
      volume: estimatedVol,
      difficulty: estimatedDiff,
      intent: words > 3 ? 'Commercial' : 'Informational',
      cpc: Number(estimatedCpc),
      trend: `+${Math.floor(Math.random() * 60) + 25}%`,
      category: 'Custom Research',
      suggestedTitle: `The Ultimate Guide to ${kw.replace(/\b\w/g, (c) => c.toUpperCase())} in 2026`,
      tags: [kw, 'growth strategy', 'video clipping'],
    };

    setAnalyzedCustom(generated);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#121217] via-[#0E0E13] to-[#070709] p-6 md:p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
            <Sparkles size={13} />
            <span>High-Ranking SEO Explorer</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-[#F5F3EF] md:text-3xl">
            Find High-Intent Keywords, Dominate Search & Drive Traffic
          </h2>
          <p className="mt-2 text-sm text-[#A3A3B0]">
            Explore high-volume viral search terms for video clipping, shortform syndication, and creator growth.
            Click <strong>"Draft Article"</strong> to instantly generate a ranking blog post with pre-built outline.
          </p>
        </div>

        {/* Custom Keyword Analyzer Box */}
        <form onSubmit={handleAnalyzeCustom} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search or enter any target keyword (e.g. 'podcast video editor')..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-[#171720] py-3.5 pl-11 pr-4 text-sm text-[#F5F3EF] placeholder-neutral-500 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#F3E5C8] shadow-lg shadow-[#D4AF37]/20"
          >
            <Lightbulb size={15} />
            Analyze Keyword
          </button>
        </form>

        {/* Custom Analyzed Card if active */}
        {analyzedCustom && (
          <div className="mt-5 rounded-2xl border border-[#D4AF37]/40 bg-[#161622]/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#D4AF37]/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#D4AF37]">
                    Analyzed Query
                  </span>
                  <span className="font-mono text-xs text-neutral-400">Search Intent: {analyzedCustom.intent}</span>
                </div>
                <h3 className="mt-1 font-serif text-xl font-medium text-[#F5F3EF]">"{analyzedCustom.keyword}"</h3>
                <p className="mt-1 text-xs text-[#C5A880]">Suggested Title: {analyzedCustom.suggestedTitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-center">
                  <p className="font-mono text-[10px] uppercase text-neutral-400">Est. Volume</p>
                  <p className="font-mono text-sm font-bold text-[#F5F3EF]">{analyzedCustom.volume.toLocaleString()}/mo</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-center">
                  <p className="font-mono text-[10px] uppercase text-neutral-400">Difficulty</p>
                  <p className="font-mono text-sm font-bold text-emerald-400">{analyzedCustom.difficulty}/100</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-center">
                  <p className="font-mono text-[10px] uppercase text-neutral-400">Est. CPC</p>
                  <p className="font-mono text-sm font-bold text-[#D4AF37]">${analyzedCustom.cpc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectKeywordForArticle(analyzedCustom)}
                  className="btn-ink !px-5 !py-2.5 !text-xs"
                >
                  Draft Article With This
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/20'
                  : 'border border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Filter list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#121217] py-2 pl-9 pr-3 text-xs text-[#F5F3EF] placeholder-neutral-500 outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Keywords Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const isEasy = item.difficulty < 35;
          const isMed = item.difficulty >= 35 && item.difficulty < 50;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121217]/90 p-5 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#16161F]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
                      {item.category}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-medium text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors">
                      {item.keyword}
                    </h3>
                  </div>
                  <button
                    onClick={() => copyKeyword(item.id, item.keyword)}
                    title="Copy Keyword"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                  >
                    {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                <p className="mt-2 text-xs italic text-neutral-400">
                  <span className="text-neutral-500 font-sans not-italic font-medium">Article Angle: </span>
                  "{item.suggestedTitle}"
                </p>

                {/* Metrics Badges */}
                <div className="mt-4 grid grid-cols-4 gap-2 border-y border-white/5 py-3">
                  <div>
                    <span className="block font-mono text-[10px] text-neutral-500">Volume</span>
                    <span className="font-mono text-xs font-semibold text-[#F5F3EF]">
                      {item.volume.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-neutral-500">Difficulty</span>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isEasy ? 'text-emerald-400' : isMed ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {item.difficulty}/100
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-neutral-500">Est. CPC</span>
                    <span className="font-mono text-xs font-semibold text-[#D4AF37]">${item.cpc.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-neutral-500">Growth</span>
                    <span className="flex items-center gap-0.5 font-mono text-xs font-semibold text-emerald-400">
                      <TrendingUp size={11} />
                      {item.trend}
                    </span>
                  </div>
                </div>

                {/* Keyword Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-2 flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-neutral-400">
                  Intent: <strong className="text-neutral-200">{item.intent}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => onSelectKeywordForArticle(item)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3.5 py-1.5 text-xs font-medium text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black"
                >
                  Draft Article
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
