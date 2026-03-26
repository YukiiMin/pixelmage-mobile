import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { useSpreads } from '@/features/tarot/hooks/useSpreads';
import { useCreateSession } from '@/features/tarot/hooks/useCreateSession';
import { useGuestReadingGuard } from '@/features/tarot/hooks/useGuestReadingGuard';
import { secureStore } from '@/api/secureStore';
import { ApiError } from '@/api/client';
import { SpreadSelector } from './SpreadSelector';
import { ModeToggle } from './ModeToggle';
import { QuestionInput } from './QuestionInput';
import { CardPicker } from './CardPicker';
import { ActiveSessionSheet } from './ActiveSessionSheet';
import { colors } from '@/theme/index';

export default function TarotSetupClient() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    secureStore.get('userId').then((id) => {
      if (id) setUserId(Number(id));
    });
  }, []);

  const { data: spreads, isLoading: spreadsLoading } = useSpreads();
  const { canRead, hasCards, usedGuestToday } = useGuestReadingGuard(userId);
  const { spreadId, mode, mainQuestion, selectedCardIds } = useTarotSessionStore();

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const createSession = useCreateSession();

  // ModeYOUR_DECK check
  const selectedSpread = spreads?.find(s => s.spreadId === spreadId);

  const isFormValid = spreadId && mode;

  const handleStart = () => {
    if (!spreadId || !mode) return;
    createSession.mutate(
      { spreadId, mainQuestion, mode },
      {
        onError: (error: ApiError) => {
          if (error.status === 409 && error.data?.activeSessionId) {
            setActiveSessionId(error.data.activeSessionId);
          }
        },
        onSuccess: (session) => {
          // If YOUR_DECK, drawing actually happens automatically via TarotSessionClient OR we route and draw there.
          router.push({
            // @ts-expect-error: Expo Router static paths typing limitation
            pathname: '/(tabs)/tarot/reading',
            params: { sessionId: String(session.sessionId) },
          });
        }
      }
    );
  };

  if (!userId) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!canRead && usedGuestToday && !hasCards) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-4">
        <Text className="font-heading text-xl text-primary mb-4 text-center">
          Bạn đã dùng hết lượt trải bài miễn phí hôm nay
        </Text>
        <Text className="font-body text-text/80 mb-6 text-center">
          Vui lòng mua thêm thẻ Tarot để tiếp tục sử dụng tính năng này không giới hạn, hoặc quay lại vào ngày mai!
        </Text>
        <Pressable
          onPress={() => {
             // @ts-expect-error: Expo Router static paths typing limitation
             router.push('/(tabs)/shop');
          }}
          style={{ backgroundColor: colors.primary }}
          className="py-4 px-8 rounded-xl"
        >
          <Text className="font-body font-medium text-background">Mua Pack Thẻ</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0A0D1E]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="font-heading text-3xl text-primary text-center mt-6 mb-2">
          Hỏi Các Vì Sao
        </Text>
        <Text className="font-body text-text/80 text-center px-4 mb-6">
          Chọn một trải bài và nhập câu hỏi để bắt đầu
        </Text>

        {spreadsLoading ? (
          <ActivityIndicator color={colors.primary} className="my-8" />
        ) : (
          <SpreadSelector spreads={spreads || []} />
        )}

        <ModeToggle />

        <QuestionInput />

        {mode === 'YOUR_DECK' && selectedSpread && (
          <CardPicker
            spreadPositionCount={selectedSpread.positionCount}
            onConfirm={(ids) => {
              // Confirm is handled by CreateSession + draw mutate logic.
              // We'll keep it simple and just enable Start button when IDs are enough
            }}
          />
        )}

        <Pressable
          onPress={handleStart}
          disabled={!isFormValid || createSession.isPending || (mode === 'YOUR_DECK' && (!selectedSpread || selectedCardIds.length !== selectedSpread.positionCount))}
          style={{
            backgroundColor: (!isFormValid || createSession.isPending || (mode === 'YOUR_DECK' && (!selectedSpread || selectedCardIds.length !== selectedSpread.positionCount)))
              ? 'rgba(44, 51, 66, 0.5)'
              : '#D4B857',
            margin: 16,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text
            className={`font-body font-medium ${
              (!isFormValid || createSession.isPending || (mode === 'YOUR_DECK' && (!selectedSpread || selectedCardIds.length !== selectedSpread.positionCount)))
                ? 'text-textMuted'
                : 'text-background'
            }`}
          >
            {createSession.isPending ? 'Đang tạo phiên...' : 'Bắt đầu'}
          </Text>
        </Pressable>
      </ScrollView>

      <ActiveSessionSheet
        visible={activeSessionId !== null}
        activeSessionId={activeSessionId}
        onClose={() => setActiveSessionId(null)}
      />
    </View>
  );
}
