import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getSessionUser } from '@/lib/session';
import AuditLog from '@/models/auditlog.model';

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = getSessionUser(session);
  if (!user?.role || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectToDatabase();
  const users = await User.find({}, 'name email role verified').lean();
  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = getSessionUser(session);
  if (!sessionUser?.role || sessionUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { userId, action, value } = await req.json();
  if (!userId || !action) {
    return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
  }
  await connectToDatabase();
  let update: any = {};
  if (action === 'verify') update.verified = true;
  if (action === 'deactivate') update.isActive = false;
  if (action === 'activate') update.isActive = true;
  if (action === 'changeRole') update.role = value;
  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  // Log the admin action
  await AuditLog.create({
    adminId: sessionUser?.id,
    adminEmail: sessionUser?.email,
    action,
    targetUserId: user._id,
    targetUserEmail: user.email,
    details: action === 'changeRole' ? `New role: ${value}` : undefined,
  });
  return NextResponse.json({ user });} 