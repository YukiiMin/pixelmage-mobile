import { View } from 'react-native'
import { useMemo } from 'react'
import { useRouter } from 'expo-router'
import type { Collection, CollectionProgress } from '@/types/collection'
import { CollectionCard } from './CollectionCard'

interface Props {
  collections: Collection[]
  progressData: CollectionProgress[]
}

export function CollectionList({ collections, progressData }: Props) {
  const router = useRouter()
  
  const progressMap = useMemo(() => {
    return Object.fromEntries(progressData.map((p) => [p.collectionId, p]))
  }, [progressData])

  return (
    <View className="w-full">
      {collections.map((col) => (
        <CollectionCard
          key={col.collectionId}
          collection={col}
          progress={progressMap[col.collectionId]}
          onPress={() => {
            router.push({
              // @ts-expect-error: Expo Router static generation limitation
              pathname: '/collections/[id]',
              params: { id: col.collectionId }
            })
          }}
        />
      ))}
    </View>
  )
}
