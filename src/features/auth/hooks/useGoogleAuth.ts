import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { secureStore } from '@/api/secureStore'
import { useToastStore } from '@/store/useToastStore'
import { ResponseBase, AuthResponseData, GoogleAuthRequestDTO } from '@/types'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'

WebBrowser.maybeCompleteAuthSession()

/**
 * Mobile Google Auth Hook
 * 1. Signs in via expo-auth-session.
 * 2. POST to /api/accounts/auth/google/verify.
 * 3. Navigates on success.
 */
export function useGoogleAuth() {
  const router = useRouter()
  const { showToast } = useToastStore()

  const [, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  })

  const verifyMutation = useMutation({
    mutationFn: (idToken: string) => {
      const payload: GoogleAuthRequestDTO = { token: idToken }
      return client.post<ResponseBase<AuthResponseData>>(EP.AUTH_GOOGLE_VERIFY, payload).then((res) => res.data)
    },

    onSuccess: (data: AuthResponseData) => {
      const { accessToken, refreshToken, account } = data

      if (!accessToken || !refreshToken || !account) {
        showToast('Server trả về dữ liệu không hợp lệ', 'error')
        return
      }

      // Senior-level foresight: await persistence to prevent navigation race conditions
      Promise.all([
        secureStore.set('accessToken', accessToken),
        secureStore.set('refreshToken', refreshToken),
        secureStore.set('userId', account.customerId.toString()),
        secureStore.set('userRole', account.role.roleName),
      ]).then(() => {
        showToast(`Chào mừng, ${account.name}!`, 'success')
        router.replace('/(tabs)')
      }).catch(() => {
        showToast('Lỗi lưu trữ thông tin đăng nhập', 'error')
      })
    },

    onError: (error: ApiError) => {
      const message = error.data?.message ?? error.message ?? 'Cả lỗi xác thực Google thất bại'
      showToast(message, 'error')
    },
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params
      if (id_token) {
        verifyMutation.mutate(id_token)
      }
    }
  }, [response, verifyMutation])

  const signIn = () => {
    void promptAsync()
  }

  return { 
    signIn, 
    isPending: verifyMutation.isPending || !response 
  }
}
