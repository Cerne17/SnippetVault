import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { useAuth } from '../context/AuthContext';
import CodeBlock from '../components/CodeBlock';
import { Button } from '../components/ui/Button';
import { Loader2, Calendar, Tag, Trash2, ArrowLeft, Pencil, TrendingUp, TrendingDown, Download, FileJson, User, ChevronRight } from 'lucide-react';
import InsightBadge from '../components/InsightBadge';
import CommentSection from '../components/CommentSection';
import { exportSnippetAsJson, exportSnippetAsSource } from '../utils/fileUtils';

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

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
      refreshUser();
    },
  });

  const diminishMutation = useMutation({
    mutationFn: () => snippetService.diminish(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippet', id] });
      refreshUser();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading snippet</h2>
        <p className="text-slate-600 dark:text-slate-400">The snippet could not be found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  const author = typeof snippet.userId === 'object' ? snippet.userId : { name: 'Unknown', insightPoints: 0, _id: '' };
  const isOwner = user?._id === author._id;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Detail Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {snippet.title}
                </h1>
              </div>

              {snippet.description && (
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
                  {snippet.description}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button variant="ghost" size="sm" onClick={() => exportSnippetAsSource(snippet)} title="Download Source" className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2 sm:mr-0" />
                  <span className="sm:hidden">Download Source</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => exportSnippetAsJson(snippet)} title="Download JSON" className="flex-1 sm:flex-none">
                  <FileJson className="w-4 h-4 mr-2 sm:mr-0" />
                  <span className="sm:hidden">Download JSON</span>
                </Button>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => navigate(`/snippets/${snippet._id}/edit`)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-red-600 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300"
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
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-medium text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                {author.name}
                <InsightBadge points={author.insightPoints} />
              </div>
              <div className="flex items-center gap-1.5 font-medium italic">
                <Calendar className="w-4 h-4" />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                {snippet.language}
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start md:self-auto">
              <button
                onClick={() => amplifyMutation.mutate()}
                disabled={!user || amplifyMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${user && snippet.amplifiers?.includes(user._id)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-primary'
                  } disabled:opacity-50`}
              >
                <TrendingUp className="w-4 h-4" />
                Amplify
              </button>
              <div className="px-4 font-black text-slate-700 dark:text-slate-300 text-lg">
                {snippet.insightScore}
              </div>
              <button
                onClick={() => diminishMutation.mutate()}
                disabled={!user || diminishMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${user && snippet.diminishers?.includes(user._id)
                    ? 'bg-slate-400 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  } disabled:opacity-50`}
              >
                <TrendingDown className="w-4 h-4" />
                Diminish
              </button>
            </div>
          </div>

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wide border border-slate-200 dark:border-slate-700">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-0 border-t border-slate-100 dark:border-slate-800">
          <CodeBlock code={snippet.code} language={snippet.language} isMarkdown={snippet.isMarkdown} />
        </div>
      </div>

      <CommentSection snippetId={snippet._id} />
    </div>
  );
}
