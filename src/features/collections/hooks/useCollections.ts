import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase } from '@/types'
import type { Collection } from '@/types/collection'

export function useCollections(customerId: number | null) {
  return useQuery({
    queryKey: ['collections', customerId],
    queryFn: () =>
      client.get<ResponseBase<Collection[]>>(EP.COLLECTIONS(customerId!))
        .then((r) => r.data),
    enabled: !!customerId,
    staleTime: 60_000,
  })
}
