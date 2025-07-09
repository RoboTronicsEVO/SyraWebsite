import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  reactionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    reactionCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default (mongoose.models.Comment as Model<IComment>) ||
  mongoose.model<IComment>('Comment', CommentSchema);