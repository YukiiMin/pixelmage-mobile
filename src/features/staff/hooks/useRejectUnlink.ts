import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useRejectUnlink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, staffNote }: { requestId: number; staffNote: string }) =>
      client.post<ResponseBase<void>>(EP.STAFF_UNLINK_REJECT(requestId), { staffNote }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlink-requests'] })
      useToastStore.getState().showToast('Đã từ chối yêu cầu', 'success')
    },
    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Từ chối thất bại'
      useToastStore.getState().showToast(message, 'error')
    },
  })
}
