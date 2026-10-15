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

// Auto-connect database for all requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[db] auto-connect notice:', err.message);
  }
  next();
});

const healthHandler = (req, res) =>
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'up' : 'down (fallback active)',
    timestamp: new Date().toISOString(),
  });

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount routes at both /api and root to support flexible Vercel rewrites
app.use('/api', routes);
app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

// Listen on configured port (required for Vercel Express service & local dev)
app.listen(PORT, () => {
  console.log(`[api] Creator Growth System API running on port ${PORT}`);
  connectDB()
    .then(() => seedMongoIfEmpty().catch(() => {}))
    .catch((err) => {
      console.warn('[db] MongoDB offline or unreachable:', err.message);
      console.log('[db] In-memory & local cache fallback active. All endpoints functional.');
    });
});

export default app;
