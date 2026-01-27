import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { Button } from './ui/Button';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InsightBadge from './InsightBadge';

interface CommentSectionProps {
    snippetId: string;
}

export default function CommentSection({ snippetId }: CommentSectionProps) {
    const { user, refreshUser } = useAuth();
    const queryClient = useQueryClient();
    const [content, setContent] = useState('');

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', snippetId],
        queryFn: () => snippetService.getComments(snippetId),
    });

    const commentMutation = useMutation({
        mutationFn: (text: string) => snippetService.createComment(text, snippetId),
        onSuccess: () => {
            setContent('');
            queryClient.invalidateQueries({ queryKey: ['comments', snippetId] });
            // Points might have changed for the current user
            queryClient.invalidateQueries({ queryKey: ['snippet', snippetId] });
            refreshUser();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        commentMutation.mutate(content);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-900">Guardian Contributions</h2>
                <span className="text-sm font-medium text-slate-500 ml-auto">
                    {comments?.length || 0} {comments?.length === 1 ? 'Thought' : 'Thoughts'}
                </span>
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Amplify this knowledge with your insights..."
                            className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm"
                        />
                        <div className="absolute bottom-3 right-3">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!content.trim() || commentMutation.isPending}
                            >
                                {commentMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Contribute Insight
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center mb-8">
                    <p className="text-sm text-indigo-700">
                        Log in to share your insights and earn **Insight Points**.
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-slate-900">{comment.author.name}</span>
                                <InsightBadge points={comment.author.insightPoints} />
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed">
                                {comment.content}
                            </div>
                        </div>
                    </div>
                ))}
                {comments?.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic text-sm">
                        No insights shared yet. Be the first to amplify this knowledge.
                    </div>
                )}
            </div>
        </div>
    );
}
