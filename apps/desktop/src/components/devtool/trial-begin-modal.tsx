import { create } from "zustand";

type TrialBeginModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useTrialBeginModal = create<TrialBeginModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export function TrialBeginModal() {
  return null;
}
