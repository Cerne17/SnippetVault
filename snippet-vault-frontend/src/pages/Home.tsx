import { useQuery } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import SnippetCard from '../components/SnippetCard';
import { Globe, Loader2, Search, User as UserIcon, FileJson } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { exportVaultAsJson } from '../utils/fileUtils';


export default function Home() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [scope, setScope] = useState<'mine' | 'public'>(user ? 'mine' : 'public');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['snippets', debouncedSearch, !!user, scope],
    queryFn: () => snippetService.getAll({ search: debouncedSearch, scope }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {scope === 'mine' ? 'My Snippet Vault' : 'Community Vault'}
          </h1>
          <p className="text-slate-500 mt-1">
            {scope === 'mine'
              ? 'Your personal collection of code gems.'
              : 'Discover shared code from developers worldwide.'}
          </p>
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={scope === 'mine' ? "Search your vault..." : "Search community..."}
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {user && (
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setScope('mine')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${scope === 'mine'
              ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <UserIcon className="w-4 h-4" />
            My Vault
          </button>
          <button
            onClick={() => setScope('public')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${scope === 'public'
              ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Globe className="w-4 h-4" />
            Community Vault
          </button>
        </div>
      )}

      {scope === 'mine' && snippets && snippets.length > 0 && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => exportVaultAsJson(snippets)}
          >
            <FileJson className="w-4 h-4" />
            Export Vault (.json)
          </Button>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {snippets?.map((snippet) => (
          <SnippetCard key={snippet._id} snippet={snippet} />
        ))}
        {snippets?.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <p className="text-slate-500">
              {scope === 'mine'
                ? 'Your vault is empty. Time to add some magic!'
                : 'No public snippets found. Be the first to share one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
