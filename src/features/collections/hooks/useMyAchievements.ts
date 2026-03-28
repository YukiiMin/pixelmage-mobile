import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Achievement } from '@/types'

export function useMyAchievements(userId: number | null) {
  return useQuery({
    queryKey: ['my-achievements', userId],
    queryFn: () =>
      client.get<ResponseBase<Achievement[]>>(EP.MY_ACHIEVEMENTS).then((r) => r.data),
    enabled: !!userId,
    staleTime: 30_000,
  })
}
