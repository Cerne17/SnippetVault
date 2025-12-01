import { useQuery } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import SnippetCard from '../components/SnippetCard';
import { Loader2, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { useState } from 'react';


export default function Home() {
  const [search, setSearch] = useState('');
  // For now, we won't implement debounce to save time, just direct search or maybe no search yet if it's too complex for this step.
  // Actually, let's just fetch all for now.
  
  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['snippets'],
    queryFn: () => snippetService.getAll(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading snippets</h2>
        <p className="text-slate-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Discover Snippets</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search snippets..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {snippets?.map((snippet) => (
          <SnippetCard key={snippet._id} snippet={snippet} />
        ))}
        {snippets?.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">No snippets found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
