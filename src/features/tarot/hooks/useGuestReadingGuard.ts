import { useQuery } from '@tanstack/react-query';
import { client } from '@/api/client';
import { EP } from '@/api/endpoints';
import { useMyCards } from '@/features/my-cards/hooks/useMyCards';
import type { ResponseBase } from '@/types';

interface AccountLite {
  guestReadingUsedAt: string | null;
}

function useAccountLite(userId: number | null) {
  return useQuery({
    // Cache key follows project convention
    queryKey: ['account', userId],
    queryFn: () =>
      client.get<ResponseBase<AccountLite>>(EP.ACCOUNT(userId!)).then((r) => r.data),
    enabled: !!userId,
    staleTime: 60_000,
  });
}

export function useGuestReadingGuard(userId: number | null) {
  const { data: myCards } = useMyCards(userId);
  const { data: account } = useAccountLite(userId);

  const hasCards = (myCards?.length ?? 0) > 0;
  
  const usedGuestToday = account?.guestReadingUsedAt !== null &&
    account?.guestReadingUsedAt !== undefined &&
    new Date(account.guestReadingUsedAt).toDateString() === new Date().toDateString();

  return {
    canRead: hasCards || !usedGuestToday,
    hasCards,
    usedGuestToday,
  };
}
