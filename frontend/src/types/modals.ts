export type BaseModalProps = {
  open: boolean;
  closeModal: () => Promise<void> | void;
};

export enum ModalTypes {
  MODAL_ADD_AGENT = "modal-add-agent",
  MODAL_ENABLE_2FA = "modal-enable-2fa",
  MODAL_DISABLE_2FA = "modal-disable-2fa",
}

export type ModalPropsMap = {
  [ModalTypes.MODAL_ADD_AGENT]: null;
  [ModalTypes.MODAL_ENABLE_2FA]: {
    qrCode: string;
  };
  [ModalTypes.MODAL_DISABLE_2FA]: null;
  default: Record<string, any> | null;
};

export type ModalPropInferer =
  | {
      activeModal: ModalTypes.MODAL_ADD_AGENT;
      modalProps?: ModalPropsMap[ModalTypes.MODAL_ADD_AGENT];
    }
  | {
      activeModal: ModalTypes.MODAL_ENABLE_2FA;
      modalProps: ModalPropsMap[ModalTypes.MODAL_ENABLE_2FA];
    }
  | {
      activeModal: ModalTypes.MODAL_DISABLE_2FA;
      modalProps?: ModalPropsMap[ModalTypes.MODAL_DISABLE_2FA];
    }
  | {
      activeModal: "default";
      modalProps?: ModalPropsMap["default"];
    };

export interface ModalState {
  settings: ModalPropInferer;
  setActiveModal: (settings: ModalPropInferer) => void;
  closeModal: () => void;
}
