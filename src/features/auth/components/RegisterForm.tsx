import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'expo-router'
import { useRegister } from '../hooks/useRegister'
import { fonts, colors } from '@/theme/index'

const registerSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })
  
  const registerMutation = useRegister()

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password
    }, {
      onError: (err: any) => {
        Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 32, color: colors.text, marginBottom: 32, textAlign: 'center' }}>
        Đăng ký
      </Text>

      <Controller
        control={control}
        name="name"
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
              placeholder="Họ tên"
              placeholderTextColor={colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && <Text style={{ color: colors.error, marginTop: 4 }}>{errors.name.message}</Text>}
          </View>
        )}
      />

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

      <Controller
        control={control}
        name="confirmPassword"
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
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor={colors.textMuted}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.confirmPassword && <Text style={{ color: colors.error, marginTop: 4 }}>{errors.confirmPassword.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={registerMutation.isPending}
        style={{
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 24
        }}
      >
        <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, fontSize: 16 }}>
          {registerMutation.isPending ? 'Đang xử lý...' : 'Đăng ký'}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ color: colors.textMuted, fontFamily: fonts.body }}>Đã có tài khoản? </Text>
        {/* @ts-expect-error: Expo Router static generation fails to detect newly injected segment routes without an interactive bundler build cache. */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={{ color: colors.accent, fontFamily: fonts.bodyMedium }}>Đăng nhập</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
