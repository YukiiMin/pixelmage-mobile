import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { UnlinkRequest } from '@/types/unlink'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useUnlinkRequests() {
  return useQuery({
    queryKey: ['unlink-requests'],
    queryFn: () =>
      client.get<ResponseBase<UnlinkRequest[]>>(EP.STAFF_UNLINK_REQUESTS).then((r) => r.data),
    staleTime: 30_000,
  })
}
