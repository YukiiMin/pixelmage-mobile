import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useWallet } from '../hooks/useWallet'
import { useVouchers } from '../hooks/useVouchers'
import { useExchangePoints } from '../hooks/useExchangePoints'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { colors, fonts } from '@/theme/index'

export function WalletScreen({ userId }: { userId: number }) {
  const { data: walletData, isLoading: walletLoading } = useWallet(userId)
  const { data: vouchers, isLoading: vouchersLoading } = useVouchers(userId)
  const exchangeMutation = useExchangePoints(userId)

  const [confirmVisible, setConfirmVisible] = useState(false)

  if (walletLoading || vouchersLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const balance = walletData?.balance || 0
  const canExchange = balance >= 1000

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <View
        className="rounded-xl border border-border/50 p-6 items-center mb-6"
        style={{ backgroundColor: 'rgba(26, 32, 64, 0.85)' }}
      >
        <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-sm mb-2 uppercase tracking-wide">
          Số dư PixelMage
        </Text>
        <Text style={{ fontFamily: fonts.stats, color: colors.primary }} className="text-5xl mb-4">
          {balance.toLocaleString()} pts
        </Text>
        <TouchableOpacity
          disabled={!canExchange || exchangeMutation.isPending}
          onPress={() => setConfirmVisible(true)}
          className={`px-6 py-3 rounded-lg items-center ${!canExchange ? 'opacity-50' : ''}`}
          style={{ backgroundColor: colors.primary }}
        >
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.background }} className="text-base">
            Đổi 1000 điểm → 1 Voucher
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontFamily: fonts.heading, color: colors.text }} className="text-2xl mb-4">
        Voucher Của Bạn
      </Text>

      {vouchers && vouchers.length > 0 ? (
        vouchers.map((v) => (
          <View
            key={v.voucherId}
            className="rounded-xl border border-border/50 p-4 mb-3"
            style={{ backgroundColor: 'rgba(26, 32, 64, 0.6)' }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text }} className="text-lg">
                Giảm {v.discountPercent}%
              </Text>
              {v.isUsed ? (
                <View className="bg-border px-2 py-1 rounded">
                  <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-xs">Đã dùng</Text>
                </View>
              ) : (
                <View className="bg-primary/20 px-2 py-1 rounded border border-primary/50">
                  <Text style={{ fontFamily: fonts.body, color: colors.primary }} className="text-xs">Chưa dùng</Text>
                </View>
              )}
            </View>
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-sm">
              Mã: <Text style={{ fontFamily: fonts.stats, color: colors.text }}>{v.code}</Text>
            </Text>
            <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-sm">
              Hết hạn: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-center mt-4">
          Bạn chưa có voucher nào. Đổi điểm để nhận thẻ giảm giá nhé!
        </Text>
      )}

      <ConfirmModal
        visible={confirmVisible}
        title="Xác nhận đổi điểm"
        body="Bạn có chắc muốn đổi 1.000 điểm PM lấy 1 voucher giảm giá?"
        onConfirm={() => {
          exchangeMutation.mutate()
          setConfirmVisible(false)
        }}
        onCancel={() => setConfirmVisible(false)}
        loading={exchangeMutation.isPending}
      />
    </ScrollView>
  )
}
