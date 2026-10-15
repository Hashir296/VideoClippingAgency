import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/validate.js';
import { seedMongoIfEmpty } from './services/store.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,*').split(','),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Ensure database connection for all requests (crucial for Serverless Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[db] auto-connect notice:', err.message);
  }
  next();
});

app.get('/api/health', (req, res) =>
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'up' : 'down (fallback active)',
    timestamp: new Date().toISOString(),
  })
);

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

// Standalone listener for local dev / non-serverless
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`[api] Creator Growth System API running on http://localhost:${PORT}`));
  connectDB()
    .then(() => seedMongoIfEmpty().catch(() => {}))
    .catch((err) => {
      console.warn('[db] MongoDB offline or unreachable:', err.message);
      console.log('[db] Seamless in-memory & local cache fallback active. All endpoints functional.');
    });
}

export default app;
