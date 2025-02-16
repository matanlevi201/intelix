import { EyeIcon, EyeOffIcon } from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { useState } from "react";

export const useShowPassword = (): {
  showPassword: boolean;
  EyeToggler: () => JSX.Element;
} => {
  const [showPassword, setShowPassword] = useState(false);
  const EyeToggler = () => (
    <IconButton
      onClick={(e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
      }}
    >
      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
    </IconButton>
  );
  return { showPassword, EyeToggler };
};
