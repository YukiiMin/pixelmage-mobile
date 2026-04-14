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
      <View className="flex-row px-4 py-4">
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
        columnWrapperStyle={{ paddingHorizontal: 8, justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        ListHeaderComponent={<View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View
            className="mx-4 mt-6 rounded-2xl border px-6 py-8"
            style={{ backgroundColor: colors.surface, borderColor: colors.borderMuted }}
          >
            <Text className="text-center text-xl" style={{ fontFamily: fonts.heading, color: colors.text }}>
              Không có thẻ phù hợp
            </Text>
            <Text className="mt-2 text-center" style={{ fontFamily: fonts.body, color: colors.textMuted }}>
              Hãy thử đổi bộ lọc độ hiếm để xem thêm thẻ.
            </Text>
          </View>
        }
      />
    </View>
  )
}

