import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  role: 'member' | 'admin' | 'moderator' | 'owner';
  status: 'active' | 'pending' | 'cancelled';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  joinedAt: Date;
}

const MembershipSchema = new Schema<IMembership>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
  role: { type: String, enum: ['member', 'admin', 'moderator', 'owner'], default: 'member' },
  status: { type: String, enum: ['active', 'pending', 'cancelled'], default: 'active' },
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  joinedAt: { type: Date, default: Date.now },
});

MembershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });

export default (mongoose.models.Membership as Model<IMembership>) || mongoose.model<IMembership>('Membership', MembershipSchema);