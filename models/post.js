/*
    This file represents the Mongoose schema for the 'Post' model.
    It defines the structure for posts created within communities.

    Example (models/post.model.ts):

    import mongoose, { Document, Schema } from 'mongoose';

    export interface IPost extends Document {
        title: string;
        content: string;
        imageUrl?: string;
        videoUrl?: string;
        authorId: mongoose.Types.ObjectId;
        communityId: mongoose.Types.ObjectId;
        reactionCount: number;
        commentCount: number;
    }

    const PostSchema: Schema = new Schema({
        title: { type: String, required: true },
        content: { type: String, required: true },
        imageUrl: { type: String }, // Optional URL to an image on S3
        videoUrl: { type: String }, // Optional URL to a video on S3
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
        reactionCount: { type: Number, default: 0 },
        commentCount: { type: Number, default: 0 },
    }, { timestamps: true });

    PostSchema.index({ communityId: 1, createdAt: -1 });

    export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
*/
