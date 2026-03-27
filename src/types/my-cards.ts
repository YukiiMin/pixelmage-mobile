export type Rarity = 'COMMON' | 'RARE' | 'LEGENDARY'

export interface UserInventory {
  inventoryId: number
  cardTemplate: CardTemplate
  linkedAt: string
  nfcUid: string
}

export interface CardTemplate {
  templateId: number
  name: string
  imageUrl: string
  rarity: Rarity  // 'COMMON' | 'RARE' | 'LEGENDARY'
  description: string
  collection: { collectionId: number; name: string }
}
