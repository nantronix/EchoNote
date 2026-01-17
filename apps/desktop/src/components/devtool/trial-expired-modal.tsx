import { create } from "zustand";

type TrialExpiredModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useTrialExpiredModal = create<TrialExpiredModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export function TrialExpiredModal() {
  return null;
}
