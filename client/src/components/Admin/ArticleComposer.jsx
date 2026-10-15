import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Send,
  Eye,
  FileEdit,
  Columns,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  Clock,
  User,
  Globe,
  Loader2,
  Lightbulb,
  Wand2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Table,
  Check,
  ChevronDown,
  RefreshCw,
  Info,
} from 'lucide-react';
import MarkdownView from '../Blog/MarkdownView.jsx';
import { api } from '../../lib/api.js';

const PRESET_COVERS = [
  {
    label: 'Modern Media Studio',
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Golden Waveforms',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Video Timeline Suite',
    url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'High-Tech Creator Lab',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
];

const SUGGESTED_TOPICS = [
  'How Top Podcasters Repurpose 1 Episode into 30 Viral Shorts',
  'Mastering the 3-Second Hook: YouTube Shorts Retention Architecture',
  'Why 99% of Automated AI Clips Flop (And What Humans Do Differently)',
  'Faceless Channel Video Clipping: Turning Attention into $20k Retainers',
  'TikTok Organic Reach in 2026: Why Pacing and Micro-Cuts Win The Feed',
];

export default function ArticleComposer({ initialData = null, onSave, onCancel }) {
  // Main Article Data
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'Strategy');
  const [author, setAuthor] = useState(initialData?.author || 'Elena Vance — Head of Syndication');
  const [readTime, setReadTime] = useState(initialData?.readTime || '6 min read');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || PRESET_COVERS[0].url);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [keywords, setKeywords] = useState(initialData?.keywords || ['video clipping agency', 'creator growth']);
  const [newKeyword, setNewKeyword] = useState('');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');

  // UI Modes: 'edit' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState('split');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Assistant States
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Authoritative, high-leverage founder');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTitleOptions, setAiTitleOptions] = useState([]);
  const [aiHooks, setAiHooks] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const textareaRef = useRef(null);

  // Auto-generate slug when title changes unless manual edit
  useEffect(() => {
    if (!initialData && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  }, [title, initialData]);

  // Estimate read time based on words
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${mins} min read`);
  }, [content]);

  // Intelligent SEO Ranking Score Calculation
  const seoAnalysis = useMemo(() => {
    let score = 0;
    const checks = [];
    const primaryKw = keywords[0]?.toLowerCase() || '';

    // 1. Keyword in Title
    const hasKwInTitle = primaryKw && title.toLowerCase().includes(primaryKw);
    if (hasKwInTitle) {
      score += 20;
      checks.push({ label: `Primary keyword "${primaryKw}" in title`, pass: true });
    } else {
      checks.push({ label: `Include "${primaryKw || 'target keyword'}" in title`, pass: false });
    }

    // 2. Title Length (30 - 70 chars)
    const titleLenPass = title.length >= 30 && title.length <= 70;
    if (titleLenPass) {
      score += 15;
      checks.push({ label: `Title length (${title.length} chars) is optimal`, pass: true });
    } else {
      checks.push({ label: `Aim for 30-70 characters in title (current: ${title.length})`, pass: false });
    }

    // 3. Word Count (350+ words)
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 350) {
      score += 20;
      checks.push({ label: `Comprehensive depth (${wordCount} words)`, pass: true });
    } else {
      checks.push({ label: `Content length: ${wordCount}/350 words recommended`, pass: false });
    }

    // 4. Subheadings (H2/H3)
    const hasH2 = content.includes('## ');
    if (hasH2) {
      score += 15;
      checks.push({ label: 'Structured with section headings (H2)', pass: true });
    } else {
      checks.push({ label: 'Add at least one "## Section" heading', pass: false });
    }

    // 5. Keyword in Content
    const hasKwInBody = primaryKw && content.toLowerCase().includes(primaryKw);
    if (hasKwInBody) {
      score += 15;
      checks.push({ label: `Keyword used naturally in article body`, pass: true });
    } else {
      checks.push({ label: `Mention "${primaryKw}" in first 2 paragraphs`, pass: false });
    }

    // 6. Meta Description
    const metaPass = seoDescription.length >= 80 && seoDescription.length <= 160;
    if (metaPass) {
      score += 15;
      checks.push({ label: `Meta description length (${seoDescription.length} chars) is perfect`, pass: true });
    } else {
      checks.push({ label: `Meta description should be 80-160 chars (current: ${seoDescription.length})`, pass: false });
    }

    return { score: Math.min(score, 100), checks, wordCount };
  }, [title, seoDescription, content, keywords]);

  // Insert markdown formatting helper at cursor
  const insertFormat = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const sel = content.substring(start, end) || 'text';
    const updated = content.substring(0, start) + before + sel + after + content.substring(end);

    setContent(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + sel.length);
    }, 10);
  };

  // Run AI Article Generation
  const handleGenerateAiArticle = async (selectedTopic = '') => {
    const topicToUse = selectedTopic || aiTopic || title || keywords[0];
    if (!topicToUse) {
      alert('Please enter or select a topic to generate an article.');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await api.generateAiArticle({
        topic: topicToUse,
        keyword: keywords[0] || topicToUse,
        tone: aiTone,
        category,
      });

      if (res.data) {
        setTitle(res.data.title || topicToUse);
        if (res.data.slug) setSlug(res.data.slug);
        if (res.data.excerpt) setExcerpt(res.data.excerpt);
        if (res.data.content) setContent(res.data.content);
        if (res.data.seoDescription) setSeoDescription(res.data.seoDescription);
        if (res.data.keywords && res.data.keywords.length > 0) setKeywords(res.data.keywords);
        if (res.data.titleOptions) setAiTitleOptions(res.data.titleOptions);
        if (res.data.hooks) setAiHooks(res.data.hooks);

        setAiSuccessMsg('✨ AI Article generated with full outline and SEO keywords!');
        setTimeout(() => setAiSuccessMsg(''), 4000);
        setShowAiModal(false);
      }
    } catch (err) {
      alert(err.message || 'AI generation failed. Please try again.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI: Generate Titles
  const handleFetchTitles = async () => {
    if (!title && !keywords[0]) return alert('Enter a title or keyword first.');
    try {
      const res = await api.generateTitles(title || keywords[0]);
      if (res.data) setAiTitleOptions(res.data);
    } catch (e) {
      console.warn('Titles gen error', e);
    }
  };

  // AI: Generate Hooks
  const handleFetchHooks = async () => {
    if (!title && !keywords[0]) return alert('Enter a title or keyword first.');
    try {
      const res = await api.generateHooks(title || keywords[0]);
      if (res.data) setAiHooks(res.data);
    } catch (e) {
      console.warn('Hooks gen error', e);
    }
  };

  // AI: Auto-Optimize SEO
  const handleAutoOptimizeSeo = () => {
    const primaryKw = keywords[0] || 'video clipping agency';
    let newTitle = title;
    if (!newTitle.toLowerCase().includes(primaryKw.toLowerCase())) {
      newTitle = `${primaryKw.replace(/\b\w/g, (c) => c.toUpperCase())}: ${title || 'The Definitive Blueprint'}`;
      setTitle(newTitle);
    }
    if (!seoDescription) {
      setSeoDescription(
        `Discover high-leverage frameworks for ${primaryKw}. Learn how top creators scale retention, viral shorts, and high-ticket revenue.`
      );
    }
    setAiSuccessMsg('⚡ SEO Title & Meta Description auto-optimized!');
    setTimeout(() => setAiSuccessMsg(''), 3000);
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    const trimmed = newKeyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kToRemove) => {
    setKeywords(keywords.filter((k) => k !== kToRemove));
  };

  const handleSubmit = async (publishStatus) => {
    if (!title.trim()) return alert('Please enter an article title.');
    if (!content.trim()) return alert('Please write some content for the article.');

    setIsSubmitting(true);
    const payload = {
      ...(initialData?._id ? { _id: initialData._id } : {}),
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      author,
      readTime,
      coverImage,
      excerpt: excerpt.trim() || content.slice(0, 160).replace(/[#*]/g, '') + '...',
      content: content.trim(),
      keywords,
      seoTitle: title.trim(),
      seoDescription: seoDescription.trim() || excerpt.trim(),
      seoScore: seoAnalysis.score,
      isPublished: publishStatus,
    };

    try {
      await onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#121217] p-5 lg:flex-row lg:items-center lg:justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Wand2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#C5A880]">
                {initialData ? 'Editorial Editor' : 'AI Article Studio & Publisher'}
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                SEO Score: {seoAnalysis.score}/100
              </span>
            </div>
            <h2 className="font-serif text-lg font-medium text-[#F5F3EF] line-clamp-1">
              {title || 'Untitled Strategic Article'}
            </h2>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick AI Generator Launch Button */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-4 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md shadow-[#D4AF37]/10"
          >
            <Sparkles size={14} />
            <span>AI Article Wizard</span>
          </button>

          {/* Layout Toggle: Edit | Split | Preview */}
          <div className="flex items-center rounded-full border border-white/10 bg-[#181822] p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`rounded-full px-3 py-1.5 transition ${
                viewMode === 'edit' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition ${
                viewMode === 'split' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns size={12} />
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`rounded-full px-3 py-1.5 transition ${
                viewMode === 'preview' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Action: Save Draft */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="rounded-full border border-white/20 bg-white/[0.03] px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-white/10 transition disabled:opacity-50"
          >
            Save Draft
          </button>

          {/* Action: Publish Live */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="btn-ink !px-5 !py-2 text-xs font-semibold"
          >
            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>Publish to Website</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {aiSuccessMsg && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/60 p-3.5 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
          <Check size={15} />
          {aiSuccessMsg}
        </div>
      )}

      {/* AI GENERATION MODAL / POPUP WIZARD */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-[#D4AF37]/30 bg-[#121218] p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="text-[#D4AF37]" size={22} />
                <h3 className="font-serif text-xl font-medium text-[#F5F3EF]">AI Article Generator Wizard</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-full border border-white/10 p-1.5 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter any topic or select a proven high-ranking angle. The AI content engine will write an in-depth,
              1,000+ word publication-ready article with headers, retention frameworks, and SEO metadata.
            </p>

            {/* Popular 1-Click Topic Suggestions */}
            <div>
              <label className="label text-[10px]">1-Click Trending Ideas</label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TOPICS.map((top, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAiTopic(top);
                      handleGenerateAiArticle(top);
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-left text-xs text-neutral-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
                  >
                    ⚡ {top}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="label">Or Enter Custom Topic / Keyword</label>
              <input
                type="text"
                placeholder="e.g. How to edit YouTube shorts that cross 1M views..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="field text-sm"
              />
            </div>

            {/* Tone & Style Selector */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Editorial Tone</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="field !py-2.5 text-xs"
                >
                  <option value="Authoritative, high-leverage founder">Authoritative (Founder & Agency)</option>
                  <option value="Viral, high-energy creator">Viral & Engaging (Shortform Creator)</option>
                  <option value="Tactical step-by-step breakdown">Tactical & Technical (Step-by-step)</option>
                  <option value="Contrarian industry tear-down">Contrarian & Critical (Debunking myths)</option>
                </select>
              </div>

              <div>
                <label className="label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="field !py-2.5 text-xs"
                >
                  <option value="Strategy">Strategy</option>
                  <option value="Retention">Retention</option>
                  <option value="Syndication">Syndication</option>
                  <option value="Monetization">Monetization</option>
                  <option value="AI Systems">AI Systems</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="rounded-full px-5 py-2.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAiGenerating}
                onClick={() => handleGenerateAiArticle()}
                className="btn-ink !px-6 !py-2.5 !text-xs font-semibold"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Synthesizing Article...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Generate Full Article Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT / CENTER: WRITING AREA (8 cols or 12 cols if preview) */}
        <div className={`space-y-5 ${viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
          {/* VIEW: FULL PREVIEW MODE */}
          {viewMode === 'preview' && (
            <div className="rounded-3xl border border-white/10 bg-[#0E0E13] p-6 md:p-12 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-[#D4AF37]/20 px-3 py-1 font-mono text-xs text-[#D4AF37]">
                  {category}
                </span>
                <span className="font-mono text-xs text-neutral-400">{readTime}</span>
                <span className="font-mono text-xs text-neutral-400">• By {author}</span>
              </div>
              <h1 className="font-serif text-3xl font-semibold text-[#F5F3EF] md:text-5xl leading-tight">
                {title || 'Untitled Article'}
              </h1>
              {excerpt && <p className="mt-4 font-serif text-lg italic text-[#C5A880]">{excerpt}</p>}
              {coverImage && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                  <img src={coverImage} alt={title} className="h-72 w-full object-cover md:h-96" />
                </div>
              )}
              <div className="mt-10 border-t border-white/10 pt-8">
                <MarkdownView content={content} />
              </div>
            </div>
          )}

          {/* VIEW: SPLIT OR WRITE MODE */}
          {viewMode !== 'preview' && (
            <div className="space-y-5">
              {/* Title & Metadata Card */}
              <div className="rounded-3xl border border-white/10 bg-[#121217] p-6 space-y-4 shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label !mb-0">Article Title</label>
                    <button
                      type="button"
                      onClick={handleFetchTitles}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#D4AF37] hover:underline"
                    >
                      <Lightbulb size={12} />
                      AI Title Suggestions
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Mastering the 3-Second Hook: YouTube Shorts Retention Architecture"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="field text-lg font-serif"
                  />

                  {/* AI Suggested Titles Pills */}
                  {aiTitleOptions.length > 0 && (
                    <div className="mt-3 rounded-2xl border border-[#D4AF37]/20 bg-[#161622] p-3 space-y-1.5">
                      <p className="font-mono text-[10px] uppercase text-[#D4AF37] font-semibold">
                        Click to use AI title:
                      </p>
                      {aiTitleOptions.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setTitle(opt)}
                          className="block w-full text-left font-serif text-xs text-neutral-300 hover:text-[#D4AF37] py-1 border-b border-white/5 last:border-0"
                        >
                          → {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Slug & Category */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">URL Slug</label>
                    <div className="flex items-center rounded-xl border border-white/10 bg-[#16161D] px-3.5 py-3 text-xs text-neutral-400">
                      <span className="mr-1 text-neutral-500 font-mono">/blog/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-transparent text-[#F5F3EF] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="field !py-3 text-xs"
                    >
                      <option value="Strategy">Strategy</option>
                      <option value="Retention">Retention</option>
                      <option value="Syndication">Syndication</option>
                      <option value="Monetization">Monetization</option>
                      <option value="AI Systems">AI Systems</option>
                      <option value="Case Study">Case Study</option>
                    </select>
                  </div>
                </div>

                {/* Excerpt / Lead Paragraph */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label !mb-0">Article Excerpt (Hook Summary)</label>
                    <button
                      type="button"
                      onClick={handleFetchHooks}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#D4AF37] hover:underline"
                    >
                      <Sparkles size={12} />
                      AI Hook Ideas
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="A punchy 1-2 sentence hook explaining why this article matters..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="field resize-none text-xs"
                  />

                  {/* AI Hook Ideas list */}
                  {aiHooks.length > 0 && (
                    <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-3 space-y-1">
                      <p className="font-mono text-[10px] text-[#D4AF37]">Click to insert hook into excerpt:</p>
                      {aiHooks.map((h, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setExcerpt(h)}
                          className="block text-left text-xs italic text-neutral-300 hover:text-white py-0.5"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SPLIT / WRITING CONTAINER */}
              <div className="rounded-3xl border border-white/10 bg-[#121217] overflow-hidden shadow-xl">
                {/* Visual Editor Toolbar */}
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#16161F] px-4 py-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertFormat('**', '**')}
                      title="Bold (**text**)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('*', '*')}
                      title="Italic (*text*)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <Italic size={14} />
                    </button>
                    <span className="mx-1 h-4 w-px bg-white/10" />
                    <button
                      type="button"
                      onClick={() => insertFormat('\n## ')}
                      title="Heading 2 (## Section)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <Heading2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('\n### ')}
                      title="Heading 3 (### Sub-section)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <Heading3 size={14} />
                    </button>
                    <span className="mx-1 h-4 w-px bg-white/10" />
                    <button
                      type="button"
                      onClick={() => insertFormat('\n> ')}
                      title="Blockquote (> Quote)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('\n* ')}
                      title="Bullet list (* item)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('\n1. ')}
                      title="Numbered list (1. item)"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertFormat(
                          '\n\n| Feature | Conventional Clipping | Creator Growth Engine |\n| :--- | :--- | :--- |\n| Retention | 45% drop-off | 85%+ loop completion |\n| Funnel | Zero attribution | High-ticket client pipeline |\n\n'
                        )
                      }
                      title="Insert Data Table"
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <Table size={14} />
                    </button>
                  </div>

                  {/* Word Count Indicator */}
                  <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
                    <span>{seoAnalysis.wordCount} words</span>
                    <span>•</span>
                    <span>{readTime}</span>
                  </div>
                </div>

                {/* Editor Layout: Split vs Single */}
                <div className={viewMode === 'split' ? 'grid md:grid-cols-2 divide-x divide-white/10' : ''}>
                  {/* Textarea Writing Pane */}
                  <div className="p-4">
                    <textarea
                      ref={textareaRef}
                      rows={viewMode === 'split' ? 24 : 16}
                      placeholder="Write your article in markdown or use the AI Generator above...&#10;&#10;## Section Heading&#10;Paragraph text with **bold highlights**..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-full min-h-[380px] bg-transparent font-mono text-xs leading-relaxed text-[#F5F3EF] outline-none placeholder-neutral-600 resize-none"
                    />
                  </div>

                  {/* Live Rendered Markdown Pane (in Split View) */}
                  {viewMode === 'split' && (
                    <div className="p-5 overflow-y-auto max-h-[600px] bg-[#0E0E13]/80">
                      <p className="font-mono text-[10px] uppercase text-[#C5A880] mb-3 tracking-wider">
                        Live Rendered Preview
                      </p>
                      <div className="prose-dark text-xs">
                        <MarkdownView content={content || '*Article preview will appear here as you type...*'} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: SEO HEALTH, KEYWORDS & COVER IMAGE (4 cols) */}
        {viewMode !== 'preview' && (
          <div className="space-y-5 lg:col-span-4">
            {/* Real-time SEO Optimizer Card */}
            <div className="rounded-3xl border border-white/10 bg-[#121217] p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    SEO Ranking Score
                  </span>
                  <p className="font-serif text-lg font-medium text-[#F5F3EF]">Search Visibility</p>
                </div>
                <div className="flex items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-1.5 shadow-inner">
                  <span className="font-mono text-2xl font-bold text-[#D4AF37]">{seoAnalysis.score}</span>
                  <span className="font-mono text-xs text-neutral-400">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#D4AF37] to-emerald-400 transition-all duration-500"
                    style={{ width: `${seoAnalysis.score}%` }}
                  />
                </div>
              </div>

              {/* Checkpoints */}
              <div className="mt-4 space-y-2">
                {seoAnalysis.checks.map((chk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {chk.pass ? (
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle size={13} className="mt-0.5 shrink-0 text-amber-400" />
                    )}
                    <span className={chk.pass ? 'text-neutral-300' : 'text-neutral-500'}>{chk.label}</span>
                  </div>
                ))}
              </div>

              {/* 1-Click Auto Optimize Button */}
              <button
                type="button"
                onClick={handleAutoOptimizeSeo}
                className="mt-5 w-full rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 py-2.5 font-mono text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
              >
                ⚡ 1-Click Auto-Optimize SEO
              </button>
            </div>

            {/* Target Keywords Card */}
            <div className="rounded-3xl border border-white/10 bg-[#121217] p-5 shadow-xl">
              <label className="label flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag size={13} />
                  Target Focus Keywords
                </span>
                <span className="text-[10px] text-neutral-500">First tag is primary</span>
              </label>

              <form onSubmit={handleAddKeyword} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. video clipping agency..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="field !py-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-[#D4AF37]"
                >
                  Add
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {keywords.map((kw, i) => (
                  <span
                    key={kw}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] ${
                      i === 0
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] font-semibold'
                        : 'border border-white/10 bg-white/[0.03] text-neutral-300'
                    }`}
                  >
                    #{kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="ml-1 text-neutral-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Visual Cover Picker */}
            <div className="rounded-3xl border border-white/10 bg-[#121217] p-5 shadow-xl space-y-3">
              <label className="label flex items-center gap-1.5">
                <ImageIcon size={13} />
                Featured Cover Image
              </label>

              {coverImage && (
                <div className="h-32 w-full overflow-hidden rounded-2xl border border-white/10">
                  <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}

              {/* Visual Thumbnail Grid */}
              <div className="grid grid-cols-2 gap-2">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative overflow-hidden rounded-xl border p-1 text-left transition ${
                      coverImage === preset.url
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="h-12 w-full object-cover rounded-lg" />
                    <span className="mt-1 block font-mono text-[10px] text-neutral-300 line-clamp-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>

              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="field !py-2 text-[11px]"
              />
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="rounded-3xl border border-white/10 bg-[#121217] p-5 shadow-xl">
              <label className="label flex items-center gap-1.5">
                <Globe size={13} />
                Google SERP Snippet Preview
              </label>

              <div className="rounded-2xl border border-white/10 bg-[#070709] p-4 text-left">
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span className="font-mono text-emerald-400">https://creatorgrowth.agency</span>
                  <span>› blog › {slug || 'article-slug'}</span>
                </div>
                <h4 className="mt-1 line-clamp-1 font-serif text-sm font-medium text-[#8ab4f8] hover:underline cursor-pointer">
                  {title || 'Article Title - Creator Growth Agency'}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
                  {seoDescription ||
                    excerpt ||
                    'Discover high-impact frameworks on video clipping, retention architecture, and organic syndication.'}
                </p>
              </div>

              <div className="mt-3">
                <label className="label !text-[10px]">Meta Description</label>
                <textarea
                  rows={3}
                  placeholder="Search snippet summary (100-160 chars)..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="field resize-none text-xs"
                />
                <span className="mt-1 block text-right font-mono text-[10px] text-neutral-500">
                  {seoDescription.length} / 160 chars
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
