import { View, Text } from 'react-native'
import { Trophy } from 'lucide-react-native'
import type { AchievementStatus } from '@/types/collection'
import { fonts, colors } from '@/theme/index'

interface Props {
  achievement: AchievementStatus
}

export function AchievementBadge({ achievement }: Props) {
  return (
    <View className="items-center w-1/3 p-2">
      <View 
        className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${achievement.isEarned ? 'bg-[#D4B857]/20 border border-[#D4B857]' : 'bg-slate-800 border border-slate-700'}`}
      >
        <Trophy size={24} color={achievement.isEarned ? colors.primary : colors.textMuted} />
      </View>
      <Text 
        style={{ fontFamily: fonts.stats, color: achievement.isEarned ? colors.primary : colors.textMuted }} 
        className="text-xs text-center leading-tight"
      >
        {achievement.name}
      </Text>
    </View>
  )
}
