import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionResume } from '@/features/tarot/hooks/useSessionResume';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { DrawPhase } from './DrawPhase';
import { RevealPhase } from './RevealPhase';
import { InterpretPanel } from './InterpretPanel';
import { colors } from '@/theme/index';
import { useDrawCards } from '@/features/tarot/hooks/useDrawCards';

interface TarotSessionClientProps {
  sessionId: number;
}

export default function TarotSessionClient({ sessionId }: TarotSessionClientProps) {
  const router = useRouter();
  const { session, phase: initialPhase, isLoading } = useSessionResume(sessionId);
  const { phase, setSession, setPhase, mode, selectedCardIds } = useTarotSessionStore();

  const [initialized, setInitialized] = useState(false);

  // Hook must be called at top level
  const drawCards = useDrawCards(sessionId);

  // Setup Zustand store on first load based on resume data
  useEffect(() => {
    if (session && !initialized) {
      setSession(session.sessionId, session.spread.spreadId, session.mode);
      
      // Map API status to UI phase if not already in an active flow phase
      // If store phase is SETUP, it means we came from somewhere else or app bounds
      if (phase === 'SETUP' || phase === 'SHUFFLING') {
        setPhase(initialPhase);
      }
      setInitialized(true);
    }
  }, [session, initialized, initialPhase, phase, setSession, setPhase]);

  // Handle immediate draw for YOUR_DECK
  useEffect(() => {
    if (initialized && mode === 'YOUR_DECK' && initialPhase === 'DRAWING' && phase === 'DRAWING') {
      // Trực tiếp drawCards thay vì user bấm
      if (selectedCardIds.length > 0 && !drawCards.isPending && !drawCards.isSuccess) {
         drawCards.mutate(selectedCardIds);
      }
    }
  }, [initialized, mode, initialPhase, phase, drawCards, selectedCardIds]);

  if (isLoading || !initialized) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (phase === 'EXPIRED' || session?.status === 'EXPIRED') {
    return (
      <View className="flex-1 bg-background justify-center items-center p-6">
        <Text className="font-heading text-2xl text-error mb-4">Session đã hết hạn.</Text>
        <Pressable
          onPress={() => {
            // @ts-expect-error: Expo Router static paths typing limitation
            router.replace('/(tabs)/tarot');
          }}
          style={{ backgroundColor: 'rgba(44, 51, 66, 0.5)' }}
          className="py-4 px-8 rounded-xl items-center"
        >
          <Text className="font-body font-medium text-text">Về trang Tarot</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {phase === 'SHUFFLING' || phase === 'DRAWING' || phase === 'SETUP' ? (
        <DrawPhase />
      ) : phase === 'REVEAL' ? (
        <RevealPhase />
      ) : (
        <InterpretPanel sessionId={sessionId} />
      )}
    </View>
  );
}
