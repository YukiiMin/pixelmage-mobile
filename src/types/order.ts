import type { Pack } from './marketplace'

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

export interface OrderItem {
  orderItemId: number
  pack: Pack
  quantity: number
  unitPrice: number
}

export interface Order {
  orderId: number
  customerId: number
  status: OrderStatus
  totalPrice: number
  createdAt: string
  items: OrderItem[]
}
