import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    category: {
      type: String,
      default: 'Strategy',
      enum: ['Strategy', 'Retention', 'Syndication', 'Monetization', 'AI Systems', 'Case Study'],
    },
    keywords: [{ type: String, trim: true }],
    seoTitle: { type: String, trim: true, maxlength: 100 },
    seoDescription: { type: String, trim: true, maxlength: 300 },
    seoScore: { type: Number, default: 85, min: 0, max: 100 },
    author: { type: String, default: 'Editorial Team' },
    readTime: { type: String, default: '5 min read' },
    isPublished: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

articleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Article', articleSchema);
