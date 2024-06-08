import { create } from "zustand";

export type ModalState = {
  isOpen: boolean;
  onOpen: (teachers: string[]) => void;
  onClose: () => void;
  teachers: string[];
};

export const inviteTeachersModalState = create<ModalState>((set) => ({
  teachers: [],
  isOpen: false,
  onOpen: (t) => set({ isOpen: true, teachers: t }),
  onClose: () => set({ isOpen: false, teachers: [] }),
}));
