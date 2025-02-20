import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field } from "@/shared/types";

interface RendererProps<K extends FieldValues> {
  type?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  leftSection?: React.ReactNode;
  CustomInput?: Field<K>["CustomInput"];
}

export function FormFields<K extends FieldValues>({ form, fields }: { form: UseFormReturn<K>; fields: Field<K>[] }) {
  const renderer = ({ type, label, placeholder, description, leftSection, CustomInput }: RendererProps<K>): ControllerProps<K>["render"] => {
    return ({ field }) => (
      <FormItem className="space-y-2">
        {label && <FormLabel>{label}</FormLabel>}

        <FormControl>{CustomInput ? <CustomInput {...field} /> : <Input type={type ?? "text"} placeholder={placeholder} leftSection={leftSection} {...field} />}</FormControl>
        {description && <FormDescription className="text-sm">{description}</FormDescription>}

        <FormMessage />
      </FormItem>
    );
  };
  return (
    <>
      {fields.map((f) => (
        <FormField
          key={f.name}
          control={form.control}
          name={f.name}
          render={
            f.render
              ? f.render
              : renderer({
                  type: f.type,
                  label: f.label,
                  placeholder: f.placeholder,
                  leftSection: f.leftSection,
                  description: f.description,
                  CustomInput: f.CustomInput,
                })
          }
        />
      ))}
    </>
  );
}
