import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { BaseModalProps, ModalPropsMap, ModalTypes } from "@/types";
import { Button } from "@/components/ui/button";
import { use2fa } from "@/hooks/use-2fa";
import QRCode from "react-qr-code";

type ModalEnable2FAProps = ModalPropsMap[ModalTypes.MODAL_ENABLE_2FA] & BaseModalProps;

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
        <InputOTP maxLength={6} onChange={(v) => setOtp(v)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <DialogFooter>
          <Button onClick={enable} className="w-full">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
