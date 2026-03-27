import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'
import { Account } from '@/types/account'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useUpdateProfile(userId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string }) =>
      client.put<ResponseBase<Account>>(EP.ACCOUNT(userId), data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', userId] })
      useToastStore.getState().showToast('Cập nhật thành công', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Cập nhật thất bại'
      useToastStore.getState().showToast(message, 'error')
    },
  })
}
