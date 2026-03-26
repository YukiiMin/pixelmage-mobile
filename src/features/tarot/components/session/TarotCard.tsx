import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { fonts, rarityConfig } from '@/theme/index';
import type { ReadingCard } from '@/types';

interface TarotCardProps {
  card: ReadingCard;
}

export function TarotCard({ card }: TarotCardProps) {
  const { cardTemplate, isReversed } = card;
  const isLegendary = cardTemplate.rarity === 'LEGENDARY';
  const rarity = rarityConfig[cardTemplate.rarity];

  return (
    <View
      style={[
        {
          borderColor: rarity.border,
          borderWidth: isLegendary ? 2 : 1,
          backgroundColor: 'rgba(26, 32, 64, 0.85)',
          ...(rarity.glow || {}),
        },
      ]}
      className="rounded-xl overflow-hidden aspect-[2.5/3.5] bg-[#0d1126] w-full"
    >
      <Image
        source={{ uri: cardTemplate.imageUrl }}
        className="flex-1 w-full"
        contentFit="cover"
        transition={200}
      />
      <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/70">
        <Text
          style={{ fontFamily: fonts.heading }}
          className="text-white text-sm"
          numberOfLines={1}
        >
          {cardTemplate.name}
        </Text>
        <Text
          style={{ fontFamily: fonts.stats, color: rarity.color }}
          className="text-xs mt-1"
        >
          {rarity.label || cardTemplate.rarity}
          {isReversed && ' (Reversed)'}
        </Text>
      </View>
    </View>
  );
}
