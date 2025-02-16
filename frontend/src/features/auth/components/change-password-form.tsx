import { Form } from "@/components/common/form/form";
import { useShowPassword } from "@/hooks/use-show-password";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "@/components/common";
import { usePassword } from "@/hooks/use-password";
import { Field } from "@/types/api";
import { cn } from "@/lib/utils";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string({ message: "Field is required." }),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { changePassword } = usePassword();
  const { showPassword, EyeToggler } = useShowPassword();
  const fields: Field<ChangePasswordSchema>[] = [
    {
      name: "currentPassword",
      label: "Your current password",
      type: showPassword ? "text" : "password",
      placeholder: "Current password...",
      leftSection: <EyeToggler />,
    },
    {
      name: "newPassword",
      label: "Your new password",
      placeholder: "New password...",
      CustomInput: PasswordInput,
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: showPassword ? "text" : "password",
      placeholder: "Confirm password...",
      leftSection: <EyeToggler />,
    },
  ];

  async function submit(values: ChangePasswordSchema) {
    const { currentPassword, newPassword } = values;
    await changePassword({ currentPassword, newPassword });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col gap-6 py-6">
        <CardContent>
          <Form fields={fields} formSchema={changePasswordSchema} submit={submit} />
        </CardContent>
      </Card>
    </div>
  );
}
