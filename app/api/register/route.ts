import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import { registerSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import { getRedisClient } from '@/lib/redis';

const RATE_LIMIT = 5; // max requests
const WINDOW_SEC = 10 * 60; // 10 minutes

async function isRateLimited(ip: string) {
  const redis = getRedisClient();
  const key = `register:rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SEC);
  }
  return count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  if (await isRateLimited(ip)) {
    console.warn('[REGISTER] Rate limit exceeded');
    return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
  }
  console.log('[REGISTER] Incoming registration request');
  await connectToDatabase();
  const data = await request.json();
  // Do not log received user data

  // Validate input
  const parse = registerSchema.safeParse(data);
  if (!parse.success) {
    console.error('[REGISTER] Validation error');
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  // Extra server-side validation
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(data.email)) {
    console.error('[REGISTER] Invalid email format');
    return NextResponse.json({ error: { fieldErrors: { email: 'Invalid email format' } } }, { status: 400 });
  }
  if (typeof data.password !== 'string' || data.password.length < 8 || !/[0-9]/.test(data.password) || !/[a-zA-Z]/.test(data.password)) {
    console.error('[REGISTER] Weak password');
    return NextResponse.json({ error: { fieldErrors: { password: 'Password must be at least 8 characters and include a number and a letter' } } }, { status: 400 });
  }

  // Check for unique email
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    console.warn('[REGISTER] Email already exists');
    return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
  }

  // Hash password
  const hashed = await bcrypt.hash(data.password, 10);
  console.log('[REGISTER] Password hashed');

  // Create user
  try {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
      image: '',
      verified: false,
    });
    console.log('[REGISTER] User created');
    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('[REGISTER] Error creating user');
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
} 