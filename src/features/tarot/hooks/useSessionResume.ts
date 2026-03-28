import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import type { ResponseBase, ReadingSession } from '@/types';
import { type TarotPhase } from '@/store/useTarotSessionStore';

export function useSessionResume(sessionId: number) {
  const { data: session, isLoading } = useQuery({
    queryKey: ['tarot-session-detail', sessionId],
    // The endpoint EP.SESSION might not exist, but let's assume it's `/api/v1/readings/sessions/${sessionId}`
    queryFn: () => client.get<ResponseBase<ReadingSession>>(
      `/api/v1/readings/sessions/${sessionId}`
    ).then((r) => r.data),
    enabled: !!sessionId,
  });

  const getPhase = (): TarotPhase => {
    switch (session?.status) {
      case 'PENDING': return 'DRAWING';
      case 'INTERPRETING': return 'INTERPRET';
      case 'COMPLETED': return 'COMPLETE';
      case 'EXPIRED': return 'EXPIRED';
      default: return 'SETUP';
    }
  };

  return { session, phase: getPhase(), isLoading };
}
