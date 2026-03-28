import { useTarotSessions } from './useTarotSessions';

export function useYourDeckResume() {
  const { data: sessions, isLoading } = useTarotSessions();

  // Tìm YOUR_DECK session PENDING hoặc INTERPRETING
  const activeSession = sessions?.find(
    (s) => s.mode === 'YOUR_DECK' &&
           ['PENDING', 'INTERPRETING'].includes(s.status)
  );

  return { activeSession, isLoading };
}
