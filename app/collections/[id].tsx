import { useLocalSearchParams } from 'expo-router'
import { CollectionDetail } from '@/features/collections/components/CollectionDetail'

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <CollectionDetail collectionId={Number(id)} />
}
