import { AuthLayout } from "@/components/layouts";
import { ForgotPasswordForm } from "@/features/auth";

export function ForgotPassword() {
  return (
    <AuthLayout
      title="Enter email to reset password"
      body={<ForgotPasswordForm />}
      redirectText="Remember now? Great !"
      redirectLink="Sign in"
      redirectHref="/signin"
    />
  );
}
