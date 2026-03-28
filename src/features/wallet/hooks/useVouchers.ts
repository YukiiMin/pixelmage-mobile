import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { Voucher } from '@/types/wallet'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useVouchers(userId: number | null) {
  return useQuery({
    queryKey: ['vouchers', userId],
    queryFn: () =>
      client.get<ResponseBase<Voucher[]>>(EP.VOUCHERS).then((r) => r.data),
    enabled: !!userId,
    staleTime: 30_000,
  })
}
