import { IsOptional, IsString } from "class-validator";

export class FilterSnippetDto {
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}