import { useLocalSearchParams } from 'expo-router'
import { NfcScanSheet } from '@/features/nfc/components/NfcScanSheet'
import { StatusBar } from 'expo-status-bar'

export default function NfcScanModal() {
  const { uid } = useLocalSearchParams<{ uid?: string }>()
  
  return (
    <>
      <StatusBar style="light" />
      <NfcScanSheet preScannedUid={uid} />
    </>
  )
}
