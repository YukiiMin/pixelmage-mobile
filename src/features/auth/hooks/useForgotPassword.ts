import { useMutation } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      client.post(EP.AUTH_FORGOT_PASSWORD, data),
    onSuccess: () => {
      // Success state UI managed correctly
    },
    onError: (_error: ApiError) => {
      // Error state handled by isError flag in component
    },
  })
}
