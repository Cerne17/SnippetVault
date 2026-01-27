export interface Snippet {
  _id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string | { _id: string; name: string };
  isMarkdown?: boolean;
  isPublic?: boolean;
}

export interface CreateSnippetDto {
  title: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  isMarkdown?: boolean;
  isPublic?: boolean;
}

export interface UpdateSnippetDto extends Partial<CreateSnippetDto> { }

export interface FilterSnippetDto {
  language?: string;
  tag?: string;
  search?: string;
  scope?: string;
}
