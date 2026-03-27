import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { Account } from '@/types/account'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useAccount(userId: number | null) {
  return useQuery({
    queryKey: ['account', userId],
    queryFn: () =>
      client.get<ResponseBase<Account>>(EP.ACCOUNT(userId!)).then((r) => r.data),
    enabled: !!userId,
    staleTime: 60_000,
  })
}
