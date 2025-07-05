import Stripe from 'stripe';
import { buffer } from 'micro';
import { memberships } from '../../../lib/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { userId, communityId } = session.metadata;

            if (!userId || !communityId) {
                console.error('Webhook Error: Missing userId or communityId in metadata');
                return res.status(400).send('Webhook Error: Missing required metadata.');
            }
            
            const existingMembership = memberships.find(m => m.userId === userId && m.communityId === communityId);

            if (!existingMembership) {
                 const newMembership = {
                    id: `mem_${Date.now()}`,
                    userId: userId,
                    communityId: communityId,
                    role: 'member',
                    status: 'active',
                    stripeSubscriptionId: session.subscription,
                    stripeCustomerId: session.customer,
                    joinedAt: new Date().toISOString()
                };
                memberships.push(newMembership);
            } else {
                existingMembership.status = 'active';
                existingMembership.stripeSubscriptionId = session.subscription;
                existingMembership.stripeCustomerId = session.customer;
            }
            break;
        
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
};

export default handler;
