import { Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Snippet } from './schemas/snippet.schema';
import type { Model } from 'mongoose';
import type { FilterSnippetDto } from './dto/filter-snippet.dto';

@Injectable()
export class SnippetsService {

  constructor(@InjectModel(Snippet.name) private snippetModel: Model<Snippet>) {}

  async create(createSnippetDto: CreateSnippetDto, userId: string): Promise<Snippet> {
    const newSnippet = new this.snippetModel({
      ...createSnippetDto,
      userId,
    });

    return newSnippet.save();
  }

  findAll(filterDto: FilterSnippetDto): Promise<Snippet[]> {
    const { language, tag } = filterDto;
    const query: any = { deletedAt: null };

    if (language) {
      query.language = { $regex: language, $options: 'i' };
    }

    if (tag) {
      query.tags = tag;
    }

    return this.snippetModel.find(query).exec();
  }

  findOne(id: string): Promise<Snippet> {
    return this.snippetModel.findOne({ _id: id, deletedAt: null }).exec();
  }

  update(id: string, updateSnippetDto: UpdateSnippetDto): Promise<Snippet> {
    return this.snippetModel
      .findByIdAndUpdate(id, updateSnippetDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<Snippet> {
    return this.snippetModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();
  }
}
