import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from "class-validator";

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isMarkdown?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
