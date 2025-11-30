import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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

  @IsString()
  @IsNotEmpty()
  userId: string;
}
