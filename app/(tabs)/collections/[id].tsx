import { CollectionDetail } from '@/features/collections/components/CollectionDetail'
import { useLocalSearchParams } from 'expo-router'

export default function CollectionDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <CollectionDetail collectionId={parseInt(id, 10)} />
}
