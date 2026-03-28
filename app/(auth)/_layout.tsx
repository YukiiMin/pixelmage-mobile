import { Stack } from 'expo-router'
import { colors } from '@/theme/index'
import { StatusBar } from 'expo-status-bar'

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      />
    </>
  )
}
