import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { WalletBalance } from '@/types/wallet'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useWallet(userId: number | null) {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () =>
      client.get<ResponseBase<WalletBalance>>(EP.WALLET_BALANCE).then((r) => r.data),
    enabled: !!userId,
    staleTime: 30_000,
  })
}
