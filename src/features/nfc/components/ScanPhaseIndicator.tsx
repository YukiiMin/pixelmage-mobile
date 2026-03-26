import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '@/theme/index'
import { NfcPhase } from '@/store/useNfcStore'

interface Props {
  phase: NfcPhase
}

export function ScanPhaseIndicator({ phase }: Props) {
  const steps: { key: NfcPhase; label: string }[] = [
    { key: 'ready_to_scan', label: 'Sẵn sàng' },
    { key: 'scanning', label: 'Đang quét' },
    { key: 'success', label: 'Thành công' },
  ]
  
  const currentIndex = phase === 'error' ? 1 : steps.findIndex(s => s.key === phase)

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index <= currentIndex
        const isError = phase === 'error' && index === 1
        
        let pointColor: string = colors.border
        if (isActive) pointColor = colors.primary
        if (isError) pointColor = colors.error

        return (
          <View key={step.key} style={styles.stepContainer}>
            <View style={[styles.dot, { backgroundColor: pointColor }]} />
            <Text style={[styles.label, { color: isActive ? colors.text : colors.textMuted }]}>
              {step.label}
            </Text>
            {index < steps.length - 1 && (
              <View style={[styles.line, { backgroundColor: isActive ? colors.primary : colors.border }]} />
            )}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 12,
  },
})
