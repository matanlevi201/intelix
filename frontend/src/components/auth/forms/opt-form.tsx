import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSessionStore } from "@/context/use-session-store";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/common";
import { use2fa } from "@/hooks/use-2fa";
import { cn } from "@/lib/utils";

export function OtpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { currentUser } = useSessionStore();
  const { setOtp, verify } = use2fa();
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  const handleSubmit = async () => {
    await verify();
    navigate("/");
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col gap-6 py-6">
        <CardContent>
          <OtpInput onChange={(v) => setOtp(v)} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-2/3 mx-auto">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
