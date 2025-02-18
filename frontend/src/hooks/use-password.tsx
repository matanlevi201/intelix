import { changePassword as ApiChangePassword, forgotPassword as ApiForgotPassword, resetPassword as ApiResetPassword } from "@/api";
import { ChangePasswordBody, ForgotPasswordBody, ResetPasswordBody } from "@intelix/common";
import { Notifications } from "@/lib/notifications";
import { useNavigate } from "react-router-dom";

interface UsePassword {
  changePassword: ({ currentPassword, newPassword }: ChangePasswordBody) => Promise<void>;
  forgotPassword: ({ email }: ForgotPasswordBody) => Promise<void>;
  resetPassword: ({ resetToken, password }: ResetPasswordBody) => Promise<void>;
}

export const usePassword = (): UsePassword => {
  const navigate = useNavigate();

  const changePassword = async ({ currentPassword, newPassword }: ChangePasswordBody) => {
    const result = await ApiChangePassword({ currentPassword, newPassword });
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    navigate("/");
  };

  const forgotPassword = async ({ email }: ForgotPasswordBody) => {
    const result = await ApiForgotPassword({ email });
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
  };

  const resetPassword = async ({ resetToken, password }: ResetPasswordBody) => {
    const result = await ApiResetPassword({ resetToken, password });
    if (!result.success) {
      Notifications.errors(result.errors);
    }
  };

  return { changePassword, forgotPassword, resetPassword };
};
