/*
    This file represents the Mongoose schema for the 'Comment' model.
    It stores comments on posts and supports nested replies via a 'parentId'.

    Example (models/comment.model.ts):

    import mongoose, { Document, Schema } from 'mongoose';

    export interface IComment extends Document {
        content: string;
        authorId: mongoose.Types.ObjectId;
        postId: mongoose.Types.ObjectId;
        parentId?: mongoose.Types.ObjectId;
        reactionCount: number;
    }

    const CommentSchema: Schema = new Schema({
        content: { type: String, required: true },
        authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
        reactionCount: { type: Number, default: 0 },
    }, { timestamps: true });

    export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
*/
