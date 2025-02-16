import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useShowPassword } from "@/hooks/use-show-password";
import { CheckIcon, XIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const passwordRules = [
  { rule: "At least 8 characters", regex: /.{8,}/ },
  { rule: "At least 1 uppercase letter", regex: /[A-Z]/ },
  { rule: "At least 1 lowercase letter", regex: /[a-z]/ },
  { rule: "At least 1 number", regex: /\d/ },
  { rule: "At least 1 special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

const calculateStrength = (password: string) => {
  return passwordRules.reduce((score, { regex }) => (regex.test(password) ? score + 1 : score), 0);
};

const StrengthBar = ({ password }: { password: string }) => {
  const strength = calculateStrength(password);
  const colors = ["red", "orange", "yellow", "lightgreen", "green"];

  return (
    <div className="mt-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 rounded transition-colors mx-1"
            style={{
              backgroundColor: index < strength ? colors[strength - 1] : "#e0e0e0",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const RuleDialog = ({ password }: { password: string }) => {
  return (
    <div className="mb-2 text-sm">
      <ul className="text-sm">
        {passwordRules.map(({ rule, regex }) => (
          <li key={rule} className={`flex items-center gap-2 color-red ${regex.test(password) ? "text-green-500" : "text-red-500"}`}>
            {regex.test(password) ? <CheckIcon size={16} /> : <XIcon size={16} />}
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  const { showPassword, EyeToggler } = useShowPassword();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <div className="relative flex items-center">
              <span className="absolute right-1 flex items-center rounded-md">
                <div className="h-7 w-7">
                  <EyeToggler />
                </div>
              </span>
              <input
                placeholder="Password..."
                type={showPassword ? "text" : "password"}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  className
                )}
                ref={ref}
                {...props}
              />
            </div>
            <StrengthBar password={props.value as string} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white shadow-lg p-4">
          <RuleDialog password={props.value as string} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
