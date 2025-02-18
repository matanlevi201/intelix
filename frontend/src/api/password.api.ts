import { ChangePasswordBody, ForgotPasswordBody, ResetPasswordBody, ChangePasswordResponse, ForgotPasswordResponse, ResetPasswordResponse } from "@intelix/common";
import { makeRequest } from "@/api/make-request";
import { EHttpMethods } from "@/shared/enums";

const BASE_URL = "/password";

export const changePassword = async ({ currentPassword, newPassword }: ChangePasswordBody) => {
  return await makeRequest<ChangePasswordBody, ChangePasswordResponse>({
    method: EHttpMethods.PUT,
    url: BASE_URL,
    body: { currentPassword, newPassword },
  });
};

export const forgotPassword = async ({ email }: ForgotPasswordBody) => {
  return await makeRequest<ForgotPasswordBody, ForgotPasswordResponse>({
    method: EHttpMethods.POST,
    url: `${BASE_URL}/reset`,
    body: { email },
  });
};

export const resetPassword = async ({ resetToken, password }: ResetPasswordBody) => {
  return await makeRequest<{ password: string }, ResetPasswordResponse>({
    method: EHttpMethods.PUT,
    url: `${BASE_URL}/reset?resetToken=${resetToken}`,
    body: { password },
  });
};
