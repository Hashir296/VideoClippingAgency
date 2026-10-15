import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuditProvider } from './context/AuditContext.jsx';
import Cursor from './components/Cursor.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Ticker from './components/Ticker.jsx';
import Paradigm from './components/Paradigm.jsx';
import Engine from './components/Engine.jsx';
import Segments from './components/Segments.jsx';
import Retainers from './components/Retainers.jsx';
import Portal from './components/Portal.jsx';
import Footer from './components/Footer.jsx';
import AuditModal from './components/AuditModal.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import BlogList from './components/Blog/BlogList.jsx';
import ArticleView from './components/Blog/ArticleView.jsx';
import FeaturedNotes from './components/FeaturedNotes.jsx';
import { api } from './lib/api.js';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#admin') return 'admin';
    if (hash === '#blog') return 'blog';
    if (hash.startsWith('#article/')) return 'article';
    return 'home';
  });

  const [selectedArticleSlug, setSelectedArticleSlug] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#article/')) {
      return hash.replace('#article/', '');
    }
    return '';
  });

  const [articles, setArticles] = useState([]);
  const [tickerPhrases, setTickerPhrases] = useState(() => {
    try {
      const saved = localStorage.getItem('cg_ticker_phrases');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      '50M+ Organic Impressions',
      'Automated Syndication',
      'Zero Commodity Waste',
      'Proprietary AI Scoring',
      'High-Retention Hooks',
      'Full-Funnel Conversion',
    ];
  });

  // Fetch published articles
  const loadPublishedArticles = async () => {
    try {
      const res = await api.getArticles(false);
      if (res.data && res.data.length > 0) {
        setArticles(res.data);
      }
    } catch (err) {
      console.warn('Initial articles load:', err);
    }
  };

  useEffect(() => {
    loadPublishedArticles();
  }, []);

  // Listen to browser hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#blog') {
        setCurrentView('blog');
      } else if (hash.startsWith('#article/')) {
        setSelectedArticleSlug(hash.replace('#article/', ''));
        setCurrentView('article');
      } else if (hash === '' || hash === '#top' || hash.startsWith('#engine') || hash.startsWith('#methodology') || hash.startsWith('#segments') || hash.startsWith('#retainers')) {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view, slug = '') => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = 'top';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'blog') {
      window.location.hash = 'blog';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'article' && slug) {
      setSelectedArticleSlug(slug);
      window.location.hash = `article/${slug}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateTicker = (newPhrases) => {
    setTickerPhrases(newPhrases);
    try {
      localStorage.setItem('cg_ticker_phrases', JSON.stringify(newPhrases));
    } catch {}
  };

  // View transition animations
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  return (
    <AuditProvider>
      <div className="grain" aria-hidden="true" />
      <Cursor />

      {/* Persistent Navbar */}
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      {/* Main Content Area with Smooth Route Transitions */}
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <main>
              <Hero onExploreArticles={() => navigateTo('blog')} />
              <Ticker customPhrases={tickerPhrases} />
              <Paradigm />
              <Engine />
              <Segments />
              <Retainers />
              <FeaturedNotes
                articles={articles}
                onSelectArticle={(slug) => navigateTo('article', slug)}
                onExploreAll={() => navigateTo('blog')}
              />
              <Portal />
            </main>
            <Footer onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentView === 'blog' && (
          <motion.div
            key="blog-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <main>
              <BlogList
                articles={articles}
                onSelectArticle={(slug) => navigateTo('article', slug)}
                onOpenAudit={() => {
                  const btn = document.getElementById('nav-request');
                  if (btn) btn.click();
                }}
              />
            </main>
            <Footer onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentView === 'article' && (
          <motion.div
            key={`article-${selectedArticleSlug}`}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <main>
              <ArticleView
                slug={selectedArticleSlug}
                onBack={() => navigateTo('blog')}
                onSelectArticle={(slug) => navigateTo('article', slug)}
                onOpenAudit={() => {
                  const btn = document.getElementById('nav-request');
                  if (btn) btn.click();
                }}
              />
            </main>
            <Footer onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentView === 'admin' && (
          <motion.div
            key="admin-view"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminPanel
              onClose={() => navigateTo('home')}
              onNavigateHome={() => navigateTo('home')}
              onViewArticle={(slug) => navigateTo('article', slug)}
              tickerPhrases={tickerPhrases}
              onUpdateTicker={updateTicker}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AuditModal />
    </AuditProvider>
  );
}
