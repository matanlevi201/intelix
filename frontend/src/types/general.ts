import { DetailedHTMLProps, ForwardRefExoticComponent, InputHTMLAttributes } from "react";
import { ControllerProps, FieldValues, Path } from "react-hook-form";

export type Field<K extends FieldValues> = {
  name: Path<K>;
  type?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  render?: ControllerProps<K>["render"];
  leftSection?: React.ReactNode;
  CustomInput?: ForwardRefExoticComponent<Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">>;
};
