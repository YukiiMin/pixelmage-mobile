import { OrderDetailScreen } from '@/features/marketplace/components/OrderDetailScreen'
import { useLocalSearchParams } from 'expo-router'

export default function OrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <OrderDetailScreen orderId={parseInt(id, 10)} />
}
