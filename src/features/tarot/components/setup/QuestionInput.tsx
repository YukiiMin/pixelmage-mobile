import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';

export function QuestionInput() {
  const { mainQuestion } = useTarotSessionStore();

  const handleChange = (text: string) => {
    useTarotSessionStore.setState({ mainQuestion: text });
  };

  return (
    <View className="mt-4 px-4">
      <Text className="font-body text-text/80 mb-2">Câu hỏi của bạn (Tùy chọn)</Text>
      <TextInput
        value={mainQuestion}
        onChangeText={handleChange}
        placeholder="VD: Điều gì đang cản trở tôi lúc này?"
        placeholderTextColor="#9BA5B0"
        className="font-body text-text border border-border/50 rounded-xl px-4 py-3 bg-surface/85"
        style={{
          backgroundColor: 'rgba(26, 32, 64, 0.85)',
          borderColor: 'rgba(44, 51, 66, 0.5)',
        }}
      />
    </View>
  );
}
