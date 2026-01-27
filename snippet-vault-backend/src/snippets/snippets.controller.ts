import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { FilterSnippetDto } from './dto/filter-snippet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto, @Request() req) {
    return this.snippetsService.create(createSnippetDto, req.user.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query() filterDto: FilterSnippetDto, @Request() req) {
    return this.snippetsService.findAll(filterDto, req.user?.userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.snippetsService.findOne(id, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto, @Request() req) {
    return this.snippetsService.update(id, updateSnippetDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.snippetsService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/amplify')
  amplify(@Param('id') id: string, @Request() req) {
    return this.snippetsService.amplify(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/diminish')
  diminish(@Param('id') id: string, @Request() req) {
    return this.snippetsService.diminish(id, req.user.userId);
  }
}
