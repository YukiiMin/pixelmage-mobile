import { View, Text, FlatList, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { FileText, Package } from 'lucide-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useOrders } from '@/features/marketplace/hooks/useOrders'
import { colors, fonts } from '@/theme/index'
import type { Order, OrderStatus } from '@/types'

interface Props {
  customerId: number | null
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: colors.accent,
  PROCESSING: colors.primary,
  COMPLETED: colors.success,
  CANCELLED: colors.error,
}

const statusText: Record<OrderStatus, string> = {
  PENDING: 'Chờ thanh toán',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const router = useRouter()
  const statusColor = statusColors[order.status]

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/(modals)/order-detail',
            params: { id: order.orderId },
          })
        }}
        className="bg-slate-800/40 rounded-xl p-4 mb-3 border border-slate-700/50"
      >
        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center">
            <FileText size={16} color={colors.textMuted} className="mr-2" />
            <Text style={{ fontFamily: fonts.stats, color: colors.text, fontSize: 13 }}>
              #{order.orderId}
            </Text>
          </View>
          <View className="px-2 py-0.5 rounded" style={{ backgroundColor: `${statusColor}20` }}>
            <Text style={{ fontFamily: fonts.stats, color: statusColor, fontSize: 11 }}>
              {statusText[order.status]}
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-end mt-2">
          <View>
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 12 }} className="mb-1">
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </Text>
            <View className="flex-row items-center">
              <Package size={14} color={colors.textMuted} className="mr-1" />
              <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 12 }}>
                {order.items.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: fonts.stats, color: colors.primary, fontSize: 16 }}>
            {order.totalPrice.toLocaleString('vi-VN')} đ
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export function OrderList({ customerId }: Props) {
  const { data: orders, isLoading } = useOrders(customerId)

  if (!customerId) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontFamily: fonts.body, color: colors.textMuted }}>
          Đăng nhập để xem lịch sử đơn hàng
        </Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontFamily: fonts.stats, color: colors.textMuted }}>Đang tải...</Text>
      </View>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <FileText size={48} color={colors.textMuted} />
        <Text style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 18 }} className="mt-4">
          Chưa có đơn hàng nào
        </Text>
      </View>
    )
  }

  // Sort by date desc implicitly assumed if BE returns it, else we probably should format
  // MVP: just render the array

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => String(item.orderId)}
      renderItem={({ item, index }) => <OrderRow order={item} index={index} />}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  )
}
