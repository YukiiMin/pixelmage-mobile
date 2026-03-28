export type CardStatus = 'PENDING_BIND' | 'READY' | 'LINKED' | 'DAMAGED' | 'LOST' | 'SOLD' | 'DEACTIVATED'

export interface CardRequestDTO {
  nfcUid: string
  templateId: number
}

export interface CardInfo {
  cardId: number
  nfcUid: string
  status: CardStatus
  template: {
    templateId: number
    name: string
    imageUrl?: string
    rarity: 'COMMON' | 'RARE' | 'LEGENDARY'
  }
  owner?: { accountId: number; name: string } | null
}
