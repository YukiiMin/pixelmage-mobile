// d:\Minh\FU_Learning\EXE201\PixelMage_Rebase\project_src\MO\pixelmage-mobile\metro.config.js

const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// 1. Hỗ trợ pnpm (symlinks)
config.resolver.unstable_enableSymlinks = true

// 2. Hỗ trợ modern ESM (giúp xử lý tslib và .mjs tốt hơn)
config.resolver.unstable_enablePackageExports = true

// 3. Ưu tiên các định dạng file (thêm mjs nếu chưa có)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs']

// 4. Ép Metro tìm đúng tslib nếu vẫn bị lỗi default import
config.resolver.extraNodeModules = {
  tslib: path.resolve(__dirname, 'node_modules/tslib'),
}

module.exports = withNativeWind(config, { input: './app/global.css' })
