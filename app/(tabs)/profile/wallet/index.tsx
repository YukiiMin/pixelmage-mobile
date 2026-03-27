import { WalletScreen } from '@/features/wallet/components/WalletScreen'
import { secureStore } from '@/api/secureStore'
import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '@/theme/index'

export default function WalletIndex() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    secureStore.get('userId').then(id => {
      if (id) setUserId(Number(id))
    })
  }, [])

  if (!userId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return <WalletScreen userId={userId} />
}
