import { signup as ApiSignup, signin as ApiSignin, signout as ApiSignout, refreshToken as ApiRefreshToken } from "@/api";
import { useSessionStore } from "@/context/use-session-store";
import { Notifications } from "@/lib/notifications";
import { useNavigate } from "react-router-dom";
import { SignBody } from "@intelix/common";

interface UseAuth {
  signup: ({ email, password }: SignBody) => Promise<void>;
  signin: ({ email, password }: SignBody) => Promise<void>;
  signout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuth = (): UseAuth => {
  const navigate = useNavigate();
  const { setSession, endSession } = useSessionStore();
  const signup = async ({ email, password }: SignBody) => {
    const result = await ApiSignup({ email, password });
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setSession(result.data.accessToken);
    navigate("/");
  };

  const signin = async ({ email, password }: SignBody) => {
    const result = await ApiSignin({ email, password });
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    setSession(result.data.accessToken);
    navigate("/");
  };

  const signout = async () => {
    const result = await ApiSignout();
    if (!result.success) {
      return Notifications.errors(result.errors);
    }
    endSession();
    navigate("/signin");
  };

  const refresh = async () => {
    const result = await ApiRefreshToken();
    if (!result.success) {
      endSession();
      return Notifications.errors(result.errors);
    }
    setSession(result.data.accessToken);
  };

  return { signup, signin, signout, refresh };
};
