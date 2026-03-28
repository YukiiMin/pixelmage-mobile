import NfcManager, { NfcTech } from 'react-native-nfc-manager'
import * as Haptics from 'expo-haptics'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNfcStore } from '@/store/useNfcStore'
import { client, ApiError } from '@/api/client'
import { ResponseBase } from '@/types/index'
import { EP } from '@/api/endpoints'
import { secureStore } from '@/api/secureStore'

export function useNfcScan() {
  const queryClient = useQueryClient()
  const { setPhase, setScannedUid, setError, reset } = useNfcStore()

  const scanMutation = useMutation({
    mutationFn: ({ uid, userId }: { uid: string; userId: number }) =>
      client.post<ResponseBase<void>>(EP.NFC_SCAN(uid, userId)),
  })

  const linkMutation = useMutation({
    mutationFn: ({ uid, userId }: { uid: string; userId: number }) =>
      client.post<ResponseBase<void>>(EP.NFC_LINK(uid, userId)),
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      queryClient.invalidateQueries({ queryKey: ['my-cards'] })
      queryClient.invalidateQueries({ queryKey: ['collection-progress'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      setPhase('success')
    },
    onError: async (error: ApiError) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      if (error.status === 409) {
        setError('Thẻ đã được liên kết bởi người dùng khác.')
      } else {
        setError(error.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    },
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  })

  async function startIosScan() {
    setPhase('scanning')
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef)
      const tag = await NfcManager.getTag()
      const uid = tag?.id ?? ''
      setScannedUid(uid)
      const userIdStr = await secureStore.get('userId')
      const userId = parseInt(userIdStr ?? '0')
      
      if (!userId) { return }
      await scanMutation.mutateAsync({ uid, userId })
      await linkMutation.mutateAsync({ uid, userId })
    } catch {
      setError('Không đọc được thẻ. Thử lại.')
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      NfcManager.cancelTechnologyRequest()
    }
  }

  return { startIosScan, scanMutation, linkMutation, reset }
}
