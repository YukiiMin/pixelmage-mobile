import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase } from '@/types'
import type { UserInventory } from '@/types/inventory'

export function useMyCards(userId: number | null) {
  return useQuery({
    queryKey: ['my-cards', userId],
    queryFn: () =>
      client.get<ResponseBase<UserInventory[]>>(EP.MY_CARDS(userId!))
        .then((r) => r.data),
    enabled: !!userId,
    staleTime: 30_000,
  })
}
