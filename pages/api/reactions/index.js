import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/lib/mongodb';
import Reaction from '@/models/reaction.model';
import Post from '@/models/post.model';
import Comment from '@/models/comment.model';
import mongoose from 'mongoose';

const TargetModels = {
    Post,
    Comment,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();

    const { targetId, targetModel, type = 'like' } = req.body;
    const userId = session.user.id;

    if (!targetId || !targetModel || !['Post', 'Comment'].includes(targetModel)) {
        return res.status(400).json({ message: 'Valid targetId and targetModel are required.' });
    }

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        const existingReaction = await Reaction.findOne({ userId, targetId, targetModel });
        const Model = TargetModels[targetModel];

        if (existingReaction) {
            await existingReaction.deleteOne({ session: dbSession });
            await Model.findByIdAndUpdate(targetId, { $inc: { reactionCount: -1 } }, { session: dbSession });
            
            await dbSession.commitTransaction();
            return res.status(200).json({ message: 'Reaction removed' });

        } else {
            const newReaction = new Reaction({
                userId,
                targetId,
                targetModel,
                type,
            });
            await newReaction.save({ session: dbSession });

            await Model.findByIdAndUpdate(targetId, { $inc: { reactionCount: 1 } }, { session: dbSession });

            await dbSession.commitTransaction();
            return res.status(201).json({ message: 'Reaction added', data: newReaction });
        }
    } catch (error) {
        await dbSession.abortTransaction();
        console.error('Reaction toggle failed:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        dbSession.endSession();
    }
}
