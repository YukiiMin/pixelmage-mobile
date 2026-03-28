import { Stack } from 'expo-router'

export default function StaffLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="bind" />
      <Stack.Screen name="unlink-requests" />
    </Stack>
  )
}
