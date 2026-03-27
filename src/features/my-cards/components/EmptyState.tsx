import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { fonts, colors } from '@/theme/index'

export function EmptyState() {
  const router = useRouter()
  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text style={{ fontFamily: fonts.heading, color: colors.primary }} className="text-2xl mb-2 text-center">
        Chưa có thẻ nào
      </Text>
      <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-base text-center mb-8">
        Scan thẻ NFC vật lý để bắt đầu bộ sưu tập của bạn
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(modals)/nfc-scan')}
        className="px-6 py-3 rounded-full flex-row items-center border border-[#7F50B3] bg-[rgba(26,32,64,0.85)]"
      >
        <Text style={{ fontFamily: fonts.stats, color: colors.accent }} className="text-base font-bold">
          📲 Scan NFC ngay
        </Text>
      </TouchableOpacity>
    </View>
  )
}
