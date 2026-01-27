import { Link } from 'react-router-dom';
import { Plus, LogIn, LogOut, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import InsightProgress from './ui/InsightProgress';

interface UserNavigationProps {
    isMobile?: boolean;
    onCloseMobileMenu?: () => void;
}

export default function UserNavigation({ isMobile, onCloseMobileMenu }: UserNavigationProps) {
    const { user, logout } = useAuth();

    if (isMobile) {
        return (
            <div className="space-y-4 pt-2">
                {user ? (
                    <>
                        <div className="py-3 border-b border-slate-100 dark:border-slate-800">
                            <InsightProgress points={user.insightPoints} />
                        </div>
                        <div className="pt-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                            </div>
                            <Link to="/create" onClick={onCloseMobileMenu} className="block">
                                <Button className="w-full gap-2 text-white">
                                    <Plus className="w-4 h-4" />
                                    New Snippet
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full gap-2 text-red-600" onClick={() => { logout(); onCloseMobileMenu?.(); }}>
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                        <Link to="/login" onClick={onCloseMobileMenu}>
                            <Button variant="ghost" className="w-full">Login</Button>
                        </Link>
                        <Link to="/register" onClick={onCloseMobileMenu}>
                            <Button className="w-full text-white">Register</Button>
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 lg:gap-6">
            {user ? (
                <>
                    <div className="hidden lg:block border-r border-slate-100 pr-6 h-10 my-auto">
                        <InsightProgress points={user.insightPoints} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:inline font-bold text-slate-900 dark:text-white">{user.name}</span>
                    </div>
                    <Link to="/create">
                        <Button size="sm" className="gap-2 text-white">
                            <Plus className="w-4 h-4" />
                            New Snippet
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout} title="Logout">
                        <LogOut className="w-4 h-4" />
                    </Button>
                </>
            ) : (
                <>
                    <Link to="/login">
                        <Button variant="ghost" size="sm">
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button size="sm" className="text-white">
                            Register
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
}
