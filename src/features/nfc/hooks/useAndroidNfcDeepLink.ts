import * as Linking from 'expo-linking'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { secureStore } from '@/api/secureStore'

export function useAndroidNfcDeepLink() {
  const router = useRouter()

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleNfcUrl(url, router)
    })
    
    const sub = Linking.addEventListener('url', ({ url }) => {
      handleNfcUrl(url, router)
    })
    
    return () => sub.remove()
  }, [])
}

function handleNfcUrl(url: string, router: ReturnType<typeof useRouter>) {
  const parsed = Linking.parse(url)
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean)
  
  if (pathParts[0] === 'nfc' && pathParts[1]) {
    const uid = pathParts[1]
    secureStore.get('accessToken').then((token) => {
      if (!token) {
        // @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache.
        router.replace({ pathname: '/(auth)/login', params: { returnUid: uid } })
      } else {
        // @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache.
        router.push({ pathname: '/(modals)/nfc-scan', params: { uid } })
      }
    })
  }
}
