import { StoriesList } from '@/features/collections/components/StoriesList'
import { secureStore } from '@/api/secureStore'
import { useEffect, useState } from 'react'

export default function StoriesScreen() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then(id => {
      setUserId(id ? parseInt(id, 10) : null)
    })
  }, [])

  return <StoriesList userId={userId} />
}
