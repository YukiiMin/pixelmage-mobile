import React from 'react'
import * as Haptics from 'expo-haptics'
import { PlatformPressable } from '@react-navigation/elements'

/**
 * A bottom tab button that triggers a light haptic feedback on press.
 * Drop-in replacement for the default Tabs button.
 */
export function HapticTab(props: React.ComponentProps<typeof PlatformPressable>) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        props.onPressIn?.(ev)
      }}
    />
  )
}
