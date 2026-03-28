import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { ApiError, client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { useToastStore } from '@/store/useToastStore'
import { ResponseBase, Account, RegisterRequestDTO } from '@/types'

/**
 * Mobile Registration Hook
 * → We do NOT write anything to SecureStore here.
 * → We show a toast and navigate to login.
 */
export function useRegister() {
  const router = useRouter()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: (data: RegisterRequestDTO) =>
      client.post<ResponseBase<Account>>(EP.AUTH_REGISTER, data).then((r) => r.data),

    onSuccess: (account: Account) => {
      showToast(`Tạo tài khoản ${account.name} thành công. Vui lòng đăng nhập!`, 'success')
      router.replace('/(auth)/login')
    },

    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Đăng ký thất bại'
      showToast(message, 'error')
    },
  })
}
