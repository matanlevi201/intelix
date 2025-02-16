import { AuthLayout } from "@/components/layouts";
import { SigninForm } from "@/features/auth";

export function Signin() {
  return (
    <AuthLayout
      title=" Welcome back !"
      body={<SigninForm />}
      redirectText="Don't have an account?"
      redirectLink="Sign up"
      redirectHref="/signup"
      footer={
        <>
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </>
      }
    />
  );
}
