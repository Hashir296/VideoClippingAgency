import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import {
  createAudit,
  subscribe,
  getPackages,
  createContact,
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getAdminStats,
  getAdminLeads,
  updateLeadStatus,
  getAdminSubscribers,
  getAdminContacts,
  getAdminKeywords,
  generateAiArticle,
  generateTitles,
  generateHooks,
} from '../controllers/index.js';
import { PLATFORMS, PACKAGES, AUDIENCE_SCALES, REVENUE_MODELS } from '../models/Lead.js';

const router = Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Try again in a few minutes.' },
});

const email = body('email').isEmail().withMessage('Enter a valid email').normalizeEmail();

// Public Lead / Audit route
router.post(
  '/audit',
  formLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name is required').escape(),
    email,
    body('channelUrl')
      .trim()
      .isURL({ require_protocol: false })
      .withMessage('Enter a valid channel / podcast URL'),
    body('platform').isIn(PLATFORMS).withMessage('Select a primary platform'),
    body('audienceScale').isIn(AUDIENCE_SCALES).withMessage('Select your current audience scale'),
    body('revenueModel').isIn(REVENUE_MODELS).withMessage('Select a target revenue model'),
    body('selectedPackage').optional().isIn(PACKAGES),
    body('notes').optional().trim().isLength({ max: 2000 }).escape(),
  ],
  validate,
  createAudit
);

// Public Newsletter
router.post(
  '/subscribe',
  formLimiter,
  [email, body('source').optional().trim().isLength({ max: 60 }).escape()],
  validate,
  subscribe
);

router.get('/packages', getPackages);

// Public Contact
router.post(
  '/contact',
  formLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name is required').escape(),
    email,
    body('subject').optional().trim().isLength({ max: 160 }).escape(),
    body('message').trim().isLength({ min: 10, max: 4000 }).withMessage('Message must be at least 10 characters').escape(),
  ],
  validate,
  createContact
);

// Public & Admin Articles
router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);
router.post(
  '/articles',
  [
    body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title is required'),
    body('content').trim().isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  ],
  validate,
  createArticle
);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

// Admin Control Panel Endpoints
router.get('/admin/stats', getAdminStats);
router.get('/admin/leads', getAdminLeads);
router.patch('/admin/leads/:id', updateLeadStatus);
router.get('/admin/subscribers', getAdminSubscribers);
router.get('/admin/contacts', getAdminContacts);
router.get('/admin/keywords', getAdminKeywords);

// AI Content Studio Endpoints
router.post('/ai/generate-article', generateAiArticle);
router.post('/ai/titles', generateTitles);
router.post('/ai/hooks', generateHooks);

export default router;
