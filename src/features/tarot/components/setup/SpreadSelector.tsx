import { secureStore } from '@/api/secureStore'
import { useMyCards } from '@/features/my-cards/hooks/useMyCards'
import { useTarotSessionStore } from '@/store/useTarotSessionStore'
import type { Spread } from '@/types'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

interface SpreadSelectorProps {
  spreads: Spread[]
}

export function SpreadSelector({ spreads }: SpreadSelectorProps) {
  const { spreadId, mode } = useTarotSessionStore()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then((id) => {
      if (id) setUserId(Number(id))
    })
  }, [])

  const { data: myCards } = useMyCards(userId)

  const handleSelect = (spread: Spread) => {
    // Cannot select if disabled
    const disabled =
      mode === 'YOUR_DECK' && (myCards?.length ?? 0) < spread.minCardsRequired
    if (disabled) return

    // We update only spreadId, but setSession requires mode. Just call standard zustand set
    useTarotSessionStore.setState({ spreadId: spread.spreadId })
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-2"
    >
      <View className="flex-row gap-4 px-4">
        {spreads.map((spread) => {
          const isSelected = spreadId === spread.spreadId
          const isDisabled =
            mode === 'YOUR_DECK' &&
            (myCards?.length ?? 0) < spread.minCardsRequired

          return (
            <Pressable
              key={spread.spreadId}
              onPress={() => handleSelect(spread)}
              style={[{ backgroundColor: 'rgba(26, 32, 64, 0.85)' }]}
              className={`p-4 rounded-xl border w-40 ${
                isDisabled
                  ? 'border-border/50 opacity-40'
                  : isSelected
                    ? 'border-primary'
                    : 'border-border/50'
              }`}
            >
              <Text
                className="font-heading text-xl text-primary mb-2"
                numberOfLines={1}
              >
                {spread.name}
              </Text>
              <Text
                className="font-body text-text/80 text-sm mb-4"
                numberOfLines={2}
              >
                {spread.description}
              </Text>

              <View className="mt-auto flex-row items-center justify-between">
                <Text className="font-stats text-text/60 text-xs">
                  {spread.positionCount} lá
                </Text>
              </View>

              {isDisabled && (
                <Text className="font-body text-error mt-2 text-xs">
                  Cần {spread.minCardsRequired} lá. Bạn có{' '}
                  {myCards?.length ?? 0} lá.
                </Text>
              )}
            </Pressable>
          )
        })}
      </View>
    </ScrollView>
  )
}
