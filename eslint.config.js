// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*'],
    rules: {
      // CẤM TIỆT việc dùng `any`. Mọi dữ liệu phải có interface.
      '@typescript-eslint/no-explicit-any': 'error',

      // Bắt buộc phải có lý do nếu dùng @ts-ignore hoặc @ts-expect-error
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
        },
      ],

      // Biến lỗi Rules of Hooks thành LỖI ĐỎ thay vì chỉ cảnh báo vàng
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // ĐƯA RED LINES VÀO ESLINT: Cấm import các thư viện rác
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              message:
                'RED LINE VIOLATION: Use native fetch wrapper at @/api/client instead of axios.',
            },
            {
              name: 'react-native-toast-message',
              message:
                'RED LINE VIOLATION: Use our CustomToast from @/store/useToastStore instead.',
            },
          ],
        },
      ],
    },
  },
])
