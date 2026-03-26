import { InterpretPanel } from '@/features/tarot/components/session/InterpretPanel'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function TarotResultScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>()
  // We can just render interpret panel which fetches result
  return <InterpretPanel sessionId={Number(sessionId)} />
}
