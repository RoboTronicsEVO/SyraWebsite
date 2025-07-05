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
        const membership = await Membership.findOne({ userId, communityId });
        if (!membership) {
            return res.status(404).json({ message: 'User is not a member of this community.' });
        }

        if (membership.role === 'owner') {
            return res.status(403).json({ message: 'Community owner cannot leave. Please transfer ownership or delete the community.' });
        }
        
        await Membership.findByIdAndDelete(membership._id);

        await Community.findByIdAndUpdate(communityId, { $inc: { memberCount: -1 } });

        return res.status(200).json({ message: 'Successfully left community.' });

    } catch (error) {
        console.error('API Error leaving community:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
