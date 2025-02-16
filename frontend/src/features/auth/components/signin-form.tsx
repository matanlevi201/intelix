import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/common/form/form";
import { useShowPassword } from "@/hooks/use-show-password";
import { Link } from "react-router-dom";
import { FormFooter } from "./form-footer";
import { useAuth } from "@/hooks/use-auth";
import { Field } from "@/types/api";
import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Field is required."),
});

export type SigninSchema = z.infer<typeof signinSchema>;

export function SigninForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { signin } = useAuth();
  const { showPassword, EyeToggler } = useShowPassword();
  const fields: Field<SigninSchema>[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "your@email.com",
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Password...",
      leftSection: <EyeToggler />,
    },
  ];

  const ForgotPassword = () => (
    <Link to="/forgot-password" className="text-xs underline-offset-4 hover:underline place-self-end">
      Forgot your password?
    </Link>
  );

  async function submit(values: SigninSchema) {
    const { email, password } = values;
    await signin({ email, password });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col gap-6 py-6">
        <CardContent>
          <Form fields={fields} formSchema={signinSchema} submit={submit} Compnent={ForgotPassword} />
        </CardContent>

        <CardFooter>
          <FormFooter />
        </CardFooter>
      </Card>
    </div>
  );
}
