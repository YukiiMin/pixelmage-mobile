import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { secureStore } from '@/api/secureStore'

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: unknown) =>
      client.post<{ data: { accessToken: string; refreshToken: string; userId: number; role: { roleName: string } } }>(EP.AUTH_LOGIN, data),
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
      // Throw hay catch error message
    },
  })
}
