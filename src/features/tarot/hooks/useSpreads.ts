import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { EP } from '@/api/endpoints';
import type { ResponseBase, Spread } from '@/types';

export function useSpreads() {
  return useQuery({
    queryKey: ['spreads'],
    queryFn: () =>
      client.get<ResponseBase<Spread[]>>(EP.SPREADS).then((r) => r.data),
    staleTime: 5 * 60_000,  // spreads ít thay đổi
  });
}
