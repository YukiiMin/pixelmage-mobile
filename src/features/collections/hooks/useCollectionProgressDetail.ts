import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase } from '@/types'
import type { CollectionProgressDetail } from '@/types/collection'

export function useCollectionProgressDetail(
  customerId: number | null,
  collectionId: number | null
) {
  return useQuery({
    queryKey: ['collection-detail', collectionId, customerId],
    queryFn: () =>
      client.get<ResponseBase<CollectionProgressDetail>>(
        EP.COLLECTION_PROGRESS_DETAIL(customerId!, collectionId!)
      ).then((r) => r.data),
    enabled: !!customerId && !!collectionId,
    staleTime: 30_000,
  })
}
