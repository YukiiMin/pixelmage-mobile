import React from 'react'
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors, fonts } from '@/theme/index'

export interface ConfirmModalProps {
  visible: boolean
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmModal({
  visible,
  title,
  body,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      >
        <View
          style={{
            backgroundColor: 'rgba(26, 32, 64, 0.95)',
            borderColor: 'rgba(44, 51, 66, 0.6)',
            borderWidth: 1,
            borderRadius: 16,
          }}
          className="w-full max-w-sm p-6 items-center"
        >
          <Text style={{ fontFamily: fonts.heading, color: colors.text }} className="text-xl mb-3 text-center">
            {title}
          </Text>
          <Text style={{ fontFamily: fonts.body, color: colors.textMuted }} className="text-base text-center mb-6">
            {body}
          </Text>

          <View className="flex-row w-full space-x-3">
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="flex-1 py-3 rounded-lg border border-border items-center justify-center mr-2"
              style={{ backgroundColor: 'rgba(44, 51, 66, 0.5)' }}
            >
              <Text style={{ fontFamily: fonts.bodyMedium, color: colors.text }} className="text-base">
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-lg items-center justify-center ml-2"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={{ fontFamily: fonts.bodyMedium, color: colors.background }} className="text-base">
                  {confirmLabel}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
