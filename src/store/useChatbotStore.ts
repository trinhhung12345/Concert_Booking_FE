import { create } from 'zustand';
import type { BookingContext } from '../features/concerts/types/chatbot';

interface ChatbotStore {
  context: BookingContext;
  setContext: (ctx: Partial<BookingContext>) => void;
  resetContext: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  context: {},
  setContext: (ctx) => set((state) => ({ context: { ...state.context, ...ctx } })),
  resetContext: () => set({ context: {} }),
}));
