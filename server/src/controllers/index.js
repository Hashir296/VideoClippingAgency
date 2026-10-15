import { packages } from '../data/packages.js';
import { sendAuditConfirmation, sendContactReceipt } from '../services/email.js';
import { asyncHandler } from '../middleware/validate.js';
import { articleStore, adminStore } from '../services/store.js';
import {
  generateSmartArticle,
  generateWithGemini,
  generateTitleIdeas,
  generateViralHooks,
} from '../services/ai.js';

export const createAudit = asyncHandler(async (req, res) => {
  const { name, email, channelUrl, platform, audienceScale, revenueModel, selectedPackage, notes } = req.body;
  const lead = await adminStore.addLead({
    name,
    email,
    channelUrl,
    platform,
    audienceScale,
    revenueModel,
    selectedPackage,
    notes,
  });

  sendAuditConfirmation(lead).catch((e) => console.error('[email] failed', e));

  const leadId = lead._id || lead.id || 'GEN';
  res.status(201).json({
    success: true,
    message: 'Application received. Our team will review your channel personally.',
    data: {
      id: leadId,
      reference: `CG-${String(leadId).slice(-6).toUpperCase()}`,
      status: lead.status || 'Pending',
      confirmationEmail: 'queued',
    },
  });
});

export const subscribe = asyncHandler(async (req, res) => {
  const { email, source } = req.body;
  const result = await adminStore.addSubscriber({ email, source });
  if (result.duplicate) {
    return res.status(200).json({ success: true, message: "You're already on the VIP list.", data: { duplicate: true } });
  }
  res.status(201).json({ success: true, message: "You're in. Welcome to the VIP waitlist." });
});

export const getPackages = (req, res) => {
  res.json({ success: true, data: packages });
};

export const createContact = asyncHandler(async (req, res) => {
  const contact = await adminStore.addContact(req.body);
  sendContactReceipt(contact).catch(() => {});
  res.status(201).json({ success: true, message: "Message received. We'll reply within 24 hours." });
});

// Articles endpoints
export const getArticles = asyncHandler(async (req, res) => {
  const admin = req.query.admin === 'true';
  const articles = await articleStore.getAll({ admin });
  res.json({ success: true, data: articles });
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const article = await articleStore.getBySlug(slug);
  if (!article) {
    return res.status(404).json({ success: false, message: 'Article not found.' });
  }
  res.json({ success: true, data: article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const article = await articleStore.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Article published successfully.',
    data: article,
  });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await articleStore.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Article not found.' });
  }
  res.json({ success: true, message: 'Article updated successfully.', data: updated });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await articleStore.delete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Article not found.' });
  }
  res.json({ success: true, message: 'Article deleted successfully.' });
});

// Admin endpoints
export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await adminStore.getStats();
  res.json({ success: true, data: stats });
});

export const getAdminLeads = asyncHandler(async (req, res) => {
  const leads = await adminStore.getLeads();
  res.json({ success: true, data: leads });
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await adminStore.updateLeadStatus(id, status);
  res.json({ success: true, message: 'Status updated.', data: updated });
});

export const getAdminSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await adminStore.getSubscribers();
  res.json({ success: true, data: subscribers });
});

export const getAdminContacts = asyncHandler(async (req, res) => {
  const contacts = await adminStore.getContacts();
  res.json({ success: true, data: contacts });
});

export const getAdminKeywords = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const keywords = adminStore.getKeywords(q);
  res.json({ success: true, data: keywords });
});

// AI Generation Endpoints
export const generateAiArticle = asyncHandler(async (req, res) => {
  const { topic, keyword, tone, category, apiKey } = req.body;
  const targetTopic = topic || keyword || 'Video Clipping Agency Strategy';

  // If user provided Gemini Key or server has key, try calling Gemini for bespoke synthesis
  const geminiPrompt = `You are the lead content architect at an ultra-luxury video clipping and creator growth agency. 
Write a high-retention, high-ranking SEO blog post about: "${targetTopic}".
Tone: ${tone || 'Authoritative, analytical, high-leverage'}.
Category: ${category || 'Strategy'}.

Requirements:
1. Include an attention-grabbing hook in the first 2 sentences.
2. Structure with H2 (##) and H3 (###) headers, bullet points, data breakdown, and blockquotes.
3. Keep word count around 800-1200 words.
4. Output strictly formatted markdown for the content.`;

  let geminiOutput = await generateWithGemini(geminiPrompt, apiKey);

  if (geminiOutput) {
    const title = targetTopic.replace(/\b\w/g, (c) => c.toUpperCase());
    return res.json({
      success: true,
      provider: 'gemini',
      data: {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: `An elite strategic breakdown on ${targetTopic} for high-output creators and venture founders.`,
        content: geminiOutput,
        category: category || 'Strategy',
        keywords: [keyword || targetTopic, 'creator growth', 'retention architecture'],
        seoTitle: `${title} | Agency Field Notes`,
        seoDescription: `Learn the exact framework behind ${targetTopic}. Master shortform retention and high-ticket conversion.`,
        readTime: '6 min read',
        author: 'Elena Vance — Head of Syndication',
        seoScore: 98,
        titleOptions: generateTitleIdeas(targetTopic),
        hooks: generateViralHooks(targetTopic),
      },
    });
  }

  // Fallback to sophisticated local generative engine
  const generated = generateSmartArticle({ topic, keyword, tone, category });
  res.json({
    success: true,
    provider: 'smart-local-engine',
    data: generated,
  });
});

export const generateTitles = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  const titles = generateTitleIdeas(topic);
  res.json({ success: true, data: titles });
});

export const generateHooks = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  const hooks = generateViralHooks(topic);
  res.json({ success: true, data: hooks });
});
