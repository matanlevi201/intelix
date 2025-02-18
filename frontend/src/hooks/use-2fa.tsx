import { disable2fa, enable2fa, verify2fa, generate2faQr } from "@/api";
import { useModalsStore } from "@/context/use-modals-store";
import { useSessionStore } from "@/context/use-session-store";
import { Notifications } from "@/lib/notifications";
import { EModals } from "@/shared/enums";
import { useState } from "react";

interface Use2FAReturn {
  otp: string;
  setOtp: (value: string) => void;
  enable: () => Promise<void>;
  verify: () => Promise<void>;
  disable: () => Promise<void>;
  openEnableModal: () => Promise<void>;
  openDisableModal: () => Promise<void>;
}

export const use2fa = (): Use2FAReturn => {
  const { setSession } = useSessionStore();
  const { closeModal } = useModalsStore();
  const [otp, setOtp] = useState<string>("");
  const { setActiveModal } = useModalsStore();

  const enable = async () => {
    const result = await enable2fa(otp);
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setSession(result.data.accessToken);
    closeModal();
  };

  const verify = async () => {
    const result = await verify2fa(otp);
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setSession(result.data.accessToken);
    closeModal();
  };

  const disable = async () => {
    const result = await disable2fa(otp);
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setSession(result.data.accessToken);
    closeModal();
  };

  const openEnableModal = async () => {
    const result = await generate2faQr();
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setActiveModal({ activeModal: EModals.MODAL_ENABLE_2FA, modalProps: { qrCode: result.data.qr } });
  };

  const openDisableModal = async () => {
    setActiveModal({ activeModal: EModals.MODAL_DISABLE_2FA });
  };

  return { otp, setOtp, enable, verify, disable, openEnableModal, openDisableModal };
};
