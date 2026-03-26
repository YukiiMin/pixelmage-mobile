import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client, type ApiError } from '@/api/client';
import { EP } from '@/api/endpoints';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import type { ResponseBase, ReadingSession, ReadingMode } from '@/types';

export function useCreateSession() {
  const queryClient = useQueryClient();
  const { setSession, setPhase } = useTarotSessionStore();

  return useMutation<ReadingSession, ApiError, { spreadId: number; mainQuestion: string; mode: ReadingMode }>({
    mutationFn: (payload: { spreadId: number; mainQuestion: string; mode: ReadingMode }) =>
      client.post<ResponseBase<ReadingSession>>(EP.SESSIONS, payload).then((r) => r.data),
    onSuccess: (session) => {
      setSession(session.sessionId, session.spread.spreadId, session.mode);
      setPhase('SHUFFLING');
      // Invalidate account sau guest reading (guestReadingUsedAt update)
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
    // onError sẽ được pass activeSessionId lên component qua onError callback 
  });
}
