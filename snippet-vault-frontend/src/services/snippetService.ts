import { api } from './api';
import type { Snippet, CreateSnippetDto, UpdateSnippetDto, FilterSnippetDto } from '../types/snippet';

export const snippetService = {
  getAll: async (filters?: FilterSnippetDto): Promise<Snippet[]> => {
    const params = new URLSearchParams();
    if (filters?.language) params.append('language', filters.language);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get<Snippet[]>('/snippets', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Snippet> => {
    const response = await api.get<Snippet>(`/snippets/${id}`);
    return response.data;
  },

  create: async (data: CreateSnippetDto): Promise<Snippet> => {
    const response = await api.post<Snippet>('/snippets', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSnippetDto): Promise<Snippet> => {
    const response = await api.patch<Snippet>(`/snippets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/snippets/${id}`);
  }
};
