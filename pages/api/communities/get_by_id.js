import { connectToDatabase } from '@/lib/mongodb';
import Community from '@/models/community.model';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    await connectToDatabase();

    const { id } = req.query;

    try {
        const community = await Community.findById(id);

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        return res.status(200).json({ data: community });

    } catch (error) {
        console.error('API Error fetching community:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
