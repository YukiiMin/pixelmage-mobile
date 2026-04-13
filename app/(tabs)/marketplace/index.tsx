import { View, Text, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import * as Linking from 'expo-linking'
import { useQueryClient } from '@tanstack/react-query'
import { PackList } from '@/features/marketplace/components/PackList'
import { CardTemplateGrid } from '@/features/marketplace/components/CardTemplateGrid'
import { useToastStore } from '@/store/useToastStore'
import { colors, fonts } from '@/theme/index'

export default function MarketplaceScreen() {
  const [tab, setTab] = useState<'PACKS' | 'CARDS'>('PACKS')
  const { showToast } = useToastStore()
  const queryClient = useQueryClient()

  // ─── Deep Link return handler ─────────────────────────────────────
  // The Web App redirects back to the mobile app after SEPay payment via:
  //   pixelmage://marketplace?payment=success&orderId=123
  //   pixelmage://marketplace?payment=failed&reason=...
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url)
      const payment = parsed.queryParams?.payment

      if (payment === 'success') {
        showToast('🎉 Thanh toán thành công! Pack đang được xử lý.', 'success')
        // Invalidate relevant queries so Order History and Inventory reflect the new state
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['inventory'] })
        queryClient.invalidateQueries({ queryKey: ['myCards'] })
      } else if (payment === 'failed') {
        const reason = typeof parsed.queryParams?.reason === 'string'
          ? parsed.queryParams.reason
          : 'Vui lòng thử lại.'
        showToast(`Thanh toán thất bại: ${reason}`, 'error')
      }
    })

    return () => subscription.remove()
  }, [showToast, queryClient])
  // ─────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="border-b border-border px-4 pb-3 pt-10" style={{ backgroundColor: colors.surface }}>
        <Text
          style={{ fontFamily: fonts.heading, color: colors.primary, fontSize: 40, lineHeight: 44 }}
          className="pb-3"
        >
          Cửa hàng
        </Text>
        <View className="mt-1 flex-row">
          <Pressable 
            onPress={() => setTab('PACKS')}
            style={{ borderBottomColor: tab === 'PACKS' ? colors.primary : 'transparent', borderBottomWidth: 2 }}
            className="flex-1 items-center py-2"
          >
            <Text style={{ fontFamily: fonts.stats, color: tab === 'PACKS' ? colors.primary : colors.textMuted, fontSize: 14 }}>
              PACKS
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => setTab('CARDS')}
            style={{ borderBottomColor: tab === 'CARDS' ? colors.primary : 'transparent', borderBottomWidth: 2 }}
            className="flex-1 items-center py-2"
          >
            <Text style={{ fontFamily: fonts.stats, color: tab === 'CARDS' ? colors.primary : colors.textMuted, fontSize: 14 }}>
              DANH MỤC THẺ
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        {tab === 'PACKS' ? <PackList /> : <CardTemplateGrid />}
      </View>
    </View>
  )
}
