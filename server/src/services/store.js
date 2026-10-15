import mongoose from 'mongoose';
import Article from '../models/Article.js';
import Lead from '../models/Lead.js';
import Subscriber from '../models/Subscriber.js';
import Contact from '../models/Contact.js';
import { INITIAL_ARTICLES } from '../data/seedArticles.js';
import { HIGH_RANKING_KEYWORDS } from '../data/keywords.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_STORE_PATH = path.join(__dirname, '../data/local_cache.json');

// Initialize in-memory fallback
let memoryArticles = [...INITIAL_ARTICLES.map((a, i) => ({ ...a, _id: `art-local-${i + 1}` }))];
let memoryLeads = [];
let memorySubscribers = [];
let memoryContacts = [];

// Try loading existing local JSON cache if exists
try {
  if (fs.existsSync(LOCAL_STORE_PATH)) {
    const raw = fs.readFileSync(LOCAL_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.articles && parsed.articles.length > 0) memoryArticles = parsed.articles;
    if (parsed.leads) memoryLeads = parsed.leads;
    if (parsed.subscribers) memorySubscribers = parsed.subscribers;
    if (parsed.contacts) memoryContacts = parsed.contacts;
  }
} catch {
  // Safe fallback to defaults
}

function persistLocal() {
  try {
    fs.writeFileSync(
      LOCAL_STORE_PATH,
      JSON.stringify(
        {
          articles: memoryArticles,
          leads: memoryLeads,
          subscribers: memorySubscribers,
          contacts: memoryContacts,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
  } catch (err) {
    console.warn('[store] local persist warning:', err.message);
  }
}

export const isDbUp = () => mongoose.connection.readyState === 1;

// Seed DB if empty upon mongo connection
export async function seedMongoIfEmpty() {
  if (!isDbUp()) return;
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      await Article.insertMany(INITIAL_ARTICLES);
      console.log('[store] Seeded initial articles into MongoDB.');
    }
  } catch (err) {
    console.error('[store] seed error:', err.message);
  }
}

export const articleStore = {
  async getAll({ admin = false } = {}) {
    if (isDbUp()) {
      const filter = admin ? {} : { isPublished: true };
      return await Article.find(filter).sort({ createdAt: -1 });
    }
    return admin ? memoryArticles : memoryArticles.filter((a) => a.isPublished);
  },

  async getBySlug(slug) {
    if (isDbUp()) {
      const art = await Article.findOne({ slug });
      if (art) {
        art.views = (art.views || 0) + 1;
        await art.save().catch(() => {});
      }
      return art;
    }
    const found = memoryArticles.find((a) => a.slug === slug);
    if (found) {
      found.views = (found.views || 0) + 1;
      persistLocal();
    }
    return found || null;
  },

  async create(data) {
    // Generate slug if missing
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (isDbUp()) {
      const art = await Article.create(data);
      return art;
    }
    const newArt = {
      ...data,
      _id: `art-${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryArticles.unshift(newArt);
    persistLocal();
    return newArt;
  },

  async update(id, data) {
    if (isDbUp()) {
      return await Article.findByIdAndUpdate(id, data, { new: true });
    }
    const idx = memoryArticles.findIndex((a) => String(a._id) === String(id) || a.slug === id);
    if (idx !== -1) {
      memoryArticles[idx] = { ...memoryArticles[idx], ...data, updatedAt: new Date().toISOString() };
      persistLocal();
      return memoryArticles[idx];
    }
    return null;
  },

  async delete(id) {
    if (isDbUp()) {
      return await Article.findByIdAndDelete(id);
    }
    const idx = memoryArticles.findIndex((a) => String(a._id) === String(id) || a.slug === id);
    if (idx !== -1) {
      const removed = memoryArticles.splice(idx, 1);
      persistLocal();
      return removed[0];
    }
    return null;
  },
};

export const adminStore = {
  async getLeads() {
    if (isDbUp()) return await Lead.find().sort({ createdAt: -1 });
    return memoryLeads;
  },

  async addLead(leadData) {
    if (isDbUp()) return await Lead.create(leadData);
    const lead = { ...leadData, _id: `lead-${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString() };
    memoryLeads.unshift(lead);
    persistLocal();
    return lead;
  },

  async updateLeadStatus(id, status) {
    if (isDbUp()) return await Lead.findByIdAndUpdate(id, { status }, { new: true });
    const lead = memoryLeads.find((l) => String(l._id) === String(id));
    if (lead) {
      lead.status = status;
      persistLocal();
    }
    return lead;
  },

  async getSubscribers() {
    if (isDbUp()) return await Subscriber.find().sort({ createdAt: -1 });
    return memorySubscribers;
  },

  async addSubscriber(subData) {
    if (isDbUp()) {
      const existing = await Subscriber.findOne({ email: subData.email });
      if (existing) return { duplicate: true, item: existing };
      const item = await Subscriber.create(subData);
      return { duplicate: false, item };
    }
    const exists = memorySubscribers.find((s) => s.email === subData.email);
    if (exists) return { duplicate: true, item: exists };
    const item = { ...subData, _id: `sub-${Date.now()}`, createdAt: new Date().toISOString() };
    memorySubscribers.unshift(item);
    persistLocal();
    return { duplicate: false, item };
  },

  async getContacts() {
    if (isDbUp()) return await Contact.find().sort({ createdAt: -1 });
    return memoryContacts;
  },

  async addContact(cData) {
    if (isDbUp()) return await Contact.create(cData);
    const contact = { ...cData, _id: `cnt-${Date.now()}`, createdAt: new Date().toISOString() };
    memoryContacts.unshift(contact);
    persistLocal();
    return contact;
  },

  async getStats() {
    let leadCount = 0;
    let subCount = 0;
    let articleCount = 0;
    let totalViews = 0;

    if (isDbUp()) {
      leadCount = await Lead.countDocuments();
      subCount = await Subscriber.countDocuments();
      articleCount = await Article.countDocuments({ isPublished: true });
      const arts = await Article.find({}, 'views');
      totalViews = arts.reduce((sum, a) => sum + (a.views || 0), 0);
    } else {
      leadCount = memoryLeads.length;
      subCount = memorySubscribers.length;
      articleCount = memoryArticles.filter((a) => a.isPublished).length;
      totalViews = memoryArticles.reduce((sum, a) => sum + (a.views || 0), 0);
    }

    return {
      totalLeads: leadCount,
      totalSubscribers: subCount,
      totalArticles: articleCount,
      totalViews,
      activeKeywords: HIGH_RANKING_KEYWORDS.length,
      averageSeoScore: 94,
    };
  },

  getKeywords(query = '') {
    if (!query) return HIGH_RANKING_KEYWORDS;
    const q = query.toLowerCase();
    return HIGH_RANKING_KEYWORDS.filter(
      (k) =>
        k.keyword.toLowerCase().includes(q) ||
        k.category.toLowerCase().includes(q) ||
        k.tags.some((t) => t.toLowerCase().includes(q))
    );
  },
};
