import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { secureStore } from '@/api/secureStore'
import { useCollectionProgressDetail } from '../hooks/useCollectionProgressDetail'
import { StoryUnlockRow } from './StoryUnlockRow'
import { AchievementBadge } from './AchievementBadge'
import { ProgressBar } from './ProgressBar'
import { fonts, colors } from '@/theme/index'

interface Props {
  collectionId: number
}

export function CollectionDetail({ collectionId }: Props) {
  const [userId, setUserId] = useState<number | null>(null)
  
  useEffect(() => {
    secureStore.get('userId').then(id => {
      if (id) setUserId(Number(id))
    })
  }, [])

  const { data: detail, isLoading } = useCollectionProgressDetail(userId, collectionId)

  if (isLoading || !detail) {
    return (
      <View className="flex-1 bg-[#0A0D1E] justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const isCompleted = detail.ownedCards === detail.totalCards

  return (
    <ScrollView className="flex-1 bg-[#0A0D1E]">
      <View className="py-8 px-4">
        <View className="items-center mb-8">
          <Text style={{ fontFamily: fonts.heading, color: colors.text }} className="text-3xl text-center mb-2">
            {detail.collectionName}
          </Text>
          <View className="w-full mt-4">
            <ProgressBar 
              value={detail.ownedCards} 
              max={detail.totalCards} 
              color={isCompleted ? colors.primary : colors.accent} 
            />
            <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }} className="text-sm text-center mt-2">
              Tiến độ bộ sưu tập: {detail.ownedCards}/{detail.totalCards} thẻ
            </Text>
          </View>
        </View>

        <View className="mb-8 p-4 rounded-xl bg-[rgba(26,32,64,0.5)] border border-slate-700/50">
          <Text style={{ fontFamily: fonts.heading, color: colors.text }} className="text-xl mb-4">
            Cốt Truyện Bí Ẩn
          </Text>
          {detail.stories.map((story) => (
            <StoryUnlockRow key={story.storyId} story={story} />
          ))}
          {detail.stories.length === 0 && (
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-sm italic">
              (Chưa có cốt truyện nào)
            </Text>
          )}
        </View>

        <View className="mb-8 p-4 rounded-xl bg-[rgba(26,32,64,0.5)] border border-slate-700/50">
          <Text style={{ fontFamily: fonts.heading, color: colors.text }} className="text-xl mb-4">
            Danh Hiệu ({detail.achievements.filter(a => a.isEarned).length}/{detail.achievements.length})
          </Text>
          <View className="flex-row flex-wrap">
            {detail.achievements.map((ach) => (
              <AchievementBadge key={ach.achievementId} achievement={ach} />
            ))}
            {detail.achievements.length === 0 && (
              <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-sm italic ml-2">
                (Chưa có danh hiệu nào)
              </Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
