import { useLocalSearchParams } from 'expo-router'
import { CardDetailModal } from '@/features/my-cards/components/CardDetailModal'

export default function CardDetailScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>()
  return <CardDetailModal templateId={Number(templateId)} />
}
