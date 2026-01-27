import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Snippet } from '../../snippets/schemas/snippet.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', required: true, index: true })
    snippet: Snippet;

    @Prop({ type: Number, default: 0, index: true })
    insightScore: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    amplifiers: mongoose.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    diminishers: mongoose.Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Compound index for efficient comment feed fetching
CommentSchema.index({ snippet: 1, createdAt: -1 });
