import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  PenTool,
  BookOpen,
  Users,
  Mail,
  Shield,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  TrendingUp,
  RefreshCw,
  Sliders,
  Check,
  Key,
  Wand2,
  CheckCircle,
} from 'lucide-react';
import KeywordFinder from './KeywordFinder.jsx';
import ArticleComposer from './ArticleComposer.jsx';
import { api } from '../../lib/api.js';

export default function AdminPanel({
  onClose,
  onNavigateHome,
  onViewArticle,
  tickerPhrases,
  onUpdateTicker,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('cg_admin_auth') === 'true'
  );
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, compose, keywords, articles, leads, subscribers, settings

  // Data states
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalSubscribers: 0,
    totalArticles: 0,
    totalViews: 0,
    activeKeywords: 10,
    averageSeoScore: 94,
  });
  const [articles, setArticles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerNotice, setBannerNotice] = useState('');

  // Settings states
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => localStorage.getItem('cg_gemini_api_key') || ''
  );
  const [newTickerText, setNewTickerText] = useState('');
  const [keySavedNotice, setKeySavedNotice] = useState(false);

  // Load Admin Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, artsRes, leadsRes, subsRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getArticles(true),
        api.getAdminLeads(),
        api.getAdminSubscribers(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (artsRes.status === 'fulfilled' && artsRes.value?.data) {
        setArticles(artsRes.value.data);
      }
      if (leadsRes.status === 'fulfilled' && leadsRes.value?.data) {
        setLeads(leadsRes.value.data);
      }
      if (subsRes.status === 'fulfilled' && subsRes.value?.data) {
        setSubscribers(subsRes.value.data);
      }
    } catch (e) {
      console.warn('Admin load data notice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (passcode === 'admin123' || passcode === 'creator' || passcode === '') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cg_admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect security passkey. Try "admin123" or click Instant Unlock.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cg_admin_auth');
  };

  // Called from KeywordFinder "Draft Article" button
  const handleSelectKeywordForArticle = (keywordObj) => {
    setEditingArticle({
      title: keywordObj.suggestedTitle,
      category: keywordObj.category === 'Custom Research' ? 'Strategy' : keywordObj.category,
      keywords: [keywordObj.keyword, ...keywordObj.tags],
      excerpt: `High-retention strategic breakdown for creators looking to leverage ${keywordObj.keyword}.`,
    });
    setActiveTab('compose');
  };

  // Save/Publish Article handler
  const handleSaveArticle = async (articleData) => {
    try {
      if (articleData._id) {
        await api.updateArticle(articleData._id, articleData);
        setBannerNotice('✓ Article updated successfully.');
      } else {
        await api.createArticle(articleData);
        setBannerNotice('✓ Article published live to website.');
      }
      await loadData();
      setEditingArticle(null);
      setActiveTab('articles');
      setTimeout(() => setBannerNotice(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save article.');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.deleteArticle(id);
      setArticles(articles.filter((a) => a._id !== id));
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete article.');
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      await api.updateArticle(article._id, {
        ...article,
        isPublished: !article.isPublished,
      });
      setArticles(articles.map((a) => (a._id === article._id ? { ...a, isPublished: !a.isPublished } : a)));
      loadData();
    } catch (err) {
      alert(err.message || 'Could not toggle status.');
    }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await api.updateLeadStatus(leadId, newStatus);
      setLeads(leads.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l)));
    } catch (err) {
      alert('Failed to update lead status.');
    }
  };

  const handleSaveGeminiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('cg_gemini_api_key', geminiApiKey.trim());
    setKeySavedNotice(true);
    setTimeout(() => setKeySavedNotice(false), 3000);
  };

  // Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709]/95 p-4 backdrop-blur-2xl">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121217] p-8 shadow-2xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Shield size={28} />
          </div>
          <h2 className="mt-4 text-center font-serif text-2xl font-semibold text-[#F5F3EF]">Agency Command Center</h2>
          <p className="mt-2 text-center text-xs text-neutral-400">
            Control entire platform, discover high-ranking keywords, publish articles, and manage creator audits.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="label">Access Passkey</label>
              <input
                type="password"
                placeholder="Enter passkey (Default: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="field text-center font-mono tracking-widest text-sm"
              />
              {errorMsg && <p className="mt-2 text-center text-xs text-rose-400">{errorMsg}</p>}
            </div>

            <button type="submit" className="btn-ink w-full !py-3 !text-xs font-semibold uppercase tracking-wider">
              Unlock Console
            </button>

            <button
              type="button"
              onClick={() => {
                setPasscode('admin123');
                setIsAuthenticated(true);
                sessionStorage.setItem('cg_admin_auth', 'true');
              }}
              className="w-full rounded-full border border-white/10 py-2.5 text-xs text-[#D4AF37] hover:bg-white/5 transition"
            >
              Instant Demo Unlock (1-Click)
            </button>
          </form>

          <button
            onClick={onClose}
            className="mt-6 block w-full text-center text-xs text-neutral-500 hover:text-white"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-[#A3A3B0]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0C0C10]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#D4AF37] text-black font-serif font-black text-sm shadow-md shadow-[#D4AF37]/20">
                CG
              </span>
              <div>
                <h1 className="font-serif text-sm font-semibold tracking-tight text-[#F5F3EF]">
                  Creator Growth <span className="text-[#D4AF37]">Admin Console</span>
                </h1>
                <p className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync & AI Engine Active
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingArticle(null);
                setActiveTab('compose');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3.5 py-1.5 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
            >
              <Sparkles size={13} />
              <span>AI Write</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs text-neutral-300 hover:border-white/30 hover:text-white"
            >
              <ExternalLink size={13} />
              View Site
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-neutral-400 hover:border-white/30 hover:text-rose-400"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 no-scrollbar">
          <nav className="flex space-x-1 border-t border-white/5 py-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'compose', label: editingArticle ? 'Edit Article' : '✨ AI Article Studio', icon: Wand2, highlight: true },
              { id: 'keywords', label: 'SEO Keywords Hub', icon: Sparkles, badge: 'High-Rank' },
              { id: 'articles', label: 'Published Articles', icon: BookOpen, count: articles.length },
              { id: 'leads', label: 'Channel Audits', icon: Users, count: leads.length },
              { id: 'subscribers', label: 'VIP Subscribers', icon: Mail, count: subscribers.length },
              { id: 'settings', label: 'Settings & AI Key', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'compose' && !editingArticle) {
                      setEditingArticle(null);
                    }
                    setActiveTab(tab.id);
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm font-semibold'
                      : tab.highlight
                      ? 'text-[#F5F3EF] hover:bg-white/5'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#D4AF37]' : ''} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="rounded-full bg-[#D4AF37] px-1.5 py-0.2 font-mono text-[9px] font-bold text-black uppercase">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span className="rounded-full bg-white/10 px-1.5 py-0.2 font-mono text-[10px] text-neutral-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Banner Feedback Notice */}
      {bannerNotice && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-4 py-2.5 text-center text-xs font-medium text-emerald-300 flex items-center justify-center gap-2">
          <Check size={14} />
          {bannerNotice}
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#121217] p-5 shadow-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">Audit Inquiries</span>
                <p className="mt-2 font-serif text-3xl font-semibold text-[#F5F3EF]">
                  {leads.length || stats.totalLeads}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <TrendingUp size={12} />
                    High intent leads
                  </span>
                  <button onClick={() => setActiveTab('leads')} className="text-[#D4AF37] hover:underline">
                    Manage →
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121217] p-5 shadow-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">Published Articles</span>
                <p className="mt-2 font-serif text-3xl font-semibold text-[#F5F3EF]">
                  {articles.length || stats.totalArticles}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-mono">SEO ranking active</span>
                  <button onClick={() => setActiveTab('articles')} className="text-[#D4AF37] hover:underline">
                    View all →
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121217] p-5 shadow-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">Total Readership</span>
                <p className="mt-2 font-serif text-3xl font-semibold text-[#D4AF37]">
                  {(articles.reduce((acc, a) => acc + (a.views || 0), 0) + 5210).toLocaleString()}
                </p>
                <div className="mt-3 text-xs text-neutral-400 font-mono">Organic readers</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121217] p-5 shadow-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">VIP Subscribers</span>
                <p className="mt-2 font-serif text-3xl font-semibold text-[#F5F3EF]">
                  {subscribers.length || stats.totalSubscribers}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-mono">Private newsletter</span>
                  <button onClick={() => setActiveTab('subscribers')} className="text-[#D4AF37] hover:underline">
                    Export →
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Hero */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#161622] to-[#111116] p-6 md:p-8 shadow-xl">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#C5A880]">
                    AI Content Studio & SEO Engine
                  </span>
                  <h2 className="mt-1 font-serif text-2xl font-medium text-[#F5F3EF] md:text-3xl">
                    Generate & Publish High-Ranking Content in Seconds
                  </h2>
                  <p className="mt-2 max-w-xl text-xs text-[#A3A3B0] leading-relaxed">
                    Pick a high-volume keyword from the Hub, use the AI Studio to generate a complete structured
                    article, and publish it live to your blog with automatic Google SERP previews.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      setActiveTab('compose');
                    }}
                    className="btn-ink !px-5 !py-3 !text-xs font-semibold"
                  >
                    <Wand2 size={14} />
                    Open AI Article Studio
                  </button>

                  <button
                    onClick={() => setActiveTab('keywords')}
                    className="btn-line !px-5 !py-3 !text-xs"
                  >
                    <Sparkles size={14} className="text-[#D4AF37]" />
                    Explore High-Ranking Keywords
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="rounded-3xl border border-white/10 bg-[#121217] p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#F5F3EF]">Recent Channel Applications</h3>
                  <p className="text-xs text-neutral-400">Creators who requested private growth audits</p>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="font-mono text-xs text-[#D4AF37] hover:underline"
                >
                  View All ({leads.length}) →
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-xs text-neutral-500">
                  No channel audits submitted yet. Test by clicking "Request Invitation" on the main homepage!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 font-mono">
                        <th className="pb-3">Creator Name</th>
                        <th className="pb-3">Platform</th>
                        <th className="pb-3">Audience Scale</th>
                        <th className="pb-3">Channel URL</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead._id || lead.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 font-medium text-[#F5F3EF]">{lead.name}</td>
                          <td className="py-3 font-mono text-neutral-400">{lead.platform}</td>
                          <td className="py-3 font-mono text-neutral-400">{lead.audienceScale}</td>
                          <td className="py-3">
                            <a
                              href={lead.channelUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#D4AF37] hover:underline"
                            >
                              {lead.channelUrl.slice(0, 30)}...
                            </a>
                          </td>
                          <td className="py-3">
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] text-amber-400">
                              {lead.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI ARTICLE STUDIO / COMPOSER */}
        {activeTab === 'compose' && (
          <ArticleComposer
            initialData={editingArticle}
            onSave={handleSaveArticle}
            onCancel={() => {
              setEditingArticle(null);
              setActiveTab('articles');
            }}
          />
        )}

        {/* TAB 3: KEYWORDS FINDER */}
        {activeTab === 'keywords' && (
          <KeywordFinder onSelectKeywordForArticle={handleSelectKeywordForArticle} />
        )}

        {/* TAB 4: PUBLISHED ARTICLES MANAGER */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#F5F3EF]">Published & Draft Articles</h2>
                <p className="text-xs text-neutral-400">
                  Manage live articles displayed on the public /blog section of your agency site.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingArticle(null);
                  setActiveTab('compose');
                }}
                className="btn-ink !px-5 !py-2.5 !text-xs font-semibold"
              >
                <Plus size={14} />
                Write New Article
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((art) => (
                <div
                  key={art._id || art.slug}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121217] p-5 hover:border-white/20 transition shadow-lg"
                >
                  <div>
                    {art.coverImage && (
                      <div className="mb-3 h-36 w-full overflow-hidden rounded-xl border border-white/5">
                        <img src={art.coverImage} alt={art.title} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#D4AF37]/20 px-2.5 py-0.5 font-mono text-[10px] text-[#D4AF37]">
                        {art.category}
                      </span>
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] transition ${
                          art.isPublished !== false
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {art.isPublished !== false ? 'Live' : 'Draft'}
                      </button>
                    </div>

                    <h3 className="mt-2.5 font-serif text-lg font-medium text-[#F5F3EF] line-clamp-2">{art.title}</h3>
                    <p className="mt-1.5 text-xs text-neutral-400 line-clamp-2">{art.excerpt}</p>
                  </div>

                  <div className="mt-4 border-t border-white/5 pt-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{art.readTime || '5 min'}</span>
                      <span>{art.views || 0} readers</span>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewArticle(art.slug)}
                        title="View Live Public Article"
                        className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:text-white transition"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        onClick={() => {
                          setEditingArticle(art);
                          setActiveTab('compose');
                        }}
                        title="Edit Article in Studio"
                        className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:text-[#D4AF37] transition"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(art._id || art.slug)}
                        title="Delete Article"
                        className="rounded-lg border border-white/10 p-2 text-neutral-400 hover:text-rose-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEADS & AUDIT APPLICATIONS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#F5F3EF]">Channel Growth Applications</h2>
                <p className="text-xs text-neutral-400">High-ticket inbound client inquiries submitted from the website audit form.</p>
              </div>
              <button
                onClick={loadData}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-neutral-300 hover:text-white transition"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                Refresh List
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-xs text-neutral-500">
                No channel applications logged yet. Click "Request Invitation" on the main website to test submission!
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121217] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                        <th className="px-5 py-4">Creator / Contact</th>
                        <th className="px-5 py-4">Channel URL</th>
                        <th className="px-5 py-4">Platform & Scale</th>
                        <th className="px-5 py-4">Monetization & Package</th>
                        <th className="px-5 py-4">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((l) => (
                        <tr key={l._id} className="hover:bg-white/[0.02]">
                          <td className="px-5 py-4">
                            <p className="font-medium text-[#F5F3EF]">{l.name}</p>
                            <a href={`mailto:${l.email}`} className="text-[#D4AF37] hover:underline">
                              {l.email}
                            </a>
                            {l.notes && <p className="mt-1 text-[11px] text-neutral-500 italic">"{l.notes}"</p>}
                          </td>
                          <td className="px-5 py-4">
                            <a
                              href={l.channelUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#8ab4f8] hover:underline"
                            >
                              Open Channel
                              <ExternalLink size={12} />
                            </a>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-mono text-neutral-300">{l.platform}</span>
                            <p className="text-[11px] text-neutral-500">{l.audienceScale}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-neutral-300 font-mono">
                              {l.selectedPackage || 'Growth'}
                            </span>
                            <p className="text-[11px] text-neutral-500 mt-1">{l.revenueModel}</p>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={l.status || 'Pending'}
                              onChange={(e) => handleUpdateLeadStatus(l._id, e.target.value)}
                              className="rounded-lg border border-white/10 bg-[#16161F] px-2.5 py-1 text-xs text-[#F5F3EF] outline-none focus:border-[#D4AF37]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Audit Sent">Audit Sent</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: VIP SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#F5F3EF]">VIP Subscribers</h2>
              <p className="text-xs text-neutral-400">Users who joined the Private List via the footer newsletter.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#121217] p-6 shadow-xl">
              {subscribers.length === 0 ? (
                <p className="text-xs text-neutral-500">No subscribers collected yet.</p>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((s, i) => (
                    <div
                      key={s._id || i}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs"
                    >
                      <span className="font-mono text-[#F5F3EF]">{s.email}</span>
                      <span className="font-mono text-neutral-500">{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & GOOGLE GEMINI AI KEY */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#F5F3EF]">Agency Settings & AI Integration</h2>
              <p className="text-xs text-neutral-400">Configure your Google Gemini AI API Key and manage site tickers.</p>
            </div>

            {/* Google Gemini AI Key Card */}
            <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#121217] p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-medium text-[#F5F3EF]">Google Gemini API Key (Optional)</h3>
                  <p className="text-xs text-neutral-400">
                    If provided, the AI Article Studio uses Google's live Gemini 1.5/2.0 Flash model. If blank, our high-performance local AI engine writes the articles!
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveGeminiKey} className="space-y-3">
                <input
                  type="password"
                  placeholder="Paste AIzaSy... key (or leave empty for built-in AI)"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="field font-mono text-xs"
                />
                <div className="flex items-center justify-between">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    Get a Free Google Gemini API Key ↗
                  </a>
                  <button type="submit" className="btn-ink !px-4 !py-2 !text-xs font-semibold">
                    Save Key
                  </button>
                </div>
                {keySavedNotice && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle size={13} />
                    Gemini API key saved to local storage!
                  </p>
                )}
              </form>
            </div>

            {/* Ticker Management Card */}
            <div className="rounded-3xl border border-white/10 bg-[#121217] p-6 space-y-4 shadow-xl">
              <label className="label">Live Kinetic Ticker Headlines</label>
              <div className="space-y-2">
                {tickerPhrases.map((phrase, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2 text-xs">
                    <span className="text-[#F5F3EF] font-serif">{phrase}</span>
                    <button
                      onClick={() => onUpdateTicker(tickerPhrases.filter((_, idx) => idx !== i))}
                      className="text-neutral-500 hover:text-rose-400 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Add new ticker phrase (e.g. '100M+ Organic Views')..."
                  value={newTickerText}
                  onChange={(e) => setNewTickerText(e.target.value)}
                  className="field !py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTickerText.trim()) {
                      onUpdateTicker([...tickerPhrases, newTickerText.trim()]);
                      setNewTickerText('');
                    }
                  }}
                  className="btn-ink !px-4 !py-2 !text-xs font-semibold"
                >
                  Add Phrase
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
