import { create } from 'zustand'

export type NfcPhase = 'ready_to_scan' | 'scanning' | 'success' | 'error'

export interface NfcState {
  phase: NfcPhase
  scannedUid: string | null
  errorMessage: string | null
  setPhase: (phase: NfcPhase) => void
  setScannedUid: (uid: string) => void
  setError: (message: string) => void
  reset: () => void
}

export const useNfcStore = create<NfcState>((set) => ({
  phase: 'ready_to_scan',
  scannedUid: null,
  errorMessage: null,
  setPhase: (phase) => set({ phase }),
  setScannedUid: (uid) => set({ scannedUid: uid }),
  setError: (message) => set({ phase: 'error', errorMessage: message }),
  reset: () => set({ phase: 'ready_to_scan', scannedUid: null, errorMessage: null }),
}))
