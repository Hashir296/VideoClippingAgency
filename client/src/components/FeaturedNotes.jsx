import React from 'react';
import { motion } from 'framer-motion';

/**
 * Editorial intelligence preview section on the home page.
 * Displays top strategic articles to build extreme authority and organic conversion.
 */
export default function FeaturedNotes({ articles = [], onSelectArticle, onExploreAll }) {
  // Show up to 3 published articles
  const featured = articles.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section id="field-notes" className="relative border-t border-white/5 bg-[#08080B] py-28 md:py-36">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.025] blur-[140px]" />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                Proprietary Research & Strategic Dispatches
              </span>
            </div>
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#F5F3EF] sm:text-5xl md:text-6xl">
              Field Notes from the <span className="italic text-[#D4AF37]">Frontline</span>
            </h2>
            <p className="mt-4 text-base text-[#8E8B85] md:text-lg">
              Deconstructed retention algorithms, editorial breakdowns, and high-ticket syndication case studies published directly from our active agency client rosters.
            </p>
          </div>

          <div>
            <button
              onClick={onExploreAll}
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-[#F5F3EF] transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10"
            >
              <span>Explore All Strategic Field Notes</span>
              <span className="text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* 3-Column Luxury Article Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((article, idx) => (
            <motion.article
              key={article._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => onSelectArticle(article.slug)}
              className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E14]/70 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37]/40 hover:bg-[#12121A] hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.08)]"
            >
              {/* Subtle top card glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#D4AF37]/[0.04] blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <div>
                {/* Thumbnail Image */}
                <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl border border-white/5">
                  <img
                    src={
                      article.coverImage ||
                      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={article.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent opacity-50" />
                </div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">
                    {article.category || 'Strategic Intelligence'}
                  </span>
                  <span className="font-mono text-xs text-[#8E8B85]">
                    {article.readTime || '6 min read'}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="font-serif text-2xl font-normal leading-snug tracking-tight text-[#F5F3EF] transition-colors duration-300 group-hover:text-[#D4AF37]">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#A3A3B0]">
                  {article.excerpt}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#8E8B85]">
                    {article.views ? `${article.views.toLocaleString()} reads` : 'Documented Benchmark'}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#D4AF37] transition-all duration-300 group-hover:translate-x-1">
                  Read Analysis <span>→</span>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
