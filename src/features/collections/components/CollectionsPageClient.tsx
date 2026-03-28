import { secureStore } from '@/api/secureStore'
import { colors, fonts } from '@/theme/index'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useCollectionProgress } from '../hooks/useCollectionProgress'
import { useCollections } from '../hooks/useCollections'
import { CollectionList } from './CollectionList'

export function CollectionsPageClient() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then((id) => {
      if (id) setUserId(Number(id))
    })
  }, [])

  const { data: collections, isLoading: loadingColls } = useCollections(userId)
  const { data: progresses, isLoading: loadingProgs } =
    useCollectionProgress(userId)

  const isLoading = loadingColls || loadingProgs

  return (
    <ScrollView className="flex-1 bg-[#0A0D1E]">
      <View className="py-8 px-4">
        <Text
          style={{ fontFamily: fonts.heading, color: colors.primary }}
          className="text-3xl text-center mb-6"
        >
          Bộ Sưu Tập
        </Text>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            className="mt-12"
          />
        )}

        {!isLoading && collections && progresses && (
          <CollectionList collections={collections} progressData={progresses} />
        )}
      </View>
    </ScrollView>
  )
}
