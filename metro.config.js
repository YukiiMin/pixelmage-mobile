// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// Chỉ định đường dẫn tới file CSS tổng của dự án (mới tạo ở bước 2)
module.exports = withNativeWind(config, { input: './app/global.css' })
