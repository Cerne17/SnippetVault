import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetService } from '../services/snippetService';
import { useAuth } from '../context/AuthContext';

export function useSnippetActions(snippetId: string) {
    const queryClient = useQueryClient();
    const { user, refreshUser } = useAuth();

    const amplifyMutation = useMutation({
        mutationFn: () => snippetService.amplify(snippetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['snippets'] });
            queryClient.invalidateQueries({ queryKey: ['snippet', snippetId] });
            refreshUser();
        },
    });

    const diminishMutation = useMutation({
        mutationFn: () => snippetService.diminish(snippetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['snippets'] });
            queryClient.invalidateQueries({ queryKey: ['snippet', snippetId] });
            refreshUser();
        },
    });

    return {
        amplify: amplifyMutation.mutate,
        diminish: diminishMutation.mutate,
        isAmplifying: amplifyMutation.isPending,
        isDiminishing: diminishMutation.isPending,
        user,
    };
}
