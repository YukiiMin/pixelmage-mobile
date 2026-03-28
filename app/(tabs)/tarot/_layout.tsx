import { Stack } from 'expo-router'

export default function TarotLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reading" />
      <Stack.Screen name="result" />
    </Stack>
  )
}
