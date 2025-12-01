import { Link } from 'react-router-dom';
import type { Snippet } from '../types/snippet';
import CodeBlock from './CodeBlock';
import { Calendar, Tag } from 'lucide-react';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link to={`/snippets/${snippet._id}`} className="block group">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                {snippet.title}
              </h3>
            </Link>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(snippet.createdAt).toLocaleDateString()}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600 uppercase tracking-wider">
                {snippet.language}
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-64 overflow-hidden relative group">
          <CodeBlock code={snippet.code} language={snippet.language} />
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={`/snippets/${snippet._id}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-white/90 px-3 py-1 rounded-full shadow-sm border border-indigo-100">
              View Full Snippet
            </Link>
          </div>
        </div>

        {snippet.tags && snippet.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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
  );
}
