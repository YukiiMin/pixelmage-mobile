import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { useDrawCards } from '@/features/tarot/hooks/useDrawCards';
import Animated, { FadeIn } from 'react-native-reanimated';

export function DrawPhase() {
  const { sessionId, mode, selectedCardIds } = useTarotSessionStore();
  const drawCards = useDrawCards(sessionId);

  const handleDraw = () => {
    if (mode === 'EXPLORE') {
      drawCards.mutate(undefined);
    } else if (mode === 'YOUR_DECK') {
      drawCards.mutate(selectedCardIds);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 justify-center items-center p-4">
      {/* Shuffle animation could go here */}
      <View className="w-full aspect-[2.5/3.5] max-w-[200px] bg-surface rounded-xl border border-border/50 items-center justify-center mb-8">
        <Text className="font-heading text-primary text-xl">The Deck</Text>
      </View>

      <Pressable
        onPress={handleDraw}
        disabled={drawCards.isPending}
        style={{ backgroundColor: drawCards.isPending ? 'rgba(44, 51, 66, 0.5)' : '#D4B857' }}
        className="py-4 px-12 rounded-xl items-center"
      >
        <Text className={`font-body font-medium ${drawCards.isPending ? 'text-textMuted' : 'text-background'}`}>
          {drawCards.isPending ? 'Đang rút bài...' : (mode === 'YOUR_DECK' ? 'Bắt đầu' : 'Rút bài')}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
