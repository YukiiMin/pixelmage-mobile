export const EP = {
  // Auth
  AUTH_LOGIN: '/api/accounts/auth/login',
  AUTH_REGISTER: '/api/accounts/auth/registration',
  AUTH_LOGOUT: '/api/accounts/auth/logout',
  AUTH_REFRESH: (token: string) => `/api/accounts/auth/refresh?refreshToken=${token}`,
  AUTH_GOOGLE_VERIFY: '/api/accounts/auth/google/verify',
  AUTH_FORGOT_PASSWORD: '/api/accounts/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/accounts/auth/reset-password',
  ACCOUNT: (id: number) => `/api/accounts/${id}`,
  ACCOUNT_PASSWORD: (id: number) => `/api/accounts/${id}/password`,

  // NFC
  NFC_SCAN: (uid: string, userId: number) => `/api/nfc/scan?nfcUid=${uid}&userId=${userId}`,
  NFC_LINK: (uid: string, userId: number) => `/api/nfc/link?nfcUid=${uid}&userId=${userId}`,
  UNLINK_REQUESTS: '/api/unlink-requests',

  // Inventory
  MY_CARDS: (userId: number) => `/api/inventory/my-cards?userId=${userId}`,
  MY_CARD_DETAIL: (templateId: number, userId: number) => `/api/inventory/my-cards/${templateId}?userId=${userId}`,

  // Collections
  COLLECTIONS: (customerId: number) => `/api/collections/customer/${customerId}`,
  COLLECTION_PROGRESS: (customerId: number) => `/api/collections/progress?customerId=${customerId}`,
  COLLECTION_PROGRESS_DETAIL: (customerId: number, collectionId: number) =>
    `/api/collections/progress/detail?customerId=${customerId}&collectionId=${collectionId}`,

  // Stories
  STORIES: (userId: number) => `/api/stories?userId=${userId}`,
  STORY: (id: number, userId: number) => `/api/stories/${id}?userId=${userId}`,

  // Achievements
  ACHIEVEMENTS: '/api/achievements',
  MY_ACHIEVEMENTS: '/api/achievements/my',

  // Tarot (v1)
  SPREADS: '/api/v1/readings/spreads',
  SESSIONS: '/api/v1/readings/sessions',
  SESSION_DRAW: (id: number) => `/api/v1/readings/sessions/${id}/draw`,
  SESSION_INTERPRET: (id: number) => `/api/v1/readings/sessions/${id}/interpret`,

  // Marketplace
  CARD_TEMPLATES: '/api/card-templates',
  CARD_TEMPLATE: (id: number) => `/api/card-templates/${id}`,
  PACKS_AVAILABLE: '/api/packs/available',
  PACK: (id: number) => `/api/packs/${id}`,

  // Orders
  ORDERS: (customerId: number) => `/api/orders/customer/${customerId}`,
  ORDER: (id: number) => `/api/orders/${id}`,

  // Wallet
  WALLET_BALANCE: '/api/wallet/balance',
  WALLET_EXCHANGE: '/api/wallet/exchange',
  VOUCHERS: '/api/vouchers/my',

  // Staff
  CARDS_BIND: '/api/cards/bind',
  STAFF_UNLINK_REQUESTS: '/api/staff/unlink-requests',
  STAFF_UNLINK_APPROVE: (id: number) => `/api/staff/unlink-requests/${id}/approve`,
  STAFF_UNLINK_REJECT: (id: number) => `/api/staff/unlink-requests/${id}/reject`,
  CARD_BY_NFC: (uid: string) => `/api/cards/nfc/${uid}`,
  CARD: (id: number) => `/api/cards/${id}`,
} as const
