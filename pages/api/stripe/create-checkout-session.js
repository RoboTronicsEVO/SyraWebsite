import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
});

const getMockUserSession = async () => {
    return {
        user: {
            id: '1'
        }
    };
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { priceId, communityId } = req.body;
        const session = await getMockUserSession();

        if (!session || !session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = session.user.id;

        if (!priceId || !communityId) {
            return res.status(400).json({ error: 'Price ID and Community ID are required.' });
        }

        const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/communities/${communityId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/communities/${communityId}`;

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId,
                communityId,
            },
        });

        res.status(200).json({ sessionId: checkoutSession.id });

    } catch (error) {
        console.error('Stripe Checkout Session Creation Error:', error);
        res.status(500).json({ error: `Stripe Error: ${error.message}` });
    }
}
