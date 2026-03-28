import { colors, fonts } from '@/theme/index'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { z } from 'zod'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { useLogin } from '../hooks/useLogin'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})
type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const loginMutation = useLogin()
  const googleAuth = useGoogleAuth()
  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = (data: LoginFormValues) => {
    setApiError(null)
    loginMutation.mutate(data, {
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.'
        setApiError(msg)
      },
    })
  }

  const inputStyle = (fieldName: string) => ({
    backgroundColor: 'rgba(26, 32, 64, 0.85)',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: focusedField === fieldName
      ? 'rgba(212, 184, 87, 0.7)'
      : errors[fieldName as keyof LoginFormValues]
        ? colors.error
        : 'rgba(44, 51, 66, 0.8)',
    fontFamily: fonts.body,
    fontSize: 15,
  })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', paddingHorizontal: 24 }}>

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(500).delay(0)} style={{ marginBottom: 8, alignItems: 'center' }}>
        <View style={{
          width: 56, height: 56, borderRadius: 16, marginBottom: 20,
          backgroundColor: 'rgba(212, 184, 87, 0.15)',
          borderWidth: 1, borderColor: 'rgba(212, 184, 87, 0.4)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 24 }}>✦</Text>
        </View>
        <Text style={{
          fontFamily: fonts.heading,
          fontSize: 34,
          color: colors.primary,
          textAlign: 'center',
          letterSpacing: 0.5,
        }}>
          Đăng Nhập
        </Text>
        <Text style={{
          fontFamily: fonts.body,
          fontSize: 14,
          color: colors.textMuted,
          textAlign: 'center',
          marginTop: 6,
        }}>
          Dùng tài khoản PixelMage để đồng bộ dữ liệu
        </Text>
      </Animated.View>

      {/* Fields */}
      <View style={{ marginTop: 32, gap: 12 }}>
        {/* Email */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
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
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
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
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: 14, top: 0, bottom: 0,
                      justifyContent: 'center', alignItems: 'center',
                    }}
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

        {/* Forgot password */}
        <Animated.View entering={FadeInDown.duration(500).delay(280)} style={{ alignItems: 'flex-end' }}>
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 }}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </Link>
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
      <Animated.View entering={FadeInDown.duration(500).delay(360)} style={{ marginTop: 28 }}>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loginMutation.isPending}
          activeOpacity={0.85}
          style={{
            backgroundColor: loginMutation.isPending ? 'rgba(212,184,87,0.5)' : colors.primary,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {loginMutation.isPending
            ? <ActivityIndicator size="small" color={colors.background} style={{ marginRight: 8 }} />
            : null
          }
          <Text style={{ color: colors.background, fontFamily: fonts.bodyMedium, fontSize: 16 }}>
            {loginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Divider */}
      <Animated.View entering={FadeInDown.duration(500).delay(440)} style={{
        flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 12,
      }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(44,51,66,0.6)' }} />
        <Text style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          hoặc
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(44,51,66,0.6)' }} />
      </Animated.View>

      {/* Google button */}
      <Animated.View entering={FadeInDown.duration(500).delay(520)} style={{ marginTop: 16 }}>
        <TouchableOpacity
          onPress={googleAuth.signIn}
          disabled={googleAuth.isPending}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'rgba(26, 32, 64, 0.85)',
            paddingVertical: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(44, 51, 66, 0.8)',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {/* Google logo */}
          <View style={{ width: 20, height: 20 }}>
            <Text style={{ fontSize: 15, lineHeight: 20, color: '#EA4335', fontFamily: fonts.bodyMedium }}>G</Text>
          </View>
          <Text style={{ color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 15 }}>
            Tiếp tục với Google
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Register link */}
      <Animated.View entering={FadeInDown.duration(500).delay(600)} style={{
        flexDirection: 'row', justifyContent: 'center', marginTop: 28, gap: 4,
      }}>
        <Text style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 14 }}>
          Chưa có tài khoản?
        </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 14 }}>
              Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  )
}
