import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Story } from '@/types'

export function useStories(userId: number | null) {
  return useQuery({
    queryKey: ['stories', userId],
    queryFn: () =>
      client.get<ResponseBase<Story[]>>(EP.STORIES(userId!)).then((r) => r.data),
    enabled: !!userId,
    staleTime: 60_000,
  })
}
