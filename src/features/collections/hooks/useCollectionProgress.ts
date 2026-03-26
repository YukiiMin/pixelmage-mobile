import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase } from '@/types'
import type { CollectionProgress } from '@/types/collection'

export function useCollectionProgress(customerId: number | null) {
  return useQuery({
    queryKey: ['collection-progress', customerId],
    queryFn: () =>
      client.get<ResponseBase<CollectionProgress[]>>(EP.COLLECTION_PROGRESS(customerId!))
        .then((r) => r.data),
    enabled: !!customerId,
    staleTime: 30_000,
  })
}
