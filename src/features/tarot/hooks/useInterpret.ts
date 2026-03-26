import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { EP } from '@/api/endpoints';
import type { ResponseBase, ReadingSession } from '@/types';

export function useInterpret(sessionId: number | null) {
  return useQuery({
    queryKey: ['tarot-interpret', sessionId],
    queryFn: () =>
      client.get<ResponseBase<ReadingSession>>(EP.SESSION_INTERPRET(sessionId!))
        .then((r) => r.data),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'INTERPRETING' ? 2000 : false;
    },
  });
}
