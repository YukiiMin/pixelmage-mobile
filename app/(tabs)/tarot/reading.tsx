import TarotSessionClient from '@/features/tarot/components/session/TarotSessionClient'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

export default function TarotReadingScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>()
  return <TarotSessionClient sessionId={Number(sessionId)} />
}
