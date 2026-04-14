import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import { colors, fonts } from '@/theme/index';

export function QuestionInput() {
  const { mainQuestion } = useTarotSessionStore();

  const handleChange = (text: string) => {
    useTarotSessionStore.setState({ mainQuestion: text });
  };

  return (
    <View className="mt-4 px-4">
      <Text className="mb-2" style={{ color: colors.textMuted, fontFamily: fonts.body }}>
        Câu hỏi của bạn (Tùy chọn)
      </Text>
      <TextInput
        value={mainQuestion}
        onChangeText={handleChange}
        placeholder="VD: Điều gì đang cản trở tôi lúc này?"
        placeholderTextColor={colors.textMuted}
        className="rounded-xl border px-4 py-3"
        style={{
          color: colors.text,
          fontFamily: fonts.body,
          backgroundColor: colors.surface,
          borderColor: colors.borderMuted,
          minHeight: 48,
        }}
      />
    </View>
  );
}
