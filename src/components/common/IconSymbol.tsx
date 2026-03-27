/**
 * Fallback for using MaterialIcons on Android and web.
 * On iOS, uses native SF Symbols via the .ios.tsx sibling.
 */
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type IconMapping = Record<string, keyof typeof MaterialIcons.glyphMap>

const MAPPING: IconMapping = {
  // Tab bar
  'house.fill': 'home',
  'cart.fill': 'shopping-cart',
  'star.fill': 'star',
  'rectangle.portrait.fill': 'style',
  'person.fill': 'person',
  'wrench.fill': 'build',
  // Staff screen
  'creditcard.fill': 'credit-card',
  'clock.arrow.circlepath': 'history',
  // Navigation
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  // Toast
  'exclamationmark.triangle.fill': 'warning',
  'checkmark.circle.fill': 'check-circle',
  'info.circle.fill': 'info',
}

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
}) {
  const iconName = MAPPING[name] ?? 'help-outline'
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />
}
