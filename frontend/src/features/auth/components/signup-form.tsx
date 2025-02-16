import React from "react";
import { cn } from "@/lib/utils";
import { Field } from "@/types/api";
import { Form } from "@/components/common/form/form";
import { useShowPassword } from "@/hooks/use-show-password";
import { FormFooter } from "@/features/auth/components/form-footer";
import { PasswordInput } from "@/components/common";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
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

export type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { signup } = useAuth();
  const { showPassword, EyeToggler } = useShowPassword();

  const fields: Field<SignupSchema>[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "your@email.com",
    },
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

  async function submit(values: SignupSchema) {
    const { email, password } = values;
    await signup({ email, password });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col gap-6 py-6">
        <CardContent>
          <Form fields={fields} formSchema={signupSchema} submit={submit} />
        </CardContent>

        <CardFooter>
          <FormFooter />
        </CardFooter>
      </Card>
    </div>
  );
}
