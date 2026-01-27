import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { useAuth } from '../context/AuthContext';
import CodeBlock from '../components/CodeBlock';
import { Button } from '../components/ui/Button';
import { Loader2, Calendar, Tag, Trash2, ArrowLeft, Pencil, TrendingUp, TrendingDown } from 'lucide-react';
import InsightBadge from '../components/InsightBadge';
import CommentSection from '../components/CommentSection';

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

  const amplifyMutation = useMutation({
    mutationFn: () => snippetService.amplify(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippet', id] });
    },
  });

  const diminishMutation = useMutation({
    mutationFn: () => snippetService.diminish(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippet', id] });
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

  const isOwner = user?._id === (typeof snippet.userId === 'object' ? snippet.userId._id : snippet.userId);

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
                {snippet.isPublic && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 font-medium text-emerald-600 uppercase tracking-wider text-xs">
                    Public
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 uppercase tracking-wider text-xs">
                  {snippet.language}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">by {typeof snippet.userId === 'object' ? snippet.userId.name : 'Unknown'}</span>
                  {typeof snippet.userId === 'object' && (
                    <InsightBadge points={snippet.userId.insightPoints} />
                  )}
                </div>
              </div>
              {snippet.description && (
                <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl">
                  {snippet.description}
                </p>
              )}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/snippets/${snippet._id}/edit`)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => amplifyMutation.mutate()}
                  disabled={!user || amplifyMutation.isPending}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${user && snippet.amplifiers?.includes(user._id)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600'
                    } disabled:opacity-50`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Amplify
                </button>
                <div className="px-3 font-bold text-slate-600">
                  {snippet.insightScore}
                </div>
                <button
                  onClick={() => diminishMutation.mutate()}
                  disabled={!user || diminishMutation.isPending}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${user && snippet.diminishers?.includes(user._id)
                    ? 'bg-slate-400 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    } disabled:opacity-50`}
                >
                  <TrendingDown className="w-4 h-4" />
                  Diminish
                </button>
              </div>
              {!user && (
                <span className="text-xs text-slate-400 italic">
                  Sign in to amplify this knowledge.
                </span>
              )}
            </div>

            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 text-xs text-slate-600 border border-slate-100">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50">
          <CodeBlock code={snippet.code} language={snippet.language} isMarkdown={snippet.isMarkdown} />
        </div>
      </div>

      <CommentSection snippetId={snippet._id} />
    </div>
  );
}
