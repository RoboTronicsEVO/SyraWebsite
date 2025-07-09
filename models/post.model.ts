import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  authorId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  reactionCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: String,
    videoUrl: String,
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
    reactionCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PostSchema.index({ communityId: 1, createdAt: -1 });

export default (mongoose.models.Post as Model<IPost>) || mongoose.model<IPost>('Post', PostSchema);