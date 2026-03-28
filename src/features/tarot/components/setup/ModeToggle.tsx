import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { secureStore } from '@/api/secureStore';
import { useMyCards } from '@/features/my-cards/hooks/useMyCards';
import type { ReadingMode } from '@/types';

export function ModeToggle() {
  const { mode } = useTarotSessionStore();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    secureStore.get('userId').then((id) => {
      if (id) setUserId(Number(id));
    });
  }, []);

  const { data: myCards } = useMyCards(userId);

  const canUseYourDeck = (myCards?.length ?? 0) >= 1;

  const handleToggle = (newMode: ReadingMode) => {
    if (newMode === 'YOUR_DECK' && !canUseYourDeck) return;
    useTarotSessionStore.setState({ mode: newMode });
  };

  return (
    <View className="flex-row items-center justify-between mt-4 px-4 gap-4">
      <Pressable
        onPress={() => handleToggle('EXPLORE')}
        style={{
          backgroundColor: mode === 'EXPLORE' ? 'rgba(212, 184, 87, 0.1)' : 'rgba(26, 32, 64, 0.85)',
          borderColor: mode === 'EXPLORE' ? '#D4B857' : 'rgba(44, 51, 66, 0.5)',
        }}
        className="flex-1 p-3 rounded-xl border flex-row items-center justify-center space-x-2"
      >
        <Text
          className={`font-body font-medium ${
            mode === 'EXPLORE' ? 'text-primary' : 'text-text/80'
          }`}
        >
          EXPLORE
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handleToggle('YOUR_DECK')}
        style={{
          backgroundColor: mode === 'YOUR_DECK' ? 'rgba(212, 184, 87, 0.1)' : 'rgba(26, 32, 64, 0.85)',
          borderColor: mode === 'YOUR_DECK' ? '#D4B857' : 'rgba(44, 51, 66, 0.5)',
        }}
        className={`flex-1 p-3 rounded-xl border flex-row items-center justify-center space-x-2 ${
          !canUseYourDeck ? 'opacity-40' : ''
        }`}
      >
        <Text
          className={`font-body font-medium ${
            mode === 'YOUR_DECK' ? 'text-primary' : 'text-text/80'
          }`}
        >
          YOUR DECK
        </Text>
      </Pressable>
    </View>
  );
}
