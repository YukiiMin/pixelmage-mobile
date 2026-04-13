import { View, Text, Pressable } from 'react-native'
import type { Collection, CollectionProgress } from '@/types/collection'
import { ProgressBar } from './ProgressBar'
import { fonts, colors } from '@/theme/index'

interface Props {
  collection: Collection
  progress?: CollectionProgress
  onPress: () => void
}

export function CollectionCard({ collection, progress, onPress }: Props) {
  const ownedCards = progress?.ownedCards ?? 0
  const isCompleted = progress?.isCompleted ?? false

  return (
    <Pressable onPress={onPress} className="mb-4">
      <View 
        className="relative rounded-2xl p-5"
        style={{
          backgroundColor: colors.surface,
          borderColor: isCompleted ? colors.primary : colors.border,
          borderWidth: 1,
        }}
      >
        <Text
          style={{ fontFamily: fonts.heading, color: isCompleted ? colors.primary : colors.text }}
          className="text-[30px]"
          numberOfLines={1}
        >
          {collection.name}
        </Text>
        
        {isCompleted && (
          <View className="absolute right-4 top-4 rounded-md px-2 py-1" style={{ backgroundColor: colors.primary }}>
            <Text style={{ fontFamily: fonts.stats, color: colors.background }} className="text-xs font-bold uppercase">
              ✓ Hoàn thành
            </Text>
          </View>
        )}

        <ProgressBar
          value={ownedCards}
          max={collection.totalCards}
          color={isCompleted ? colors.primary : colors.accent}
        />
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }} className="mt-1 text-xs">
          {ownedCards}/{collection.totalCards} thẻ
        </Text>
      </View>
    </Pressable>
  )
}
