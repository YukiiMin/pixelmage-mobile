import { StoryDetailScreen } from '@/features/collections/components/StoryDetailScreen'
import { useLocalSearchParams } from 'expo-router'
import { secureStore } from '@/api/secureStore'
import { useEffect, useState } from 'react'

export default function StoryDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then(uid => {
      setUserId(uid ? parseInt(uid, 10) : null)
    })
  }, [])

  if (!id) return null

  return <StoryDetailScreen storyId={parseInt(id, 10)} userId={userId} />
}
