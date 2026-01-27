import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
        return this.commentsService.create(createCommentDto, req.user.userId);
    }

    @Get()
    findAllBySnippet(@Query('snippetId') snippetId: string) {
        return this.commentsService.findAllBySnippet(snippetId);
    }
}
