import { Stack } from 'expo-router'
import { colors } from '@/theme/index'

export default function CollectionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="stories/index" />
      <Stack.Screen name="stories/[id]" />
    </Stack>
  )
}
