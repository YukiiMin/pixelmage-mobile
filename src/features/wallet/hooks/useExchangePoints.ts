import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useExchangePoints(userId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      client.post<ResponseBase<void>>(EP.WALLET_EXCHANGE).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
      queryClient.invalidateQueries({ queryKey: ['vouchers', userId] })
      useToastStore.getState().showToast('Đổi điểm thành công. Bạn nhận được 1 voucher.', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Đổi điểm thất bại'
      useToastStore.getState().showToast(message, 'error')
    },
  })
}
