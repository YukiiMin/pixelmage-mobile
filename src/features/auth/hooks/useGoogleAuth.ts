import * as React from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { secureStore } from '@/api/secureStore'
import { Platform } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

export function useGoogleAuth() {
  const router = useRouter()

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    selectAccount: true,
  })

  const verifyMutation = useMutation({
    mutationFn: (idToken: string) =>
      client.post<{ data: { accessToken: string; refreshToken: string; userId: number; role: { roleName: string } } }>(
        EP.AUTH_GOOGLE_VERIFY,
        { idToken }
      ),
    onSuccess: async (data) => {
      const payload = data.data
      await Promise.all([
        secureStore.set('accessToken', payload.accessToken),
        secureStore.set('refreshToken', payload.refreshToken),
        secureStore.set('userId', String(payload.userId)),
        secureStore.set('userRole', payload.role.roleName),
      ])
      router.replace('/(tabs)')
    },
    onError: (error: ApiError) => {
      // throw
    },
  })

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params
      if (id_token) {
        verifyMutation.mutate(id_token)
      }
    }
  }, [response])

  const signIn = async () => {
    await promptAsync()
  }

  return { signIn, isPending: verifyMutation.isPending }
}
