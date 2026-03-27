import { useMutation } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useChangePassword(userId: number) {
  return useMutation({
    mutationFn: (data: any) =>
      client.put<ResponseBase<void>>(EP.ACCOUNT_PASSWORD(userId), data).then((r) => r.data),
    onSuccess: () => {
      useToastStore.getState().showToast('Đổi mật khẩu thành công', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Đổi mật khẩu thất bại'
      useToastStore.getState().showToast(message, 'error')
    },
  })
}
