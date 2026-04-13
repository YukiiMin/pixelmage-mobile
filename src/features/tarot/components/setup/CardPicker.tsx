import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { secureStore } from '@/api/secureStore';
import { useMyCards } from '@/features/my-cards/hooks/useMyCards';
import { CardThumbnail } from '@/features/my-cards/components/CardThumbnail';
import { colors, fonts } from '@/theme/index';

interface CardPickerProps {
  spreadPositionCount: number;
  onConfirm: (cardIds: number[]) => void;
}

export function CardPicker({ spreadPositionCount, onConfirm }: CardPickerProps) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    secureStore.get('userId').then((id) => {
      if (id) setUserId(Number(id));
    });
  }, []);

  const { data: myCards } = useMyCards(userId);
  const { selectedCardIds, toggleCardSelection } = useTarotSessionStore();

  const handleToggle = (templateId: number) => {
    // If not selected yet and we are at limit, don't allow selecting
    if (!selectedCardIds.includes(templateId) && selectedCardIds.length >= spreadPositionCount) {
      return;
    }
    toggleCardSelection(templateId);
  };

  const isConfirmedReady = selectedCardIds.length === spreadPositionCount;
  const selectedLabelColor = isConfirmedReady ? colors.primary : colors.textMuted

  return (
    <View className="mt-4 px-4">
      <View className="flex-row items-end justify-between mb-4">
        <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: colors.primary }}>
          Chọn lá bài
        </Text>
        <Text style={{ fontFamily: fonts.stats, color: selectedLabelColor }}>
          Đã chọn: {selectedCardIds.length} / {spreadPositionCount} lá
        </Text>
      </View>

      <ScrollView style={{ maxHeight: 420 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4 }}>
          {myCards?.map((inv) => {
            const isSelected = selectedCardIds.includes(inv.cardTemplate.templateId);
            return (
              <View
                key={inv.inventoryId}
                style={{ width: '50%' }}
              >
                <CardThumbnail card={inv} onPress={() => handleToggle(inv.cardTemplate.templateId)} />
                {isSelected && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      borderColor: colors.primary,
                      borderWidth: 2,
                      borderRadius: 12,
                      backgroundColor: 'rgba(212, 184, 87, 0.14)',
                      margin: 8, // since CardThumbnail has p-2
                    }}
                    pointerEvents="none"
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => {
          if (isConfirmedReady) {
            onConfirm(selectedCardIds);
          }
        }}
        style={{
          backgroundColor: isConfirmedReady ? colors.primary : colors.borderMuted,
          marginTop: 16,
          marginBottom: 8,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
          minHeight: 48,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.bodyMedium,
            color: isConfirmedReady ? colors.background : colors.textMuted,
          }}
        >
          Xác nhận
        </Text>
      </Pressable>
    </View>
  );
}
