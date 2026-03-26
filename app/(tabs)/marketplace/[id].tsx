import { PackDetail } from '@/features/marketplace/components/PackDetail'
import { useLocalSearchParams } from 'expo-router'

export default function PackDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <PackDetail packId={parseInt(id, 10)} />
}
