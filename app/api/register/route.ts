import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import { registerSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

// Simple in-memory rate limit store
const rateLimitStore = new Map();
const RATE_LIMIT = 5; // max requests
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip) || { count: 0, last: now };
  if (now - entry.last > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, last: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) {
    return true;
  }
  rateLimitStore.set(ip, { count: entry.count + 1, last: entry.last });
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  if (isRateLimited(ip)) {
    console.warn('[REGISTER] Rate limit exceeded for IP:', ip);
    return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 });
  }
  console.log('[REGISTER] Incoming registration request');
  await connectToDatabase();
  const data = await request.json();
  console.log('[REGISTER] Received data:', { ...data, password: '***' });

  // Validate input
  const parse = registerSchema.safeParse(data);
  if (!parse.success) {
    console.error('[REGISTER] Validation error:', parse.error.flatten());
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  // Extra server-side validation
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(data.email)) {
    console.error('[REGISTER] Invalid email format:', data.email);
    return NextResponse.json({ error: { fieldErrors: { email: 'Invalid email format' } } }, { status: 400 });
  }
  if (typeof data.password !== 'string' || data.password.length < 8 || !/[0-9]/.test(data.password) || !/[a-zA-Z]/.test(data.password)) {
    console.error('[REGISTER] Weak password');
    return NextResponse.json({ error: { fieldErrors: { password: 'Password must be at least 8 characters and include a number and a letter' } } }, { status: 400 });
  }

  // Check for unique email
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    console.warn('[REGISTER] Email already exists:', data.email);
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
    console.log('[REGISTER] User created:', user.email, user._id);
    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('[REGISTER] Error creating user:', err);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
} 