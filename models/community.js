/*
    This file represents the Mongoose schema for the 'Community' model.
    In a real Next.js/Node.js application, this would be a TypeScript file
    that uses the Mongoose library to define the data structure and validation rules.

    Example (models/community.model.ts):

    import mongoose, { Document, Schema } from 'mongoose';

    export interface ICommunity extends Document {
        name: string;
        slug: string;
        description?: string;
        coverImage?: string;
        category: 'Hobbies' | 'Music' | 'Money' | 'Spirituality' | 'Tech' | 'Health' | 'Sports' | 'Self-improvement' | 'Relationships';
        ownerId: mongoose.Types.ObjectId;
        memberCount: number;
        isPrivate: boolean;
        pricing: {
            type: 'free' | 'paid';
            amount?: number;
            currency?: string;
            stripePriceId?: string;
        };
    }

    const CommunitySchema: Schema = new Schema({
        name: { type: String, required: true },
        slug: { type: String, unique: true, required: true },
        description: { type: String },
        coverImage: { type: String }, // URL to cover image on S3
        category: {
            type: String,
            enum: ['Hobbies', 'Music', 'Money', 'Spirituality', 'Tech', 'Health', 'Sports', 'Self-improvement', 'Relationships'],
            required: true
        },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        memberCount: { type: Number, default: 1 },
        isPrivate: { type: Boolean, default: false },
        pricing: {
            type: { type: String, enum: ['free', 'paid'], required: true },
            amount: { type: Number }, // In cents
            currency: { type: String, default: 'usd' },
            stripePriceId: { type: String }
        }
    }, { timestamps: true });

    export default mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);
*/
