export type PackStatus = 'STOCKED' | 'RESERVED' | 'SOLD'

export interface Pack {
  packId: number
  name: string
  description: string
  price: number
  imageUrl?: string
  status: PackStatus
  cardCount: number
}

export interface MarketCardTemplate {
  cardTemplateId: number
  name: string
  description?: string
  imageUrl?: string
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY'
}
