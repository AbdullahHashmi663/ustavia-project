import { create } from 'zustand';

interface UiState {
  isGlobalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
}));
