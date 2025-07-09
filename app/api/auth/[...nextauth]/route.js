import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getRedisClient } from '@/lib/redis';

const LOGIN_RATE_LIMIT = 10;
const LOGIN_WINDOW_SEC = 10 * 60; // 10 minutes

async function isLoginRateLimited(ip) {
  const redis = getRedisClient();
  const key = `login:rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, LOGIN_WINDOW_SEC);
  }
  return count > LOGIN_RATE_LIMIT;
}

const handler = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (req.method === 'POST' && await isLoginRateLimited(ip)) {
    console.warn('[LOGIN] Rate limit exceeded for IP:', ip);
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }
  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };