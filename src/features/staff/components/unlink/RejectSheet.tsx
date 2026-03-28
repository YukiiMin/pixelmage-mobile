import React from 'react'
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { colors, fonts } from '@/theme/index'

interface RejectSheetProps {
  visible: boolean
  onClose: () => void
  onConfirm: (staffNote: string) => void
  isLoading: boolean
}

export function RejectSheet({ visible, onClose, onConfirm, isLoading }: RejectSheetProps) {
  const [note, setNote] = React.useState('')
  const isDisabled = note.trim().length === 0 || isLoading

  const handleConfirm = () => {
    if (!isDisabled) {
      onConfirm(note)
      setNote('')
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(20, 24, 50, 0.8)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: colors.surface, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderColor: colors.border, borderWidth: 1 }}>
          <Text style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 24, marginBottom: 16 }}>Từ chối yêu cầu hủy liên kết</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, marginBottom: 8 }}>Lý do từ chối (bắt buộc):</Text>
          <TextInput
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              padding: 16,
              color: colors.text,
              fontFamily: fonts.bodyMedium,
              minHeight: 100,
              textAlignVertical: 'top'
            }}
            multiline
            placeholder="Nhập lý do ở đây..."
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            editable={!isLoading}
          />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity 
              style={{ flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border }} 
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text, textAlign: 'center' }}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ 
                flex: 1, 
                padding: 16, 
                borderRadius: 12, 
                backgroundColor: isDisabled ? colors.border : colors.error,
                opacity: isDisabled ? 0.5 : 1
              }} 
              onPress={handleConfirm}
              disabled={isDisabled}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text, textAlign: 'center' }}>Xác nhận từ chối</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
