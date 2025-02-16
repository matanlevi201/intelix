import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface AuthHeaderProps {
  title: string;
  redirectText?: string;
  redirectLink?: string;
  redirectHref?: string;
}
interface AuthLayoutProps extends AuthHeaderProps {
  body: ReactNode;
  footer?: ReactNode;
}

export function AuthHeader({ title, redirectText, redirectLink, redirectHref }: AuthHeaderProps) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        {title}
      </a>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        {redirectText}{" "}
        {redirectHref && (
          <Link to={redirectHref} className="underline underline-offset-4">
            {redirectLink}
          </Link>
        )}
      </div>
    </div>
  );
}

export function AuthFooter({ children }: { children?: ReactNode }) {
  if (!children) return;
  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
      {children}
    </div>
  );
}

export function AuthLayout({ title, body, redirectText, redirectLink, redirectHref, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full">
        <AuthHeader title={title} redirectText={redirectText} redirectLink={redirectLink} redirectHref={redirectHref} />

        <div className="mx-auto w-full max-w-md">{body}</div>
      </div>
      <AuthFooter>{footer}</AuthFooter>
    </div>
  );
}
