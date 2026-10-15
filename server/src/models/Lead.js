import mongoose from 'mongoose';

export const PLATFORMS = ['Twitch', 'YouTube', 'Kick', 'Podcast', 'Other'];
export const PACKAGES = ['Starter', 'Growth', 'Full System'];
export const AUDIENCE_SCALES = ['Under 10k', '10k – 100k', '100k – 1M', '1M+'];
export const REVENUE_MODELS = [
  'Brand sponsorships',
  'Memberships & subscriptions',
  'High-ticket services',
  'Courses & digital products',
  'Enterprise deal flow',
];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    platform: { type: String, enum: PLATFORMS, default: 'Other' },
    channelUrl: { type: String, required: true, trim: true },
    audienceScale: { type: String, enum: AUDIENCE_SCALES },
    revenueModel: { type: String, enum: REVENUE_MODELS },
    selectedPackage: { type: String, enum: PACKAGES, default: 'Growth' },
    notes: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['Pending', 'Audit Sent', 'Closed', 'Rejected'],
      default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model('Lead', leadSchema);
