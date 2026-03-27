import { useQuery } from '@tanstack/react-query'
import { client, ApiError } from '@/api/client'
import { EP } from '@/api/endpoints'
import { CardInfo } from '@/types/card'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useCardByNfc(nfcUid: string | null) {
  return useQuery({
    queryKey: ['card-by-nfc', nfcUid],
    queryFn: () =>
      client.get<ResponseBase<CardInfo>>(EP.CARD_BY_NFC(nfcUid!)).then((r) => r.data),
    enabled: !!nfcUid,
    staleTime: 0,
    retry: (failureCount, error: ApiError) =>
      error.status !== 404 && failureCount < 2,
  })
}
