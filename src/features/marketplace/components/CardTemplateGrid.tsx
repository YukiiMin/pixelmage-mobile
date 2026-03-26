import { View, Text, FlatList, Pressable } from 'react-native'
import { useState } from 'react'
import { useCardTemplates } from '@/features/marketplace/hooks/useCardTemplates'
import { CardThumbnail } from '@/features/my-cards/components/CardThumbnail'
import { colors, fonts, rarityConfig } from '@/theme/index'

export function CardTemplateGrid() {
  const { data: templates, isLoading } = useCardTemplates()
  const [filter, setFilter] = useState<'ALL' | 'COMMON' | 'RARE' | 'LEGENDARY'>('ALL')

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }}>Đang tải...</Text>
      </View>
    )
  }

  const filtered = templates?.filter(t => filter === 'ALL' || t.rarity === filter) || []

  return (
    <View className="flex-1">
      {/* Filters */}
      <View className="flex-row px-4 py-3">
        {(['ALL', 'COMMON', 'RARE', 'LEGENDARY'] as const).map(f => {
          const isSelected = filter === f
          const activeColor = f === 'ALL' ? colors.primary : rarityConfig[f].color
          
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              className="mr-2 px-3 py-1.5 rounded-full border"
              style={{
                borderColor: isSelected ? activeColor : colors.border,
                backgroundColor: isSelected ? `${activeColor}20` : 'transparent'
              }}
            >
              <Text 
                style={{ 
                  fontFamily: fonts.stats, 
                  color: isSelected ? activeColor : colors.textMuted,
                  fontSize: 12
                }}
              >
                {f}
              </Text>
            </Pressable>
          )
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.cardTemplateId)}
        numColumns={2}
        renderItem={({ item }) => <CardThumbnail template={item} onPress={() => {}} />}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  )
}

