import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { BaseModalProps } from "@/shared/types";
import { OtpInput } from "@/components/common";
import { use2fa } from "@/hooks/use-2fa";

export const ModalDisable2FA = ({ open, closeModal }: BaseModalProps) => {
  const { setOtp, disable } = use2fa();
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-xs">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="flex flex-col items-center">
            <div className="flex items-center gap-2 self-center font-medium text-xl">
              <span>Disable 2FA</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <OtpInput onChange={(v) => setOtp(v)} />

        <DialogFooter>
          <Button onClick={disable} className="w-full">
            Disable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
