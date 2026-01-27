import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { snippetService } from '../services/snippetService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import CodeEditor from '../components/CodeEditor';
import { Loader2 } from 'lucide-react';
import type { CreateSnippetDto } from '../types/snippet';

export default function EditSnippet() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: snippet, isLoading: isLoadingSnippet } = useQuery({
        queryKey: ['snippet', id],
        queryFn: () => snippetService.getOne(id!),
        enabled: !!id,
    });

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<CreateSnippetDto>();

    useEffect(() => {
        if (snippet) {
            reset({
                title: snippet.title,
                description: snippet.description,
                language: snippet.language,
                code: snippet.code,
                isMarkdown: snippet.isMarkdown,
                isPublic: snippet.isPublic,
                tags: snippet.tags as any, // We'll handle the array-to-string transform soon
            });
            // Handle tags display: convert array to comma-separated string
            if (Array.isArray(snippet.tags)) {
                setValue('tags', snippet.tags.join(', ') as any);
            }
        }
    }, [snippet, reset, setValue]);

    const title = watch('title');

    useEffect(() => {
        if (title?.toLowerCase().endsWith('.md')) {
            setValue('isMarkdown', true);
        }
    }, [title, setValue]);

    const updateMutation = useMutation({
        mutationFn: (data: CreateSnippetDto) => snippetService.update(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['snippet', id] });
            queryClient.invalidateQueries({ queryKey: ['snippets'] });
            navigate(`/snippets/${id}`);
        },
    });

    const onSubmit = (data: CreateSnippetDto) => {
        const payload = {
            ...data,
            tags: (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
        };

        updateMutation.mutate(payload as unknown as CreateSnippetDto);
    };

    if (isLoadingSnippet) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Snippet</h1>

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
                        Description
                    </label>
                    <textarea
                        {...register('description')}
                        placeholder="A brief description of this snippet..."
                        className="flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
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
                        <option value="markdown">Markdown</option>
                    </select>
                    {errors.language && (
                        <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isMarkdown"
                            {...register('isMarkdown')}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="isMarkdown" className="text-sm font-medium text-slate-700">
                            Render as Markdown
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            {...register('isPublic')}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="isPublic" className="text-sm font-medium text-slate-700">
                            Make Public
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Code
                    </label>
                    <CodeEditor
                        value={watch('code') || ''}
                        onValueChange={(code) => setValue('code', code)}
                        language={watch('language') || 'javascript'}
                        placeholder="Paste your code here..."
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
                        onClick={() => navigate(`/snippets/${id}`)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
