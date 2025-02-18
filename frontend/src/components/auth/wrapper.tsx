import { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { Body } from "./body";

export function Wrapper({ children }: { children: ReactNode }) {
  return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">{children}</div>;
}

Wrapper.Header = Header;
Wrapper.Body = Body;
Wrapper.Footer = Footer;
