import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  User,
  Tag,
  Share2,
  Check,
  ArrowRight,
  Eye,
  ListTree,
  Twitter,
  Linkedin,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import MarkdownView from './MarkdownView.jsx';
import { api } from '../../lib/api.js';

export default function ArticleView({ slug, onBack, onOpenAudit, onSelectArticle }) {
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const current = window.scrollY;
        setScrollProgress(Math.min(100, Math.max(0, (current / total) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [artRes, listRes] = await Promise.allSettled([
          api.getArticle(slug),
          api.getArticles(false),
        ]);

        if (isMounted && artRes.status === 'fulfilled' && artRes.value?.data) {
          setArticle(artRes.value.data);
        }
        if (isMounted && listRes.status === 'fulfilled' && listRes.value?.data) {
          setAllArticles(listRes.value.data);
        }
      } catch (err) {
        console.warn('Article fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Extract Table of Contents (H2 headings from content)
  const headings = useMemo(() => {
    if (!article?.content) return [];
    const lines = article.content.split('\n');
    return lines
      .filter((line) => line.trim().startsWith('## '))
      .map((line) => line.replace('## ', '').trim());
  }, [article?.content]);

  // Related articles (excluding current)
  const relatedArticles = useMemo(() => {
    return allArticles.filter((a) => a.slug !== slug).slice(0, 2);
  }, [allArticles, slug]);

  const copyUrl = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Reading "${article.title}" by @CreatorGrowth`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const scrollToHeading = (text) => {
    const elements = document.querySelectorAll('h2');
    for (let el of elements) {
      if (el.textContent.includes(text)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center pt-28 space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent shadow-lg shadow-[#D4AF37]/20" />
        <p className="font-mono text-xs text-neutral-400">Loading Intelligence Field Note...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl pt-36 pb-24 text-center px-4">
        <h2 className="font-serif text-3xl font-medium text-[#F5F3EF]">Field Note Not Found</h2>
        <p className="mt-2 text-xs text-neutral-400">The requested article could not be retrieved from the archives.</p>
        <button onClick={onBack} className="btn-ink mt-6 !px-6 !py-3">
          ← Back to All Field Notes
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Scroll Reading Progress Bar at very top */}
      <div className="fixed top-0 inset-x-0 z-50 h-[3px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-[#D4AF37] to-[#F3E5C8] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="pt-28 pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Back & Breadcrumb Bar */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 font-mono text-xs text-neutral-400 hover:text-[#D4AF37] transition-colors"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform" />
              <span>Back to Field Notes & Research</span>
            </button>

            <span className="font-mono text-[11px] text-neutral-500 hidden sm:inline">
              Reading Time: {article.readTime || '6 min'}
            </span>
          </div>

          {/* Hero Masthead Card */}
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-b from-[#14141C] to-[#0D0D12] p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1 font-mono text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                {article.category}
              </span>
              <span className="flex items-center gap-1 font-mono text-xs text-neutral-400">
                <Clock size={13} />
                {article.readTime || '6 min read'}
              </span>
              <span className="flex items-center gap-1 font-mono text-xs text-neutral-400">
                <Eye size={13} />
                {(article.views || 1420).toLocaleString()} readers
              </span>
            </div>

            <h1 className="mt-5 font-serif text-3xl font-medium leading-[1.08] tracking-tight text-[#F5F3EF] sm:text-5xl md:text-6xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-5 font-serif text-lg italic text-[#C5A880] leading-relaxed md:text-xl border-l-2 border-[#D4AF37]/60 pl-4 py-1">
                "{article.excerpt}"
              </p>
            )}

            {/* Author & Share Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3.5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 font-serif font-black text-[#D4AF37] text-sm shadow-md shadow-[#D4AF37]/10">
                  CG
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F3EF]">{article.author || 'Elena Vance — Head of Syndication'}</p>
                  <p className="font-mono text-[10px] text-neutral-400">
                    Published {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'} • Attention Architecture Desk
                  </p>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={shareTwitter}
                  title="Share on X (Twitter)"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-neutral-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
                >
                  <Twitter size={14} />
                </button>
                <button
                  onClick={shareLinkedIn}
                  title="Share on LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-neutral-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
                >
                  <Linkedin size={14} />
                </button>
                <button
                  onClick={copyUrl}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-mono text-neutral-300 hover:border-white/30 hover:text-white transition"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                  <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Cover Photo */}
          <div className="mt-10 overflow-hidden rounded-[32px] border border-white/10 shadow-2xl relative">
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
              className="h-80 w-full object-cover sm:h-[450px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-transparent to-transparent opacity-30 pointer-events-none" />
          </div>

          {/* Interactive Table of Contents (if 2+ headings) */}
          {headings.length > 1 && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#121217]/90 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#C5A880] mb-3">
                <ListTree size={14} />
                <span>Table of Contents & Core Theses</span>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {headings.map((h, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToHeading(h)}
                      className="text-left font-serif text-xs text-neutral-300 hover:text-[#D4AF37] hover:translate-x-1 transition-all flex items-start gap-2"
                    >
                      <span className="font-mono text-[10px] text-[#D4AF37] shrink-0 font-bold">0{i + 1}.</span>
                      <span className="line-clamp-1">{h}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Formatted Article Body */}
          <div className="mt-12 rounded-[32px] border border-white/5 bg-[#09090D] p-6 sm:p-12 shadow-2xl">
            <MarkdownView content={article.content} />
          </div>

          {/* Focus Keyword Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#121217] p-5">
              <div className="flex items-center gap-2 font-mono text-xs text-[#C5A880] mb-3">
                <Tag size={13} />
                <span>Target Focus Keywords & Algorithmic Clusters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-xs text-neutral-300"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Box */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-[#121217] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] text-black font-serif font-black text-xl shadow-lg">
              CG
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#D4AF37] tracking-wider font-semibold">
                About The Author
              </span>
              <h4 className="font-serif text-lg font-medium text-[#F5F3EF]">
                {article.author || 'Elena Vance — Head of Syndication'}
              </h4>
              <p className="mt-1 text-xs text-[#A3A3B0] leading-relaxed">
                Directs full-funnel distribution architecture for Creator Growth System. Specializes in 0–3 second
                micro-hook optimization, video atomization, and converting ambient viral attention into high-ticket deal flow.
              </p>
            </div>
          </div>

          {/* Read Next / Related Field Notes */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#F5F3EF]">Related Strategic Research</h3>
                <button
                  onClick={onBack}
                  className="font-mono text-xs text-[#D4AF37] hover:underline"
                >
                  View All Field Notes →
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.slug}
                    onClick={() => {
                      if (onSelectArticle) onSelectArticle(rel.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group rounded-2xl border border-white/10 bg-[#121217] p-5 hover:border-[#D4AF37]/50 hover:bg-[#161622] transition-all cursor-pointer shadow-lg"
                  >
                    <span className="font-mono text-[10px] text-[#D4AF37] uppercase">{rel.category}</span>
                    <h4 className="mt-1 font-serif text-lg font-medium text-[#F5F3EF] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="mt-2 text-xs text-neutral-400 line-clamp-2">{rel.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-white/5">
                      <span>{rel.readTime || '5 min'}</span>
                      <span className="text-[#D4AF37] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Read Breakdown →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End-Of-Article Conversion CTA */}
          <div className="mt-16 rounded-[36px] border border-[#D4AF37]/30 bg-gradient-to-br from-[#161622] via-[#121218] to-[#0A0A0E] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
            <span className="eyebrow !text-[#D4AF37]">[ Private Syndication Retainers ]</span>
            <h3 className="mt-3 font-serif text-2xl font-medium text-[#F5F3EF] md:text-4xl">
              Turn your longform archive into an omnipresent media machine.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-xs text-[#A3A3B0] md:text-sm leading-relaxed">
              We review your longform library, analyze retention drop-offs, and engineer a customized
              omnipresence system that converts viewers into high-ticket clients.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => onOpenAudit()} className="btn-ink !px-8 !py-4 text-xs font-semibold">
                Request Channel Growth Audit
                <ArrowRight size={14} />
              </button>
              <button onClick={onBack} className="btn-line !px-6 !py-4 text-xs">
                Browse More Field Notes
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
