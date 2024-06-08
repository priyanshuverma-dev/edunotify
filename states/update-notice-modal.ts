import { Notice } from "@prisma/client";
import { create } from "zustand";

export type ModalState = {
  isOpen: boolean;
  onOpen: (n: Notice) => void;
  onClose: () => void;
  notice: Notice | null;
};

export const updateNoticeModalState = create<ModalState>((set) => ({
  notice: null,
  isOpen: false,
  onOpen: (n) => set({ isOpen: true, notice: n }),
  onClose: () => set({ isOpen: false, notice: null }),
}));
