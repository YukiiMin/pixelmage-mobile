import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, withTiming, useSharedValue, useAnimatedStyle, withDelay, runOnJS } from 'react-native-reanimated';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { TarotCard } from './TarotCard';

export function RevealPhase() {
  const { drawnCards, setPhase } = useTarotSessionStore();

  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Total reveal time: last card delay + animation duration
    const totalRevealTime = (drawnCards.length - 1) * 300 + 500;
    
    glowOpacity.value = withDelay(
      totalRevealTime,
      withTiming(0.4, { duration: 750 }, (finished) => {
        if (finished) {
          glowOpacity.value = withTiming(0, { duration: 750 }, (fin2) => {
            if (fin2) {
              runOnJS(setPhase)('INTERPRET');
            }
          });
        }
      })
    );
  }, [drawnCards.length, glowOpacity, setPhase]);

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <View className="flex-1 p-4 justify-center items-center">
      <View className="flex-row flex-wrap justify-center gap-4">
        {drawnCards.map((card, i) => (
          <Animated.View
            key={card.readingCardId}
            entering={FadeInDown.delay(i * 300).duration(500).springify()}
            className="w-[45%]"
            style={card.isReversed ? { transform: [{ rotate: '180deg' }] } : {}}
          >
            <View className="mb-2 items-center">
              <Text className="font-heading text-primary text-sm">{card.positionName}</Text>
            </View>
            <TarotCard card={card} />
          </Animated.View>
        ))}
      </View>

      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: '#D4B857', pointerEvents: 'none' },
          animatedGlowStyle,
        ]}
      />
    </View>
  );
}
