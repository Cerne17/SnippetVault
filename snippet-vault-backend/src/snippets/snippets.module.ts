import { Module } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { SnippetsController } from './snippets.controller';
import { Snippet, SnippetSchema } from './schemas/snippet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Snippet.name, schema: SnippetSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule { }
