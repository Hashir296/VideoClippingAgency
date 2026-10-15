import { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Clock,
  Eye,
  TrendingUp,
  SlidersHorizontal,
  Flame,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogList({ articles = [], onSelectArticle, onOpenAudit }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'views'

  const categories = ['All', 'Strategy', 'Retention', 'Syndication', 'Monetization', 'AI Systems'];

  // Filter & Sort
  const processedArticles = useMemo(() => {
    let list = articles.filter((art) => art.isPublished !== false);

    if (selectedCategory !== 'All') {
      list = list.filter((art) => art.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (art) =>
          art.title?.toLowerCase().includes(q) ||
          art.excerpt?.toLowerCase().includes(q) ||
          (art.keywords && art.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'views') {
      list = [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  // Featured Hero Story (first item if available)
  const featuredArticle = processedArticles[0];
  const gridArticles = processedArticles.slice(1);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: articles.filter((a) => a.isPublished !== false).length };
    articles.forEach((a) => {
      if (a.isPublished !== false && a.category) {
        counts[a.category] = (counts[a.category] || 0) + 1;
      }
    });
    return counts;
  }, [articles]);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Editorial Masthead */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10">
            <Sparkles size={13} />
            <span>Proprietary Attention Intelligence</span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#F5F3EF] sm:text-6xl md:text-7xl">
            Field Notes <em className="italic text-[#D4AF37]">&</em> Research
          </h1>
          <p className="mt-4 text-sm text-[#A3A3B0] md:text-base leading-relaxed">
            Architectural breakdowns, retention telemetry, and viral syndication blueprints engineered for
            high-output creators, venture podcasters, and high-ticket educators.
          </p>

          {/* Research Metrics Strip */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/10 bg-[#121217]/90 px-6 py-3 font-mono text-xs text-neutral-400 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-[#F5F3EF]">50M+</span>
              <span>Documented Impressions</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-[#D4AF37]">92.4%</span>
              <span>Avg. Retention Goal</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-[#F5F3EF]">{articles.length}</span>
              <span>Strategic Frameworks</span>
            </div>
          </div>
        </div>

        {/* FEATURED STORY BILLBOARD (Cover Story) */}
        {featuredArticle && !searchQuery && selectedCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => onSelectArticle(featuredArticle.slug)}
            className="group mt-16 relative overflow-hidden rounded-[36px] border border-[#D4AF37]/30 bg-gradient-to-br from-[#161622] via-[#121218] to-[#0A0A0E] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#D4AF37]/60 transition-all duration-500"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Cover Image Half */}
              <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-2xl lg:col-span-7">
                <img
                  src={
                    featuredArticle.coverImage ||
                    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={featuredArticle.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 font-mono text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md">
                  <Flame size={13} />
                  <span>COVER STORY</span>
                </div>
              </div>

              {/* Text Information Half */}
              <div className="space-y-4 lg:col-span-5">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-0.5 font-mono text-xs uppercase tracking-wider text-[#D4AF37]">
                    {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-neutral-400">
                    <Clock size={12} />
                    {featuredArticle.readTime || '6 min read'}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-neutral-400">
                    <Eye size={12} />
                    {(featuredArticle.views || 1420).toLocaleString()}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-medium leading-tight text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors md:text-3xl">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs text-[#A3A3B0] leading-relaxed line-clamp-4 md:text-sm">
                  {featuredArticle.excerpt}
                </p>

                {/* Tags */}
                {featuredArticle.keywords && featuredArticle.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredArticle.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-neutral-300"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <span className="font-mono text-xs text-neutral-400">
                    By {featuredArticle.author || 'Elena Vance — Head of Syndication'}
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                    Read Complete Breakdown
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter, Sort & Search Toolbar */}
        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/25'
                      : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                        isSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Search & Sort */}
          <div className="flex items-center gap-3">
            {/* Sort Switcher */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-white/10 bg-[#121217] px-4 py-2.5 text-xs text-[#F5F3EF] outline-none hover:border-white/20 transition cursor-pointer"
              >
                <option value="latest">Sort: Latest</option>
                <option value="views">Sort: Most Read</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search articles & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-[#121217] py-2.5 pl-9 pr-4 text-xs text-[#F5F3EF] placeholder-neutral-500 outline-none transition focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* ARTICLES GRID */}
        {processedArticles.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] mt-8">
            <Bookmark size={32} className="mx-auto text-neutral-600 mb-3" />
            <h3 className="font-serif text-xl font-medium text-[#F5F3EF]">No Articles Found</h3>
            <p className="mt-2 text-xs text-neutral-400 max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try selecting "All" categories or clearing your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-line mt-5 !px-5 !py-2 !text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(searchQuery || selectedCategory !== 'All' ? processedArticles : gridArticles).map((art, idx) => (
              <motion.article
                key={art._id || art.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                onClick={() => onSelectArticle(art.slug)}
                className="group flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-[#121217]/85 p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#D4AF37]/50 hover:bg-[#161622] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] cursor-pointer"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative mb-5 h-48 w-full overflow-hidden rounded-2xl border border-white/5">
                    <img
                      src={
                        art.coverImage ||
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={art.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Badges: Category & Reading Time */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                      <Clock size={12} />
                      {art.readTime || '5 min read'}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-medium leading-snug text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-[#A3A3B0] leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 space-y-3">
                  {/* Keywords Pills */}
                  {art.keywords && art.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {art.keywords.slice(0, 2).map((k) => (
                        <span
                          key={k}
                          className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-neutral-400"
                        >
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {(art.views || 0).toLocaleString()} readers
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                      Read Breakdown
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* High-Ticket Conversion Banner */}
        <div className="mt-24 rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#161622] via-[#121218] to-[#0A0A0E] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
          <span className="eyebrow !text-[#D4AF37]">[ Private Channel Retention Review ]</span>
          <h3 className="mt-3 font-serif text-2xl font-medium text-[#F5F3EF] md:text-4xl">
            Want us to architect this attention engine for your channel?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-xs text-[#A3A3B0] md:text-sm leading-relaxed">
            We analyze your long-form recordings, pinpoint 3-second drop-off bottlenecks, and build a bespoke
            multi-platform syndication pipeline that converts views into enterprise revenue.
          </p>
          <div className="mt-7 flex justify-center">
            <button onClick={() => onOpenAudit()} className="btn-ink !px-8 !py-4 text-sm font-semibold">
              Request Private Growth Audit
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
