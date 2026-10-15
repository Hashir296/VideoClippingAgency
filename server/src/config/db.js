import dns from 'dns';
import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/creator_growth_db';
  if (uri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch {
      // DNS override note
    }
  }

  mongoose.set('strictQuery', true);
  cachedConnection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[db] Connected to MongoDB Atlas: ${mongoose.connection.host}/${mongoose.connection.name}`);
  return cachedConnection;
}
