/*
    This file represents the Mongoose schema for the 'Membership' model.
    This model acts as a joining table between Users and Communities,
    defining the role and status of each member within a community.

    Example (models/membership.model.ts):

    import mongoose, { Document, Schema } from 'mongoose';

    export interface IMembership extends Document {
        userId: mongoose.Types.ObjectId;
        communityId: mongoose.Types.ObjectId;
        role: 'member' | 'admin' | 'moderator' | 'owner';
        status: 'active' | 'pending' | 'cancelled';
        stripeSubscriptionId?: string;
        stripeCustomerId?: string;
        joinedAt: Date;
    }

    const MembershipSchema: Schema = new Schema({
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
        role: {
            type: String,
            enum: ['member', 'admin', 'moderator', 'owner'],
            default: 'member'
        },
        status: {
            type: String,
            enum: ['active', 'pending', 'cancelled'],
            default: 'active'
        },
        stripeSubscriptionId: { type: String },
        stripeCustomerId: { type: String },
        joinedAt: { type: Date, default: Date.now }
    });


    MembershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });

    export default mongoose.models.Membership || mongoose.model<IMembership>('Membership', MembershipSchema);
*/
