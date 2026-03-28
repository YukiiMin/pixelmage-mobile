import { create } from 'zustand';
import type { ReadingMode, ReadingCard } from '@/types/tarot';
import type { UserInventory } from '@/types/my-cards';

export type TarotPhase = 'SETUP' | 'SHUFFLING' | 'DRAWING' | 'REVEAL' | 'INTERPRET' | 'COMPLETE' | 'EXPIRED';

interface TarotSessionState {
  sessionId: number | null;
  spreadId: number | null;
  mode: ReadingMode | null;          // 'EXPLORE' | 'YOUR_DECK'
  mainQuestion: string;
  availableCards: UserInventory[];   // YOUR_DECK pool (empty trong EXPLORE)
  drawnCards: ReadingCard[];
  phase: TarotPhase;
  selectedCardIds: number[];

  setSession: (id: number, spreadId: number, mode: ReadingMode) => void;
  setDrawnCards: (cards: ReadingCard[]) => void;
  setPhase: (phase: TarotPhase) => void;
  setMainQuestion: (q: string) => void;
  setAvailableCards: (cards: UserInventory[]) => void;
  toggleCardSelection: (templateId: number) => void;
  clearSession: () => void;   // gọi khi COMPLETED hoặc EXPIRED
  reset: () => void;
}

export const useTarotSessionStore = create<TarotSessionState>((set) => ({
  sessionId: null,
  spreadId: null,
  mode: null,
  mainQuestion: '',
  availableCards: [],
  drawnCards: [],
  phase: 'SETUP',
  selectedCardIds: [],

  setSession: (id, spreadId, mode) =>
    set({ sessionId: id, spreadId, mode }),
    
  setDrawnCards: (cards) => set({ drawnCards: cards }),
  
  setPhase: (phase) => set({ phase }),
  
  setMainQuestion: (q) => set({ mainQuestion: q }),
  
  setAvailableCards: (cards) => set({ availableCards: cards }),
  
  toggleCardSelection: (templateId) =>
    set((state) => {
      const isSelected = state.selectedCardIds.includes(templateId);
      if (isSelected) {
        return {
          selectedCardIds: state.selectedCardIds.filter((id) => id !== templateId),
        };
      } else {
        return {
          selectedCardIds: [...state.selectedCardIds, templateId],
        };
      }
    }),
    
  clearSession: () =>
    set({
      sessionId: null,
      spreadId: null,
      mode: null,
      mainQuestion: '',
      drawnCards: [],
      availableCards: [],
      selectedCardIds: [],
      phase: 'SETUP',
    }),
    
  reset: () =>
    set({
      sessionId: null,
      spreadId: null,
      mode: null,
      mainQuestion: '',
      drawnCards: [],
      availableCards: [],
      selectedCardIds: [],
      phase: 'SETUP',
    }),
}));
