/*
    This file represents the Mongoose schema for the 'Reaction' model.
    It stores user reactions (e.g., likes) to posts and comments polymorphically.

    Example (models/reaction.model.ts):

    import mongoose, { Document, Schema } from 'mongoose';

    export interface IReaction extends Document {
        userId: mongoose.Types.ObjectId;
        targetId: mongoose.Types.ObjectId;
        targetModel: 'Post' | 'Comment';
        type: string;
    }

    const ReactionSchema: Schema = new Schema({
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        targetId: { type: Schema.Types.ObjectId, required: true },
        targetModel: {
            type: String,
            required: true,
            enum: ['Post', 'Comment']
        },
        type: { type: String, default: 'like' }
    }, { timestamps: true });

    ReactionSchema.index({ userId: 1, targetId: 1, targetModel: 1 }, { unique: true });

    export default mongoose.models.Reaction || mongoose.model<IReaction>('Reaction', ReactionSchema);
*/
