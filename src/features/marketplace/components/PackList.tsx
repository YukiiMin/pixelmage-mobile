import { View, Text, FlatList, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { usePacks } from '@/features/marketplace/hooks/usePacks'
import { colors, fonts } from '@/theme/index'
import type { Pack } from '@/types'

interface PackRowProps {
  pack: Pack
  index: number
}

function PackRow({ pack, index }: PackRowProps) {
  const router = useRouter()
  const isSoldOut = pack.status === 'SOLD'

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/marketplace/[id]',
            params: { id: pack.packId },
          })
        }}
        className={`bg-slate-800/60 rounded-xl overflow-hidden mb-4 border ${
          isSoldOut ? 'border-slate-700/50' : 'border-[#D4B857]/30'
        }`}
        style={{ opacity: isSoldOut ? 0.6 : 1 }}
      >
        <Image
          source={pack.imageUrl ? { uri: pack.imageUrl } : require('../../../../assets/images/placeholder.jpg')}
          className="w-full h-32 bg-slate-700"
          contentFit="cover"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text
              style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 18 }}
              className="flex-1 mr-2"
            >
              {pack.name}
            </Text>
            {isSoldOut ? (
              <View className="bg-slate-700 px-2 py-1 rounded">
                <Text style={{ fontFamily: fonts.stats, color: colors.textMuted, fontSize: 10 }}>
                  HẾT HÀNG
                </Text>
              </View>
            ) : pack.status === 'RESERVED' ? (
              <View className="bg-[#7F50B3]/20 border border-[#7F50B3] px-2 py-1 rounded">
                <Text style={{ fontFamily: fonts.stats, color: colors.secondary, fontSize: 10 }}>
                  LIMITED
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 14 }} className="mb-3">
            Gồm {pack.cardCount} thẻ
          </Text>
          <Text style={{ fontFamily: fonts.stats, color: colors.primary, fontSize: 16 }}>
            {pack.price.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export function PackList() {
  const { data: packs, isLoading } = usePacks()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }}>Đang tải...</Text>
      </View>
    )
  }

  if (!packs || packs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 18 }}>
          Chưa có pack nào
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={packs}
      keyExtractor={(item) => String(item.packId)}
      renderItem={({ item, index }) => <PackRow pack={item} index={index} />}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  )
}
