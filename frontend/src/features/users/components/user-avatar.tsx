import { LogOutIcon, ShieldCheckIcon, TextCursorInputIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSessionStore } from "@/context/use-session-store";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { use2fa } from "@/hooks/use-2fa";

export function UserAvatar() {
  const { signout } = useAuth();
  const { openEnableModal, openDisableModal } = use2fa();
  const navigate = useNavigate();
  const { currentUser } = useSessionStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="h-[45px] w-[45px] hover:bg-slate-300 hover:cursor-pointer p-1 rounded-full duration-200 ease-in-out">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="rounded-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/change-password")}>
          Change password
          <DropdownMenuShortcut className="size-4">
            <TextCursorInputIcon className="w-full h-full" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={currentUser?.isOauth2User} onClick={currentUser?.is2FAVerified ? openDisableModal : openEnableModal}>
          {currentUser?.is2FAVerified ? "Disable 2FA" : "Enable 2FA"}
          <DropdownMenuShortcut className="size-4">
            <ShieldCheckIcon className="w-full h-full" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await signout()} className="!text-red-500 hover:!text-red-500 focus:!bg-red-50">
          Sign out
          <DropdownMenuShortcut className="size-4 !text-red-500 hover:!text-red-500">
            <LogOutIcon className="w-full h-full" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
