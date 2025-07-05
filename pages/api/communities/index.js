import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/community.model';
import Membership from '@/models/membership.model';
import mongoose from 'mongoose';

export default async function handler(req, res) {
    await connectToDatabase();
    const session = await getSession({ req });

    if (req.method === 'GET') {
        try {
            const communities = await Community.find({ isPrivate: false })
                .sort({ memberCount: -1 })
                .limit(20);

            return res.status(200).json({ data: communities });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (req.method === 'POST') {
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, description, category, isPrivate, pricing } = req.body;
        const ownerId = session.user.id;

        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required.' });
        }

        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            const newCommunity = new Community({
                name,
                slug: name.toLowerCase().replace(new RegExp('\\\\s+', 'g'), '-').replace(new RegExp('[^\\\\w-]+', 'g'), ''),
                description,
                category,
                isPrivate,
                pricing,
                ownerId,
                memberCount: 1,
            });

            const savedCommunity = await newCommunity.save({ session: dbSession });

            const newMembership = new Membership({
                userId: ownerId,
                communityId: savedCommunity._id,
                role: 'owner',
                status: 'active',
            });

            await newMembership.save({ session: dbSession });

            await dbSession.commitTransaction();

            return res.status(201).json({ message: 'Community created', data: savedCommunity });

        } catch (error) {
            await dbSession.abortTransaction();
            console.error('Community creation failed:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            dbSession.endSession();
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
