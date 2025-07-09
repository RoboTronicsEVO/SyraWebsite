import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Simple in-memory rate limit store for login
const loginRateLimitStore = new Map();
const LOGIN_RATE_LIMIT = 10;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

function isLoginRateLimited(ip) {
  const now = Date.now();
  const entry = loginRateLimitStore.get(ip) || { count: 0, last: now };
  if (now - entry.last > LOGIN_WINDOW_MS) {
    loginRateLimitStore.set(ip, { count: 1, last: now });
    return false;
  }
  if (entry.count >= LOGIN_RATE_LIMIT) {
    return true;
  }
  loginRateLimitStore.set(ip, { count: entry.count + 1, last: entry.last });
  return false;
}

const handler = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (req.method === 'POST' && isLoginRateLimited(ip)) {
    console.warn('[LOGIN] Rate limit exceeded for IP:', ip);
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }
  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };