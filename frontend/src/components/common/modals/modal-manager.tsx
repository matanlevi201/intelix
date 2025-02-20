import { ModalEnable2FA, ModalDisable2FA, ModalAddAgent } from "@/components/common";
import { useModalsStore } from "@/context/use-modals-store";
import { EModals } from "@/shared/enums";

export function ModalManager() {
  const { closeModal, settings } = useModalsStore();

  const { activeModal, modalProps } = settings;

  return (
    <>
      {activeModal === EModals.MODAL_ENABLE_2FA && <ModalEnable2FA open={true} closeModal={closeModal} {...modalProps} />}
      {activeModal === EModals.MODAL_DISABLE_2FA && <ModalDisable2FA open={true} closeModal={closeModal} />}
      {activeModal === EModals.MODAL_ADD_AGENT && <ModalAddAgent open={true} closeModal={closeModal} {...modalProps} />}
    </>
  );
}
