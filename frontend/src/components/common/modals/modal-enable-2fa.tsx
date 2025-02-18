import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { BaseModalProps, ModalPropsMap } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/common";
import { EModals } from "@/shared/enums";
import { use2fa } from "@/hooks/use-2fa";
import QRCode from "react-qr-code";

type ModalEnable2FAProps = ModalPropsMap[EModals.MODAL_ENABLE_2FA] & BaseModalProps;

export const ModalEnable2FA = ({ open, closeModal, qrCode }: ModalEnable2FAProps) => {
  const { setOtp, enable } = use2fa();
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-xs">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="flex flex-col items-center">
            <div className="flex items-center gap-2 self-center font-medium text-xl">
              <span>Enable 2FA</span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex flex-col items-center">
            <QRCode value={qrCode} />
          </DialogDescription>
        </DialogHeader>

        <OtpInput onChange={(v) => setOtp(v)} />

        <DialogFooter>
          <Button onClick={enable} className="w-full">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
