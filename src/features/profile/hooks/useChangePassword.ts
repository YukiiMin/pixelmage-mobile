import { useMutation } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'
import { ResponseBase, ChangePasswordRequestDTO } from '@/types'

/**
 * Mobile Password Update Hook
 */
export function useChangePassword(userId: number) {
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: (data: ChangePasswordRequestDTO) =>
      client.put<ResponseBase<void>>(EP.ACCOUNT_PASSWORD(userId), data).then((r) => r.data),
    onSuccess: () => {
      showToast('Đổi mật khẩu thành công', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Đổi mật khẩu thất bại'
      showToast(message, 'error')
    },
  })
}
