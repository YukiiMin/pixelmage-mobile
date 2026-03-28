import NfcManager, { NfcTech } from 'react-native-nfc-manager'
import * as Haptics from 'expo-haptics'

export function useStaffNfcScan() {
  async function scanUid(): Promise<string | null> {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef)
      const tag = await NfcManager.getTag()
      const uid = tag?.id ?? null
      return uid
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return null
    } finally {
      NfcManager.cancelTechnologyRequest()
    }
  }

  return { scanUid }
}
