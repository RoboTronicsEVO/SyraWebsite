import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    // Already connected
    return;
  }
  const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;
  if (!uri) {
    console.error('[MONGODB] No connection string found in env!');
    throw new Error('No MongoDB connection string');
  }
  const redacted = uri.replace(/(mongodb(?:\+srv)?:\/\/)(.*:)(.*)(@)/, '$1$2***$4');
  console.log('[MONGODB] Connecting to:', redacted);
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('[MONGODB] Connected successfully');
  } catch (err) {
    console.error('[MONGODB] Connection failed:', err);
    throw err;
  }
}