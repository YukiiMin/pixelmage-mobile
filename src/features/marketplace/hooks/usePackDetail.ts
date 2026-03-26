import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Pack } from '@/types'

export function usePackDetail(packId: number | null) {
  return useQuery({
    queryKey: ['pack-detail', packId],
    queryFn: () =>
      client.get<ResponseBase<Pack>>(EP.PACK(packId!)).then((r) => r.data),
    enabled: !!packId,
    staleTime: 5 * 60_000,
  })
}
