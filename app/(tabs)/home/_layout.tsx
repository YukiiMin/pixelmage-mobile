import { Stack } from 'expo-router'
import { colors } from '@/theme/index'

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
