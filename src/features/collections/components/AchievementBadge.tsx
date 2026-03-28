import { View, Text } from 'react-native'
import { Trophy } from 'lucide-react-native'
import type { AchievementStatus } from '@/types/collection'
import { fonts, colors } from '@/theme/index'

interface Props {
  achievement: AchievementStatus & { earnedAt?: string }
  size?: 'sm' | 'lg'
}

export function AchievementBadge({ achievement, size = 'sm' }: Props) {
  const isEarned = achievement.isEarned
  const iconSize = size === 'lg' ? 32 : 24
  const containerSize = size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'

  return (
    <View className={`items-center ${size === 'lg' ? 'p-3' : 'w-1/3 p-2'}`}>
      <View
        className={`${containerSize} rounded-full items-center justify-center mb-2 ${
          isEarned
            ? 'bg-[#D4B857]/20 border border-[#D4B857]'
            : 'bg-slate-800 border border-slate-700'
        }`}
        style={{ opacity: isEarned ? 1 : 0.4 }}
      >
        <Trophy size={iconSize} color={isEarned ? colors.primary : colors.textMuted} />
      </View>
      <Text
        style={{ fontFamily: fonts.stats, color: isEarned ? colors.primary : colors.textMuted }}
        className={`${size === 'lg' ? 'text-sm' : 'text-xs'} text-center leading-tight`}
      >
        {achievement.name}
      </Text>
      {size === 'lg' && isEarned && achievement.earnedAt && (
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }} className="text-xs mt-1">
          {new Date(achievement.earnedAt).toLocaleDateString('vi-VN')}
        </Text>
      )}
    </View>
  )
}

