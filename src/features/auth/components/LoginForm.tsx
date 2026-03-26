import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'expo-router'
import { useLogin } from '../hooks/useLogin'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { fonts, colors } from '@/theme/index'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})
type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  
  const loginMutation = useLogin()
  const googleAuth = useGoogleAuth()

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onError: (err: any) => {
        Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: colors.text, marginBottom: 32, textAlign: 'center' }}>
        Đăng nhập
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 16 }}>
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

      <Controller
        control={control}
        name="password"
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
              placeholder="Mật khẩu"
              placeholderTextColor={colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.password && <Text style={{ color: colors.error, marginTop: 4 }}>{errors.password.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={loginMutation.isPending}
        style={{
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, fontSize: 16 }}>
          {loginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={googleAuth.signIn}
        disabled={googleAuth.isPending}
        style={{
          backgroundColor: colors.surface,
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 24
        }}
      >
        <Text style={{ color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 16 }}>
          Tiếp tục với Google
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
        {/* @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache. */}
        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity>
            <Text style={{ color: colors.textMuted, fontFamily: fonts.body }}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </Link>
        {/* @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache. */}
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={{ color: colors.accent, fontFamily: fonts.body }}>Đăng ký</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
