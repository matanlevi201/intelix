import { SigninForm } from "./forms/signin";
import { SignupForm } from "./forms/signup";
import { ChangePasswordForm } from "./forms/change-password";
import { ForgotPasswordForm } from "./forms/forgot-password";
import { ResetPasswordForm } from "./forms/reset-password";
import { OtpForm } from "./forms/opt-form";
import { EAuthForms } from "@/shared/enums";

export function Body({ authForm }: { authForm: EAuthForms }) {
  return (
    <div className="mx-auto w-full max-w-md">
      {authForm === EAuthForms.SIGNUP && <SignupForm />}
      {authForm === EAuthForms.SIGNIN && <SigninForm />}
      {authForm === EAuthForms.FORGOT_PASSWORD && <ForgotPasswordForm />}
      {authForm === EAuthForms.RESET_PASSWORD && <ResetPasswordForm />}
      {authForm === EAuthForms.CHANGE_PASSWORD && <ChangePasswordForm />}
      {authForm === EAuthForms.OTP_FORM && <OtpForm />}
    </div>
  );
}
