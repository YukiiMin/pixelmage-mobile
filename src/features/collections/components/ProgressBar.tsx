import { View } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useSharedValue } from 'react-native-reanimated'

interface Props {
  value: number
  max: number
  color: string
}

export function ProgressBar({ value, max, color }: Props) {
  const progressPercent = max > 0 ? (value / max) * 100 : 0
  const animatedWidth = useSharedValue(0)

  useEffect(() => {
    animatedWidth.value = withSpring(progressPercent, {
      damping: 20,
      stiffness: 90,
    })
  }, [progressPercent, animatedWidth])

  const style = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
      backgroundColor: color,
    }
  })

  return (
    <View className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-2">
      <Animated.View style={[style, { height: '100%' }]} />
    </View>
  )
}
