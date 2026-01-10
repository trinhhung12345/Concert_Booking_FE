import { create } from "zustand";

interface ModalState {
  isLoginPromptOpen: boolean;
  openLoginPrompt: () => void;
  closeLoginPrompt: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isLoginPromptOpen: false,
  openLoginPrompt: () => set({ isLoginPromptOpen: true }),
  closeLoginPrompt: () => set({ isLoginPromptOpen: false }),
}));