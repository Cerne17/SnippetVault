import { Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Snippet } from './schemas/snippet.schema';
import type { Model } from 'mongoose';
import type { FilterSnippetDto } from './dto/filter-snippet.dto';

@Injectable()
export class SnippetsService {

  constructor(@InjectModel(Snippet.name) private snippetModel: Model<Snippet>) { }

  async create(createSnippetDto: CreateSnippetDto, userId: string): Promise<Snippet> {
    const newSnippet = new this.snippetModel({
      ...createSnippetDto,
      userId,
    });

    return newSnippet.save();
  }

  findAll(filterDto: FilterSnippetDto, userId: string): Promise<Snippet[]> {
    const { language, tag } = filterDto;
    const query: any = { deletedAt: null, userId };

    if (language) {
      query.language = { $regex: language, $options: 'i' };
    }

    if (tag) {
      query.tags = tag;
    }

    if (filterDto.search) {
      query.$or = [
        { title: { $regex: filterDto.search, $options: 'i' } },
        { code: { $regex: filterDto.search, $options: 'i' } },
      ];
    }

    return this.snippetModel.find(query).populate('userId', 'name').exec();
  }

  findOne(id: string, userId: string): Promise<Snippet> {
    return this.snippetModel.findOne({ _id: id, userId, deletedAt: null }).populate('userId', 'name').exec();
  }

  update(id: string, updateSnippetDto: UpdateSnippetDto, userId: string): Promise<Snippet> {
    return this.snippetModel
      .findOneAndUpdate({ _id: id, userId }, updateSnippetDto, { new: true })
      .exec();
  }

  remove(id: string, userId: string): Promise<Snippet> {
    return this.snippetModel
      .findOneAndUpdate({ _id: id, userId }, { deletedAt: new Date() }, { new: true })
      .exec();
  }
}
