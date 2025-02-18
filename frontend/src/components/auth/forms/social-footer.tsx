import { AppleIcon, GoogleIcon } from "@/components/common";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

export function SocialFooter() {
  return (
    <div className="flex flex-col w-full gap-3">
      <CardDescription>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </CardDescription>
      <Button variant="outline" className="w-full">
        <AppleIcon />
        Apple
      </Button>
      <Button variant="outline" className="w-full">
        <GoogleIcon />
        Google
      </Button>
    </div>
  );
}
