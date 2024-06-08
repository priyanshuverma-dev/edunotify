import { create } from "zustand";

type IRegisterSchoolModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const registerSchoolModalState = create<IRegisterSchoolModalState>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
