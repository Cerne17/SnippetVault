import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import CodeBlock from '../components/CodeBlock';
import { Button } from '../components/ui/Button';
import { Loader2, Calendar, Tag, Trash2, ArrowLeft } from 'lucide-react';

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: snippet, isLoading, error } = useQuery({
    queryKey: ['snippet', id],
    queryFn: () => snippetService.getOne(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => snippetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      navigate('/');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading snippet</h2>
        <p className="text-slate-600">The snippet could not be found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Snippets
      </Button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{snippet.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 uppercase tracking-wider text-xs">
                  {snippet.language}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => {
                if (confirm('Are you sure you want to delete this snippet?')) {
                  deleteMutation.mutate(snippet._id);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </div>

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 text-sm text-slate-600 border border-slate-100">
                  <Tag className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50">
          <CodeBlock code={snippet.code} language={snippet.language} />
        </div>
      </div>
    </div>
  );
}
