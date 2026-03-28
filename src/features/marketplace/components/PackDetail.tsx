import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import { ArrowLeft, ShoppingCart } from 'lucide-react-native'
import { usePackDetail } from '@/features/marketplace/hooks/usePackDetail'
import { useCheckoutToken } from '@/features/marketplace/hooks/useCheckoutToken'
import { useToastStore } from '@/store/useToastStore'
import { colors, fonts, rarityConfig } from '@/theme/index'

interface Props {
  packId: number
}

// Hardcoded drop rates as per MVP
const DROP_RATES = [
  { slot: 'Slot 1-3', common: 100, rare: 0, legendary: 0 },
  { slot: 'Slot 4', common: 70, rare: 30, legendary: 0 },
  { slot: 'Slot 5', common: 0, rare: 80, legendary: 20 },
]

export function PackDetail({ packId }: Props) {
  const router = useRouter()
  const { data: pack, isLoading, isError } = usePackDetail(packId)
  const { mutateAsync: getCheckoutToken, isPending: isCheckingOut } = useCheckoutToken()
  const { showToast } = useToastStore()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (isError || !pack) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 18 }}>
          Không tìm thấy pack
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text style={{ fontFamily: fonts.body, color: colors.primary }}>Quay lại</Text>
        </Pressable>
      </View>
    )
  }

  const isSoldOut = pack.status === 'SOLD'

  const onBuyPress = async () => {
    try {
      // 1. Exchange stored JWT for a short-lived, one-use checkout token
      const ct = await getCheckoutToken()

      // 2. Build the checkout URL — encodeURIComponent is REQUIRED because
      //    tokens contain +/= chars that break URL parsing if unescaped.
      const baseUrl = (process.env.EXPO_PUBLIC_WEB_BASE_URL ?? '').replace(/\/$/, '')
      const url = `${baseUrl}/checkout/${pack.packId}?ct=${encodeURIComponent(ct)}`

      // 3. Guard: verify the device can actually open a browser
      const canOpen = await Linking.canOpenURL(url)
      if (!canOpen) {
        showToast('Không thể mở trình duyệt. Vui lòng thử lại.', 'error')
        return
      }

      await Linking.openURL(url)
    } catch {
      showToast('Không thể khởi tạo phiên thanh toán. Vui lòng thử lại.', 'error')
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <Image
        source={pack.imageUrl ? { uri: pack.imageUrl } : require('@/assets/images/placeholder.jpg')}
        className="w-full h-64 bg-slate-800"
        contentFit="cover"
      />
      
      <Pressable 
        onPress={() => router.back()} 
        className="absolute top-12 left-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
      >
        <ArrowLeft size={20} color={colors.text} />
      </Pressable>

      <View className="p-5">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-4">
            <Text style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 24 }}>
              {pack.name}
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ fontFamily: fonts.stats, color: colors.primary, fontSize: 20 }}>
              {pack.price.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>

        <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 15, lineHeight: 22 }} className="mb-6">
          {pack.description}
        </Text>

        {/* Drop Rate Table */}
        <View className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-700/50">
          <Text style={{ fontFamily: fonts.stats, color: colors.text, fontSize: 14 }} className="mb-3">
            TỶ LỆ RƠI THẺ (DROP RATE)
          </Text>
          
          <View className="flex-row border-b border-slate-700 pb-2 mb-2">
            <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, flex: 2 }}>Slot</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, color: rarityConfig.COMMON.color, flex: 1, textAlign: 'center' }}>C</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, color: rarityConfig.RARE.color, flex: 1, textAlign: 'center' }}>R</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, color: rarityConfig.LEGENDARY.color, flex: 1, textAlign: 'center' }}>L</Text>
          </View>

          {DROP_RATES.map((rate, i) => (
            <View key={i} className="flex-row py-2 border-b border-slate-700/50 last:border-0">
              <Text style={{ fontFamily: fonts.body, color: colors.text, flex: 2 }}>{rate.slot}</Text>
              <Text style={{ fontFamily: fonts.stats, color: colors.text, flex: 1, textAlign: 'center' }}>
                {rate.common > 0 ? `${rate.common}%` : '-'}
              </Text>
              <Text style={{ fontFamily: fonts.stats, color: colors.text, flex: 1, textAlign: 'center' }}>
                {rate.rare > 0 ? `${rate.rare}%` : '-'}
              </Text>
              <Text style={{ fontFamily: fonts.stats, color: colors.text, flex: 1, textAlign: 'center' }}>
                {rate.legendary > 0 ? `${rate.legendary}%` : '-'}
              </Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={onBuyPress}
          disabled={isSoldOut || isCheckingOut}
          className={`flex-row items-center justify-center p-4 rounded-xl ${
            isSoldOut || isCheckingOut ? 'bg-slate-700' : 'bg-[#D4B857]'
          }`}
        >
          {isCheckingOut ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <ShoppingCart size={20} color={isSoldOut ? colors.textMuted : colors.background} className="mr-2" />
              <Text
                style={{ fontFamily: fonts.bodyMedium, color: isSoldOut ? colors.textMuted : colors.background, fontSize: 16 }}
              >
                {isSoldOut ? 'HẾT HÀNG' : 'MUA PACK (WEB)'}
              </Text>
            </>
          )}
        </Pressable>
        <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 12, textAlign: 'center' }} className="mt-3">
          Sẽ chuyển hướng tới giao diện Web để thanh toán an toàn
        </Text>
      </View>
    </ScrollView>
  )
}
