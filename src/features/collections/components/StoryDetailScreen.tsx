import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Lock, ArrowLeft } from 'lucide-react-native'
import type { ApiError } from '@/api/client'
import { useStoryDetail } from '@/features/collections/hooks/useStoryDetail'
import { colors, fonts } from '@/theme/index'

interface Props {
  storyId: number
  userId: number | null
}

export function StoryDetailScreen({ storyId, userId }: Props) {
  const router = useRouter()
  const { data: story, isLoading, isError, error } = useStoryDetail(storyId, userId)

  const apiError = error as ApiError | null
  const status = apiError?.status

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }} className="mt-4">
          Đang tải nội dung...
        </Text>
      </View>
    )
  }

  // 403 — Locked story — KHÔNG generic
  if (isError && status === 403) {
    return (
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-6"
          style={{
            backgroundColor: 'rgba(127, 80, 179, 0.15)',
            borderWidth: 1,
            borderColor: colors.secondary,
          }}
        >
          <Lock size={40} color={colors.secondary} />
        </View>
        <Text
          style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 22 }}
          className="text-center mb-3"
        >
          Nội dung đã khoá
        </Text>
        <Text
          style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 15 }}
          className="text-center mb-8 leading-6"
        >
          Hoàn thành bộ thẻ để truy cập nội dung này
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/index' as never)}
          className="px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.primary }}
        >
          <Text
            style={{ fontFamily: fonts.bodyMedium, color: colors.background, fontSize: 15 }}
          >
            Xem bộ sưu tập
          </Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="mt-4 px-6 py-2">
          <Text style={{ fontFamily: fonts.body, color: colors.textMuted }}>Quay lại</Text>
        </Pressable>
      </View>
    )
  }

  // 404 or generic error
  if (isError || !story) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 20 }}
          className="text-center"
        >
          Không tìm thấy câu chuyện
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text style={{ fontFamily: fonts.body, color: colors.primary }}>Quay lại</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back nav */}
      <Pressable onPress={() => router.back()} className="flex-row items-center mb-6 -ml-1">
        <ArrowLeft size={20} color={colors.textMuted} />
        <Text
          style={{ fontFamily: fonts.stats, color: colors.textMuted, fontSize: 13 }}
          className="ml-1"
        >
          Câu chuyện
        </Text>
      </Pressable>

      {/* Collection tag */}
      <View
        className="self-start px-3 py-1 rounded-md mb-4"
        style={{
          backgroundColor: 'rgba(213, 184, 87, 0.12)',
          borderWidth: 1,
          borderColor: 'rgba(213, 184, 87, 0.3)',
        }}
      >
        <Text style={{ fontFamily: fonts.stats, color: colors.primary, fontSize: 11 }}>
          {story.collection.name}
        </Text>
      </View>

      {/* Title */}
      <Text
        style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 28, lineHeight: 36 }}
        className="mb-6"
      >
        {story.title}
      </Text>

      {/* Unlocked date */}
      {story.unlockedAt && (
        <Text
          style={{ fontFamily: fonts.stats, color: colors.textMuted, fontSize: 12 }}
          className="mb-6"
        >
          Mở khoá lúc {new Date(story.unlockedAt).toLocaleDateString('vi-VN')}
        </Text>
      )}

      {/* Divider */}
      <View className="h-px mb-6" style={{ backgroundColor: colors.border }} />

      {/* Content */}
      <Text
        style={{
          fontFamily: fonts.body,
          color: colors.text,
          fontSize: 16,
          lineHeight: 26,
        }}
      >
        {story.content}
      </Text>
    </ScrollView>
  )
}
