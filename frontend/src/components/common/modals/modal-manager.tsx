import { ModalEnable2FA, ModalDisable2FA } from "@/components/common";
import { useModalsStore } from "@/context/use-modals-store";
import { ModalTypes } from "@/types";

export function ModalManager() {
  const { closeModal, settings } = useModalsStore();

  const { activeModal, modalProps } = settings;

  return (
    <>
      {activeModal === ModalTypes.MODAL_ENABLE_2FA && <ModalEnable2FA open={true} closeModal={closeModal} {...modalProps} />}
      {activeModal === ModalTypes.MODAL_DISABLE_2FA && <ModalDisable2FA open={true} closeModal={closeModal} />}
    </>
  );
}
