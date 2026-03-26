import { View, Text, FlatList, Pressable } from 'react-native'
import { Lock, BookOpen } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useStories } from '@/features/collections/hooks/useStories'
import { colors, fonts } from '@/theme/index'
import type { Story } from '@/types'

function StoryRow({ story, index }: { story: Story; index: number }) {
  const router = useRouter()
  const isLocked = !story.isUnlocked

  const handlePress = () => {
    if (isLocked) return
    router.push({
      // @ts-expect-error: dynamic route
      pathname: '/collections/stories/[id]',
      params: { id: story.storyId },
    })
  }

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 60).duration(350)}>
      <Pressable
        onPress={handlePress}
        className={`flex-row items-center p-4 mb-2 rounded-xl border ${
          isLocked
            ? 'border-slate-700/50 bg-slate-800/40'
            : 'border-[#D4B857]/30 bg-[#D4B857]/10'
        }`}
        style={{ opacity: isLocked ? 0.5 : 1 }}
      >
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
            isLocked ? 'bg-slate-700' : 'bg-[#D4B857]/20'
          }`}
        >
          {isLocked ? (
            <Lock size={18} color={colors.textMuted} />
          ) : (
            <BookOpen size={18} color={colors.primary} />
          )}
        </View>
        <View className="flex-1">
          <Text
            style={{
              fontFamily: fonts.heading,
              color: isLocked ? colors.textMuted : colors.primary,
              fontSize: 16,
            }}
            numberOfLines={1}
          >
            {story.title}
          </Text>
          <Text
            style={{ fontFamily: fonts.stats, color: colors.textMuted, fontSize: 11 }}
            className="mt-0.5"
          >
            {isLocked
              ? 'Hoàn thành bộ thẻ để mở'
              : `Bộ sưu tập: ${story.collection.name}`}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

interface Props {
  userId: number | null
}

export function StoriesList({ userId }: Props) {
  const { data: stories, isLoading, isError } = useStories(userId)

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-center">
          Đăng nhập để xem danh sách câu chuyện
        </Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }}>Đang tải...</Text>
      </View>
    )
  }

  if (isError || !stories) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text style={{ fontFamily: fonts.body, color: colors.error }} className="text-center">
          Không thể tải danh sách câu chuyện
        </Text>
      </View>
    )
  }

  if (stories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <BookOpen size={48} color={colors.textMuted} />
        <Text
          style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 18 }}
          className="mt-4 text-center"
        >
          Chưa có câu chuyện nào
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => String(item.storyId)}
      renderItem={({ item, index }) => <StoryRow story={item} index={index} />}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  )
}
