import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getSessionUser } from '@/lib/session';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/comment.model';
import Post from '@/models/post.model';
import mongoose from 'mongoose';
import { getRedisClient } from '@/lib/redis';

const RATE_LIMIT = 10;
const WINDOW_SEC = 60;

async function isRateLimited(ip: string) {
  const redis = getRedisClient();
  const key = `comments:rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SEC);
  }
  return count > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many comments. Please try again later." }, { status: 429 });
  }
  const session = await getServerSession(authOptions);
  const user = getSessionUser(session);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const { content, postId, parentId } = await request.json();
  const authorId = user.id;

  if (!content || !postId) {
    return NextResponse.json({ message: 'Content and postId are required.' }, { status: 400 });
  }

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();
  try {
    const newComment = new Comment({ content, postId, authorId, parentId: parentId || null });
    const savedComment = await newComment.save({ session: dbSession });

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } }, { session: dbSession });

    await dbSession.commitTransaction();
    return NextResponse.json({ message: 'Comment created', data: savedComment }, { status: 201 });
  } catch (error) {
    await dbSession.abortTransaction();
    console.error('Comment creation failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    dbSession.endSession();
  }}