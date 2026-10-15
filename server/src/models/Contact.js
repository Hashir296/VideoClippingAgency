import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model('Contact', contactSchema);
