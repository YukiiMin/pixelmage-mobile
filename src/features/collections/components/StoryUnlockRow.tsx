import { View, Text, Pressable } from 'react-native'
import { Lock, Unlock } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import type { StoryStatus } from '@/types/collection'
import { fonts, colors } from '@/theme/index'

interface Props {
  story: StoryStatus
}

export function StoryUnlockRow({ story }: Props) {
  const router = useRouter()

  if (!story.isUnlocked) {
    return (
      <View className="flex-row items-center p-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <Lock size={20} color={colors.textMuted} className="mr-3" />
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-base line-through">
            {story.title}
          </Text>
          <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }} className="text-xs mt-1">
            Hoàn thành bộ thẻ để truy cập nội dung này
          </Text>
        </View>
      </View>
    )
  }

  return (
    <Pressable
      onPress={() => {
        router.push({
          // @ts-expect-error: Expo Router static generation limitation
          pathname: '/(tabs)/story/[id]',
          params: { id: story.storyId }
        })
      }}
      className="flex-row items-center p-3 mb-2 rounded-xl bg-[#D4B857]/10 border border-[#D4B857]/30"
    >
      <Unlock size={20} color={colors.primary} className="mr-3" />
      <Text style={{ fontFamily: fonts.heading, color: colors.primary }} className="text-lg flex-1">
        {story.title}
      </Text>
    </Pressable>
  )
}
