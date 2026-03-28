import { ApiError, client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { secureStore } from '@/api/secureStore'
import { AuthResponseData, ResponseBase, LoginRequestDTO } from '@/types'
import { useToastStore } from '@/store/useToastStore'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

/**
 * Mobile Login Hook
 * Handles: POST /api/accounts/auth/login, persisting tokens, and navigating home.
 */
export function useLogin() {
  const router = useRouter()
  const { showToast } = useToastStore()

  return useMutation({
    mutationFn: (credentials: LoginRequestDTO) =>
      client.post<ResponseBase<AuthResponseData>>(EP.AUTH_LOGIN, credentials).then((r) => r.data),

    onSuccess: (data: AuthResponseData) => {
      const { accessToken, refreshToken, account } = data

      if (!accessToken || !refreshToken || !account) {
        showToast('Phản hồi máy chủ không hợp lệ', 'error')
        return
      }

      // Chain persistence before navigation to avoid race conditions
      Promise.all([
        secureStore.set('accessToken', accessToken),
        secureStore.set('refreshToken', refreshToken),
        secureStore.set('userId', account.customerId.toString()),
        secureStore.set('userRole', account.role.roleName),
      ]).then(() => {
        showToast(`Chào mừng trở lại, ${account.name}!`, 'success')
        router.replace('/(tabs)')
      }).catch(() => {
        showToast('Lỗi lưu trữ thông tin đăng nhập', 'error')
      })
    },

    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Đăng nhập thất bại'
      showToast(message, 'error')
    },
  })
}
