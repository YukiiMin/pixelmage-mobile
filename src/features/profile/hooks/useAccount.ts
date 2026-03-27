import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { ResponseBase, Account } from '@/types'

/**
 * Mobile Account Detail Hook
 * Fetches the full profile for a given user ID.
 */
export function useAccount(userId: number | null) {
  return useQuery({
    queryKey: ['account', userId],
    queryFn: () =>
      client.get<ResponseBase<Account>>(EP.ACCOUNT(userId!)).then((r) => r.data),
    enabled: !!userId,
    staleTime: 60_000,
  })
}
