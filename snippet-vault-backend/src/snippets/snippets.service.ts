import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Snippet } from './schemas/snippet.schema';
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose';
import type { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import type { FilterSnippetDto } from './dto/filter-snippet.dto';

@Injectable()
export class SnippetsService {

  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<Snippet>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

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
        $text: { $search: search }
      });
    }

    const query = this.snippetModel.find({ $and: conditions })
      .populate('userId', 'name insightPoints');

    if (scope === 'public') {
      query.sort({ insightScore: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    return query.lean().exec() as unknown as Promise<Snippet[]>;
  }

  findOne(id: string, userId?: string): Promise<Snippet> {
    const conditions: any[] = [{ _id: id, deletedAt: null }];

    if (userId) {
      conditions.push({ $or: [{ userId }, { isPublic: true }] });
    } else {
      conditions.push({ isPublic: true });
    }

    return this.snippetModel.findOne({ $and: conditions })
      .populate('userId', 'name insightPoints')
      .lean()
      .exec() as unknown as Promise<Snippet>;
  }

  async amplify(id: string, userId: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id);
    if (!snippet) throw new NotFoundException('Snippet not found');

    const hasAmplified = snippet.amplifiers.some(uid => uid.toString() === userId);
    const hasDiminished = snippet.diminishers.some(uid => uid.toString() === userId);

    if (hasAmplified) {
      // Remove amplification
      snippet.amplifiers = snippet.amplifiers.filter(uid => uid.toString() !== userId);
      snippet.insightScore -= 1;
      await this.userModel.findByIdAndUpdate(snippet.userId, { $inc: { insightPoints: -1 } });
    } else {
      // Add amplification
      snippet.amplifiers.push(new mongoose.Types.ObjectId(userId) as any);
      snippet.insightScore += 1;
      await this.userModel.findByIdAndUpdate(snippet.userId, { $inc: { insightPoints: 1 } });

      // Remove diminishment if exists
      if (hasDiminished) {
        snippet.diminishers = snippet.diminishers.filter(uid => uid.toString() !== userId);
        snippet.insightScore += 1;
      }
    }

    return snippet.save();
  }

  async diminish(id: string, userId: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id);
    if (!snippet) throw new NotFoundException('Snippet not found');

    const hasAmplified = snippet.amplifiers.some(uid => uid.toString() === userId);
    const hasDiminished = snippet.diminishers.some(uid => uid.toString() === userId);

    if (hasDiminished) {
      // Remove diminishment
      snippet.diminishers = snippet.diminishers.filter(uid => uid.toString() !== userId);
      snippet.insightScore += 1;
    } else {
      // Add diminishment
      snippet.diminishers.push(new mongoose.Types.ObjectId(userId) as any);
      snippet.insightScore -= 1;

      if (hasAmplified) {
        snippet.amplifiers = snippet.amplifiers.filter(uid => uid.toString() !== userId);
        snippet.insightScore -= 1;
        await this.userModel.findByIdAndUpdate(snippet.userId, { $inc: { insightPoints: -1 } });
      }
    }

    return snippet.save();
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
