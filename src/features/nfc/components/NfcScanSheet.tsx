import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useNfcStore } from '@/store/useNfcStore'
import { useNfcScan } from '../hooks/useNfcScan'
import { ScanPhaseIndicator } from './ScanPhaseIndicator'
import { colors, fonts } from '@/theme/index'
import { NfcTutorialScreen } from './NfcTutorialScreen'
import { secureStore } from '@/api/secureStore'

interface Props {
  preScannedUid?: string
}

export function NfcScanSheet({ preScannedUid }: Props) {
  const router = useRouter()
  const { phase, scannedUid, errorMessage, setPhase, setScannedUid } = useNfcStore()
  const { startIosScan, scanMutation, linkMutation, reset } = useNfcScan()
  const [showTutorial, setShowTutorial] = React.useState(Platform.OS === 'ios' && !preScannedUid)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const processPreScanned = async () => {
      if (preScannedUid && phase === 'ready_to_scan') {
        setPhase('scanning')
        setScannedUid(preScannedUid)
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        try {
          const userIdStr = await secureStore.get('userId')
          const userId = parseInt(userIdStr ?? '0')
          if (!userId) return

          await scanMutation.mutateAsync({ uid: preScannedUid, userId })
          await linkMutation.mutateAsync({ uid: preScannedUid, userId })
        } catch (error) {
          // Handled in mutation error handler
        }
      }
    }
    processPreScanned()
  }, [preScannedUid, phase])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (phase === 'scanning' && Platform.OS === 'ios') {
      interval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [phase])

  if (showTutorial) {
    return <NfcTutorialScreen onComplete={() => setShowTutorial(false)} />
  }

  return (
    <View style={styles.glassModal}>
      <ScanPhaseIndicator phase={phase} />

      {phase === 'ready_to_scan' && (
        <View style={styles.content}>
          <Text style={styles.heading}>Đưa điện thoại lại gần thẻ</Text>
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.button} onPress={startIosScan}>
              <Text style={styles.buttonText}>Bắt đầu quét</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {phase === 'scanning' && (
        <View style={styles.content}>
          <MotiView
            from={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: disabledAnimation ? 1 : 1.5, opacity: 0 }}
            transition={{
              type: 'timing',
              duration: 1500,
              loop: true,
            }}
            style={styles.radarPulse}
          />
          <Text style={styles.text}>Đang đọc thẻ...</Text>
        </View>
      )}

      {phase === 'error' && (
        <Animated.View style={styles.content}>
          <Text style={[styles.text, { color: colors.error, marginBottom: 24 }]}>
            {errorMessage}
          </Text>
          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>Thử lại</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {phase === 'success' && (
        <Animated.View entering={FadeInDown.duration(reducedMotion ? 0 : 500)} style={styles.content}>
          <Text style={[styles.heading, { color: colors.primary }]}>Thẻ đã được liên kết! ✨</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              reset()
              // @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache.
              router.replace('/(tabs)/my-cards')
            }}
          >
            <Text style={styles.buttonText}>Xem thẻ của tôi</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {phase !== 'success' && phase !== 'scanning' && (
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>Đóng</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const disabledAnimation = false

const styles = StyleSheet.create({
  glassModal: {
    flex: 1,
    backgroundColor: 'rgba(20, 24, 50, 0.95)',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
  },
  radarPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    marginBottom: 30,
  },
  closeBtn: {
    position: 'absolute',
    bottom: 40,
  },
  closeBtnText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 16,
  }
})
