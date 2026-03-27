import type { CardTemplate } from './inventory';

export type ReadingMode = 'EXPLORE' | 'YOUR_DECK';
export type ReadingSessionStatus = 'PENDING' | 'INTERPRETING' | 'COMPLETED' | 'EXPIRED';

export interface Spread {
  spreadId: number;
  name: string;
  description: string;
  positionCount: number;
  minCardsRequired: number; // KHÔNG phải requiredCardCount
}

export interface ReadingCard {
  readingCardId: number;
  cardTemplate: CardTemplate;
  positionIndex: number;
  positionName: string;
  isReversed: boolean;
  // isOwnedByUser KHÔNG tồn tại — workaround: session.mode === 'YOUR_DECK'
}

export interface ReadingSession {
  sessionId: number;
  spread: Spread;
  mode: ReadingMode;
  mainQuestion: string;
  status: ReadingSessionStatus;  // 'PENDING' | 'INTERPRETING' | 'COMPLETED' | 'EXPIRED'
  readingCards: ReadingCard[];   // field name: readingCards (không phải drawnCards)
  aiInterpretation: string | null;  // field name: aiInterpretation (KHÔNG 'interpretation')
  createdAt: string;
}
