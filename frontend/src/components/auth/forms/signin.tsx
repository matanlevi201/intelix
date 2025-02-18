import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useShowPassword } from "@/hooks/use-show-password";
import { Form } from "@/components/common/form/form";
import { SocialFooter } from "./social-footer";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { Field } from "@/shared/types";
import { cn } from "@/lib/utils";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Field is required."),
});

type SigninSchema = z.infer<typeof signinSchema>;

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
          <SocialFooter />
        </CardFooter>
      </Card>
    </div>
  );
}
