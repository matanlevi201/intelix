import z from "zod";

export const ResetPasswordSchema = z.object({
  password: z.string().min(8),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const ForgotPasswordSchema = z.object({
  email: z.string(),
});
