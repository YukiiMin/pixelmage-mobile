import { colors, fonts } from '@/theme/index'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Props {
  onComplete: () => void
}

export function NfcTutorialScreen({ onComplete }: Props) {
  const [loading, setLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem('nfc_tutorial_seen').then((seen: string | null) => {
      if (seen === 'true') {
        onComplete()
      } else {
        setShowTutorial(true)
      }
      setLoading(false)
    })
  }, [onComplete])

  const handleUnderstand = async () => {
    await AsyncStorage.setItem('nfc_tutorial_seen', 'true')
    onComplete()
  }

  if (loading || !showTutorial) return null

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hướng dẫn quét thẻ</Text>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}
        style={styles.animationContainer}
      >
        <Text style={styles.stepText}>1. Chọn Bắt đầu quét</Text>
        <Text style={styles.stepText}>2. Đưa điện thoại lại gần thẻ NFC</Text>
        <Text style={styles.stepText}>
          3. Giữ yên đến khi nhận thông báo thành công
        </Text>
      </MotiView>

      <TouchableOpacity style={styles.button} onPress={handleUnderstand}>
        <Text style={styles.buttonText}>Đã hiểu</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: colors.primary,
    marginBottom: 40,
  },
  animationContainer: {
    marginBottom: 60,
    alignItems: 'flex-start',
  },
  stepText: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.background,
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
  },
})
