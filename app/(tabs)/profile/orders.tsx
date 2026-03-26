import { OrderList } from '@/features/marketplace/components/OrderList'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { colors, fonts } from '@/theme/index'
import { secureStore } from '@/api/secureStore'
import { useEffect, useState } from 'react'

export default function OrdersScreen() {
  const router = useRouter()
  const [customerId, setCustomerId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then(id => {
      setCustomerId(id ? parseInt(id, 10) : null)
    })
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-row items-center p-4 pt-12 border-b border-border shadow-sm" style={{ backgroundColor: colors.surface }}>
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 20 }} className="ml-3">
          Lịch sử đơn hàng
        </Text>
      </View>
      
      <OrderList customerId={customerId} />
    </View>
  )
}
