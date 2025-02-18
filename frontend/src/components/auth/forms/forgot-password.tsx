import { Form } from "@/components/common/form/form";
import { Card, CardContent } from "@/components/ui/card";
import { usePassword } from "@/hooks/use-password";
import { Field } from "@/shared/types";
import { cn } from "@/lib/utils";

import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { forgotPassword } = usePassword();
  const fields: Field<ForgotPasswordSchema>[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "your@email.com",
    },
  ];

  async function submit(values: ForgotPasswordSchema) {
    const { email } = values;
    await forgotPassword({ email });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col gap-6 py-6">
        <CardContent>
          <Form fields={fields} formSchema={forgotPasswordSchema} submit={submit} />
        </CardContent>
      </Card>
    </div>
  );
}
