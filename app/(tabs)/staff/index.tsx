import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, fonts } from '@/theme/index'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useUserRole } from '@/hooks/useUserRole'

export default function StaffIndexScreen() {
  const router = useRouter()
  const { isStaff, loading } = useUserRole()

  if (loading) return null
  if (!isStaff) {
    router.replace('/(tabs)')
    return null
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: colors.text, marginBottom: 8, marginTop: 40 }}>
        Staff Dashboard
      </Text>
      <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, marginBottom: 24, fontSize: 16 }}>
        Công cụ nội bộ
      </Text>

      <TouchableOpacity 
        style={{ backgroundColor: colors.surface, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderColor: colors.border, borderWidth: 1 }}
        onPress={() => router.push('/(tabs)/staff/bind' as Exclude<React.ComponentProps<typeof TouchableOpacity>['onPress'], undefined> | any)}
      >
        <IconSymbol name="creditcard.fill" size={32} color={colors.primary} />
        <View style={{ marginLeft: 16 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: colors.text }}>NFC Bind Flow</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 14 }}>Khởi tạo và gán thẻ vật lý</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ backgroundColor: colors.surface, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderColor: colors.border, borderWidth: 1 }}
        onPress={() => router.push('/(tabs)/staff/unlink-requests' as Exclude<React.ComponentProps<typeof TouchableOpacity>['onPress'], undefined> | any)}
      >
        <IconSymbol name="clock.arrow.circlepath" size={32} color={colors.primary} />
        <View style={{ marginLeft: 16 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: colors.text }}>Yêu cầu hủy liên kết</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, fontSize: 14 }}>Phê duyệt yêu cầu từ khách</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
