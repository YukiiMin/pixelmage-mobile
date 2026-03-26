import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import type { ResponseBase, Order } from '@/types'

export function useOrderDetail(orderId: number | null) {
  return useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: () =>
      client.get<ResponseBase<Order>>(EP.ORDER(orderId!)).then((r) => r.data),
    enabled: !!orderId,
    staleTime: 60_000,
  })
}
