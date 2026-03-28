export interface WalletBalance {
  balance: number
  userId: number
}

export interface Voucher {
  voucherId: number
  code: string
  discountPercent: number
  expiresAt: string
  isUsed: boolean
}
