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
        className="p-4 rounded-xl relative"
        style={{
          backgroundColor: 'rgba(26, 32, 64, 0.85)',
          borderColor: isCompleted ? colors.primary : colors.border,
          borderWidth: 1,
        }}
      >
        <Text style={{ fontFamily: fonts.heading, color: isCompleted ? colors.primary : colors.text }} className="text-xl">
          {collection.name}
        </Text>
        
        {isCompleted && (
          <View className="absolute top-4 right-4 bg-[#D4B857] px-2 py-1 rounded-sm">
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
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }} className="text-xs">
          {ownedCards}/{collection.totalCards} thẻ
        </Text>
      </View>
    </Pressable>
  )
}
