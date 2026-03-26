import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

// Bắt buộc phải import file này để Tailwind hoạt động
import './global.css'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  // Ép kiểu chặt chẽ để TypeScript không kêu ca nữa
  const theme = colorScheme === 'dark' ? 'dark' : 'light'
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // Chỉnh màu nền Tab bar cho hợp với Dark/Light mode
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scanner', // Đổi tên Tab thành Scanner cho ngầu
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="viewfinder" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
