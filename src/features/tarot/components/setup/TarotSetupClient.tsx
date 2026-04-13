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
import { colors, fonts } from '@/theme/index';

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
            pathname: '/(tabs)/tarot/reading',
            params: { sessionId: String(session.sessionId) },
          });
        }
      }
    );
  };

  if (!userId) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!canRead && usedGuestToday && !hasCards) {
    return (
      <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: colors.background }}>
        <Text className="mb-4 text-center text-xl" style={{ color: colors.primary, fontFamily: fonts.heading }}>
          Bạn đã dùng hết lượt trải bài miễn phí hôm nay
        </Text>
        <Text className="mb-6 text-center" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
          Vui lòng mua thêm thẻ Tarot để tiếp tục sử dụng tính năng này không giới hạn, hoặc quay lại vào ngày mai!
        </Text>
        <Pressable
          onPress={() => {
          router.push('/(tabs)/marketplace');
          }}
          style={{ backgroundColor: colors.primary }}
          className="py-4 px-8 rounded-xl"
        >
          <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium }}>Mua Pack Thẻ</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text
          className="mt-10 text-center text-4xl"
          style={{ color: colors.primary, fontFamily: fonts.heading }}
        >
          Hỏi Các Vì Sao
        </Text>
        <Text
          className="mb-6 px-4 text-center"
          style={{ color: colors.textMuted, fontFamily: fonts.body }}
        >
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
            onConfirm={(_ids) => {
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
              ? colors.borderMuted
              : colors.primary,
            marginHorizontal: 16,
            marginTop: mode === 'YOUR_DECK' ? 8 : 16,
            marginBottom: 16,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            minHeight: 48,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bodyMedium,
              color: (!isFormValid || createSession.isPending || (mode === 'YOUR_DECK' && (!selectedSpread || selectedCardIds.length !== selectedSpread.positionCount)))
                ? colors.textMuted
                : colors.background,
            }}
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
