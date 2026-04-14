import { Stack } from 'expo-router'
import { colors } from '@/theme/index'

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="wallet/index" />
    </Stack>
  )
}
