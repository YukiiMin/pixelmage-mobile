import { colors, fonts } from '@/theme/index'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { z } from 'zod'
import { useRegister } from '../hooks/useRegister'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const registerMutation = useRegister()

  const onSubmit = (data: RegisterFormValues) => {
    setApiError(null)
    registerMutation.mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.'
          setApiError(msg)
        },
      }
    )
  }

  const inputStyle = (fieldName: string) => ({
    backgroundColor: 'rgba(26, 32, 64, 0.85)',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: focusedField === fieldName
      ? 'rgba(127, 80, 179, 0.7)'
      : errors[fieldName as keyof RegisterFormValues]
        ? colors.error
        : 'rgba(44, 51, 66, 0.8)',
    fontFamily: fonts.body,
    fontSize: 15,
  })

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 48 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500).delay(0)} style={{ marginBottom: 8, alignItems: 'center' }}>
        <View style={{
          width: 56, height: 56, borderRadius: 16, marginBottom: 20,
          backgroundColor: 'rgba(127, 80, 179, 0.15)',
          borderWidth: 1, borderColor: 'rgba(127, 80, 179, 0.4)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 24 }}>✦</Text>
        </View>
        <Text style={{
          fontFamily: fonts.heading,
          fontSize: 34,
          color: '#A86FE0',
          textAlign: 'center',
          letterSpacing: 0.5,
        }}>
          Đăng Ký
        </Text>
        <Text style={{
          fontFamily: fonts.body,
          fontSize: 14,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: 6,
          paddingHorizontal: 16,
        }}>
          Tạo tài khoản để bước vào thế giới PixelMage
        </Text>
      </Animated.View>

      {/* Fields */}
      <View style={{ marginTop: 28, gap: 12 }}>
        {/* Name */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={inputStyle('name')}
                  placeholder="Họ và tên"
                  placeholderTextColor={colors.textMuted}
                  onBlur={() => { onBlur(); setFocusedField(null) }}
                  onFocus={() => setFocusedField('name')}
                  onChangeText={onChange}
                  value={value}
                  autoComplete="name"
                />
                {errors.name && (
                  <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4, fontFamily: fonts.body }}>
                    {errors.name.message}
                  </Text>
                )}
              </View>
            )}
          />
        </Animated.View>

        {/* Email */}
        <Animated.View entering={FadeInDown.duration(500).delay(180)}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={inputStyle('email')}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  onBlur={() => { onBlur(); setFocusedField(null) }}
                  onFocus={() => setFocusedField('email')}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
                {errors.email && (
                  <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4, fontFamily: fonts.body }}>
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />
        </Animated.View>

        {/* Password */}
        <Animated.View entering={FadeInDown.duration(500).delay(260)}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={[inputStyle('password'), { paddingRight: 48 }]}
                    placeholder="Mật khẩu"
                    placeholderTextColor={colors.textMuted}
                    onBlur={() => { onBlur(); setFocusedField(null) }}
                    onFocus={() => setFocusedField('password')}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    {showPassword
                      ? <EyeOff size={18} color={colors.textMuted} />
                      : <Eye size={18} color={colors.textMuted} />
                    }
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4, fontFamily: fonts.body }}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />
        </Animated.View>

        {/* Confirm Password */}
        <Animated.View entering={FadeInDown.duration(500).delay(340)}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={[inputStyle('confirmPassword'), { paddingRight: 48 }]}
                    placeholder="Xác nhận mật khẩu"
                    placeholderTextColor={colors.textMuted}
                    onBlur={() => { onBlur(); setFocusedField(null) }}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirm}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(v => !v)}
                    style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    {showConfirm
                      ? <EyeOff size={18} color={colors.textMuted} />
                      : <Eye size={18} color={colors.textMuted} />
                    }
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4, fontFamily: fonts.body }}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />
        </Animated.View>
      </View>

      {/* API Error */}
      {apiError && (
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={{
            color: colors.error, fontFamily: fonts.body, fontSize: 13,
            marginTop: 8, textAlign: 'center',
          }}>
            {apiError}
          </Text>
        </Animated.View>
      )}

      {/* Submit button */}
      <Animated.View entering={FadeInDown.duration(500).delay(420)} style={{ marginTop: 28 }}>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={registerMutation.isPending}
          activeOpacity={0.85}
          style={{
            backgroundColor: registerMutation.isPending ? 'rgba(127,80,179,0.5)' : '#7F50B3',
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            shadowColor: '#7F50B3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {registerMutation.isPending
            ? <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            : null
          }
          <Text style={{ color: '#fff', fontFamily: fonts.bodyMedium, fontSize: 16 }}>
            {registerMutation.isPending ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Login link */}
      <Animated.View entering={FadeInDown.duration(500).delay(500)} style={{
        flexDirection: 'row', justifyContent: 'center', marginTop: 28, gap: 4,
      }}>
        <Text style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 14 }}>
          Đã có tài khoản?
        </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ color: '#A86FE0', fontFamily: fonts.bodyMedium, fontSize: 14 }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </ScrollView>
  )
}
