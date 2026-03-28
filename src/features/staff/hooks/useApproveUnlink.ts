import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'
import * as Haptics from 'expo-haptics'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useApproveUnlink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: number) =>
      client.post<ResponseBase<void>>(EP.STAFF_UNLINK_APPROVE(requestId)).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlink-requests'] })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      useToastStore.getState().showToast('Đã phê duyệt yêu cầu hủy liên kết', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Phê duyệt thất bại'
      useToastStore.getState().showToast(message, 'error')
    },
  })
}
