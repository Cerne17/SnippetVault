import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { snippetService } from '../services/snippetService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Loader2 } from 'lucide-react';
import type { CreateSnippetDto } from '../types/snippet';

export default function CreateSnippet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSnippetDto>();

  const createMutation = useMutation({
    mutationFn: (data: CreateSnippetDto) => snippetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      navigate('/');
    },
  });

  const onSubmit = (data: CreateSnippetDto) => {
    // Split tags string into array if needed, but for now let's assume simple input
    // Actually, let's make tags a comma-separated string in the UI and convert it here
    // But the DTO expects string[], so we need to handle that.
    // For simplicity in this step, we'll just handle title, code, language.
    // We can add tags handling if we have time, or just pass empty array.
    
    // Let's handle tags as comma separated string from a text input
    // We need to cast data to any to handle the transform before sending
    const payload = {
      ...data,
      tags: (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    };
    
    createMutation.mutate(payload as unknown as CreateSnippetDto);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Snippet</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <Input
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., React UseEffect Hook"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Language
          </label>
          <select
            {...register('language', { required: 'Language is required' })}
            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Code
          </label>
          <Textarea
            {...register('code', { required: 'Code is required' })}
            placeholder="Paste your code here..."
            className="font-mono h-64"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tags (comma separated)
          </label>
          <Input
            {...register('tags')}
            placeholder="react, hooks, frontend"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Snippet
          </Button>
        </div>
      </form>
    </div>
  );
}
