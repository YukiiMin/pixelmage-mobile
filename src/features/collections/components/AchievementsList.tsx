import { View, Text, SectionList } from 'react-native'
import { Trophy } from 'lucide-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useAchievements } from '@/features/collections/hooks/useAchievements'
import { useMyAchievements } from '@/features/collections/hooks/useMyAchievements'
import { AchievementBadge } from './AchievementBadge'
import { colors, fonts } from '@/theme/index'
import type { AchievementStatus } from '@/types/collection'

interface Props {
  userId: number | null
}

export function AchievementsList({ userId }: Props) {
  const { data: allAchievements, isLoading: loadingAll } = useAchievements()
  const { data: myAchievements, isLoading: loadingMy } = useMyAchievements(userId)

  const isLoading = loadingAll || loadingMy

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }}>Đang tải...</Text>
      </View>
    )
  }

  const earnedIds = new Set((myAchievements ?? []).map((a) => a.achievementId))
  const earnedMap = new Map(
    (myAchievements ?? []).map((a) => [a.achievementId, a.earnedAt])
  )

  const merged = (allAchievements ?? []).map(
    (a): AchievementStatus & { earnedAt?: string; description: string } => ({
      achievementId: a.achievementId,
      name: a.name,
      description: a.description,
      isEarned: earnedIds.has(a.achievementId),
      earnedAt: earnedMap.get(a.achievementId),
    })
  )

  const earned = merged.filter((a) => a.isEarned)
  const unearned = merged.filter((a) => !a.isEarned)

  if (merged.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Trophy size={48} color={colors.textMuted} />
        <Text
          style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 18 }}
          className="mt-4 text-center"
        >
          Chưa có thành tích nào
        </Text>
      </View>
    )
  }

  const sections = [
    ...(earned.length > 0 ? [{ title: `Đã đạt được (${earned.length})`, data: [earned] }] : []),
    ...(unearned.length > 0 ? [{ title: `Chưa đạt (${unearned.length})`, data: [unearned] }] : []),
  ]

  return (
    <SectionList
      sections={sections}
      keyExtractor={(_item, index) => `section-${index}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}
      renderSectionHeader={({ section }) => (
        <View className="mb-3 mt-2">
          <Text style={{ fontFamily: fonts.stats, color: colors.textMuted, fontSize: 12 }}>
            {section.title.toUpperCase()}
          </Text>
        </View>
      )}
      renderItem={({ item: group, index: sectionIndex }) => (
        <Animated.View
          entering={FadeInDown.delay(sectionIndex * 100).duration(400)}
          className="flex-row flex-wrap mb-4"
        >
          {group.map((a, _i) => (
            <AchievementBadge
              key={a.achievementId}
              achievement={a}
              size="sm"
            />
          ))}
        </Animated.View>
      )}
    />
  )
}
