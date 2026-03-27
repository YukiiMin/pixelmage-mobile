import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/api/client'
import { EP } from '@/api/endpoints'
import { CardInfo, CardRequestDTO } from '@/types/card'

interface ResponseBase<T> {
  data: T
  message: string
  status: number
}

export function useBindCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CardRequestDTO) =>
      client.post<ResponseBase<CardInfo>>(EP.CARDS_BIND, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card-by-nfc'] })
    },
  })
}
