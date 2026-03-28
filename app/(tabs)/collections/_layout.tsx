import { Stack } from 'expo-router'

export default function CollectionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="stories/index" />
      <Stack.Screen name="stories/[id]" />
    </Stack>
  )
}
