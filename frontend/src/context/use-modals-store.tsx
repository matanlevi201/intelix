import { ModalPropInferer, ModalState } from "@/types";
import { create } from "zustand";

export const useModalsStore = create<ModalState>((set) => ({
  settings: { activeModal: "default", modalProps: null },
  setActiveModal: (settings: ModalPropInferer) => set(() => ({ settings })),
  closeModal: () => set(() => ({ settings: { activeModal: "default", modalProps: null } })),
}));
