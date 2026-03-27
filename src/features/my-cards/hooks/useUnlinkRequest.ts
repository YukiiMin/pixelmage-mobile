import { useMutation } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useUnlinkRequest() {
  return useMutation({
    mutationFn: (nfcUid: string) =>
      client.post<ResponseBase<void>>(EP.UNLINK_REQUESTS, { nfcUid }).then((r) => r.data),
    onSuccess: () => {
      // Show confirmation state handled in component
    },
    onError: (error: ApiError) => {
      if (error.status === 409) {
        useToastStore.getState().showToast('Bạn đã có yêu cầu đang chờ cho thẻ này', 'error')
      } else {
        const message = error.data?.message ?? error.message ?? 'Đã có lỗi xảy ra'
        useToastStore.getState().showToast(message, 'error')
      }
    },
  })
}
