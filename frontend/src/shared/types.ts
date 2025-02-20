import { DetailedHTMLProps, ForwardRefExoticComponent, InputHTMLAttributes } from "react";
import { ControllerProps, FieldValues, Path } from "react-hook-form";
import { EModals } from "@/shared/enums";
import { Method } from "axios";

export type RequestProps<TBody> = {
  url: string;
  method: Method;
  body?: TBody;
};

export type RequestResponse<T> = { success: true; data: T } | { success: false; errors: ErrorResponse };

export type ErrorResponse = { message: string }[];

export type BaseModalProps = {
  open: boolean;
  closeModal: () => Promise<void> | void;
};

export type ModalPropsMap = {
  [EModals.MODAL_ADD_AGENT]: { form: Record<string, any>[] };
  [EModals.MODAL_ENABLE_2FA]: { qrCode: string };
  [EModals.MODAL_DISABLE_2FA]: null;
  default: Record<string, any> | null;
};

export type ModalPropInferer =
  | {
      activeModal: EModals.MODAL_ADD_AGENT;
      modalProps: ModalPropsMap[EModals.MODAL_ADD_AGENT];
    }
  | {
      activeModal: EModals.MODAL_ENABLE_2FA;
      modalProps: ModalPropsMap[EModals.MODAL_ENABLE_2FA];
    }
  | {
      activeModal: EModals.MODAL_DISABLE_2FA;
      modalProps?: ModalPropsMap[EModals.MODAL_DISABLE_2FA];
    }
  | {
      activeModal: "default";
      modalProps?: ModalPropsMap["default"];
    };

export type Field<K extends FieldValues> = {
  name: Path<K>;
  type?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  render?: ControllerProps<K>["render"];
  leftSection?: React.ReactNode;
  CustomInput?: ForwardRefExoticComponent<Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">>;
};
