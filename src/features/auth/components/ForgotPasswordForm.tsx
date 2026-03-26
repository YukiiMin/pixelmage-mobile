import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'expo-router'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { fonts, colors } from '@/theme/index'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  
  const forgotMutation = useForgotPassword()
  const [success, setSuccess] = useState(false)

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotMutation.mutate(data, {
      onSuccess: () => {
        setSuccess(true)
      },
      onError: (err: any) => {
        Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: colors.text, marginBottom: 16, textAlign: 'center' }}>
        Quên mật khẩu
      </Text>

      {success ? (
        <View style={{ backgroundColor: colors.surface, padding: 24, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.success, textAlign: 'center', marginBottom: 24 }}>
            Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.
          </Text>
          {/* @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache. */}
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, fontSize: 16 }}>
                Quay lại đăng nhập
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <>
          <Text style={{ fontFamily: fonts.body, fontSize: 16, color: colors.textMuted, marginBottom: 32, textAlign: 'center' }}>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ marginBottom: 24 }}>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                    padding: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    fontFamily: fonts.body
                  }}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {errors.email && <Text style={{ color: colors.error, marginTop: 4 }}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={forgotMutation.isPending}
            style={{
              backgroundColor: colors.primary,
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 24
            }}
          >
            <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, fontSize: 16 }}>
              {forgotMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {/* @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache. */}
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={{ color: colors.textMuted, fontFamily: fonts.bodyMedium }}>Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </>
      )}
    </View>
  )
}
