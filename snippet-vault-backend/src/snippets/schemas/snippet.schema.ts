import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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

    @Prop({ required: true })
    userId: string;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);
