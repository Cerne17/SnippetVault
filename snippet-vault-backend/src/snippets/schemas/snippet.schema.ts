import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SnippetDocument = HydratedDocument<Snippet>;

@Schema({ timestamps: true })
export class Snippet {
    @Prop({ required: true })
    title: string;

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

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;

    @Prop({ type: Date, default: null })
    favoritedAt: Date | null;

    @Prop({ type: Boolean, default: false })
    isMarkdown: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: User;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);
