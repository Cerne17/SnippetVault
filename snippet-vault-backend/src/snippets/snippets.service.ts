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

  findAll(filterDto: FilterSnippetDto, userId?: string): Promise<Snippet[]> {
    const { language, tag, search, scope } = filterDto;

    const conditions: any[] = [{ deletedAt: null }];

    if (scope === 'mine' && userId) {
      conditions.push({ userId });
    } else if (scope === 'public') {
      conditions.push({ isPublic: true });
    } else {
      if (userId) {
        conditions.push({ $or: [{ userId }, { isPublic: true }] });
      } else {
        conditions.push({ isPublic: true });
      }
    }

    if (language) {
      conditions.push({ language: { $regex: language, $options: 'i' } });
    }

    if (tag) {
      conditions.push({ tags: tag });
    }

    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ],
      });
    }

    return this.snippetModel.find({ $and: conditions }).populate('userId', 'name').exec();
  }

  findOne(id: string, userId?: string): Promise<Snippet> {
    const conditions: any[] = [{ _id: id, deletedAt: null }];

    if (userId) {
      conditions.push({ $or: [{ userId }, { isPublic: true }] });
    } else {
      conditions.push({ isPublic: true });
    }

    return this.snippetModel.findOne({ $and: conditions }).populate('userId', 'name').exec();
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
