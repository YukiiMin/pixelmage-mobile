import { View, Text, Pressable } from 'react-native'
import { useState } from 'react'
import { PackList } from '@/features/marketplace/components/PackList'
import { CardTemplateGrid } from '@/features/marketplace/components/CardTemplateGrid'
import { colors, fonts } from '@/theme/index'

export default function MarketplaceScreen() {
  const [tab, setTab] = useState<'PACKS' | 'CARDS'>('PACKS')

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="px-5 pt-12 pb-2 border-b border-border shadow-sm" style={{ backgroundColor: colors.surface }}>
        <Text style={{ fontFamily: fonts.heading, color: colors.primary, fontSize: 24, paddingBottom: 10 }}>Cửa hàng</Text>
        <View className="flex-row mt-2">
          <Pressable 
            onPress={() => setTab('PACKS')}
            className={`flex-1 py-2 items-center border-b-2 ${tab === 'PACKS' ? 'border-[#D4B857]' : 'border-transparent'}`}
          >
            <Text style={{ fontFamily: fonts.stats, color: tab === 'PACKS' ? colors.primary : colors.textMuted }}>PACKS</Text>
          </Pressable>
          <Pressable 
            onPress={() => setTab('CARDS')}
            className={`flex-1 py-2 items-center border-b-2 ${tab === 'CARDS' ? 'border-[#D4B857]' : 'border-transparent'}`}
          >
            <Text style={{ fontFamily: fonts.stats, color: tab === 'CARDS' ? colors.primary : colors.textMuted }}>DANH MỤC THẺ</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        {tab === 'PACKS' ? <PackList /> : <CardTemplateGrid />}
      </View>
    </View>
  )
}
