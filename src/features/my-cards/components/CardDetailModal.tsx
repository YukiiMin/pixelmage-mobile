import { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator , TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { DeviceMotion } from 'expo-sensors'
import Animated, { useSharedValue, withSpring, useAnimatedStyle, useReducedMotion } from 'react-native-reanimated'
import { Svg, LinearGradient, Rect, Stop } from 'react-native-svg'
import { useCardDetail } from '../hooks/useCardDetail'
import { useUnlinkRequest } from '../hooks/useUnlinkRequest'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { secureStore } from '@/api/secureStore'
import { fonts, colors, rarityConfig } from '@/theme/index'

export function CardDetailModal({ templateId }: { templateId: number }) {
  const [userId, setUserId] = useState<number | null>(null)
  useEffect(() => {
    secureStore.get('userId').then(id => {
      if (id) setUserId(Number(id))
    })
  }, [])

  const { data: card, isLoading } = useCardDetail(templateId, userId)
  const unlinkRequest = useUnlinkRequest()
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false)
  const [showPendingState, setShowPendingState] = useState(false)
  const prefersReduced = useReducedMotion()
  
  const tiltX = useSharedValue(0)
  const tiltY = useSharedValue(0)

  useEffect(() => {
    if (prefersReduced) return
    const sub = DeviceMotion.addListener(({ rotation }) => {
      // Rotation in radians -> convert logic for tilt mapping
      tiltX.value = withSpring(rotation.beta * 10)  // front-back 
      tiltY.value = withSpring(rotation.gamma * 10) // left-right
    })
    DeviceMotion.setUpdateInterval(16)
    return () => {
      sub.remove()
    }
  }, [prefersReduced, tiltX, tiltY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
    ],
  }))

  const shimmerStyle = useAnimatedStyle(() => {
    const magnitude = Math.min(Math.abs(tiltX.value) + Math.abs(tiltY.value), 20)
    return {
      opacity: (magnitude / 20) * 0.5,
    }
  })

  if (isLoading || !card) {
    return (
      <View className="flex-1 bg-[#0A0D1E] justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const rarity = rarityConfig[card.cardTemplate.rarity]
  const isLegendary = card.cardTemplate.rarity === 'LEGENDARY'

  return (
    <View className="flex-1 bg-[#0A0D1E] items-center justify-center p-6">
      <Animated.View 
        style={[
          animatedStyle,
          {
            width: '100%',
            aspectRatio: 2.5/3.5,
            backgroundColor: 'rgba(26, 32, 64, 0.85)',
            borderColor: rarity.border,
            borderWidth: isLegendary ? 3 : 1,
            borderRadius: 20,
            overflow: 'hidden',
          },
          rarity.glow as import('react-native').ViewStyle
        ]}
      >
        <Image 
          source={{ uri: card.cardTemplate.imageUrl }}
          className="w-full h-[60%]"
          contentFit="cover"
        />
        
        {/* Hologram Shimmer layer for Legendary */}
        {isLegendary && (
          <Animated.View style={[shimmerStyle]} className="absolute top-0 left-0 right-0 bottom-[40%]">
            <Svg height="100%" width="100%">
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#D4B857" stopOpacity="0.8" />
                <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.2" />
                <Stop offset="1" stopColor="#D4B857" stopOpacity="0.8" />
              </LinearGradient>
              <Rect width="100%" height="100%" fill="url(#grad)" />
            </Svg>
          </Animated.View>
        )}

        <View className="flex-1 p-4 bg-black/50">
          <Text style={{ fontFamily: fonts.heading, color: colors.primary }} className="text-2xl mb-1">
            {card.cardTemplate.name}
          </Text>
          <Text style={{ fontFamily: fonts.stats, color: rarity.color }} className="text-sm font-bold mb-3 uppercase tracking-wider">
            {rarity.label} • {card.cardTemplate.collection.name}
          </Text>
          <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-sm leading-5">
            {card.cardTemplate.description}
          </Text>

          {/* Pending state OR Unlink button */}
          {showPendingState ? (
            <View className="mt-4 p-3 rounded bg-[#1A1A24] border border-border">
              <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted }} className="text-center text-sm">
                ⏳ Yêu cầu hủy đang chờ phê duyệt
              </Text>
            </View>
          ) : (
            card.nfcUid && (
              <TouchableOpacity
                onPress={() => setShowUnlinkConfirm(true)}
                className="mt-4 py-3 rounded-lg border border-border flex-row items-center justify-center bg-error/10"
              >
                <Text style={{ fontFamily: fonts.bodyMedium, color: colors.error }} className="text-base text-center">
                  Yêu cầu hủy liên kết
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </Animated.View>

      <ConfirmModal
        visible={showUnlinkConfirm}
        title="Hủy liên kết thẻ"
        body="Yêu cầu hủy liên kết sẽ cần Staff phê duyệt. Bạn có chắc muốn tiếp tục?"
        confirmLabel="Gửi yêu cầu"
        onConfirm={() => {
          if (card.nfcUid) {
            unlinkRequest.mutate(card.nfcUid, {
              onSuccess: () => {
                setShowUnlinkConfirm(false)
                setShowPendingState(true)
              },
              onError: () => {
                // 409 handled in hook with Toast
                setShowUnlinkConfirm(false)
              }
            })
          }
        }}
        onCancel={() => setShowUnlinkConfirm(false)}
        loading={unlinkRequest.isPending}
      />
    </View>
  )
}
