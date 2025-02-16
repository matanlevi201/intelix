import { Form } from "@/components/common/form/form";
import { useShowPassword } from "@/hooks/use-show-password";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "@/components/common";
import { useSearchParams } from "react-router-dom";
import { usePassword } from "@/hooks/use-password";
import { Field } from "@/types/api";
import { cn } from "@/lib/utils";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { resetPassword } = usePassword();
  const [searchParams] = useSearchParams();
  const { showPassword, EyeToggler } = useShowPassword();
  const fields: Field<ResetPasswordSchema>[] = [
    {
      name: "password",
      label: "Password",
      CustomInput: PasswordInput,
    },
    {
      name: "confirmPassword",
      type: showPassword ? "text" : "password",
      label: "Confirm password",
      placeholder: "Confirm password...",
      leftSection: <EyeToggler />,
    },
  ];

  async function submit(values: ResetPasswordSchema) {
    const { password } = values;
    const resetToken = searchParams.get("token") ?? "";
    await resetPassword({ resetToken, password });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col gap-6 py-6">
        <CardContent>
          <Form fields={fields} formSchema={resetPasswordSchema} submit={submit} />
        </CardContent>
      </Card>
    </div>
  );
}
