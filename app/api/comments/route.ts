import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/comment.model';
import Post from '@/models/post.model';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions as any) as any;
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const { content, postId, parentId } = await request.json();
  const authorId = session.user?.id;

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
  }
}