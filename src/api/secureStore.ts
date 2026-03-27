import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

export const TOKEN_KEYS = {
  accessToken: 'pm_access_token',
  refreshToken: 'pm_refresh_token',
  userId: 'pm_user_id',
  userRole: 'pm_user_role',
} as const

// expo-secure-store không hoạt động trên Web → fallback về localStorage
const isWeb = Platform.OS === 'web'

const webStore = {
  get: (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') return Promise.resolve(null)
    return Promise.resolve(window.localStorage.getItem(key))
  },
  set: (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
    return Promise.resolve()
  },
  delete: (key: string): Promise<void> => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key)
    return Promise.resolve()
  },
}

export const secureStore = {
  get: (key: keyof typeof TOKEN_KEYS): Promise<string | null> =>
    isWeb
      ? webStore.get(TOKEN_KEYS[key])
      : SecureStore.getItemAsync(TOKEN_KEYS[key]),

  set: (key: keyof typeof TOKEN_KEYS, value: string): Promise<void> =>
    isWeb
      ? webStore.set(TOKEN_KEYS[key], value)
      : SecureStore.setItemAsync(TOKEN_KEYS[key], value),

  clearAll: (): Promise<void[]> =>
    Promise.all(
      Object.values(TOKEN_KEYS).map((k) =>
        isWeb ? webStore.delete(k) : SecureStore.deleteItemAsync(k),
      ),
    ),
}
