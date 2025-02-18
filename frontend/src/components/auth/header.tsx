import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthHeaderProps {
  title: string;
  text?: string;
  link?: string;
  to?: string;
}

export function Header({ title, text, link, to }: AuthHeaderProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        {title}
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        {text}{" "}
        {to && (
          <Link to={to} className="underline underline-offset-4">
            {link}
          </Link>
        )}
      </div>
    </div>
  );
}
