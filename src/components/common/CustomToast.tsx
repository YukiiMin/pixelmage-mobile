import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, { FadeInUp, FadeOutUp, useReducedMotion } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useToastStore } from '@/store/useToastStore'
import { colors, fonts } from '@/theme/index'
import { IconSymbol } from '@/components/ui/icon-symbol'

export function CustomToast() {
  const { visible, message, type, hideToast } = useToastStore()
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (visible) {
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      } else if (type === 'error') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      }
      
      const timer = setTimeout(() => {
        hideToast()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, type, hideToast])

  if (!visible) return null

  // Glassmorphism solid background with colored border
  const getBorderColor = () => {
    switch (type) {
      case 'error': return colors.error
      case 'success': return colors.success
      default: return colors.border
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'error': return <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
      case 'success': return <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
      default: return <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
    }
  }

  return (
    <Animated.View
      entering={prefersReduced ? undefined : FadeInUp.duration(300)}
      exiting={prefersReduced ? undefined : FadeOutUp.duration(300)}
      style={{
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      <View
        className="px-4 py-3 rounded-xl border flex-row items-center"
        style={{ 
          backgroundColor: 'rgba(26, 32, 64, 0.95)',
          borderColor: getBorderColor(),
          borderWidth: 1, 
        }}
      >
        <View className="mr-3">
          {getIcon()}
        </View>
        <Text
          style={{ fontFamily: fonts.bodyMedium, color: colors.text }}
          className="text-base flex-1"
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}
