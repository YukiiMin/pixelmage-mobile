import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors, fonts } from '@/theme/index'
import { useStaffNfcScan } from '../../hooks/useStaffNfcScan'
import { useCardByNfc } from '../../hooks/useCardByNfc'
import { useBindCard } from '../../hooks/useBindCard'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { CardPreviewPanel } from './CardPreviewPanel'
import { useUserRole } from '@/hooks/useUserRole'
import { Redirect } from 'expo-router'
import * as Haptics from 'expo-haptics'

type Phase = 'IDLE' | 'SCANNING' | 'CARD_PREVIEW' | 'CONFIRM_BIND' | 'BINDING' | 'SUCCESS' | 'ERROR'

export function StaffBindScreen() {
  const { isStaff, loading } = useUserRole()
  const [phase, setPhase] = useState<Phase>('IDLE')
  const [scannedUid, setScannedUid] = useState<string | null>(null)
  
  const { scanUid } = useStaffNfcScan()
  const { data: cardRes, error: checkError, isFetching, refetch } = useCardByNfc(scannedUid)
  const bindMutation = useBindCard()

  useEffect(() => {
    if (scannedUid && phase === 'SCANNING') {
      refetch().then(res => {
         if (res.isError) {
             setPhase('ERROR')
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
         } else if (res.data) {
             setPhase('CARD_PREVIEW')
         }
      })
    }
  }, [scannedUid, phase, refetch])


  if (loading) return null
  if (!isStaff) return <Redirect href="/(tabs)" />

  const handleScan = async () => {
    setPhase('SCANNING')
    const uid = await scanUid()
    if (uid) {
      setScannedUid(uid)
    } else {
      setPhase('IDLE')
    }
  }

  const handleConfirmBind = async () => {
    if (!cardRes) return
    setPhase('BINDING')
    try {
      await bindMutation.mutateAsync({ nfcUid: cardRes.nfcUid, templateId: cardRes.template.templateId })
      setPhase('SUCCESS')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      setPhase('ERROR')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, justifyContent: 'center' }}>
      {phase === 'IDLE' && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginBottom: 20 }}>
            Sẵn sàng quét NFC
          </Text>
          <TouchableOpacity 
            style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12, width: '100%' }}
            onPress={handleScan}
          >
            <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, textAlign: 'center', fontSize: 16 }}>
              Quét Thẻ Vật Lý
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {(phase === 'SCANNING' || phase === 'BINDING' || isFetching) && (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, marginTop: 16 }}>
            {phase === 'BINDING' ? 'Đang kích hoạt thẻ...' : 'Đang xử lý tín hiệu NFC...'}
          </Text>
        </View>
      )}

      {phase === 'CARD_PREVIEW' && cardRes && !isFetching && (
        <CardPreviewPanel 
          card={cardRes} 
          onBind={() => setPhase('CONFIRM_BIND')} 
          onCancel={() => setPhase('IDLE')}
        />
      )}

      {phase === 'ERROR' && !isFetching && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: colors.error, marginBottom: 12 }}>
            {bindMutation.isError ? 'Bind thẻ thất bại' : 'Thẻ lưu trữ không hợp lệ'}
          </Text>
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, marginBottom: 24, textAlign: 'center' }}>
            {bindMutation.error?.message || checkError?.message || 'Không tìm thấy thẻ trên hệ thống, lỗi kết nối hoặc thẻ bị lỗi!'}
          </Text>
          <TouchableOpacity 
             style={{ backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1, padding: 16, borderRadius: 12, width: '100%' }}
            onPress={() => setPhase('IDLE')}
          >
            <Text style={{ color: colors.text, fontFamily: fonts.bodyMedium, textAlign: 'center' }}>Thử quét lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'SUCCESS' && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: colors.success, marginBottom: 12 }}>
            Bind thành công!
          </Text>
          <Text style={{ fontFamily: fonts.bodyMedium, color: colors.textMuted, marginBottom: 24, textAlign: 'center' }}>
            Trạng thái của thẻ đã được chuyển sang READY.
          </Text>
          <TouchableOpacity 
             style={{ backgroundColor: colors.success, padding: 16, borderRadius: 12, width: '100%' }}
            onPress={() => { setPhase('IDLE'); setScannedUid(null) }}
          >
            <Text style={{ color: '#fff', fontFamily: fonts.bodyMedium, textAlign: 'center', fontSize: 16 }}>Hoàn thành</Text>
          </TouchableOpacity>
        </View>
      )}

      <ConfirmModal
        visible={phase === 'CONFIRM_BIND'}
        title="Xác nhận Kích Hoạt (Bind)"
        body={`Bạn có chắc chắn muốn bind mã thẻ với ID UID (Hex): ${scannedUid}?`}
        onConfirm={handleConfirmBind}
        onCancel={() => setPhase('CARD_PREVIEW')}
        loading={phase === 'BINDING'}
      />
    </View>
  )
}
