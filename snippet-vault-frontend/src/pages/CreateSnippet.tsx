import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '../services/snippetService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import CodeEditor from '../components/CodeEditor';
import { Loader2 } from 'lucide-react';
import type { CreateSnippetDto } from '../types/snippet';

export default function CreateSnippet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateSnippetDto>();

  const title = watch('title');

  useEffect(() => {
    if (title?.toLowerCase().endsWith('.md')) {
      setValue('isMarkdown', true);
    }
  }, [title, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: CreateSnippetDto) => snippetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      navigate('/');
    },
  });

  const onSubmit = (data: CreateSnippetDto) => {
    const payload = {
      ...data,
      tags: (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    };

    createMutation.mutate(payload as unknown as CreateSnippetDto);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">Create New Snippet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
            Title
          </label>
          <Input
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., React UseEffect Hook"
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
            Description
          </label>
          <textarea
            {...register('description')}
            placeholder="A brief description of this snippet..."
            className="flex min-h-[100px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
            Language
          </label>
          <select
            {...register('language', { required: 'Language is required' })}
            className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white appearance-none"
          >
            <option value="">Select a language</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
            <option value="markdown">Markdown</option>
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isMarkdown"
              {...register('isMarkdown')}
              className="w-5 h-5 text-primary border-slate-300 dark:border-slate-700 rounded focus:ring-primary bg-white dark:bg-slate-800"
            />
            <label htmlFor="isMarkdown" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              Render as Markdown
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              {...register('isPublic')}
              className="w-5 h-5 text-primary border-slate-300 dark:border-slate-700 rounded focus:ring-primary bg-white dark:bg-slate-800"
            />
            <label htmlFor="isPublic" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              Make Public
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
            Code
          </label>
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <CodeEditor
              value={watch('code') || ''}
              onValueChange={(code) => setValue('code', code)}
              language={watch('language') || 'javascript'}
              placeholder="Paste your code here..."
            />
          </div>
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
            Tags (comma separated)
          </label>
          <Input
            {...register('tags')}
            placeholder="react, hooks, frontend"
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            size="lg"
            className="px-8"
          >
            {createMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Snippet
          </Button>
        </div>
      </form >
    </div >
  );
}
