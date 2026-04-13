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
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="px-4 pb-8 pt-10">
        <Text
          style={{ fontFamily: fonts.heading, color: colors.primary }}
          className="mb-6 text-center text-4xl"
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

        {!isLoading && collections && progresses && collections.length === 0 && (
          <View
            className="rounded-2xl border px-6 py-8"
            style={{ backgroundColor: colors.surface, borderColor: colors.borderMuted }}
          >
            <Text
              className="text-center text-xl"
              style={{ fontFamily: fonts.heading, color: colors.text }}
            >
              Chưa có bộ sưu tập
            </Text>
            <Text
              className="mt-2 text-center"
              style={{ fontFamily: fonts.body, color: colors.textMuted }}
            >
              Mua pack để bắt đầu hành trình sưu tầm thẻ.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
