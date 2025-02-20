import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { BaseModalProps, Field, ModalPropsMap } from "@/shared/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Form } from "@/components/common/form/form";
import { FieldValues } from "react-hook-form";
import { EModals } from "@/shared/enums";
import { z } from "zod";

type ModalAddAgentProps = ModalPropsMap[EModals.MODAL_ADD_AGENT] & BaseModalProps;

export const ModalAddAgent = ({ open, closeModal, form }: ModalAddAgentProps) => {
  const schema = z.object<Record<string, z.ZodString>>(
    form.reduce((acc, field) => {
      return { ...acc, [field.name]: z.string().min(1, "Field is required") };
    }, {})
  );

  const fields = form.map(
    (field): Field<FieldValues> => ({
      name: field.name,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder,
      description: field.description,
    })
  );

  const submit = (values: any) => {
    console.log({ values });
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add AI Agent</DialogTitle>
        </DialogHeader>

        <Form className="space-y-6" fields={fields} formSchema={schema} submit={submit} />
      </DialogContent>
    </Dialog>
  );
};
