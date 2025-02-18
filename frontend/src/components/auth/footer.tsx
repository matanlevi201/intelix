import { Link } from "react-router-dom";

export function Footer() {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
      <span>By clicking continue, you agree to our </span>
      <Link to="#">Terms of Service</Link>
      <span> and </span>
      <Link to="#">Privacy Policy</Link>
    </div>
  );
}
