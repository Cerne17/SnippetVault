export interface Snippet {
  _id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateSnippetDto {
  title: string;
  code: string;
  language: string;
  tags?: string[];
}

export interface UpdateSnippetDto extends Partial<CreateSnippetDto> {}

export interface FilterSnippetDto {
  language?: string;
  tag?: string;
  search?: string;
}
