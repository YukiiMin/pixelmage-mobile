import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, MarketCardTemplate } from '@/types'

export function useCardTemplates() {
  return useQuery({
    queryKey: ['card-templates'],
    queryFn: () =>
      client.get<ResponseBase<MarketCardTemplate[]>>(EP.CARD_TEMPLATES).then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}
