import { useFonts, CormorantGaramond_600SemiBold, CormorantGaramond_400Regular_Italic } from '@expo-google-fonts/cormorant-garamond'
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans'
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Slot, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import { secureStore } from '@/api/secureStore'
import { sessionExpiredBus } from '@/api/client'
import { StatusBar } from 'expo-status-bar'
import { CustomToast } from '@/components/common/CustomToast'

import './global.css'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_400Regular_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    SpaceGrotesk_500Medium,
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    secureStore.get('accessToken').then(token => {
      setIsAuthenticated(!!token)
    })
  }, [])

  // ── Session-expired handler ──────────────────────────────────────────────
  // When the refresh token is invalid/expired, client.ts clears all tokens
  // and emits this event. We force-navigate to login from here so the handler
  // works regardless of which screen is currently mounted.
  useEffect(() => {
    const unsub = sessionExpiredBus.subscribe(() => {
      setIsAuthenticated(false)
      router.replace('/(auth)/login')
    })
    return unsub
  }, [router])
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded && isAuthenticated !== null) {
      SplashScreen.hideAsync()
      
      const inAuthGroup = (segments[0] as string) === '(auth)'
      
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/login')
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)')
      }
    }
  }, [loaded, isAuthenticated, segments, router])

  if (!loaded || isAuthenticated === null) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Slot />
      <CustomToast />
    </QueryClientProvider>
  )
}
