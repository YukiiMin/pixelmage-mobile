import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { secureStore } from '@/api/secureStore'
import { useAccount } from '@/features/profile/hooks/useAccount'
import { colors, fonts } from '@/theme/index'
import { IconSymbol } from '@/components/common/IconSymbol'
import { useToastStore } from '@/store/useToastStore'

/**
 * Modern Profile Screen
 * Provides navigation to Wallet, Orders, and Account Settings.
 */
export default function ProfileScreen() {
  const router = useRouter()
  const { showToast } = useToastStore()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then(id => {
      if (id) setUserId(Number(id))
    })
  }, [])

  const { data: account, isLoading } = useAccount(userId)

  const handleLogout = async () => {
    await secureStore.clearAll()
    showToast('Đã đăng xuất', 'success')
    router.replace('/(auth)/login')
  }

  if (isLoading || !userId) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const MenuLink = ({ title, icon, href }: { title: string, icon: React.ComponentProps<typeof IconSymbol>['name'], href: string }) => (
    <TouchableOpacity 
      onPress={() => router.push(href as import('expo-router').Href)}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.borderMuted,
      }}
    >
      <IconSymbol name={icon} size={22} color={colors.primary} />
      <Text style={{ 
        flex: 1, 
        marginLeft: 15, 
        fontFamily: fonts.bodyMedium, 
        color: colors.text,
        fontSize: 16
      }}>
        {title}
      </Text>
      <IconSymbol name="chevron.right" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  )

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24, paddingBottom: 40 }}>
        
        {/* Header / Avatar Placeholder */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            backgroundColor: 'rgba(212, 184, 87, 0.14)',
            borderWidth: 2, borderColor: colors.primary,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 16
          }}>
            <IconSymbol name="person.fill" size={50} color={colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.heading, fontSize: 44, lineHeight: 48, color: colors.text }}>
            {account?.name || 'User'}
          </Text>
          <Text style={{ fontFamily: fonts.body, color: colors.textMuted, marginTop: 4 }}>
            {account?.email}
          </Text>
        </View>

        {/* Menu Section */}
        <View>
          <MenuLink title="Ví PixelMage" icon="creditcard.fill" href="/(tabs)/profile/wallet" />
          <MenuLink title="Lịch sử đơn hàng" icon="list.bullet.rectangle.fill" href="/(tabs)/profile/orders" />
          <MenuLink title="Cài đặt tài khoản" icon="gearshape.fill" href="/(tabs)/profile/wallet" />
        </View>

        {/* Logout */}
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ 
            marginTop: 40,
            paddingVertical: 18,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.error,
            borderRadius: 16
          }}
        >
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.error, fontSize: 16 }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
