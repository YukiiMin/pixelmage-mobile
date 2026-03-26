import { fonts, rarityConfig } from '@/theme/index'
import type { UserInventory } from '@/types/inventory'
import { Image } from 'expo-image'
import { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  card: UserInventory
  onPress: () => void
}

export function CardThumbnail({ card, onPress }: Props) {
  const rarity = rarityConfig[card.cardTemplate.rarity]
  const isLegendary = card.cardTemplate.rarity === 'LEGENDARY'

  const pulseAnim = useSharedValue(1)

  useEffect(() => {
    if (isLegendary) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1, // infinite
        true // reverse
      )
    }
  }, [isLegendary, pulseAnim])

  const animatedGlowStyle = useAnimatedStyle(() => {
    if (!isLegendary || !rarity.glow) return {}
    return {
      shadowOpacity: rarity.glow.shadowOpacity * pulseAnim.value,
      shadowRadius: rarity.glow.shadowRadius * pulseAnim.value,
    }
  })

  return (
    <Pressable onPress={onPress} className="w-1/2 p-2">
      <Animated.View
        style={[
          {
            borderColor: rarity.border,
            borderWidth: isLegendary ? 2 : 1,
            backgroundColor: 'rgba(26, 32, 64, 0.85)',
          },
          rarity.glow && !isLegendary ? (rarity.glow as any) : {},
          animatedGlowStyle,
        ]}
        className="rounded-xl overflow-hidden aspect-[2.5/3.5] bg-[#0d1126]"
      >
        <Image
          source={{ uri: card.cardTemplate.imageUrl }}
          className="flex-1 w-full"
          contentFit="cover"
          transition={200}
        />
        <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/70">
          <Text
            style={{ fontFamily: fonts.heading }}
            className="text-white text-sm"
            numberOfLines={1}
          >
            {card.cardTemplate.name}
          </Text>
          <Text
            style={{ fontFamily: fonts.stats, color: rarity.color }}
            className="text-xs mt-1"
          >
            {rarity.label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}
