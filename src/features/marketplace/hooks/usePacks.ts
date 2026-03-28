import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Pack } from '@/types'

export function usePacks() {
  return useQuery({
    queryKey: ['packs'],
    queryFn: () =>
      client.get<ResponseBase<Pack[]>>(EP.PACKS_AVAILABLE).then((r) => r.data),
    staleTime: 2 * 60_000,
  })
}
