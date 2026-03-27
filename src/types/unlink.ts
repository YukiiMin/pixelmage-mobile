export interface UnlinkRequest {
  requestId: number
  customer: { accountId: number; name: string }
  card: { cardId: number; nfcUid: string; template: { name: string } }
  requestedAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  staffNote?: string
}
