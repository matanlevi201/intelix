import { AuthLayout } from "@/components/layouts";
import { SignupForm } from "@/features/auth";

export function Signup() {
  return (
    <AuthLayout
      title="Welcome to Acme Inc."
      body={<SignupForm />}
      redirectText="Already have an account?"
      redirectLink="Sign in"
      redirectHref="/signin"
      footer={
        <>
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </>
      }
    />
  );
}
