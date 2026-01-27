import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/schemas/user.schema';
import { Snippet } from '../snippets/schemas/snippet.schema';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Snippet.name) private snippetModel: Model<Snippet>,
    ) { }

    async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
        const newComment = new this.commentModel({
            content: createCommentDto.content,
            snippet: createCommentDto.snippetId,
            author: userId,
        });

        const savedComment = await newComment.save();

        // Increment comment count on the snippet
        await this.snippetModel.findByIdAndUpdate(createCommentDto.snippetId, {
            $inc: { commentCount: 1 },
        });

        // Reward the author with 1 Insight Point for contributing
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { insightPoints: 1 },
        });

        return savedComment.populate('author', 'name insightPoints');
    }

    async findAllBySnippet(snippetId: string): Promise<Comment[]> {
        return this.commentModel
            .find({ snippet: snippetId })
            .populate('author', 'name insightPoints')
            .sort({ createdAt: -1 })
            .lean()
            .exec() as any;
    }
}
