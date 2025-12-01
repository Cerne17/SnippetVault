import { Link, Outlet } from 'react-router-dom';
import { Code2, Plus } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 hover:text-indigo-700 transition-colors">
              <Code2 className="w-6 h-6" />
              <span>SnippetVault</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/create" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                New Snippet
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
