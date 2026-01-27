import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SnippetDocument = HydratedDocument<Snippet>;

@Schema({ timestamps: true })
export class Snippet {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    language: string;

    @Prop([String])
    tags: string[];

    @Prop({ type: Date, default: null })
    createdAt: Date | null;

    @Prop({ type: Date, default: null })
    updatedAt: Date | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: User;

    @Prop({ type: Boolean, default: false, index: true })
    isPublic: boolean;

    @Prop({ type: Date, default: null, index: true })
    deletedAt: Date | null;

    @Prop({ type: Number, default: 0, index: true })
    insightScore: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    amplifiers: mongoose.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    diminishers: mongoose.Types.ObjectId[];
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

// Compound index for common filter patterns
SnippetSchema.index({ deletedAt: 1, isPublic: 1 });
SnippetSchema.index({ deletedAt: 1, userId: 1 });

// Text index for search optimization
SnippetSchema.index({ title: 'text', description: 'text' });
