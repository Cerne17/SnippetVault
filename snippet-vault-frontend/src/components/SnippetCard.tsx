import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { useAuth } from '../context/AuthContext';
import type { Snippet } from '../types/snippet';
import CodeBlock from './CodeBlock';
import { Calendar, Tag, ChevronRight, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import InsightBadge from './InsightBadge';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  const amplifyMutation = useMutation({
    mutationFn: () => snippetService.amplify(snippet._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['snippet', snippet._id] });
      refreshUser();
    },
  });

  const diminishMutation = useMutation({
    mutationFn: () => snippetService.diminish(snippet._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['snippet', snippet._id] });
      refreshUser();
    },
  });

  const author = typeof snippet.userId === 'object' ? snippet.userId : { name: 'Unknown', _id: '', insightPoints: 0 };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full break-inside-avoid">
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <Link to={`/snippets/${snippet._id}`} className="block group">
            <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors leading-tight mb-3">
              {snippet.title}
            </h3>
          </Link>

          <div className="space-y-3">
            {/* Row 1: Author and Date */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-medium">by</span>
                <span className="font-bold text-slate-700">{author.name}</span>
                {typeof snippet.userId === 'object' && (
                  <InsightBadge points={author.insightPoints} />
                )}
              </div>
              <span className="flex items-center gap-1 font-medium italic">
                <Calendar className="w-3 h-3" />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Row 2: Status Pills, Analytics and Language */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex bg-slate-100 rounded-md p-0.5">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); amplifyMutation.mutate(); }}
                      disabled={!user || amplifyMutation.isPending}
                      className={`p-1 rounded transition-all ${user && snippet.amplifiers?.includes(user._id)
                        ? 'bg-primary text-white'
                        : 'text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-700'
                        }`}
                      title="Amplify Knowledge"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 text-[11px] font-black text-slate-700 flex items-center">
                      {snippet.insightScore}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); diminishMutation.mutate(); }}
                      disabled={!user || diminishMutation.isPending}
                      className={`p-1 rounded transition-all ${user && snippet.diminishers?.includes(user._id)
                        ? 'bg-slate-400 text-white'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                        }`}
                      title="Diminish Knowledge"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 group/comments">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">{snippet.commentCount || 0}</span>
                </div>

                {snippet.isPublic && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 text-[10px] uppercase tracking-wider">
                    Public
                  </span>
                )}
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold border border-slate-200 text-[10px] uppercase tracking-wider">
                {snippet.language}
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-80 overflow-hidden relative group rounded-lg border border-slate-100">
          <CodeBlock code={snippet.code} language={snippet.language} isMarkdown={snippet.isMarkdown} />

          {/* Enhanced Dark Hover Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-center justify-center backdrop-blur-[2px]">
            <Link
              to={`/snippets/${snippet._id}`}
              className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full font-bold text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white"
            >
              Examine Snippet
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Subtle bottom fade for non-hover state */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none group-hover:hidden" />
        </div>

        {snippet.tags && snippet.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-semibold text-slate-500 border border-slate-100">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
