import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Order } from '@/types'

export function useOrders(customerId: number | null) {
  return useQuery({
    queryKey: ['orders', customerId],
    queryFn: () =>
      client.get<ResponseBase<Order[]>>(EP.ORDERS(customerId!)).then((r) => r.data),
    enabled: !!customerId,
    staleTime: 30_000,
  })
}
