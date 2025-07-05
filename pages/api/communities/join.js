import { getSession } from 'next-auth/react';
import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/community.model';
import Membership from '@/models/membership.model';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();

    const { id: communityId } = req.query;
    const userId = session.user.id;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        if (community.isPrivate) {
            return res.status(403).json({ message: 'This is a private community.' });
        }
        
        const existingMembership = await Membership.findOne({ userId, communityId });
        if (existingMembership) {
            return res.status(409).json({ message: 'User is already a member of this community.' });
        }

        const newMembership = new Membership({
            userId,
            communityId,
            role: 'member',
            status: 'active',
        });
        await newMembership.save();

        await Community.findByIdAndUpdate(communityId, { $inc: { memberCount: 1 } });

        return res.status(200).json({ message: 'Successfully joined community.' });

    } catch (error) {
        console.error('API Error joining community:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
