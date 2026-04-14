import { Stack } from 'expo-router'
import { colors } from '@/theme/index'

export default function TarotLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reading" />
      <Stack.Screen name="result" />
    </Stack>
  )
}
