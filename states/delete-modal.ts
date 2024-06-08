import { create } from "zustand";

export type ModalState = {
  isOpen: boolean;
  onOpen: (fn: () => void) => void;
  onClose: () => void;
  confirmFn: () => void;
};

export const deleteModalState = create<ModalState>((set) => ({
  confirmFn: () => {},
  isOpen: false,
  onOpen: (fn) => set({ isOpen: true, confirmFn: fn }),
  onClose: () => set({ isOpen: false, confirmFn: () => {} }),
}));
