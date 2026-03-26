import { useMutation } from '@tanstack/react-query';
import { client } from '@/api/client';
import { EP } from '@/api/endpoints';
import { useTarotSessionStore } from '@/store/useTarotSessionStore';
import type { ResponseBase, ReadingCard } from '@/types';

export function useDrawCards(sessionId: number | null) {
  const { setDrawnCards, setPhase } = useTarotSessionStore();

  return useMutation<{ drawnCards: ReadingCard[] }, Error, number[] | undefined>({
    mutationFn: (cardIds) =>
      client.post<ResponseBase<{ drawnCards: ReadingCard[] }>>(
        EP.SESSION_DRAW(sessionId!),
        cardIds && cardIds.length > 0 ? { cardIds } : {}
      ).then((r) => r.data),
    onSuccess: (data) => {
      // BE legacy: field là drawnCards trong POST /draw response
      setDrawnCards(data.drawnCards);
      setPhase('REVEAL');
    },
  });
}
