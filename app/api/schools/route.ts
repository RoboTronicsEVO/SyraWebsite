import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import School from '@/models/school.model';
import { schoolSchema } from '@/lib/validation';
import slugify from 'slugify';
import User from '@/models/user.model';
import { sendInviteEmail } from '@/lib/email';

export async function GET() {
  await connectToDatabase();
  const schools = await School.find().lean();
  return NextResponse.json({ schools });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const data = await request.json();

  // Validate input
  const parse = schoolSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }

  // Check for unique name and adminEmail
  const existing = await School.findOne({ $or: [ { name: data.name }, { adminEmail: data.adminEmail } ] });
  if (existing) {
    return NextResponse.json({ error: 'School name or admin email already exists.' }, { status: 409 });
  }

  // Create school
  const slug = slugify(data.name, { lower: true, strict: true });
  const school = await School.create({
    ...data,
    slug,
    isVerified: false,
    memberCount: 0,
  });

  // Create school admin user if not exists
  let adminUser = await User.findOne({ email: data.adminEmail });
  if (!adminUser) {
    // Generate a secure random invite token
    const crypto = await import('crypto');
    const inviteToken = crypto.randomBytes(32).toString('hex');
    adminUser = await User.create({
      name: data.adminEmail.split('@')[0],
      email: data.adminEmail,
      password: inviteToken, // Temporary, not usable for login
      role: 'school-admin',
      inviteToken,
      inviteTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h expiry
    });
    await sendInviteEmail(adminUser.email, inviteToken);
  }

  return NextResponse.json({ school });} 