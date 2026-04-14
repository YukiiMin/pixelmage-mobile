import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { secureStore } from '@/api/secureStore';
import { useMyCards } from '@/features/my-cards/hooks/useMyCards';
import type { ReadingMode } from '@/types';
import { colors, fonts } from '@/theme/index';

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
    <View className="mt-4 flex-row items-center justify-between gap-3 px-4">
      <Pressable
        onPress={() => handleToggle('EXPLORE')}
        style={{
          backgroundColor: mode === 'EXPLORE' ? 'rgba(212, 184, 87, 0.14)' : colors.surface,
          borderColor: mode === 'EXPLORE' ? colors.primary : colors.borderMuted,
        }}
        className="flex-1 items-center justify-center rounded-xl border px-4 py-3"
      >
        <Text
          style={{
            color: mode === 'EXPLORE' ? colors.primary : colors.textMuted,
            fontFamily: fonts.stats,
            fontSize: 13,
          }}
        >
          EXPLORE
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handleToggle('YOUR_DECK')}
        style={{
          backgroundColor: mode === 'YOUR_DECK' ? 'rgba(212, 184, 87, 0.14)' : colors.surface,
          borderColor: mode === 'YOUR_DECK' ? colors.primary : colors.borderMuted,
        }}
        className={`flex-1 items-center justify-center rounded-xl border px-4 py-3 ${
          !canUseYourDeck ? 'opacity-40' : ''
        }`}
      >
        <Text
          style={{
            color: mode === 'YOUR_DECK' ? colors.primary : colors.textMuted,
            fontFamily: fonts.stats,
            fontSize: 13,
          }}
        >
          YOUR DECK
        </Text>
      </Pressable>
    </View>
  );
}
