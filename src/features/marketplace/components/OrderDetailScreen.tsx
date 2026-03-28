import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { ArrowLeft, FileText, Package } from 'lucide-react-native'
import { useOrderDetail } from '@/features/marketplace/hooks/useOrderDetail'
import { colors, fonts } from '@/theme/index'
import type { OrderStatus } from '@/types'

interface Props {
  orderId: number
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

export function OrderDetailScreen({ orderId }: Props) {
  const router = useRouter()
  const { data: order, isLoading, isError } = useOrderDetail(orderId)

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (isError || !order) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ fontFamily: fonts.heading, color: colors.textMuted, fontSize: 18 }}>
          Không tìm thấy đơn hàng
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text style={{ fontFamily: fonts.body, color: colors.primary }}>Đóng</Text>
        </Pressable>
      </View>
    )
  }

  const statusColor = statusColors[order.status]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-border shadow-sm" style={{ backgroundColor: colors.surface }}>
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 20 }} className="ml-3">
          Chi tiết đơn hàng
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View className="bg-slate-800/40 rounded-xl p-5 mb-6 border border-slate-700/50">
          <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
            <View className="flex-row items-center">
              <FileText size={20} color={colors.textMuted} className="mr-2" />
              <Text style={{ fontFamily: fonts.stats, color: colors.text, fontSize: 16 }}>
                Đơn #{order.orderId}
              </Text>
            </View>
            <View className="px-3 py-1 rounded" style={{ backgroundColor: `${statusColor}20` }}>
              <Text style={{ fontFamily: fonts.stats, color: statusColor, fontSize: 12 }}>
                {statusText[order.status]}
              </Text>
            </View>
          </View>

          <View className="flex-row mb-2">
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted, flex: 1 }}>Ngày đặt:</Text>
            <Text style={{ fontFamily: fonts.body, color: colors.text, flex: 2, textAlign: 'right' }}>
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Text>
          </View>
          <View className="flex-row mb-2">
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted, flex: 1 }}>Thanh toán:</Text>
            <Text style={{ fontFamily: fonts.body, color: colors.text, flex: 2, textAlign: 'right' }}>
              Web Checkout
            </Text>
          </View>
        </View>

        {/* Items */}
        <Text style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 18 }} className="mb-4">
          Sản phẩm
        </Text>
        <View className="bg-slate-800/40 rounded-xl px-4 py-2 border border-slate-700/50 mb-6">
          {order.items.map((item, index) => (
            <View 
              key={item.orderItemId} 
              className={`py-4 flex-row items-center ${index < order.items.length - 1 ? 'border-b border-slate-700/50' : ''}`}
            >
              <View className="w-12 h-12 bg-slate-700 rounded items-center justify-center mr-4 overflow-hidden">
                {item.pack.imageUrl ? (
                  <Image source={{ uri: item.pack.imageUrl }} className="w-full h-full" contentFit="cover" />
                ) : (
                  <Package size={24} color={colors.textMuted} />
                )}
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text, fontSize: 15 }} className="mb-1">
                  {item.pack.name}
                </Text>
                <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 13 }}>
                  SL: {item.quantity} x {item.unitPrice.toLocaleString('vi-VN')} đ
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.stats, color: colors.text, fontSize: 15 }}>
                {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          ))}
        </View>

        {/* Total Summary */}
        <View className="bg-slate-800/60 rounded-xl p-5 border border-[#D4B857]/30">
          <View className="flex-row justify-between items-center mb-2">
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: 14 }}>Tạm tính</Text>
            <Text style={{ fontFamily: fonts.stats, color: colors.text, fontSize: 14 }}>
              {order.totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          <View className="h-px bg-slate-700 my-3" />
          <View className="flex-row justify-between items-center">
            <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text, fontSize: 16 }}>Tổng cộng</Text>
            <Text style={{ fontFamily: fonts.stats, color: colors.primary, fontSize: 24 }}>
              {order.totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
