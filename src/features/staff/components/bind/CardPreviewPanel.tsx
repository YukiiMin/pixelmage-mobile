import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { CardInfo } from '@/types/card'
import { colors, fonts } from '@/theme/index'

interface CardPreviewPanelProps {
  card: CardInfo
  onBind: () => void
  onCancel: () => void
}

export function CardPreviewPanel({ card, onBind, onCancel }: CardPreviewPanelProps) {
  const isBindable = card.status === 'PENDING_BIND'
  const isLinked = card.status === 'LINKED'

  return (
    <View style={{ padding: 20, backgroundColor: colors.surface, borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}>
      {card.template.imageUrl && (
        <Image 
          source={{ uri: card.template.imageUrl }}
          style={{ width: 120, height: 180, alignSelf: 'center', borderRadius: 8, marginBottom: 16 }}
        />
      )}
      <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: colors.text, textAlign: 'center' }}>
        {card.template.name}
      </Text>
      <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, textAlign: 'center', marginTop: 8 }}>
        UID: {card.nfcUid}
      </Text>

      <View style={{ marginVertical: 16, alignItems: 'center' }}>
        <Text style={{ 
          fontFamily: fonts.bodyMedium, 
          paddingHorizontal: 12, 
          paddingVertical: 4, 
          borderRadius: 16,
          backgroundColor: isBindable ? 'rgba(61, 184, 106, 0.2)' : isLinked ? 'rgba(217, 130, 38, 0.2)' : 'rgba(217, 38, 38, 0.2)',
          color: isBindable ? colors.success : isLinked ? '#D98226' : colors.error
        }}>
          {isBindable ? 'Thẻ sẵn sàng bind' : isLinked ? `Liên kết bởi ${card.owner?.name ?? 'Unknown'}` : `Trạng thái: ${card.status}`}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <TouchableOpacity 
          style={{ flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border }} 
          onPress={onCancel}
        >
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text, textAlign: 'center' }}>Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            padding: 14, 
            borderRadius: 12, 
            backgroundColor: isBindable ? colors.primary : colors.border,
            opacity: isBindable ? 1 : 0.5
          }} 
          onPress={onBind}
          disabled={!isBindable}
        >
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.background, textAlign: 'center' }}>
            Xác nhận Bind
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
