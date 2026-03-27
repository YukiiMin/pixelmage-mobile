import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase } from '@/types'
import type { UserInventory } from '@/types/my-cards'

export function useCardDetail(templateId: number | null, userId: number | null) {
  return useQuery({
    queryKey: ['my-card-detail', templateId, userId],
    queryFn: () =>
      client.get<ResponseBase<UserInventory>>(EP.MY_CARD_DETAIL(templateId!, userId!))
        .then((r) => r.data),
    enabled: !!templateId && !!userId,
    staleTime: 60_000,
  })
}
