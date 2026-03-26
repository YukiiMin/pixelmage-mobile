import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useInterpret } from '@/features/tarot/hooks/useInterpret';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import Animated, { FadeIn, useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export function InterpretPanel({ sessionId }: { sessionId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useInterpret(sessionId);
  const { clearSession } = useTarotSessionStore();

  const [timeoutWarn, setTimeoutWarn] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const status = session?.status;

  useEffect(() => {
    if (status === 'INTERPRETING') {
      const timer = setTimeout(() => {
        setTimeoutWarn(true);
        if (retryCount < 2) {
          setRetryCount((prev) => prev + 1);
          queryClient.refetchQueries({ queryKey: ['tarot-interpret', sessionId] });
        }
      }, 60000); // 60s timeout guard

      return () => clearTimeout(timer);
    }
  }, [status, retryCount, sessionId, queryClient]);

  const loadingOpacity = useSharedValue(0.5);
  useEffect(() => {
    if (status === 'INTERPRETING') {
      loadingOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.5, { duration: 800 })
        ),
        -1,
        true
      );
    }
  }, [status, loadingOpacity]);

  const animatedLoadingStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
    };
  });

  const handleReturn = () => {
    clearSession();
    // @ts-expect-error: Expo Router static paths typing limitation
    router.replace('/(tabs)/tarot');
  };

  if (status === 'INTERPRETING') {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-[#0A0D1E]">
        <Animated.View style={[animatedLoadingStyle]} className="p-4 rounded-xl items-center">
          <Text className="font-heading text-2xl text-secondary mb-4">Các vì sao đang kết nối...</Text>
          <Text className="font-body text-text/60">
            Xin chờ trong giây lát. Hệ thống đang diễn giải trải bài của bạn.
          </Text>
        </Animated.View>

        {timeoutWarn && retryCount >= 2 && (
          <View className="mt-8 items-center">
             <Text className="font-body text-error mb-4">
              Không thể lấy kết quả. Có thể server đang quá tải.
             </Text>
             <Pressable
                onPress={handleReturn}
                style={{ backgroundColor: 'rgba(44, 51, 66, 0.5)' }}
                className="py-4 px-8 rounded-xl items-center"
              >
                <Text className="font-body font-medium text-text">Về trang Tarot</Text>
              </Pressable>
          </View>
        )}
      </View>
    );
  }

  if (status === 'EXPIRED') {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-[#0A0D1E]">
        <Text className="font-heading text-2xl text-error mb-4">Session đã hết hạn.</Text>
        <Pressable
          onPress={handleReturn}
          style={{ backgroundColor: 'rgba(44, 51, 66, 0.5)' }}
          className="py-4 px-8 rounded-xl items-center"
        >
          <Text className="font-body font-medium text-text">Về trang Tarot</Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'COMPLETED') {
    return (
      <ScrollView className="flex-1 bg-[#0A0D1E] p-4">
        <Animated.View entering={FadeIn.duration(800)} className="rounded-xl overflow-hidden mt-4" style={{ backgroundColor: 'rgba(127, 80, 179, 0.15)', borderWidth: 1, borderColor: 'rgba(44, 51, 66, 0.5)' }}>
          <View className="p-6">
            <Text className="font-heading text-2xl text-secondary mb-6 text-center">Lời Giải</Text>
            <Text className="font-body text-text leading-6">
              {session?.aiInterpretation || 'Không có giải thích nào.'}
            </Text>
          </View>
        </Animated.View>

        <Pressable
          onPress={handleReturn}
          style={{ backgroundColor: '#D4B857', marginTop: 32, marginBottom: 60 }}
          className="py-4 rounded-xl items-center"
        >
          <Text className="font-body font-medium text-background">Kết thúc</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return null;
}
