import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    source: { type: String, default: 'website', trim: true, maxlength: 60 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model('Subscriber', subscriberSchema);
