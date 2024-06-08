import { create } from "zustand";

export type ModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const createNoticeModalState = create<ModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
