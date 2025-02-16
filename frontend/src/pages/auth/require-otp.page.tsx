import { AuthLayout } from "@/components/layouts";
import { OtpForm } from "@/features/auth";

export function RequireOtp() {
  return <AuthLayout title="Enter otp" body={<OtpForm />} />;
}
