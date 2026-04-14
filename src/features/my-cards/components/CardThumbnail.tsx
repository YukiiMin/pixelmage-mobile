import { colors, fonts, rarityConfig } from '@/theme/index'
import type { UserInventory } from '@/types/my-cards'
import type { MarketCardTemplate } from '@/types'
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
  card?: UserInventory
  template?: MarketCardTemplate
  onPress: () => void
}

export function CardThumbnail({ card, template, onPress }: Props) {
  const itemTemplate = template ?? card?.cardTemplate
  const isLegendary = itemTemplate?.rarity === 'LEGENDARY'

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
    if (!itemTemplate) return {}
    const rarity = rarityConfig[itemTemplate.rarity]
    if (!isLegendary || !rarity.glow) return {}
    return {
      shadowOpacity: rarity.glow.shadowOpacity * pulseAnim.value,
      shadowRadius: rarity.glow.shadowRadius * pulseAnim.value,
    }
  })

  if (!itemTemplate) return null
  const rarity = rarityConfig[itemTemplate.rarity]

  return (
    <Pressable onPress={onPress} style={{ width: '100%', padding: 8 }}>
      <Animated.View
        style={[
          {
            width: '100%',
            aspectRatio: 2.5 / 3.5,
            minHeight: 168,
            borderColor: rarity.border,
            borderWidth: isLegendary ? 2 : 1,
            backgroundColor: colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
          },
          rarity.glow && !isLegendary ? (rarity.glow as import('react-native').ViewStyle) : {},
          animatedGlowStyle,
        ]}
      >
        <Image
          source={
            itemTemplate.imageUrl
              ? { uri: itemTemplate.imageUrl }
              : require('../../../../assets/images/placeholder.jpg')
          }
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
        <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/70">
          <Text
            style={{ fontFamily: fonts.heading }}
            className="text-white text-sm"
            numberOfLines={1}
          >
            {itemTemplate.name}
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
