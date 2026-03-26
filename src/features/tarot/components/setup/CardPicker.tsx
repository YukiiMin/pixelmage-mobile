import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { secureStore } from '@/api/secureStore';
import { useMyCards } from '@/features/my-cards/hooks/useMyCards';
import { CardThumbnail } from '@/features/my-cards/components/CardThumbnail';

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

  return (
    <View className="flex-1 px-4 mt-4">
      <View className="flex-row items-end justify-between mb-4">
        <Text className="font-heading text-xl text-primary">Chọn lá bài</Text>
        <Text className="font-stats text-text/80">
          Đã chọn: {selectedCardIds.length} / {spreadPositionCount} lá
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {myCards?.map((inv) => {
            const isSelected = selectedCardIds.includes(inv.cardTemplate.templateId);
            return (
              <View
                key={inv.inventoryId}
                className="w-1/2"
              >
                <CardThumbnail card={inv} onPress={() => handleToggle(inv.cardTemplate.templateId)} />
                {isSelected && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      borderColor: '#D4B857',
                      borderWidth: 2,
                      borderRadius: 12,
                      backgroundColor: 'rgba(212, 184, 87, 0.1)',
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
          backgroundColor: isConfirmedReady ? '#D4B857' : 'rgba(44, 51, 66, 0.5)',
          marginTop: 16,
          marginBottom: 16,
          paddingVertical: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text
          className={`font-body font-medium ${
            isConfirmedReady ? 'text-background' : 'text-textMuted'
          }`}
        >
          Xác nhận
        </Text>
      </Pressable>
    </View>
  );
}
