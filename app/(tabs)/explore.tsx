import { IconSymbol } from '@/components/ui/icon-symbol'
import React, { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
// Import các công cụ "làm phép" với NFC
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager'

export default function TabTwoScreen() {
  const [isWriting, setIsWriting] = useState(false)
  // Khởi động NFC Manager khi mở màn hình này
  useEffect(() => {
    NfcManager.start()
    return () => {
      // Dọn dẹp khi chuyển sang màn hình khác
      NfcManager.cancelTechnologyRequest()
    }
  }, [])

  const writeNfcTag = async () => {
    try {
      setIsWriting(true)

      // 1. Xin quyền đọc cả 2 loại: Thẻ đã NDEF hoặc Thẻ chờ Format
      await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NdefFormatable])

      // 2. Lấy hồ sơ của chiếc thẻ vừa chạm
      const tag = await NfcManager.getTag()
      if (!tag) throw new Error('Không đọc được thẻ')

      // 3. Tạo gói tin (NDEF Message) chứa link mở app PixelMage
      const url = 'pixelmage://'
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)])

      if (bytes) {
        // 4. Kiểm tra xem thẻ thuộc "hệ" nào để xài đúng chiêu
        if (tag.techTypes?.includes('android.nfc.tech.Ndef')) {
          // Thẻ ngoan, đã format sẵn -> Ghi thẳng
          await NfcManager.ndefHandler.writeNdefMessage(bytes)
        } else if (tag.techTypes?.includes('android.nfc.tech.NdefFormatable')) {
          // Thẻ hoang dã, chưa format -> Vừa format vừa ghi
          await NfcManager.ndefFormatableHandlerAndroid.formatNdef(bytes)
        } else {
          throw new Error('Thẻ này không hỗ trợ NDEF!')
        }

        Alert.alert('✨ Thành công!', 'Đã nạp phép thuật vào thẻ NFC.')
      }
    } catch (ex) {
      console.warn('Lỗi ghi NFC:', ex)
      Alert.alert(
        'Thất bại',
        'Giao tiếp thẻ bị lỗi hoặc bạn đã rút thẻ ra quá sớm.'
      )
    } finally {
      // 5. Ngắt kết nối để thẻ được "nghỉ ngơi"
      NfcManager.cancelTechnologyRequest()
      setIsWriting(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <View className="mb-8 rounded-full bg-indigo-500/20 p-8 shadow-lg shadow-indigo-500/30">
        <IconSymbol
          size={80}
          color={isWriting ? '#34d399' : '#818cf8'} // Đổi màu xanh lá khi đang quét
          name="viewfinder"
        />
      </View>

      <Text className="mb-3 text-4xl font-extrabold text-white tracking-tight">
        PixelMage
      </Text>

      <Text className="mb-10 text-center text-base text-slate-400 leading-relaxed">
        {isWriting
          ? 'Đang tìm kiếm thẻ... Hãy chạm thẻ vào mặt lưng điện thoại của bạn ngay bây giờ!'
          : 'Chạm thẻ NFC của bạn vào mặt lưng điện thoại để bắt đầu kết nối phép thuật.'}
      </Text>

      <TouchableOpacity
        onPress={writeNfcTag}
        disabled={isWriting}
        className={`w-full max-w-xs items-center rounded-2xl py-4 shadow-sm ${
          isWriting ? 'bg-slate-600' : 'bg-indigo-600 active:bg-indigo-700'
        }`}
      >
        <Text className="text-lg font-bold text-white">
          {isWriting ? 'Đang nạp...' : 'Nạp phép thuật (Ghi thẻ)'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
