import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';

interface ActiveSessionSheetProps {
  visible: boolean;
  activeSessionId: number | null;
  onClose: () => void;
}

export function ActiveSessionSheet({ visible, activeSessionId, onClose }: ActiveSessionSheetProps) {
  const router = useRouter();

  if (!visible || !activeSessionId) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(20, 24, 50, 0.6)' }}>
        <View
          style={{
            backgroundColor: 'rgba(26, 32, 64, 0.95)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(44, 51, 66, 0.6)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          className="p-6 pb-12"
        >
          <Text className="font-heading text-xl text-primary mb-2">
            Session đang dở
          </Text>
          <Text className="font-body text-text/80 mb-6">
            Bạn có một phiên đọc bài đang dở. Bạn muốn làm gì?
          </Text>

          <View className="gap-3">
            <Pressable
              onPress={() => {
                onClose();
                router.push({ pathname: '/(tabs)/tarot/reading', params: { sessionId: String(activeSessionId) }});
              }}
              style={{ backgroundColor: '#D4B857' }}
              className="py-4 rounded-xl items-center"
            >
              <Text className="font-body font-medium text-background">Tiếp tục</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                onClose();
              }}
              style={{ backgroundColor: 'rgba(44, 51, 66, 0.5)' }}
              className="py-4 rounded-xl items-center"
            >
              <Text className="font-body font-medium text-text">Bỏ qua</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
