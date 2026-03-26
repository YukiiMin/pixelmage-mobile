import { secureStore } from '@/api/secureStore'
import { colors, fonts } from '@/theme/index'
import { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useMyCards } from '../hooks/useMyCards'
import { EmptyState } from './EmptyState'
import { MyCardsGrid } from './MyCardsGrid'

export function MyCardsPageClient() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then((id) => {
      if (id) setUserId(Number(id))
    })
  }, [])

  const { data: myCards, isLoading, error } = useMyCards(userId)

  return (
    <ScrollView className="flex-1 bg-[#0A0D1E]">
      <View className="py-8 px-4">
        <Text
          style={{ fontFamily: fonts.heading, color: colors.primary }}
          className="text-3xl text-center mb-6"
        >
          Thẻ Của Tôi
        </Text>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            className="mt-12"
          />
        )}

        {error && (
          <Text
            style={{ fontFamily: fonts.body, color: '#e74c3c' }}
            className="text-center mt-6"
          >
            Không thể tải danh sách thẻ
          </Text>
        )}

        {myCards && myCards.length === 0 && <EmptyState />}
        {myCards && myCards.length > 0 && <MyCardsGrid cards={myCards} />}
      </View>
    </ScrollView>
  )
}
