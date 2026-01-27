export interface Snippet {
  _id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string | { _id: string; name: string; insightPoints?: number };
  isMarkdown?: boolean;
  isPublic?: boolean;
  insightScore: number;
  amplifiers?: string[];
  diminishers?: string[];
  commentCount?: number;
}

export interface SnippetComment {
  _id: string;
  content: string;
  author: { _id: string; name: string; insightPoints: number };
  snippet: string;
  insightScore: number;
  amplifiers?: string[];
  diminishers?: string[];
  createdAt: string;
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
