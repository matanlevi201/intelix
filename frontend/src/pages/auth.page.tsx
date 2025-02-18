import { Wrapper } from "@/components/auth/wrapper";
import { EAuthForms } from "@/shared/enums";
import { ReactNode } from "react";

export function AuthPage({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

AuthPage.Signin = function Signin() {
  return (
    <Wrapper>
      <Wrapper.Header title=" Welcome back !" text="Don't have an account?" link="Sign up" to="/signup" />
      <Wrapper.Body authForm={EAuthForms.SIGNIN} />
      <Wrapper.Footer />
    </Wrapper>
  );
};

AuthPage.Signup = function Signup() {
  return (
    <Wrapper>
      <Wrapper.Header title="Welcome to Acme Inc." text="Already have an account?" link="Sign in" to="/signin" />
      <Wrapper.Body authForm={EAuthForms.SIGNUP} />
      <Wrapper.Footer />
    </Wrapper>
  );
};

AuthPage.ForgotPassword = function ForgotPassword() {
  return (
    <Wrapper>
      <Wrapper.Header title="Enter email to reset password" text="Remember now? Great !" link="Sign in" to="/signin" />
      <Wrapper.Body authForm={EAuthForms.FORGOT_PASSWORD} />
      <Wrapper.Footer />
    </Wrapper>
  );
};

AuthPage.ResetPassword = function ResetPassword() {
  return (
    <Wrapper>
      <Wrapper.Header title="Reset your password" text="Remember now? Great !" link="Sign in" to="/signin" />
      <Wrapper.Body authForm={EAuthForms.RESET_PASSWORD} />
      <Wrapper.Footer />
    </Wrapper>
  );
};

AuthPage.ChangePassword = function ChangePassword() {
  return (
    <Wrapper>
      <Wrapper.Header title="Change your password" text="Never mind ?" link="Home" to="/" />
      <Wrapper.Body authForm={EAuthForms.CHANGE_PASSWORD} />
      <Wrapper.Footer />
    </Wrapper>
  );
};

AuthPage.RequireOtp = function RequireOtp() {
  return (
    <Wrapper>
      <Wrapper.Header title="Enter otp" />
      <Wrapper.Body authForm={EAuthForms.OTP_FORM} />
    </Wrapper>
  );
};
