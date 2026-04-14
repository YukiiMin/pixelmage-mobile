import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/common/HapticTab'
import { IconSymbol } from '@/components/common/IconSymbol'
import { colors, fonts } from '@/theme/index'
import { useUserRole } from '@/hooks/useUserRole'

export default function TabLayout() {
  const { isStaff } = useUserRole()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
        },
      }}
    >
      {/* ── Global Redirect (Hidden) ────────────────────────── */}
      <Tabs.Screen name="index" options={{ href: null }} />

      {/* ── Visible tabs ───────────────────────────────────────── */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tarot"
        options={{
          title: 'Tarot',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="star.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="rectangle.portrait.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />

      {/*
        Staff tab: always registered as a Screen (required by Expo Router),
        but hidden via href:null when user is not staff.
        ⚠️ Never use {isStaff && <Tabs.Screen/>} — causes "Layout children must be Screen" warning.
      */}
      <Tabs.Screen
        name="staff"
        options={{
          title: 'Staff',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wrench.fill" color={color} />
          ),
          // Hide the tab entirely for non-staff users
          href: isStaff ? undefined : null,
        }}
      />

      {/* ── Hidden routes (sub-screens, not tabs) ──────────────── */}
      {/* These exist in the (tabs) folder but must NOT appear as tabs */}
      <Tabs.Screen
        name="collections"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  )
}
