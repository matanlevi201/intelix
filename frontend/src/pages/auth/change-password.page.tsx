import { AuthLayout } from "@/components/layouts";
import { ChangePasswordForm } from "@/features/auth";

export function ChangePassword() {
  return (
    <AuthLayout
      title="Change your password"
      body={<ChangePasswordForm />}
      redirectText="Never mind ?"
      redirectLink="Home"
      redirectHref="/"
    />
  );
}
