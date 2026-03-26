import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, StoryDetail } from '@/types'
import type { ApiError } from '@/api/client'

export function useStoryDetail(storyId: number | null, userId: number | null) {
  return useQuery({
    queryKey: ['story-detail', storyId, userId],
    queryFn: () =>
      client
        .get<ResponseBase<StoryDetail>>(EP.STORY(storyId!, userId!))
        .then((r) => r.data),
    enabled: !!storyId && !!userId,
    staleTime: 60_000,
    retry: (failureCount, error) => {
      const apiErr = error as ApiError
      return apiErr.status !== 403 && failureCount < 3
    },
  })
}
