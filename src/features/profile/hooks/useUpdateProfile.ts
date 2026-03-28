import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'
import { ResponseBase, Account, UpdateProfileRequestDTO } from '@/types'

/**
 * Mobile Profile Update Hook
 * Updates basic account info (e.g. name).
 */
export function useUpdateProfile(userId: number) {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: (data: UpdateProfileRequestDTO) =>
      client.put<ResponseBase<Account>>(EP.ACCOUNT(userId), data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', userId] })
      showToast('Cập nhật thành công', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Cập nhật thất bại'
      showToast(message, 'error')
    },
  })
}
