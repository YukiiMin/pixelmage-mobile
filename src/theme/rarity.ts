import { colors } from './colors'

export const rarityConfig = {
  COMMON: {
    label: 'Common',
    color: colors.textMuted,
    glow: null,
    border: colors.border,
    pulse: false,
  },
  RARE: {
    label: 'Rare',
    color: colors.secondary,
    glow: {
      shadowColor: '#7F50B3',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    border: colors.secondary,
    pulse: false,
  },
  LEGENDARY: {
    label: 'Legendary',
    color: colors.primary,
    glow: {
      shadowColor: '#D4B857',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 8,
    },
    border: colors.primary,
    pulse: true,  // persistent glow pulse — chỉ LEGENDARY
  },
} as const
