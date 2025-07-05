export const users = [
    {
        id: '1',
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        image: 'https://i.pravatar.cc/150?u=user@example.com'
    }
];

export const communities = [
    {
        id: 'comm1',
        name: 'Next.js Developers',
        slug: 'nextjs-developers',
        description: 'A community for developers passionate about Next.js and Vercel.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
        category: 'Tech',
        ownerId: '1',
        memberCount: 1,
        isPrivate: false,
        pricing: {
            type: 'free',
            amount: 0,
            currency: 'usd',
            stripePriceId: null
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const memberships = [
    {
        id: 'mem1',
        userId: '1',
        communityId: 'comm1',
        role: 'owner',
        status: 'active',
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        joinedAt: new Date().toISOString()
    }
];

export const posts = [
    {
        id: 'post1',
        title: 'First Post in Next.js Devs!',
        content: 'Just setting up the content system. What do you think?',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-1428bc38aa5a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
        videoUrl: null,
        authorId: '1',
        communityId: 'comm1',
        reactionCount: 1,
        commentCount: 1,
        createdAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString()
    }
];

export const comments = [
    {
        id: 'comment1',
        content: 'Looks great! The nesting will be useful.',
        authorId: '1',
        postId: 'post1',
        parentId: null,
        reactionCount: 0,
        createdAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString()
    }
];

export const reactions = [
    {
        id: 'reaction1',
        userId: '1',
        targetId: 'post1',
        targetModel: 'Post',
        type: 'like',
        createdAt: new Date().toISOString()
    }
];
