import { AuthLayout } from "@/components/layouts";
import { ResetPasswordForm } from "@/features/auth";

export function ResetPassword() {
  return (
    <AuthLayout
      title="Reset your password"
      body={<ResetPasswordForm />}
      redirectText="Remember now? Great !"
      redirectLink="Sign in"
      redirectHref="/signin"
    />
  );
}
