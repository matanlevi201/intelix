import { toast } from "sonner";

export class Notifications {
  static errors(errors: { message: string }[]) {
    errors.forEach((error) => toast(error.message));
  }

  static success(message: string) {
    toast(message, { className: "border-2 text-red-500" });
  }
}
