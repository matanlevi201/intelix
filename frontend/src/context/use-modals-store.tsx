import { ModalPropInferer } from "@/shared/types";
import { create } from "zustand";

interface ModalState {
  settings: ModalPropInferer;
  setActiveModal: (settings: ModalPropInferer) => void;
  closeModal: () => void;
}

export const useModalsStore = create<ModalState>((set) => ({
  settings: { activeModal: "default", modalProps: null },
  setActiveModal: (settings: ModalPropInferer) => set(() => ({ settings })),
  closeModal: () => set(() => ({ settings: { activeModal: "default", modalProps: null } })),
}));
