import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICommunityPricing {
  type: 'free' | 'paid';
  amount?: number;
  currency?: string;
  stripePriceId?: string;
}

export interface ICommunity extends Document {
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  category: string;
  ownerId: mongoose.Types.ObjectId;
  memberCount: number;
  isPrivate: boolean;
  pricing: ICommunityPricing;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    coverImage: String,
    category: {
      type: String,
      enum: [
        'Hobbies',
        'Music',
        'Money',
        'Spirituality',
        'Tech',
        'Health',
        'Sports',
        'Self-improvement',
        'Relationships',
      ],
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberCount: { type: Number, default: 1 },
    isPrivate: { type: Boolean, default: false },
    pricing: {
      type: {
        type: String,
        enum: ['free', 'paid'],
        required: true,
      },
      amount: Number,
      currency: { type: String, default: 'usd' },
      stripePriceId: String,
    },
  },
  { timestamps: true },
);

export default (mongoose.models.Community as Model<ICommunity>) || mongoose.model<ICommunity>('Community', CommunitySchema);