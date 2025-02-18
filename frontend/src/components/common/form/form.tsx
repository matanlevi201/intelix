import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { FormFields } from "@/components/common/form/form-fields";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Field } from "@/shared/types";
import { z } from "zod";

interface FormProps<T extends FieldValues> {
  fields: Field<T>[];
  formSchema: z.ZodSchema<T>;
  submit: (values: T) => Promise<void> | void;
  Compnent?: () => JSX.Element;
}

export function Form<T extends FieldValues>({ fields, formSchema, submit, Compnent }: FormProps<T>) {
  const { t } = useTranslation("common");
  const defaultValues = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {} as DefaultValues<T>);

  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: T) {
    await submit(values);
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <div className="flex flex-col gap-1">
            <FormFields<T> fields={fields} form={form} />
            {Compnent ? <Compnent /> : null}
          </div>
        </div>
        <Button type="submit" className="w-full">
          {t("form.submit")}
        </Button>
      </form>
    </FormProvider>
  );
}
