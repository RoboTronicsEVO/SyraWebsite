import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReaction extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetModel: 'Post' | 'Comment';
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetModel: { type: String, enum: ['Post', 'Comment'], required: true },
    type: { type: String, default: 'like' },
  },
  { timestamps: true },
);

ReactionSchema.index({ userId: 1, targetId: 1, targetModel: 1 }, { unique: true });

export default (mongoose.models.Reaction as Model<IReaction>) || mongoose.model<IReaction>('Reaction', ReactionSchema);