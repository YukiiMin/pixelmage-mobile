import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Achievement } from '@/types'

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () =>
      client.get<ResponseBase<Achievement[]>>(EP.ACHIEVEMENTS).then((r) => r.data),
    staleTime: 5 * 60_000,
  })
}
