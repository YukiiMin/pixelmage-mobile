import * as SecureStore from 'expo-secure-store'

export const TOKEN_KEYS = {
  accessToken: 'pm_access_token',
  refreshToken: 'pm_refresh_token',
  userId: 'pm_user_id',
  userRole: 'pm_user_role',
} as const

export const secureStore = {
  get: (key: keyof typeof TOKEN_KEYS) => SecureStore.getItemAsync(TOKEN_KEYS[key]),
  set: (key: keyof typeof TOKEN_KEYS, value: string) =>
    SecureStore.setItemAsync(TOKEN_KEYS[key], value),
  clearAll: () =>
    Promise.all(Object.values(TOKEN_KEYS).map((k) => SecureStore.deleteItemAsync(k))),
}
