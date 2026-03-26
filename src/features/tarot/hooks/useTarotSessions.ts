import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { EP } from '@/api/endpoints';
import type { ResponseBase, ReadingSession } from '@/types';

export function useTarotSessions() {
  return useQuery({
    queryKey: ['tarot-sessions'],
    queryFn: () =>
      client.get<ResponseBase<ReadingSession[]>>(EP.SESSIONS).then((r) => r.data),
    staleTime: 30_000,
  });
}
